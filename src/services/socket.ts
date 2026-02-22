import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

let socket: Socket | null = null;

/**
 * Initialize Socket.IO connection
 */
export const initSocket = (): Socket => {
  if (socket) {
    console.log('[Socket] Already connected');
    return socket;
  }

  console.log('[Socket] Initializing connection to', SOCKET_URL);

  socket = io(SOCKET_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected');
  });

  socket.on('error', (error) => {
    console.error('[Socket] Error:', error);
  });

  return socket;
};

/**
 * Get current Socket.IO instance
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Disconnect Socket.IO
 */
export const disconnectSocket = (): void => {
  if (socket) {
    console.log('[Socket] Disconnecting');
    socket.disconnect();
    socket = null;
  }
};

/**
 * Emit user online status
 */
export const emitUserOnline = (userId: string): void => {
  const sock = getSocket();
  if (sock) {
    sock.emit('user_online', userId);
    console.log('[Socket] Emitted user_online:', userId);
  }
};

/**
 * Emit typing indicator
 */
export const emitTyping = (receiverId: string, senderId: string): void => {
  const sock = getSocket();
  if (sock) {
    sock.emit('user_typing', { receiverId, senderId });
  }
};

/**
 * Emit stopped typing
 */
export const emitStoppedTyping = (receiverId: string, senderId: string): void => {
  const sock = getSocket();
  if (sock) {
    sock.emit('user_stopped_typing', { receiverId, senderId });
  }
};

/**
 * Emit message sent
 */
export const emitSendMessage = (data: any): void => {
  const sock = getSocket();
  if (sock) {
    sock.emit('send_message', data);
  }
};

/**
 * Listen for user status changes
 */
export const onUserStatusChanged = (callback: (data: { userId: string; status: string }) => void): void => {
  const sock = getSocket();
  if (sock) {
    sock.on('user_status_changed', callback);
  }
};

/**
 * Listen for incoming messages
 */
export const onReceiveMessage = (callback: (data: any) => void): void => {
  const sock = getSocket();
  if (sock) {
    sock.on('receive_message', callback);
  }
};

/**
 * Listen for new messages
 */
export const onNewMessage = (callback: (data: any) => void): void => {
  const sock = getSocket();
  if (sock) {
    sock.on('new_message', callback);
  }
};

/**
 * Listen for typing indicators
 */
export const onUserTyping = (callback: (data: { senderId: string }) => void): void => {
  const sock = getSocket();
  if (sock) {
    sock.on('user_typing', callback);
  }
};

/**
 * Listen for stopped typing
 */
export const onUserStoppedTyping = (callback: (data: { senderId: string }) => void): void => {
  const sock = getSocket();
  if (sock) {
    sock.on('user_stopped_typing', callback);
  }
};

/**
 * Remove all listeners
 */
export const removeAllSocketListeners = (): void => {
  const sock = getSocket();
  if (sock) {
    sock.off('user_status_changed');
    sock.off('receive_message');
    sock.off('new_message');
    sock.off('user_typing');
    sock.off('user_stopped_typing');
  }
};
