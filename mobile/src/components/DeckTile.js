import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';
import AppText from './AppText';

export default function DeckTile({ deck, onPress }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[styles.stripe, { backgroundColor: deck.color || theme.primary }]} />
      <View style={styles.body}>
        <AppText variant="caption" muted style={styles.subject}>
          {deck.subject?.toUpperCase()}
        </AppText>
        <AppText variant="h3" numberOfLines={2} style={{ marginTop: 4 }}>
          {deck.title}
        </AppText>
        <AppText variant="caption" muted style={{ marginTop: spacing.sm }}>
          {deck.cardCount ?? deck.cards?.length ?? 0} cards
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  stripe: { height: 6, width: '100%' },
  body: { padding: spacing.md, minHeight: 108 },
  subject: { letterSpacing: 1 },
});
