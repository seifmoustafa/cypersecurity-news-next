// Client Authentication Repository Implementation

import type { ClientAuthRepository } from "../../domain/repositories/client-auth-repository";
import type {
      Client,
      ClientLoginRequest,
      ClientLoginResponse,
      ClientChangePasswordRequest,
      UpdateClientProfileRequest,
      AvatarUploadResponse,
} from "../../domain/models/client-auth";

// Token storage keys
const ACCESS_TOKEN_KEY = "client_access_token";
const REFRESH_TOKEN_KEY = "client_refresh_token";
const CLIENT_ID_KEY = "client_id";

export class ClientAuthRepositoryImpl implements ClientAuthRepository {
      private baseUrl: string;
      private baseImageUrl: string;

      constructor() {
            this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            // Remove /api from the base URL for images (same as news-repository-impl)
            this.baseImageUrl = this.baseUrl.replace("/api", "");
      }

      // Token management
      getAccessToken(): string | null {
            if (typeof window === "undefined") return null;
            return localStorage.getItem(ACCESS_TOKEN_KEY);
      }

      getRefreshToken(): string | null {
            if (typeof window === "undefined") return null;
            return localStorage.getItem(REFRESH_TOKEN_KEY);
      }

      getClientId(): string | null {
            if (typeof window === "undefined") return null;
            return localStorage.getItem(CLIENT_ID_KEY);
      }

      private setTokens(accessToken: string, refreshToken: string): void {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      private setClientId(clientId: string): void {
            localStorage.setItem(CLIENT_ID_KEY, clientId);
      }

      clearTokens(): void {
            if (typeof window === "undefined") return;
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(CLIENT_ID_KEY);
      }

      // Helper method for authenticated requests
      private async authenticatedFetch<T>(
            endpoint: string,
            options: RequestInit = {}
      ): Promise<T> {
            const token = this.getAccessToken();
            const headers: Record<string, string> = {
                  ...(options.headers as Record<string, string>),
            };

            if (token) {
                  headers["Authorization"] = `Bearer ${token}`;
            }

            if (!options.body || !(options.body instanceof FormData)) {
                  headers["Content-Type"] = "application/json";
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                  ...options,
                  headers,
            });

            if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Handle 204 No Content
            if (response.status === 204) {
                  return {} as T;
            }

            return response.json();
      }

      // Parse JWT to extract client ID
      private parseJwt(token: string): { sub?: string;[key: string]: any } {
            try {
                  const base64Url = token.split(".")[1];
                  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                  const jsonPayload = decodeURIComponent(
                        atob(base64)
                              .split("")
                              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                              .join("")
                  );
                  return JSON.parse(jsonPayload);
            } catch {
                  return {};
            }
      }

      // API Methods
      async login(request: ClientLoginRequest): Promise<ClientLoginResponse> {
            const response = await fetch(`${this.baseUrl}/Client/Auth/login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(request),
            });

            if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.message || "Login failed");
            }

            const data: ClientLoginResponse = await response.json();

            // Store tokens
            this.setTokens(data.accessToken, data.refreshToken);

            // Extract and store client ID from token
            const payload = this.parseJwt(data.accessToken);
            if (payload.sub) {
                  this.setClientId(payload.sub);
            }

            return data;
      }

      async logout(): Promise<void> {
            const clientId = this.getClientId();
            const refreshToken = this.getRefreshToken();

            if (clientId && refreshToken) {
                  try {
                        await this.authenticatedFetch("/Client/Auth/logout", {
                              method: "POST",
                              body: JSON.stringify({ clientId, refreshToken }),
                        });
                  } catch (error) {
                        console.error("Logout API error:", error);
                  }
            }

            this.clearTokens();
      }

      async refreshToken(refreshToken: string, clientId: string): Promise<ClientLoginResponse> {
            const response = await fetch(`${this.baseUrl}/Client/Auth/refresh`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refreshToken, clientId }),
            });

            if (!response.ok) {
                  this.clearTokens();
                  throw new Error("Token refresh failed");
            }

            const data: ClientLoginResponse = await response.json();
            this.setTokens(data.accessToken, data.refreshToken);

            return data;
      }

      async getProfile(): Promise<Client> {
            const client = await this.authenticatedFetch<Client>("/Client/Profile", {
                  method: "GET",
            });
            return this.transformClient(client);
      }

      async updateProfile(request: UpdateClientProfileRequest): Promise<Client> {
            const client = await this.authenticatedFetch<Client>("/Client/Profile", {
                  method: "PUT",
                  body: JSON.stringify(request),
            });
            return this.transformClient(client);
      }

      async changePassword(request: ClientChangePasswordRequest): Promise<void> {
            await this.authenticatedFetch<void>("/Client/Profile/change-password", {
                  method: "POST",
                  body: JSON.stringify(request),
            });
      }

      async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
            const formData = new FormData();
            formData.append("file", file);

            const response = await this.authenticatedFetch<AvatarUploadResponse>("/Client/Profile/avatar", {
                  method: "POST",
                  body: formData,
            });

            // Transform the avatar URL to include base image URL
            return {
                  ...response,
                  avatarUrl: response.avatarUrl ? `${this.baseImageUrl}${response.avatarUrl}` : response.avatarUrl,
            };
      }

      // Transform client data to include full image URLs (like news-repository-impl)
      private transformClient(client: Client): Client {
            return {
                  ...client,
                  avatar: client.avatar ? `${this.baseImageUrl}${client.avatar}` : null,
            };
      }
}
