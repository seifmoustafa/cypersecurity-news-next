// Client Authentication Repository Interface

import type {
      Client,
      ClientLoginRequest,
      ClientLoginResponse,
      ClientChangePasswordRequest,
      UpdateClientProfileRequest,
      AvatarUploadResponse,
} from "../models/client-auth";

export interface ClientAuthRepository {
      /**
       * Authenticate client with username and password
       */
      login(request: ClientLoginRequest): Promise<ClientLoginResponse>;

      /**
       * Logout client and invalidate refresh token
       */
      logout(): Promise<void>;

      /**
       * Refresh access token using refresh token
       */
      refreshToken(refreshToken: string, clientId: string): Promise<ClientLoginResponse>;

      /**
       * Get current client profile
       */
      getProfile(): Promise<Client>;

      /**
       * Update client profile
       */
      updateProfile(request: UpdateClientProfileRequest): Promise<Client>;

      /**
       * Change client password
       */
      changePassword(request: ClientChangePasswordRequest): Promise<void>;

      /**
       * Upload client avatar
       */
      uploadAvatar(file: File): Promise<AvatarUploadResponse>;

      /**
       * Get stored access token
       */
      getAccessToken(): string | null;

      /**
       * Get stored refresh token
       */
      getRefreshToken(): string | null;

      /**
       * Get stored client ID
       */
      getClientId(): string | null;

      /**
       * Clear all stored tokens
       */
      clearTokens(): void;
}
