import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { router } from 'expo-router';
import { useNotifications } from '../../lib/notifications';
import MessageBubble from '../../components/MessageBubble';
import TypingIndicator from '../../components/TypingIndicator';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ChatDetailScreen(): React.ReactElement {
  const { selectedUser, messages, getMessages, sendMessage, isMessagesLoading, isSendingMessage, typingUsers, onlineUsers } =
    useChatStore();
  const { authUser } = useAuthStore();
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!selectedUser) {
      router.back();
      return;
    }

    loadMessages();
  }, [selectedUser]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      if (selectedUser) {
        await getMessages(selectedUser._id);
      }
    } catch (error: any) {
      showError(error.message || 'Failed to load messages');
    }
  };

  const handleMessageChange = (text: string) => {
    setMessageText(text);

    if (text.length > 0 && !isTyping && selectedUser && authUser) {
      setIsTyping(true);
      // Emit typing event would go here via Socket.IO
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        // Emit stopped typing event would go here via Socket.IO
      }
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedImage) {
      showError('Message cannot be empty');
      return;
    }

    if (!selectedUser || !authUser) {
      showError('Unable to send message');
      return;
    }

    try {
      await sendMessage(selectedUser._id, messageText, selectedImage || undefined);
      setMessageText('');
      setSelectedImage(null);
      showSuccess('Message sent');
    } catch (error: any) {
      showError(error.message || 'Failed to send message');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      showError('Failed to pick image');
    }
  };

  if (!selectedUser || !authUser) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#94a3b8' }}>No conversation selected</Text>
      </SafeAreaView>
    );
  }

  const isUserOnline = onlineUsers.has(selectedUser._id);
  const isUserTyping = typingUsers.has(selectedUser._id);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#1e293b',
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <FontAwesome name="chevron-left" size={20} color="#06b6d4" />
          </TouchableOpacity>

          <Image
            source={{ uri: selectedUser.profilePic || 'https://via.placeholder.com/40' }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: '600' }}>
              {selectedUser.fullName}
            </Text>
            <Text style={{ color: isUserOnline ? '#10b981' : '#94a3b8', fontSize: 12, marginTop: 2 }}>
              {isUserOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Messages */}
        {isMessagesLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#06b6d4" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const isOwnMessage =
                item.senderId === authUser._id || 
                (typeof item.senderId === 'object' && item.senderId._id === authUser._id);
              return (
                <MessageBubble
                  message={item}
                  isOwnMessage={isOwnMessage}
                  senderName={typeof item.senderId === 'object' ? item.senderId.fullName : 'Unknown'}
                  senderAvatar={
                    typeof item.senderId === 'object' ? item.senderId.profilePic : undefined
                  }
                />
              );
            }}
            scrollEnabled={true}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            }
          />
        )}

        {/* Typing Indicator */}
        {isUserTyping && <TypingIndicator userName={selectedUser.fullName} />}

        {/* Image Preview */}
        {selectedImage && (
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={{
                padding: 8,
                backgroundColor: '#dc2626',
                borderRadius: 4,
              }}
            >
              <FontAwesome name="trash" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 12,
            paddingVertical: 12,
            gap: 8,
            borderTopWidth: 1,
            borderTopColor: '#1e293b',
          }}
        >
          <TouchableOpacity
            onPress={handlePickImage}
            style={{
              padding: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesome name="image" size={20} color="#06b6d4" />
          </TouchableOpacity>

          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 14,
              borderWidth: 1,
              borderColor: '#334155',
            }}
            placeholder="Type a message..."
            placeholderTextColor="#64748b"
            value={messageText}
            onChangeText={handleMessageChange}
            multiline
            maxHeight={100}
            editable={!isSendingMessage}
          />

          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={isSendingMessage || (!messageText.trim() && !selectedImage)}
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isSendingMessage || (!messageText.trim() && !selectedImage) ? 0.5 : 1,
            }}
          >
            {isSendingMessage ? (
              <ActivityIndicator size="small" color="#06b6d4" />
            ) : (
              <FontAwesome name="send" size={18} color="#06b6d4" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
