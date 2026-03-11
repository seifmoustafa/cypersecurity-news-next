"use client";

import Keycloak from "keycloak-js";

// Keycloak configuration from environment variables
export const keycloakConfig = {
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://192.168.40.128:8081",
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "officers2",
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "portal",
};

// Create Keycloak instance (singleton)
let keycloakInstance: Keycloak | null = null;
let initPromise: Promise<boolean> | null = null;
let isInitialized = false;

export const getKeycloakInstance = (): Keycloak => {
    if (typeof window === "undefined") {
        throw new Error("Keycloak can only be initialized on the client side");
    }

    if (!keycloakInstance) {
        keycloakInstance = new Keycloak({
            url: keycloakConfig.url,
            realm: keycloakConfig.realm,
            clientId: keycloakConfig.clientId,
        });
    }

    return keycloakInstance;
};

// Token refresh interval (refresh 60 seconds before expiry)
export const TOKEN_REFRESH_INTERVAL = 60;

// Initialize Keycloak with options (singleton pattern - only initializes once)
export const initKeycloak = async (keycloak: Keycloak): Promise<boolean> => {
    // If already initialized, return the current auth state
    if (isInitialized) {
        console.log("Keycloak already initialized, returning cached state");
        return keycloak.authenticated || false;
    }

    // If initialization is in progress, wait for it
    if (initPromise) {
        console.log("Keycloak initialization in progress, waiting...");
        return initPromise;
    }

    console.log("Starting Keycloak initialization...");

    // Set up event handlers to catch token immediately
    keycloak.onAuthSuccess = () => {
        console.log("🎉 onAuthSuccess triggered!");
        if (keycloak.token) {
            console.log("💾 Saving token from onAuthSuccess...");
            localStorage.setItem("auth-token", keycloak.token);
            if (keycloak.refreshToken) {
                localStorage.setItem("refresh-token", keycloak.refreshToken);
            }
            console.log("✅ Token saved from onAuthSuccess! Length:", keycloak.token.length);
        }
    };

    keycloak.onTokenExpired = () => {
        console.log("⏰ Token expired, refreshing...");
        keycloak.updateToken(30).then((refreshed) => {
            if (refreshed && keycloak.token) {
                localStorage.setItem("auth-token", keycloak.token);
                console.log("✅ Token refreshed and saved!");
            }
        });
    };

    // Create the initialization promise
    initPromise = (async () => {
        try {
            const authenticated = await keycloak.init({
                onLoad: "check-sso",
                silentCheckSsoRedirectUri:
                    typeof window !== "undefined"
                        ? `${window.location.origin}/silent-check-sso.html`
                        : undefined,
                pkceMethod: "S256",
                checkLoginIframe: false,
                // Enable flow to process the callback
                flow: "standard",
                // Response mode fragment to handle the hash
                responseMode: "fragment",
            });

            isInitialized = true;
            console.log("🔍 Keycloak init result:", {
                authenticated,
                hasToken: !!keycloak.token,
                token: keycloak.token ? keycloak.token.substring(0, 50) + "..." : "NULL",
                hasRefreshToken: !!keycloak.refreshToken,
                tokenParsed: keycloak.tokenParsed,
                subject: keycloak.subject,
            });

            // ⚡ IMMEDIATELY save token to localStorage if authenticated
            if (authenticated && keycloak.token) {
                console.log("💾 Saving token to localStorage from keycloak.config...");
                localStorage.setItem("auth-token", keycloak.token);
                if (keycloak.refreshToken) {
                    localStorage.setItem("refresh-token", keycloak.refreshToken);
                }
                console.log("✅ Token saved! Length:", keycloak.token.length);
            } else if (authenticated && !keycloak.token) {
                console.error("❌ Authenticated but NO TOKEN! This shouldn't happen!");
                console.log("Keycloak object:", keycloak);
            }

            return authenticated;
        } catch (error) {
            console.error("Keycloak initialization failed:", error);
            initPromise = null; // Reset so it can be retried
            return false;
        }
    })();

    return initPromise;
};

// Reset the initialization state (useful for logout)
export const resetKeycloakInit = () => {
    isInitialized = false;
    initPromise = null;
    keycloakInstance = null;
};

// Setup token refresh
export const setupTokenRefresh = (
    keycloak: Keycloak,
    onRefreshError: () => void
) => {
    setInterval(async () => {
        if (keycloak.authenticated) {
            try {
                const refreshed = await keycloak.updateToken(TOKEN_REFRESH_INTERVAL);
                if (refreshed && keycloak.token) {
                    console.log("Token refreshed successfully, updating localStorage...");
                    localStorage.setItem("auth-token", keycloak.token);
                    if (keycloak.refreshToken) {
                        localStorage.setItem("refresh-token", keycloak.refreshToken);
                    }
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
                onRefreshError();
            }
        }
    }, TOKEN_REFRESH_INTERVAL * 1000);
};
