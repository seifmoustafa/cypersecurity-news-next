// Client Authentication Domain Models

export interface Client {
      id: string;
      sNumber: string;
      mNumber: string;
      userName: string;
      firstName: string;
      lastName: string;
      personalPhone: string;
      avatar: string | null;
      rank: string;
      itBranch: string;
      cdm: string | null;
      strategicNumber: string | null;
      mustChangePassword: boolean;
}

export interface ClientLoginRequest {
      userName: string;
      password: string;
}

export interface ClientLoginResponse {
      accessToken: string;
      refreshToken: string;
      mustChangePassword: boolean;
}

export interface ClientRefreshTokenRequest {
      refreshToken: string;
      clientId: string;
}

export interface ClientChangePasswordRequest {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
}

export interface UpdateClientProfileRequest {
      firstName?: string;
      lastName?: string;
      personalPhone?: string;
      avatar?: string | null;
      rank?: string;
      itBranch?: string;
      cdm?: string;
      strategicNumber?: string;
}

export interface AvatarUploadResponse {
      avatarUrl: string;
      message: string;
}

// Helper function to get initials from name
export function getClientInitials(firstName: string, lastName: string): string {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
