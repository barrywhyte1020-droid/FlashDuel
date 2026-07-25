import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';
import AppText from './AppText';

// kind: 'primary' | 'secondary' | 'ghost' | 'danger'
export default function Button({ label, onPress, kind = 'primary', loading, disabled, style, icon }) {
  const theme = useTheme();

  const backgrounds = {
    primary: theme.primary,
    secondary: theme.surfaceAlt,
    ghost: 'transparent',
    danger: theme.danger,
  };
  const textColors = {
    primary: theme.primaryText,
    secondary: theme.text,
    ghost: theme.primary,
    danger: '#FFFFFF',
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: backgrounds[kind], opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1 },
        kind === 'ghost' && { borderWidth: 1.5, borderColor: theme.primary },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[kind]} />
      ) : (
        <>
          {icon}
          <AppText variant="bodyStrong" color={textColors[kind]} style={icon ? { marginLeft: spacing.sm } : null}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
});
