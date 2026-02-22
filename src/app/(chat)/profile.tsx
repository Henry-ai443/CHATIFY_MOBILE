import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { router } from 'expo-router';
import { useNotifications } from '../../lib/notifications';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProfileScreen(): React.ReactElement {
  const { authUser, logout, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { showError, showSuccess } = useNotifications();

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);

        // Upload profile picture
        try {
          await updateProfile(imageUri);
          showSuccess('Profile picture updated!');
        } catch (error: any) {
          showError(error.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      showError('Failed to pick image');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      router.replace('/(auth)/login');
    } catch (error: any) {
      showError(error.message || 'Logout failed');
    }
  };

  if (!authUser) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#94a3b8' }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Header */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#e2e8f0',
            marginBottom: 24,
          }}
        >
          Profile
        </Text>

        {/* Profile Picture Section */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={{
              position: 'relative',
              width: 120,
              height: 120,
              borderRadius: 60,
              overflow: 'hidden',
              backgroundColor: '#1e293b',
            }}
            disabled={isUpdatingProfile}
          >
            <Image
              source={{
                uri: selectedImage || authUser.profilePic || 'https://via.placeholder.com/120',
              }}
              style={{ width: '100%', height: '100%' }}
            />

            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#06b6d4',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderColor: '#0f172a',
              }}
            >
              {isUpdatingProfile ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <FontAwesome name="camera" size={16} color="#000" />
              )}
            </View>
          </TouchableOpacity>

          <Text
            style={{
              color: '#94a3b8',
              fontSize: 12,
              marginTop: 12,
              textAlign: 'center',
            }}
          >
            Tap to change profile picture
          </Text>
        </View>

        {/* User Info Section */}
        <View
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                color: '#94a3b8',
                fontSize: 12,
                marginBottom: 6,
                textTransform: 'uppercase',
              }}
            >
              Full Name
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: '500' }}>
              {authUser.fullName}
            </Text>
          </View>

          <View>
            <Text
              style={{
                color: '#94a3b8',
                fontSize: 12,
                marginBottom: 6,
                textTransform: 'uppercase',
              }}
            >
              Email Address
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: '500' }}>
              {authUser.email}
            </Text>
          </View>
        </View>

        {/* Account Info */}
        <View
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <FontAwesome name="info-circle" size={20} color="#06b6d4" />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#e2e8f0',
                  fontSize: 14,
                  fontWeight: '500',
              }}
              >
                Account ID
              </Text>
              <Text
                style={{
                  color: '#64748b',
                  fontSize: 12,
                  marginTop: 4,
                }}
                numberOfLines={1}
              >
                {authUser._id}
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#dc2626',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FontAwesome name="sign-out" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
