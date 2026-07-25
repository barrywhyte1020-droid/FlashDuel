import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/tokens';
import DuelBackground from './DuelBackground';

// Every screen should render through <Screen> instead of a raw View, so
// theme + safe-area handling stays in exactly one place.
export default function Screen({ children, scroll = true, style, contentStyle }) {
  const theme = useTheme();

  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? { contentContainerStyle: [styles.scrollContent, contentStyle], showsVerticalScrollIndicator: false }
    : { style: [styles.flexContent, contentStyle] };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }, style]} edges={['top', 'left', 'right']}>
      <DuelBackground />
      <Container {...containerProps}>{children}</Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  flexContent: { flex: 1, padding: spacing.lg },
});
