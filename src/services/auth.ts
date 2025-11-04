import { API_CLIENT } from '@lib';
import {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterUserRequestBody,
} from '@types';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await API_CLIENT.post('/auth/login', credentials);
  return response.data;
};

export const signup = async (userData: RegisterUserRequestBody): Promise<AuthResponse> => {
  const response = await API_CLIENT.post('/auth/signup', userData);
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const request: RefreshTokenRequest = { refreshToken };
  const response = await API_CLIENT.post('/auth/refresh', request);
  return response.data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  const request: RefreshTokenRequest = { refreshToken };
  await API_CLIENT.post('/auth/logout', request);
};

