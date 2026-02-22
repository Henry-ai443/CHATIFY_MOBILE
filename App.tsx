import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ExpoRoot } from 'expo-router';

const ctx = require.context('./src/app');

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExpoRoot context={ctx} />
    </GestureHandlerRootView>
  );
}
