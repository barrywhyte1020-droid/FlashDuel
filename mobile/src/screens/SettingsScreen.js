import React from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { Surface } from '../components/Surface';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeContext';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { spacing, radius } from '../theme/tokens';

const OPTIONS = [
  { key: 'light', label: '☀️  Light' },
  { key: 'dark', label: '🌙  Dark' },
  { key: 'system', label: '📱  Match system' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const override = useThemeStore((s) => s.override);
  const setOverride = useThemeStore((s) => s.setOverride);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Screen>
      <AppText variant="h1" style={{ marginBottom: spacing.lg }}>
        Settings
      </AppText>

      <Surface style={{ marginBottom: spacing.lg }}>
        <AppText variant="bodyStrong">{user?.name}</AppText>
        <AppText variant="caption" muted>{user?.email}</AppText>
      </Surface>

      <AppText variant="bodyStrong" style={{ marginBottom: spacing.sm }}>
        Appearance
      </AppText>
      <View style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
        {OPTIONS.map((opt) => {
          const active = override === opt.key;
          return (
            <Surface
              key={opt.key}
              elevated={false}
              style={{ borderColor: active ? theme.primary : theme.border, borderWidth: active ? 2 : 1 }}
            >
              <Button label={opt.label} kind="ghost" onPress={() => setOverride(opt.key)} />
            </Surface>
          );
        })}
      </View>

      <Button label="Log out" kind="danger" onPress={logout} />
    </Screen>
  );
}
