// Client Authentication Hooks (ViewModels)

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { container } from "@/core/di/container";
import type {
      Client,
      ClientChangePasswordRequest,
      UpdateClientProfileRequest,
} from "@/core/domain/models/client-auth";

// ============================================================================
// useClientLogin - Hook for login functionality
// ============================================================================

interface UseClientLoginReturn {
      login: (userName: string, password: string) => Promise<{ success: boolean; mustChangePassword: boolean }>;
      isLoading: boolean;
      error: string | null;
      clearError: () => void;
}

export function useClientLogin(): UseClientLoginReturn {
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const router = useRouter();

      const login = useCallback(async (userName: string, password: string) => {
            setIsLoading(true);
            setError(null);

            try {
                  const result = await container.services.clientAuth.login({ userName, password });

                  if (!result.success) {
                        setError(result.error || "Login failed");
                        return { success: false, mustChangePassword: false };
                  }

                  // Redirect based on mustChangePassword
                  if (result.mustChangePassword) {
                        router.push("/change-password");
                  } else {
                        router.push("/simple");
                  }

                  return { success: true, mustChangePassword: result.mustChangePassword };
            } catch (err) {
                  const message = err instanceof Error ? err.message : "Login failed";
                  setError(message);
                  return { success: false, mustChangePassword: false };
            } finally {
                  setIsLoading(false);
            }
      }, [router]);

      const clearError = useCallback(() => setError(null), []);

      return { login, isLoading, error, clearError };
}

// ============================================================================
// useClientProfile - Hook for profile management
// ============================================================================

interface UseClientProfileReturn {
      client: Client | null;
      isLoading: boolean;
      error: string | null;
      isAuthenticated: boolean;
      mustChangePassword: boolean;
      loadProfile: () => Promise<void>;
      updateProfile: (data: UpdateClientProfileRequest) => Promise<boolean>;
      clearError: () => void;
}

export function useClientProfile(): UseClientProfileReturn {
      const [client, setClient] = useState<Client | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const router = useRouter();

      const isAuthenticated = !!client;
      const mustChangePassword = client?.mustChangePassword ?? false;

      const loadProfile = useCallback(async () => {
            if (!container.services.clientAuth.hasStoredCredentials()) {
                  setIsLoading(false);
                  return;
            }

            setIsLoading(true);
            try {
                  const profile = await container.services.clientAuth.loadProfile();
                  setClient(profile);
            } catch (err) {
                  console.error("Failed to load profile:", err);
                  setClient(null);
            } finally {
                  setIsLoading(false);
            }
      }, []);

      const updateProfile = useCallback(async (data: UpdateClientProfileRequest): Promise<boolean> => {
            if (mustChangePassword) {
                  router.push("/change-password");
                  return false;
            }

            setError(null);
            try {
                  const updated = await container.services.clientAuth.updateProfile(data);
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
      }, [mustChangePassword, router]);

      const clearError = useCallback(() => setError(null), []);

      // Auto-load profile on mount
      useEffect(() => {
            loadProfile();
      }, [loadProfile]);

      return {
            client,
            isLoading,
            error,
            isAuthenticated,
            mustChangePassword,
            loadProfile,
            updateProfile,
            clearError,
      };
}

// ============================================================================
// useChangePassword - Hook for password change functionality
// ============================================================================

interface PasswordValidation {
      minLength: boolean;
      hasUppercase: boolean;
      hasLowercase: boolean;
      hasNumber: boolean;
      hasSpecialChar: boolean;
}

interface UseChangePasswordReturn {
      changePassword: (request: ClientChangePasswordRequest) => Promise<boolean>;
      isLoading: boolean;
      error: string | null;
      validatePassword: (password: string) => { isValid: boolean; checks: PasswordValidation };
      clearError: () => void;
}

export function useChangePassword(): UseChangePasswordReturn {
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const router = useRouter();

      const changePassword = useCallback(async (request: ClientChangePasswordRequest): Promise<boolean> => {
            setIsLoading(true);
            setError(null);

            try {
                  await container.services.clientAuth.changePassword(request);
                  // Redirect to login after successful password change
                  router.push("/login");
                  return true;
            } catch (err) {
                  const message = err instanceof Error ? err.message : "Password change failed";
                  setError(message);
                  return false;
            } finally {
                  setIsLoading(false);
            }
      }, [router]);

      const validatePassword = useCallback((password: string) => {
            return container.services.clientAuth.validatePasswordStrength(password);
      }, []);

      const clearError = useCallback(() => setError(null), []);

      return { changePassword, isLoading, error, validatePassword, clearError };
}

// ============================================================================
// useAvatarUpload - Hook for avatar upload functionality
// ============================================================================

interface UseAvatarUploadReturn {
      uploadAvatar: (file: File) => Promise<string | null>;
      isUploading: boolean;
      error: string | null;
      clearError: () => void;
}

export function useAvatarUpload(): UseAvatarUploadReturn {
      const [isUploading, setIsUploading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
            setIsUploading(true);
            setError(null);

            try {
                  const response = await container.services.clientAuth.uploadAvatar(file);
                  if (response) {
                        // URL is already transformed by repository
                        return response.avatarUrl;
                  }
                  return null;
            } catch (err) {
                  const message = err instanceof Error ? err.message : "Avatar upload failed";
                  setError(message);
                  return null;
            } finally {
                  setIsUploading(false);
            }
      }, []);

      const clearError = useCallback(() => setError(null), []);

      return { uploadAvatar, isUploading, error, clearError };
}

// ============================================================================
// useClientLogout - Hook for logout functionality
// ============================================================================

interface UseClientLogoutReturn {
      logout: () => Promise<void>;
      isLoading: boolean;
}

export function useClientLogout(): UseClientLogoutReturn {
      const [isLoading, setIsLoading] = useState(false);
      const router = useRouter();

      const logout = useCallback(async () => {
            setIsLoading(true);
            try {
                  await container.services.clientAuth.logout();
                  router.push("/login");
            } catch (err) {
                  console.error("Logout error:", err);
            } finally {
                  setIsLoading(false);
            }
      }, [router]);

      return { logout, isLoading };
}
