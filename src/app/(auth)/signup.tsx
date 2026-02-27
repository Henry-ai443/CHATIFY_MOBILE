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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotifications } from '../../lib/notifications';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SignupScreen(): React.ReactElement {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signup, isSigningUp } = useAuthStore();
  const { showError, showSuccess } = useNotifications();

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      showError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    try {
      await signup({ fullName, email, password });
      showSuccess('Account created successfully!');
      router.replace('/(chat)');
    } catch (error: any) {
      showError(error.message || 'Signup failed');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: '#0f172a' }}
        >
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
              Create Account
            </Text>
            <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 5 }}>
              Sign up to start chatting
            </Text>
          </View>

          {/* Full Name Input */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 8 }}>
              Full Name
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
              <FontAwesome name="user" size={18} color="#64748b" />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  fontSize: 14,
                  color: '#e2e8f0',
                }}
                placeholder="John Doe"
                placeholderTextColor="#64748b"
                value={fullName}
                onChangeText={setFullName}
                editable={!isSigningUp}
              />
            </View>
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
                editable={!isSigningUp}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 15 }}>
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
                placeholder="Minimum 6 characters"
                placeholderTextColor="#64748b"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isSigningUp}
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

          {/* Confirm Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 8 }}>
              Confirm Password
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
                placeholder="Confirm password"
                placeholderTextColor="#64748b"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isSigningUp}
              />
            </View>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#06b6d4',
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16,
            }}
            onPress={handleSignup}
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>
              Already have an account?
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#06b6d4', fontSize: 14, fontWeight: '600' }}>
                  Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}