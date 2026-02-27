import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useNotifications } from '../../lib/notifications';
import { initSocket, emitUserOnline } from '../../services/socket';

import ChatHome from './index';
import ChatDetail from './[chatId]';
import ProfileScreen from './profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* -------------------- Chat Stack -------------------- */

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chatHome" component={ChatHome} />
      <Stack.Screen name="chatDetail" component={ChatDetail} />
    </Stack.Navigator>
  );
}

/* -------------------- Chat Layout -------------------- */

export default function ChatLayout(): React.ReactElement {
  const { authUser, logout } = useAuthStore();
  const { initializeSocket } = useChatStore();
  const { showError } = useNotifications();

  /* ---------- Auth Guard (SIDE EFFECT, NOT RENDER LOGIC) ---------- */
  useEffect(() => {
    if (!authUser) {
      router.replace('/(auth)/login');
    }
  }, [authUser]);

  /* ---------- Socket Initialization ---------- */
  useEffect(() => {
    if (!authUser) return;

    initSocket();
    emitUserOnline(authUser._id);
    initializeSocket(authUser._id);
  }, [authUser, initializeSocket]);

  /* ---------- Logout ---------- */
  const handleLogout = async () => {
    try {
      await logout();
      // navigation handled by auth effect
    } catch {
      showError('Logout failed');
    }
  };

  /* ---------- Always Render JSX ---------- */
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#06b6d4',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="chats"
        component={ChatStack}
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="comments" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}