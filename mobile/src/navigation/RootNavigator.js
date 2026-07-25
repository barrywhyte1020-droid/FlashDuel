import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../store/useAuthStore';

import MainTabs from './MainTabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DeckEditorScreen from '../screens/DeckEditorScreen';
import CardEditorScreen from '../screens/CardEditorScreen';
import StudyModeScreen from '../screens/StudyModeScreen';
import DuelPlayScreen from '../screens/DuelPlayScreen';
import DuelResultsScreen from '../screens/DuelResultsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const theme = useTheme();
  const token = useAuthStore((s) => s.token);

  const navTheme = {
    ...(theme.mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.bg,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      primary: theme.primary,
    },
  };

  const screenOptions = {
    headerStyle: { backgroundColor: theme.surface },
    headerTintColor: theme.text,
    headerTitleStyle: { fontFamily: 'SpaceGrotesk_500Medium' },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: theme.bg },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={screenOptions}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create account' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="DeckEditor" component={DeckEditorScreen} options={{ title: 'Deck' }} />
            <Stack.Screen name="CardEditor" component={CardEditorScreen} options={{ title: 'Card' }} />
            <Stack.Screen name="StudyMode" component={StudyModeScreen} options={{ title: 'Study Mode' }} />
            <Stack.Screen name="DuelPlay" component={DuelPlayScreen} options={{ title: 'Duel', headerBackVisible: false }} />
            <Stack.Screen name="DuelResults" component={DuelResultsScreen} options={{ title: 'Results', headerBackVisible: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
