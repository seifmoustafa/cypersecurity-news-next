"use client";

// Client Authentication Context - Refactored to use MVVM Architecture
// Delegates to core/services/client-auth-service via core/hooks/use-client-auth

import {
      createContext,
      useContext,
      useState,
      useEffect,
      useCallback,
      type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { container } from "@/core/di/container";

// Re-export types from domain models for backward compatibility
export type {
      Client,
      UpdateClientProfileRequest as UpdateClientProfileDto,
      ClientChangePasswordRequest as ChangePasswordDto,
} from "@/core/domain/models/client-auth";

// Re-export utility function
export { getClientInitials as getInitials } from "@/core/domain/models/client-auth";

// Import Client type for use in context
import type { Client, UpdateClientProfileRequest } from "@/core/domain/models/client-auth";

// Context type definition (backward compatible)
interface ClientAuthContextType {
      client: Client | null;
      isLoading: boolean;
      isAuthenticated: boolean;
      mustChangePassword: boolean;
      error: string | null;
      login: (userName: string, password: string) => Promise<{ success: boolean; mustChangePassword: boolean }>;
      logout: () => Promise<void>;
      updateProfile: (data: UpdateClientProfileRequest) => Promise<boolean>;
      changePassword: (dto: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<boolean>;
      clearError: () => void;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
      const [client, setClient] = useState<Client | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const router = useRouter();
      const pathname = usePathname();

      const service = container.services.clientAuth;

      const isAuthenticated = !!client;
      const mustChangePassword = client?.mustChangePassword ?? false;

      // Load profile on mount
      const loadProfile = useCallback(async () => {
            if (!service.hasStoredCredentials()) {
                  setIsLoading(false);
                  return;
            }

            setIsLoading(true);
            try {
                  const profile = await service.loadProfile();
                  setClient(profile);
            } catch (err) {
                  console.error("Failed to load profile:", err);
                  setClient(null);
            } finally {
                  setIsLoading(false);
            }
      }, [service]);

      useEffect(() => {
            loadProfile();
      }, [loadProfile]);

      // Redirect to change-password if required
      useEffect(() => {
            if (isAuthenticated && mustChangePassword && pathname !== "/change-password") {
                  router.push("/change-password");
            }
      }, [isAuthenticated, mustChangePassword, pathname, router]);

      // Login function
      const login = useCallback(async (userName: string, password: string) => {
            setError(null);
            setIsLoading(true);

            try {
                  const result = await service.login({ userName, password });

                  if (!result.success) {
                        setError(result.error || "Login failed");
                        setIsLoading(false);
                        return { success: false, mustChangePassword: false };
                  }

                  // Load full profile after login
                  const profile = await service.loadProfile();
                  setClient(profile);
                  setIsLoading(false);

                  return {
                        success: true,
                        mustChangePassword: result.mustChangePassword || profile?.mustChangePassword || false
                  };
            } catch (err) {
                  const message = err instanceof Error ? err.message : "Login failed";
                  setError(message);
                  setIsLoading(false);
                  return { success: false, mustChangePassword: false };
            }
      }, [service]);

      // Logout function
      const logout = useCallback(async () => {
            setIsLoading(true);
            try {
                  await service.logout();
            } finally {
                  setClient(null);
                  setIsLoading(false);
                  router.push("/login");
            }
      }, [service, router]);

      // Update profile function
      const updateProfile = useCallback(async (data: UpdateClientProfileRequest): Promise<boolean> => {
            if (mustChangePassword) {
                  router.push("/change-password");
                  return false;
            }

            setError(null);
            try {
                  const updated = await service.updateProfile(data);
                  if (updated) {
                        setClient(updated);
                        return true;
                  }
                  return false;
            } catch (err) {
                  const message = err instanceof Error ? err.message : "Update failed";
                  setError(message);
                  return false;
            }
      }, [service, mustChangePassword, router]);

      // Change password function
      const changePassword = useCallback(async (dto: {
            currentPassword: string;
            newPassword: string;
            confirmPassword: string;
      }): Promise<boolean> => {
            setError(null);
            try {
                  await service.changePassword(dto);
                  // Clear client - user must re-login
                  setClient(null);
                  return true;
            } catch (err) {
                  const message = err instanceof Error ? err.message : "Password change failed";
                  setError(message);
                  return false;
            }
      }, [service]);

      // Clear error function
      const clearError = useCallback(() => setError(null), []);

      return (
            <ClientAuthContext.Provider
                  value={{
                        client,
                        isLoading,
                        isAuthenticated,
                        mustChangePassword,
                        error,
                        login,
                        logout,
                        updateProfile,
                        changePassword,
                        clearError,
                  }}
            >
                  {children}
            </ClientAuthContext.Provider>
      );
}

// Hook for using the context (backward compatible)
export function useClientAuth(): ClientAuthContextType {
      const context = useContext(ClientAuthContext);
      if (context === undefined) {
            throw new Error("useClientAuth must be used within a ClientAuthProvider");
      }
      return context;
}
