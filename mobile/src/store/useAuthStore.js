import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const TOKEN_KEY = 'flashduel:token';
const USER_KEY = 'flashduel:user';

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const [token, userRaw] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);
      set({ token, user: userRaw ? JSON.parse(userRaw) : null });
    } finally {
      set({ hydrated: true });
    }
  },

  login: async (email, password) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    set({ token: data.token, user: data.user });
  },

  register: async (name, email, password) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    set({ token: data.token, user: data.user });
  },

  logout: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    set({ token: null, user: null });
  },
}));
