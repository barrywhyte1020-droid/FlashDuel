import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppText from './AppText';

// This is FlashDuel's signature visual: two player initials facing off
// across a gold "VS" divider. Used on Duel Setup, Duel Play header, and
// Duel Results so the "duel" framing is felt everywhere, not just named.
export default function VsBadge({ leftName = '?', rightName = '?', leftColor, rightColor }) {
  const theme = useTheme();
  const initials = (name) => (name || '?').trim().charAt(0).toUpperCase();

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: leftColor || theme.primary }]}>
        <AppText variant="h3" color="#FFFFFF">
          {initials(leftName)}
        </AppText>
      </View>

      <View style={styles.vsWrap}>
        <View style={[styles.vsLine, { backgroundColor: theme.border }]} />
        <AppText variant="h3" color={theme.accent} style={styles.vsText}>
          VS
        </AppText>
        <View style={[styles.vsLine, { backgroundColor: theme.border }]} />
      </View>

      <View style={[styles.avatar, { backgroundColor: rightColor || theme.accent }]}>
        <AppText variant="h3" color="#1B1D2E">
          {initials(rightName)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsWrap: { alignItems: 'center', marginHorizontal: 14, width: 56 },
  vsLine: { width: 2, height: 14 },
  vsText: { letterSpacing: 2, marginVertical: 2 },
});
