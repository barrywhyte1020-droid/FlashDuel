import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

import DeckListScreen from '../screens/DeckListScreen';
import DuelSetupScreen from '../screens/DuelSetupScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const ICONS = { Decks: '🗂️', Duel: '⚔️', Ranks: '🏆', Settings: '⚙️' };

export default function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: { backgroundColor: theme.tabBar, borderTopColor: theme.border },
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11 },
      })}
    >
      <Tab.Screen name="Decks" component={DeckListScreen} />
      <Tab.Screen name="Duel" component={DuelSetupScreen} />
      <Tab.Screen name="Ranks" component={LeaderboardScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
