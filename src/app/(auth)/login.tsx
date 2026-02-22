import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotifications } from '../../lib/notifications';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function LoginScreen(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const { showError, showSuccess } = useNotifications();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showError('Please fill in all fields');
      return;
    }

    try {
      await login({ email, password });
      showSuccess('Logged in successfully!');
      router.replace('/(chat)');
    } catch (error: any) {
      showError(error.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#0f172a' }}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <FontAwesome name="comments" size={50} color="#06b6d4" />
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#e2e8f0',
                marginTop: 10,
              }}
            >
              Chatify
            </Text>
            <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 5 }}>
              Welcome back
            </Text>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 8 }}>
              Email Address
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#334155',
                paddingHorizontal: 12,
              }}
            >
              <FontAwesome name="envelope" size={18} color="#64748b" />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  fontSize: 14,
                  color: '#e2e8f0',
                }}
                placeholder="you@example.com"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!isLoggingIn}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 8 }}>
              Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#334155',
                paddingHorizontal: 12,
              }}
            >
              <FontAwesome name="lock" size={18} color="#64748b" />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  fontSize: 14,
                  color: '#e2e8f0',
                }}
                placeholder="Enter your password"
                placeholderTextColor="#64748b"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoggingIn}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={18}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#06b6d4',
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16,
            }}
            onPress={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>
              Don't have an account?
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#06b6d4', fontSize: 14, fontWeight: '600' }}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
