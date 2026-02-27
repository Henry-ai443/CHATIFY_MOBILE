import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout(): React.ReactElement {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function prepareApp() {
      try {
        await SplashScreen.preventAutoHideAsync(); // wait until runtime ready
        if (isMounted) {
          await checkAuth(); // run your auth check
        }
      } catch (e) {
        // Handle error silently
      } finally {
        // hide splash screen once auth check is done
        if (isMounted) {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepareApp();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f172a', flex: 1 },
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