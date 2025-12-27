// Client Authentication Service

import type { ClientAuthRepository } from "../domain/repositories/client-auth-repository";
import type {
      Client,
      ClientLoginRequest,
      ClientChangePasswordRequest,
      UpdateClientProfileRequest,
      AvatarUploadResponse,
} from "../domain/models/client-auth";

export interface LoginResult {
      success: boolean;
      mustChangePassword: boolean;
      error?: string;
}

export interface AuthState {
      client: Client | null;
      isAuthenticated: boolean;
      isLoading: boolean;
      mustChangePassword: boolean;
      error: string | null;
}

export class ClientAuthService {
      private repository: ClientAuthRepository;

      constructor(repository: ClientAuthRepository) {
            this.repository = repository;
      }

      /**
       * Check if user has valid tokens stored
       */
      hasStoredCredentials(): boolean {
            return !!this.repository.getAccessToken();
      }

      /**
       * Get stored client ID
       */
      getClientId(): string | null {
            return this.repository.getClientId();
      }

      /**
       * Login with username and password
       */
      async login(request: ClientLoginRequest): Promise<LoginResult> {
            try {
                  const response = await this.repository.login(request);
                  return {
                        success: true,
                        mustChangePassword: response.mustChangePassword,
                  };
            } catch (error) {
                  console.error("ClientAuthService: Login error:", error);
                  return {
                        success: false,
                        mustChangePassword: false,
                        error: error instanceof Error ? error.message : "Login failed",
                  };
            }
      }

      /**
       * Logout current user
       */
      async logout(): Promise<void> {
            try {
                  await this.repository.logout();
            } catch (error) {
                  console.error("ClientAuthService: Logout error:", error);
                  // Always clear tokens even if logout API fails
                  this.repository.clearTokens();
            }
      }

      /**
       * Load current user profile
       */
      async loadProfile(): Promise<Client | null> {
            try {
                  const client = await this.repository.getProfile();
                  return client;
            } catch (error) {
                  console.error("ClientAuthService: Error loading profile:", error);
                  return null;
            }
      }

      /**
       * Update user profile
       */
      async updateProfile(request: UpdateClientProfileRequest): Promise<Client | null> {
            try {
                  const updated = await this.repository.updateProfile(request);
                  return updated;
            } catch (error) {
                  console.error("ClientAuthService: Error updating profile:", error);
                  throw error;
            }
      }

      /**
       * Change password
       */
      async changePassword(request: ClientChangePasswordRequest): Promise<boolean> {
            try {
                  await this.repository.changePassword(request);
                  // After password change, clear tokens - user must re-login
                  this.repository.clearTokens();
                  return true;
            } catch (error) {
                  console.error("ClientAuthService: Error changing password:", error);
                  throw error;
            }
      }

      /**
       * Upload avatar
       */
      async uploadAvatar(file: File): Promise<AvatarUploadResponse | null> {
            try {
                  const response = await this.repository.uploadAvatar(file);
                  return response;
            } catch (error) {
                  console.error("ClientAuthService: Error uploading avatar:", error);
                  throw error;
            }
      }

      /**
       * Validate password strength
       */
      validatePasswordStrength(password: string): {
            isValid: boolean;
            checks: {
                  minLength: boolean;
                  hasUppercase: boolean;
                  hasLowercase: boolean;
                  hasNumber: boolean;
                  hasSpecialChar: boolean;
            };
      } {
            const checks = {
                  minLength: password.length >= 8,
                  hasUppercase: /[A-Z]/.test(password),
                  hasLowercase: /[a-z]/.test(password),
                  hasNumber: /[0-9]/.test(password),
                  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            };

            return {
                  isValid: Object.values(checks).every(Boolean),
                  checks,
            };
      }

      /**
       * Attempt to refresh token
       */
      async refreshToken(): Promise<boolean> {
            const refreshToken = this.repository.getRefreshToken();
            const clientId = this.repository.getClientId();

            if (!refreshToken || !clientId) {
                  return false;
            }

            try {
                  await this.repository.refreshToken(refreshToken, clientId);
                  return true;
            } catch (error) {
                  console.error("ClientAuthService: Token refresh failed:", error);
                  this.repository.clearTokens();
                  return false;
            }
      }
}
