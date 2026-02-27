import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '../../store/useChatStore';
import { useNavigation } from '@react-navigation/native';
import ChatItem from '../../components/ChatItem';
import { useNotifications } from '../../lib/notifications';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ChatHomeScreen(): React.ReactElement {
  const navigation = useNavigation<any>();
  const {
    chats,
    allContacts,
    getMyChatPartners,
    getAllContacts,
    setSelectedUser,
    onlineUsers,
    isUsersLoading,
  } = useChatStore();
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
  const { showError } = useNotifications();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'chats') {
        await getMyChatPartners();
      } else {
        await getAllContacts();
      }
    } catch (error: any) {
      showError(error.message || 'Failed to load data');
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    navigation.navigate('chatDetail');
  };

  const data = activeTab === 'chats' ? chats : allContacts;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#1e293b',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#e2e8f0' }}>
          {activeTab === 'chats' ? 'Chats' : 'Contacts'}
        </Text>
      </View>

      {/* Tab Switcher */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#1e293b',
        }}
      >
        {['chats', 'contacts'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 6,
              backgroundColor: activeTab === tab ? '#06b6d4' : 'transparent',
              borderWidth: activeTab === tab ? 0 : 1,
              borderColor: '#334155',
              alignItems: 'center',
            }}
            onPress={() => setActiveTab(tab as 'chats' | 'contacts')}
          >
            <Text
              style={{
                color: activeTab === tab ? '#000' : '#e2e8f0',
                fontWeight: '600',
                fontSize: 13,
              }}
            >
              {tab === 'chats' ? 'My Chats' : 'Contacts'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chat List */}
      {isUsersLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#06b6d4" />
        </View>
      ) : data.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <FontAwesome name="inbox" size={48} color="#64748b" />
          <Text
            style={{
              color: '#94a3b8',
              fontSize: 16,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {activeTab === 'chats' ? 'No chats yet' : 'No contacts available'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ChatItem
              user={item}
              isOnline={onlineUsers.has(item._id)}
              isSelected={false}
              onPress={handleSelectUser}
            />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </SafeAreaView>
  );
}