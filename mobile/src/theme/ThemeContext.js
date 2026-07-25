import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './tokens';
import { useThemeStore } from '../store/useThemeStore';

const ThemeContext = createContext(lightTheme);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const override = useThemeStore((s) => s.override); // 'light' | 'dark' | 'system'

  const resolvedMode = override === 'system' || !override ? systemScheme || 'light' : override;
  const theme = useMemo(() => (resolvedMode === 'dark' ? darkTheme : lightTheme), [resolvedMode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
