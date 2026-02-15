import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error.message);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { initSocket, getSocket, disconnectSocket };
