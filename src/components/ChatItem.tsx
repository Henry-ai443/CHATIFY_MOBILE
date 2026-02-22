import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '../../types';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ChatItemProps {
  user: User;
  isOnline: boolean;
  isSelected: boolean;
  onPress: (user: User) => void;
}

export default function ChatItem({
  user,
  isOnline,
  isSelected,
  onPress,
}: ChatItemProps): React.ReactElement {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginHorizontal: 8,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: isSelected ? '#1e293b' : 'transparent',
      }}
      onPress={() => onPress(user)}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: user.profilePic || 'https://via.placeholder.com/48' }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
          }}
        />
        {isOnline && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: '#10b981',
              borderWidth: 2,
              borderColor: '#0f172a',
            }}
          />
        )}
      </View>

      <View
        style={{
          flex: 1,
          marginLeft: 12,
        }}
      >
        <Text
          style={{
            color: '#e2e8f0',
            fontSize: 15,
            fontWeight: '500',
          }}
          numberOfLines={1}
        >
          {user.fullName}
        </Text>
        <Text
          style={{
            color: isOnline ? '#10b981' : '#94a3b8',
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>

      {isSelected && (
        <FontAwesome name="chevron-right" size={16} color="#06b6d4" />
      )}
    </TouchableOpacity>
  );
}
