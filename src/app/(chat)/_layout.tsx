import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../../store/useAuthStore';
import { Redirect } from 'expo-router';
import { initSocket, emitUserOnline } from '../../services/socket';
import { useChatStore } from '../../store/useChatStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNotifications } from '../../lib/notifications';
import ChatHome from './index';
import ProfileScreen from './profile';

const Tab = createBottomTabNavigator();

export default function ChatLayout(): React.ReactElement {
  const { authUser, logout } = useAuthStore();
  const { initializeSocket } = useChatStore();
  const { showError } = useNotifications();

  // Redirect to login if not authenticated
  if (!authUser) {
    return <Redirect href="/(auth)/login" />;
  }

  useEffect(() => {
    // Initialize Socket.IO connection
    const socket = initSocket();
    emitUserOnline(authUser._id);

    // Setup socket listeners
    initializeSocket(authUser._id);

    // Cleanup on unmount
    return () => {
      // Note: We keep socket connected for background messaging
    };
  }, [authUser._id, initializeSocket]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showError('Logout failed');
    }
  };

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
        name="index"
        component={ChatHome}
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
