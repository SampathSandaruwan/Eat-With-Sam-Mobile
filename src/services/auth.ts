import { API_CLIENT } from '@lib';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterUserRequestBody,
} from '@types';

export const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await API_CLIENT.post('/auth/login', credentials);
  return response.data;
};

export const signup = async (userData: RegisterUserRequestBody): Promise<ApiResponse<AuthResponse>> => {
  const response = await API_CLIENT.post('/auth/signup', userData);
  return response.data;
};

export const authenticateWithGoogle = async (userData: RegisterUserRequestBody): Promise<ApiResponse<AuthResponse>> => {
  const response = await API_CLIENT.post('/auth/google', userData);
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> => {
  const request: RefreshTokenRequest = { refreshToken };
  const response = await API_CLIENT.post('/auth/refresh', request);
  return response.data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  const request: RefreshTokenRequest = { refreshToken };
  await API_CLIENT.post('/auth/logout', request);
};

