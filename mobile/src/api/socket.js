import { io } from 'socket.io-client';
import { API_BASE_URL } from './config';

// Socket.io lives at the server root, not under /api.
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

let socket = null;

// Lazily create a single shared socket connection for the app's lifetime.
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
