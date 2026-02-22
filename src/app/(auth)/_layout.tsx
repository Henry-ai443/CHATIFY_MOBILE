import React from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Redirect } from 'expo-router';

export default function AuthLayout(): React.ReactElement {
  const { authUser } = useAuthStore();

  // If user is already authenticated, redirect to chat
  if (authUser) {
    return <Redirect href="/(chat)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
