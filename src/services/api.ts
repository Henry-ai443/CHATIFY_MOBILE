import axios, { AxiosInstance } from 'axios';

const API_URL = 'https://chatify-backend-4p7g.onrender.com/api';

/**
 * Axios instance configured for Chatify API
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

/**
 * Request interceptor for debugging and adding headers if needed
 */
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API] Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('[API] Error response:', error.response.data);
    } else if (error.request) {
      console.error('[API] No response from server:', error.request);
    } else {
      console.error('[API] Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
