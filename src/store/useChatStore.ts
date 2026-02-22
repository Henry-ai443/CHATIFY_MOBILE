import { create } from 'zustand';
import { axiosInstance } from '../services/api';
import {
  User,
  Message,
  ContactsResponse,
  ChatsResponse,
  MessagesResponse,
  SendMessageResponse,
} from '../types';
import {
  onUserStatusChanged,
  onReceiveMessage,
  onNewMessage,
  onUserTyping,
  onUserStoppedTyping,
  removeAllSocketListeners,
  emitTyping,
  emitStoppedTyping,
  emitSendMessage,
} from '../services/socket';

interface ChatStore {
  // State
  allContacts: User[];
  chats: User[];
  messages: Message[];
  selectedUser: User | null;
  onlineUsers: Set<string>;
  typingUsers: Set<string>;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;

  // Actions
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (receiverId: string, text: string, image?: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  initializeSocket: (userId: string) => void;
  cleanupSocket: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  selectedUser: null,
  onlineUsers: new Set(),
  typingUsers: new Set(),
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  getAllContacts: async () => {
    try {
      set({ isUsersLoading: true });
      console.log('[Chat] Fetching all contacts...');
      const res = await axiosInstance.get<ContactsResponse>('/messages/contacts/');
      set({ allContacts: res.data.filteredUsers });
      console.log('[Chat] Loaded', res.data.filteredUsers.length, 'contacts');
    } catch (error) {
      console.error('[Chat] Error loading contacts:', error);
      throw error;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      console.log('[Chat] Fetching chat partners...');
      const res = await axiosInstance.get<ChatsResponse>('/messages/chats');
      set({ chats: res.data });
      console.log('[Chat] Loaded', res.data.length, 'chat partners');
    } catch (error) {
      console.error('[Chat] Error loading chat partners:', error);
      throw error;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    try {
      set({ isMessagesLoading: true });
      console.log('[Chat] Fetching messages for user:', userId);
      const res = await axiosInstance.get<MessagesResponse>(`/messages/${userId}`);
      set({ messages: res.data });
      console.log('[Chat] Loaded', res.data.length, 'messages');
    } catch (error) {
      console.error('[Chat] Error loading messages:', error);
      throw error;
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (receiverId: string, text: string, image?: string) => {
    try {
      set({ isSendingMessage: true });
      console.log('[Chat] Sending message to:', receiverId);

      const formData = { text };
      if (image) {
        formData.image = image;
      }

      const res = await axiosInstance.post<SendMessageResponse>(
        `/messages/send/${receiverId}`,
        formData
      );

      // Add message to local state
      set({ messages: [...get().messages, res.data] });

      // Emit via socket
      emitSendMessage({
        ...res.data,
        receiverId,
      });

      console.log('[Chat] Message sent successfully');
    } catch (error) {
      console.error('[Chat] Error sending message:', error);
      throw error;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  initializeSocket: (userId: string) => {
    console.log('[Chat] Initializing socket listeners...');

    // Listen for user status changes
    onUserStatusChanged((data) => {
      console.log('[Socket] User status changed:', data.userId, data.status);
      set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        if (data.status === 'online') {
          newOnlineUsers.add(data.userId);
        } else {
          newOnlineUsers.delete(data.userId);
        }
        return { onlineUsers: newOnlineUsers };
      });
    });

    // Listen for incoming messages
    onReceiveMessage((message: Message) => {
      const { selectedUser, isSendingMessage } = get();
      console.log('[Socket] Received message from:', message.senderId);

      if (
        selectedUser &&
        (message.senderId === selectedUser._id ||
          (typeof message.senderId === 'object' && message.senderId._id === selectedUser._id))
      ) {
        set({ messages: [...get().messages, message] });
      }
    });

    // Listen for new messages
    onNewMessage((message: Message) => {
      const { selectedUser, messages } = get();

      if (
        selectedUser &&
        (message.senderId === selectedUser._id ||
          (typeof message.senderId === 'object' && message.senderId._id === selectedUser._id)) &&
        !messages.some((m) => m._id === message._id)
      ) {
        set({ messages: [...messages, message] });
      }
    });

    // Listen for typing indicators
    onUserTyping((data) => {
      console.log('[Socket] User typing:', data.senderId);
      set((state) => {
        const newTypingUsers = new Set(state.typingUsers);
        newTypingUsers.add(data.senderId);
        return { typingUsers: newTypingUsers };
      });
    });

    // Listen for stopped typing
    onUserStoppedTyping((data) => {
      console.log('[Socket] User stopped typing:', data.senderId);
      set((state) => {
        const newTypingUsers = new Set(state.typingUsers);
        newTypingUsers.delete(data.senderId);
        return { typingUsers: newTypingUsers };
      });
    });
  },

  cleanupSocket: () => {
    console.log('[Chat] Cleaning up socket listeners...');
    removeAllSocketListeners();
  },
}));
