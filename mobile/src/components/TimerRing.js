import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppText from './AppText';

// Simple countdown indicator: an animated bar draining left-to-right inside
// a pill, with the seconds-remaining number. (A true SVG ring is possible
// but adds a native-svg dependency; this keeps the starter project
// dependency-light while still reading clearly as "time draining".)
export default function TimerRing({ totalSeconds, secondsLeft }) {
  const theme = useTheme();
  const widthAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: Math.max(0, secondsLeft / totalSeconds),
      duration: 280,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [secondsLeft]);

  const isUrgent = secondsLeft <= 3;
  const barColor = isUrgent ? theme.danger : theme.primary;

  return (
    <View style={styles.wrap}>
      <View style={[styles.track, { backgroundColor: theme.surfaceAlt }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: barColor,
              width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
      <AppText variant="bodyStrong" color={barColor} style={styles.label}>
        {secondsLeft}s
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  track: { width: '100%', height: 8, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  label: { marginTop: 6 },
});
