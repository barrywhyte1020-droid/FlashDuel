import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'flashduel:themeOverride';

export const useThemeStore = create((set) => ({
  // 'system' | 'light' | 'dark'
  override: 'system',
  hydrated: false,

  hydrate: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) set({ override: saved });
    } finally {
      set({ hydrated: true });
    }
  },

  setOverride: async (value) => {
    set({ override: value });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch {
      // non-fatal — theme just won't persist across restarts
    }
  },
}));
