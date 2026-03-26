"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Keycloak from "keycloak-js";
import {
    getKeycloakInstance,
    initKeycloak,
    setupTokenRefresh,
} from "@/lib/config/keycloak.config";

// Types for Keycloak user info
interface KeycloakUser {
    id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    roles: string[];
}

// System client data from our backend (auto-provisioned)
interface SystemClient {
    clientId: string;
    username: string;
    name: string;
    email?: string;
    isFirstLogin: boolean;
    keycloakRoles: string[];
}

// Context state
interface KeycloakContextState {
    keycloak: Keycloak | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isProcessingCallback: boolean;
    user: KeycloakUser | null;
    systemClient: SystemClient | null; // Client data from our system
    token: string | null;
    error: string | null;
}

// Context actions
interface KeycloakContextActions {
    login: () => void;
    logout: () => void;
    refreshToken: () => Promise<boolean>;
}

// Combined context type
type KeycloakContextType = KeycloakContextState & KeycloakContextActions;

const KeycloakContext = React.createContext<KeycloakContextType | undefined>(
    undefined
);

// Function to validate/register Keycloak client with our backend (JIT Provisioning)
async function validateKeycloakClientWithBackend(token: string): Promise<SystemClient | null> {
    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        console.log("🔄 Validating Keycloak client with backend...");

        const response = await fetch(`${apiBaseUrl}/keycloakauth/validate-client`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("❌ Backend client validation failed:", response.status);
            return null;
        }

        const data = await response.json();
        console.log("✅ Backend client validation response:", data);

        if (data.success) {
            return {
                clientId: data.clientId,
                username: data.username,
                name: data.name,
                email: data.email,
                isFirstLogin: data.isFirstLogin,
                keycloakRoles: data.keycloakRoles || [],
            };
        }

        return null;
    } catch (error) {
        console.error("❌ Error validating client with backend:", error);
        return null;
    }
}

// Helper to check if URL contains Keycloak callback parameters
function isKeycloakCallback(): boolean {
    if (typeof window === "undefined") return false;
    const hash = window.location.hash;
    return hash.includes("state=") && (hash.includes("code=") || hash.includes("error="));
}

interface KeycloakProviderProps {
    children: React.ReactNode;
}

export function KeycloakProvider({ children }: KeycloakProviderProps) {
    const router = useRouter();
    const [state, setState] = React.useState<KeycloakContextState>({
        keycloak: null,
        isAuthenticated: false,
        isLoading: true,
        isProcessingCallback: isKeycloakCallback(),
        user: null,
        systemClient: null,
        token: null,
        error: null,
    });

    // Extract user info from Keycloak token
    const extractUserInfo = React.useCallback(
        (keycloak: Keycloak): KeycloakUser | null => {
            if (!keycloak.authenticated || !keycloak.tokenParsed) {
                return null;
            }

            const tokenParsed = keycloak.tokenParsed as Record<string, unknown>;
            const realmRoles =
                (tokenParsed.realm_access as { roles?: string[] })?.roles || [];
            const clientRoles =
                (
                    tokenParsed.resource_access as Record<
                        string,
                        { roles?: string[] }
                    >
                )?.[keycloak.clientId || ""]?.roles || [];

            return {
                id: (tokenParsed.sub as string) || "",
                username: (tokenParsed.preferred_username as string) || "",
                email: tokenParsed.email as string | undefined,
                firstName: tokenParsed.given_name as string | undefined,
                lastName: tokenParsed.family_name as string | undefined,
                fullName: tokenParsed.name as string | undefined,
                roles: [...realmRoles, ...clientRoles],
            };
        },
        []
    );

    // Initialize Keycloak
    React.useEffect(() => {
        let isMounted = true;

        const initializeKeycloak = async () => {
            try {
                // Mark as processing callback if we detect callback params
                if (isKeycloakCallback()) {
                    setState(prev => ({ ...prev, isProcessingCallback: true }));
                }

                const keycloak = getKeycloakInstance();
                const authenticated = await initKeycloak(keycloak);

                if (!isMounted) return;

                // Clear URL hash after processing callback to avoid issues on refresh
                if (isKeycloakCallback() && typeof window !== "undefined") {
                    // Use replaceState to remove the hash without triggering navigation
                    window.history.replaceState(
                        null,
                        "",
                        window.location.pathname + window.location.search
                    );
                }

                // Save token immediately after authentication
                if (authenticated && keycloak.token) {
                    console.log("💾 Saving auth-token to localStorage...");
                    localStorage.setItem("auth-token", keycloak.token);
                    if (keycloak.refreshToken) {
                        localStorage.setItem("refresh-token", keycloak.refreshToken);
                    }
                }

                if (authenticated) {
                    const user = extractUserInfo(keycloak);

                    console.log("✅ Keycloak authenticated!", {
                        authenticated,
                        hasToken: !!keycloak.token,
                        tokenLength: keycloak.token?.length,
                    });

                    // Setup token refresh
                    setupTokenRefresh(keycloak, () => {
                        // On refresh error, redirect to login
                        keycloak.login();
                    });

                    // Validate/register client with our backend (JIT Provisioning)
                    let systemClient: SystemClient | null = null;
                    if (keycloak.token) {
                        systemClient = await validateKeycloakClientWithBackend(keycloak.token);
                        if (systemClient) {
                            console.log("✅ Client validated/registered in our system:", systemClient);
                        } else {
                            console.warn("⚠️ Could not validate client with backend, continuing with Keycloak data only");
                        }
                    }

                    setState({
                        keycloak,
                        isAuthenticated: true,
                        isLoading: false,
                        isProcessingCallback: false,
                        user,
                        systemClient,
                        token: keycloak.token || null,
                        error: null,
                    });
                } else {
                    console.log("❌ Keycloak NOT authenticated", { authenticated });
                    setState({
                        keycloak,
                        isAuthenticated: false,
                        isLoading: false,
                        isProcessingCallback: false,
                        user: null,
                        systemClient: null,
                        token: null,
                        error: null,
                    });
                }
            } catch (error) {
                console.error("Keycloak initialization error:", error);
                if (isMounted) {
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        isProcessingCallback: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : "Failed to initialize Keycloak",
                    }));
                }
            }
        };

        initializeKeycloak();

        return () => {
            isMounted = false;
        };
    }, [extractUserInfo]);

    // Login function - redirects to Keycloak
    const login = React.useCallback(() => {
        // Don't trigger login if we're processing a callback
        if (state.isProcessingCallback || isKeycloakCallback()) {
            console.log("Skipping login - processing callback");
            return;
        }

        if (state.keycloak) {
            state.keycloak.login({
                redirectUri: `${window.location.origin}/simple`,
            });
        } else {
            // If Keycloak not initialized yet, try to initialize and login
            const keycloak = getKeycloakInstance();
            keycloak.login({
                redirectUri: `${window.location.origin}/simple`,
            });
        }
    }, [state.keycloak, state.isProcessingCallback]);

    // Logout function
    const logout = React.useCallback(() => {
        // Clear local storage
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");

        if (state.keycloak) {
            state.keycloak.logout({
                redirectUri: `${window.location.origin}/login`,
            });
        } else {
            router.push("/login");
        }
    }, [state.keycloak, router]);

    // Refresh token
    const refreshToken = React.useCallback(async (): Promise<boolean> => {
        if (!state.keycloak || !state.keycloak.authenticated) {
            return false;
        }

        try {
            const refreshed = await state.keycloak.updateToken(30);
            if (refreshed && state.keycloak.token) {
                localStorage.setItem("auth-token", state.keycloak.token);
                setState((prev) => ({
                    ...prev,
                    token: state.keycloak?.token || null,
                }));
            }
            return true;
        } catch (error) {
            console.error("Token refresh failed:", error);
            return false;
        }
    }, [state.keycloak]);

    const contextValue: KeycloakContextType = {
        ...state,
        login,
        logout,
        refreshToken,
    };

    return (
        <KeycloakContext.Provider value={contextValue}>
            {children}
        </KeycloakContext.Provider>
    );
}

// Hook to use Keycloak context
export function useKeycloak() {
    const context = React.useContext(KeycloakContext);

    // Return a safe default during SSR or when context is not yet available
    if (context === undefined) {
        return {
            keycloak: null,
            isAuthenticated: false,
            isLoading: true,
            isProcessingCallback: false,
            user: null,
            systemClient: null,
            token: null,
            error: null,
            login: () => { },
            logout: () => { },
            refreshToken: async () => false,
        };
    }
    return context;
}

// HOC for protected routes
export function withKeycloakAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function ProtectedComponent(props: P) {
        const { isAuthenticated, isLoading, isProcessingCallback, login } = useKeycloak();

        React.useEffect(() => {
            // Only trigger login if not loading, not authenticated, and not processing callback
            if (!isLoading && !isAuthenticated && !isProcessingCallback) {
                login();
            }
        }, [isLoading, isAuthenticated, isProcessingCallback, login]);

        if (isLoading || isProcessingCallback) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return null; // Will redirect to Keycloak
        }

        return <WrappedComponent {...props} />;
    };
}
