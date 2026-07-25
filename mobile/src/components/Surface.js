import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, type } from '../theme/tokens';

export function Surface({ children, style, elevated = true }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Input({ style, ...rest }) {
  const theme = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.textMuted}
      style={[
        styles.input,
        { color: theme.text, backgroundColor: theme.surfaceAlt, borderColor: theme.border },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  elevated: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontFamily: type.body,
    fontSize: type.scale.body,
  },
});
