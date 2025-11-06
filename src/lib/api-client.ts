import { Platform } from 'react-native';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from 'dotenv';

import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './token-storage';

// On Android emulator, localhost points to the emulator itself, not the host machine
// Replace localhost with 10.0.2.2 which is the special IP for Android emulator to access host
const getBaseURL = () => {
  if (Platform.OS === 'android' && API_URL?.includes('localhost')) {
    return API_URL.replace('localhost', '10.0.2.2');
  }
  return API_URL;
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
});

// Log API configuration on initialization (helpful for debugging)
if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log('API Client initialized:', {
    originalBaseURL: API_URL,
    actualBaseURL: getBaseURL(),
    platform: Platform.OS,
  });
}

// Request interceptor to add access token to headers
const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get access token for request:', error);
    // Continue without token - request will proceed without auth header
  }
  return config;
};

const successResponseHandler = (response: AxiosResponse) => {
  return Promise.resolve({
    ...response,
    data: response.data,
  });
};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  request: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      // Update request with new token and retry
      if (prom.request.headers) {
        prom.request.headers.Authorization = `Bearer ${token}`;
      }
      prom.resolve(API(prom.request));
    }
  });
  failedQueue = [];
};

const errorResponseHandler = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  // Enhanced error logging for Android debugging
  const errorDetails = {
    platform: Platform.OS,
    originalBaseURL: API_URL,
    actualBaseURL: getBaseURL(),
    fullURL: error.config ? `${error.config.baseURL || ''}${error.config.url || ''}` : 'unknown',
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    message: error.message,
    code: error.code,
    // Network errors don't have response, so check for request object
    networkError: !error.response && !error.request ? true : undefined,
    timeout: error.code === 'ECONNABORTED',
  };

  // Handle 401 Unauthorized - attempt token refresh
  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    // Check if this is already a refresh token request to avoid infinite loop
    if (originalRequest.url?.includes('/auth/refresh')) {
      // Refresh token request failed - clear tokens and reject
      await clearTokens();
      // eslint-disable-next-line no-console
      console.error('Token refresh failed - user must re-authenticate');
      // eslint-disable-next-line no-console
      console.error('API Error:', errorDetails);
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, request: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Create a fresh axios instance for refresh to avoid interceptor loops
      const refreshAxios = axios.create({
        baseURL: getBaseURL(),
        timeout: 5000,
      });

      // Call refresh endpoint
      const refreshResponse = await refreshAxios.post<{ data?: { tokens: { accessToken: string; refreshToken: string } } }>(
        '/auth/refresh',
        { refreshToken },
      );

      // Handle both response formats: { data: { tokens: ... } } or { tokens: ... }
      const responseData = refreshResponse.data.data;
      const tokens = responseData?.tokens;

      if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
        throw new Error('Invalid token response from refresh endpoint');
      }

      await saveTokens(tokens.accessToken, tokens.refreshToken);

      // Update the original request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }

      // Process queued requests
      processQueue(null, tokens.accessToken);

      // Retry the original request
      return API(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear tokens and reject all queued requests
      processQueue(refreshError as AxiosError);
      await clearTokens();

      // eslint-disable-next-line no-console
      console.error('Token refresh failed:', refreshError);
      // eslint-disable-next-line no-console
      console.error('API Error:', errorDetails);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  // eslint-disable-next-line no-console
  console.error('API Error:', errorDetails);

  return Promise.reject(error);
};

// Add request interceptor to include access token
API.interceptors.request.use(requestInterceptor);

// Add response interceptors
API.interceptors.response.use(successResponseHandler, errorResponseHandler);

export default API;
