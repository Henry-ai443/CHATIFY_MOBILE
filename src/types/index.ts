/**
 * User model
 */
export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Message model
 */
export interface Message {
  _id: string;
  senderId: User | string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response types
 */
export interface AuthResponse {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

export interface ContactsResponse {
  filteredUsers: User[];
}

export interface ChatsResponse extends Array<User> {}

export interface MessagesResponse extends Array<Message> {}

export interface SendMessageResponse extends Message {}

/**
 * Error response
 */
export interface ErrorResponse {
  message: string;
}

/**
 * Socket.IO events
 */
export interface TypingEvent {
  senderId: string;
  receiverId: string;
}

export interface UserStatusEvent {
  userId: string;
  status: 'online' | 'offline';
}

export interface NewMessageEvent extends Message {
  receiverId: string;
}
