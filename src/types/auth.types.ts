// Backend-aligned types
export interface UserResponse {
  id: number;
  email: string;
  passwordHash?: string | null;
  googleId?: string | null;
  name: string;
  phoneNumber?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface RegisterUserRequestBody {
  email: string;
  password?: string | null;
  googleId?: string | null;
  name: string;
  phoneNumber?: string | null;
  address?: string | null;
}

// Auth flow types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: TokenPair;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  tokens: TokenPair;
}
