import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { clearTokens, getAccessToken, getRefreshToken, saveTokens, signInWithGoogle, signOutFromGoogle } from '@lib';
import { authenticateWithGoogle, login, logout as logoutAPI, refreshAccessToken as refreshTokenAPI, signup } from '@services';
import {
  LoginRequest,
  RegisterUserRequestBody,
  UserResponse,
} from '@types';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  authenticateWithGoogle: () => Promise<void>;
  signup: (userData: RegisterUserRequestBody) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  updateProfile: (profile: Partial<UserResponse>) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await login(credentials);
          const { user, tokens } = response.data;

          // Save tokens securely
          await saveTokens(tokens.accessToken, tokens.refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Login failed. Please try again.';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await signup(userData);
          const { user, tokens } = response.data;

          // Save tokens securely
          await saveTokens(tokens.accessToken, tokens.refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Signup failed. Please try again.';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      authenticateWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          // Sign in with Google and get ID token
          const { userInfo } = await signInWithGoogle();

          if (!userInfo) {
            throw new Error('Failed to get ID token or user info from Google Sign-In');
          }

          // Send ID token to backend for verification and authentication
          const response = await authenticateWithGoogle({
            email: userInfo.email,
            googleId: userInfo.id,
            name: userInfo.name || '',
          });
          const { user, tokens } = response.data;

          // Save tokens securely
          await saveTokens(tokens.accessToken, tokens.refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Google Sign-In failed. Please try again.';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        const refreshTokenValue = await getRefreshToken();

        set({ isLoading: true });
        try {
          // Sign out from Google if signed in
          try {
            await signOutFromGoogle();
          } catch {
            // Ignore Google sign out errors - user might not be signed in with Google
          }

          // Call logout API if we have a refresh token
          if (refreshTokenValue) {
            try {
              await logoutAPI(refreshTokenValue);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Logout API call failed:', error);
              // Continue with logout even if API call fails
            }
          }
        } finally {
          // Clear tokens from secure storage
          await clearTokens();

          // Clear auth state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshTokens: async () => {
        try {
          const refreshTokenValue = await getRefreshToken();
          if (!refreshTokenValue) {
            throw new Error('No refresh token available');
          }

          const response = await refreshTokenAPI(refreshTokenValue);
          const { tokens } = response.data;

          // Save new tokens securely
          await saveTokens(tokens.accessToken, tokens.refreshToken);

          // Update state if user is logged in
          if (get().isAuthenticated) {
            set({ error: null });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Token refresh failed';

          // If refresh fails, clear auth state
          await clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateProfile: (profile) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...profile,
            },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const accessToken = await getAccessToken();
          const refreshTokenValue = await getRefreshToken();

          if (!accessToken || !refreshTokenValue) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          // Validate token by attempting refresh
          // If refresh succeeds, tokens are valid
          await get().refreshTokens();

          // Note: User profile should be fetched from API on app start
          // For now, we'll assume tokens are valid if refresh succeeds
          // In a full implementation, you'd fetch user profile here
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Auth initialization failed:', error);
          await clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user data, not tokens (tokens are in secure storage)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

