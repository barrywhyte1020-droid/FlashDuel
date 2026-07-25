import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts as useSpaceGrotesk,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { useThemeStore } from './src/store/useThemeStore';
import { useAuthStore } from './src/store/useAuthStore';
import RootNavigator from './src/navigation/RootNavigator';

function LoadingScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg }}>
      <ActivityIndicator color={theme.primary} size="large" />
    </View>
  );
}

function AppShell() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  const [fontsLoaded1] = useSpaceGrotesk({ SpaceGrotesk_500Medium, SpaceGrotesk_700Bold });
  const [fontsLoaded2] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const [storesHydrated, setStoresHydrated] = useState(false);

  useEffect(() => {
    Promise.all([useThemeStore.getState().hydrate(), useAuthStore.getState().hydrate()]).then(() =>
      setStoresHydrated(true)
    );
  }, []);

  const ready = fontsLoaded1 && fontsLoaded2 && storesHydrated;

  return (
    <ThemeProvider>
      {ready ? <AppShell /> : <LoadingScreen />}
    </ThemeProvider>
  );
}
