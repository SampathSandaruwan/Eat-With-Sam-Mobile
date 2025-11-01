import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_URL } from 'dotenv';

const API = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

const successResponseHandler = (response: AxiosResponse) => {
  return Promise.resolve({
    ...response,
    data: response.data.data ?? response.data,
  });
};

const errorResponseHandler = (error: AxiosError) => {
  console.error('API Error:', {
    url: error.config?.url,
    status: error.response?.status,
    data: error.response?.data,
  });

  return Promise.reject(error);
};

API.interceptors.response.use(successResponseHandler, errorResponseHandler);

export default API;
