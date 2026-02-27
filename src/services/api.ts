import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from 'react-native-toast-notifications'; // We'll inject this in your store/hooks
import { router } from 'expo-router';

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
 * Request interceptor: debug logging + attach token
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    // Attach token if exists
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: user-friendly toast messages & auto logout on 401
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let errorMessage = 'An error occurred. Please try again.';

    if (error.response) {
      const { status, data } = error.response;

      // Friendly messages per status
      switch (status) {
        case 401:
          errorMessage = 'Session expired. Please log in again.';
          // Clear token and redirect
          await AsyncStorage.removeItem('authToken');
          router.replace('/(auth)/login');
          break;
        case 403:
          errorMessage = 'Access denied.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Try again later.';
          break;
        default:
          if (data?.message) errorMessage = data.message;
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Check your connection.';
    } else {
      errorMessage = error.message || 'Request error';
    }

    // Attach user-friendly message
    error.userMessage = errorMessage;

    // Show toast (ensure your toast context is available globally)
    try {
      toast.show(errorMessage, {
        type: 'danger',
        placement: 'top',
        duration: 4000,
      });
    } catch {
      // fallback if toast is not ready yet
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;