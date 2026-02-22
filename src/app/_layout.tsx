import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { useAuthStore } from '../store/useAuthStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout(): React.ReactElement {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app launch
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Hide splash screen once auth check is complete
    if (!isCheckingAuth) {
      SplashScreen.hideAsync();
    }
  }, [isCheckingAuth]);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f172a' },
            animationEnabled: true,
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(chat)" />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
