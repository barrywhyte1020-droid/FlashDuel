import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius } from '../theme/tokens';

export function SkeletonBlock({ width = '100%', height = 16, style }) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius.sm, backgroundColor: theme.surfaceAlt, opacity: pulse },
        style,
      ]}
    />
  );
}

// Prebuilt skeleton matching the DeckTile grid layout.
export function DeckGridSkeleton({ count = 4 }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.tile}>
          <SkeletonBlock height={6} style={{ marginBottom: 12 }} />
          <SkeletonBlock width="60%" height={10} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="90%" height={18} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="40%" height={10} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', padding: 16, marginBottom: 16 },
});
