import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';
import AppText from './AppText';

export function Pill({ label, tone = 'default' }) {
  const theme = useTheme();
  const tones = {
    default: { bg: theme.surfaceAlt, text: theme.text },
    success: { bg: 'rgba(46, 204, 113, 0.16)', text: theme.success },
    accent: { bg: 'rgba(255, 184, 0, 0.18)', text: '#B8860B' },
    danger: { bg: 'rgba(255, 82, 82, 0.14)', text: theme.danger },
  };
  const t = tones[tone] || tones.default;
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <AppText variant="caption" color={t.text}>
        {label}
      </AppText>
    </View>
  );
}

export function EmptyState({ title, subtitle, action }) {
  const theme = useTheme();
  return (
    <View style={[styles.empty, { borderColor: theme.border }]}>
      <AppText variant="h3" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" muted style={{ textAlign: 'center', marginTop: spacing.xs }}>
          {subtitle}
        </AppText>
      ) : null}
      {action ? <View style={{ marginTop: spacing.md }}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  empty: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
