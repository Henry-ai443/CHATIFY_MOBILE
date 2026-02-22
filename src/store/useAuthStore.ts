import { create } from 'zustand';
import { axiosInstance } from '../services/api';
import { User, AuthResponse } from '../types';

interface AuthStore {
  // State
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;

  // Actions
  checkAuth: () => Promise<void>;
  signup: (data: { fullName: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profilePic: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      console.log('[Auth] Checking authentication...');
      const res = await axiosInstance.get<AuthResponse>('/auth/check');
      set({ authUser: res.data as User });
      console.log('[Auth] User authenticated:', res.data.fullName);
    } catch (error) {
      console.log('[Auth] Not authenticated:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      console.log('[Auth] Signing up with email:', data.email);
      const res = await axiosInstance.post<AuthResponse>('/auth/signup', data);
      set({ authUser: res.data as User });
      console.log('[Auth] Signup successful');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      console.error('[Auth] Signup error:', message);
      throw new Error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log('[Auth] Logging in with email:', data.email);
      const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
      set({ authUser: res.data as User });
      console.log('[Auth] Login successful');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      console.error('[Auth] Login error:', message);
      throw new Error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      console.log('[Auth] Logging out...');
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      console.log('[Auth] Logout successful');
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      throw error;
    }
  },

  updateProfile: async (profilePic: string) => {
    set({ isUpdatingProfile: true });
    try {
      console.log('[Auth] Updating profile...');
      const formData = new FormData();
      formData.append('profilePic', {
        uri: profilePic,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const res = await axiosInstance.put<AuthResponse>('/auth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({ authUser: res.data as User });
      console.log('[Auth] Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed.';
      console.error('[Auth] Update profile error:', message);
      throw new Error(message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
