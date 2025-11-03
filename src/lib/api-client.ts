import { Platform } from 'react-native';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from 'dotenv';

import { getAccessToken } from './token-storage';

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
    data: response.data.data ?? response.data,
  });
};

const errorResponseHandler = (error: AxiosError) => {
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

  // eslint-disable-next-line no-console
  console.error('API Error:', errorDetails);

  return Promise.reject(error);
};

// Add request interceptor to include access token
API.interceptors.request.use(requestInterceptor);

// Add response interceptors
API.interceptors.response.use(successResponseHandler, errorResponseHandler);

export default API;
