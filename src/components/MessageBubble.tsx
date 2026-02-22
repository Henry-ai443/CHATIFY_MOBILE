import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Message, User } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  senderName: string;
  senderAvatar?: string;
}

export default function MessageBubble({
  message,
  isOwnMessage,
  senderName,
  senderAvatar,
}: MessageBubbleProps): React.ReactElement {
  return (
    <View
      style={{
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        marginVertical: 8,
        marginHorizontal: 12,
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {!isOwnMessage && senderAvatar && (
        <Image
          source={{ uri: senderAvatar }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
      )}

      <View
        style={{
          maxWidth: '75%',
          backgroundColor: isOwnMessage ? '#06b6d4' : '#334155',
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
      >
        {message.image && (
          <Image
            source={{ uri: message.image }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 8,
              marginBottom: message.text ? 8 : 0,
            }}
            resizeMode="cover"
          />
        )}

        {message.text && (
          <Text
            style={{
              color: isOwnMessage ? '#000' : '#e2e8f0',
              fontSize: 14,
            }}
          >
            {message.text}
          </Text>
        )}

        <Text
          style={{
            color: isOwnMessage ? 'rgba(0, 0, 0, 0.7)' : '#94a3b8',
            fontSize: 11,
            marginTop: 4,
            textAlign: 'right',
          }}
        >
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
