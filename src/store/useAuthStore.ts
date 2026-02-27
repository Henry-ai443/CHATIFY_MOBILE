import { create } from 'zustand';
import { axiosInstance } from '../services/api';
import { User, AuthResponse } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface ToastFunctions {
  showSuccess?: (msg: string) => void;
  showError?: (msg: string) => void;
}

interface AuthStore {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;

  checkAuth: (toasts?: ToastFunctions) => Promise<void>;
  signup: (data: { fullName: string; email: string; password: string }, toasts?: ToastFunctions) => Promise<void>;
  login: (data: { email: string; password: string }, toasts?: ToastFunctions) => Promise<void>;
  logout: (toasts?: ToastFunctions) => Promise<void>;
  updateProfile: (profilePic: string, toasts?: ToastFunctions) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async (toasts) => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get<AuthResponse>('/auth/check');
      set({ authUser: res.data as User });
    } catch (error: any) {
      set({ authUser: null });
      toasts?.showError?.(error.userMessage || 'Not authenticated');
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data, toasts) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<AuthResponse>('/auth/signup', data);
      set({ authUser: res.data as User });
      toasts?.showSuccess?.('Signup successful!');
    } catch (error: any) {
      toasts?.showError?.(error.userMessage || 'Signup failed. Please try again.');
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data, toasts) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
      set({ authUser: res.data as User });
      await AsyncStorage.setItem('authToken', res.data.token || '');
      toasts?.showSuccess?.('Login successful!');
    } catch (error: any) {
      toasts?.showError?.(error.userMessage || 'Login failed. Please try again.');
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (toasts) => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error: any) {
      toasts?.showError?.(error.userMessage || 'Logout failed');
    } finally {
      await AsyncStorage.removeItem('authToken');
      set({ authUser: null });
      toasts?.showSuccess?.('Logged out successfully');
      router.replace('/(auth)/login');
    }
  },

  updateProfile: async (profilePic, toasts) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();
      formData.append('profilePic', {
        uri: profilePic,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const res = await axiosInstance.put<AuthResponse>('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      set({ authUser: res.data as User });
      toasts?.showSuccess?.('Profile updated!');
    } catch (error: any) {
      toasts?.showError?.(error.userMessage || 'Profile update failed');
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));