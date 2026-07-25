import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

export default function DuelBackground() {
  const theme = useTheme();

  return (
    <>
      <LinearGradient
        colors={theme.mode === 'dark' ? ['#090b1f', '#14162b'] : ['#f7f3ed', '#e9e2d6']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.topGlow, theme.mode === 'dark' ? styles.topGlowDark : styles.topGlowLight]} />
      <View style={[styles.bottomGlow, theme.mode === 'dark' ? styles.bottomGlowDark : styles.bottomGlowLight]} />
      <View style={[styles.arena, theme.mode === 'dark' ? styles.arenaDark : styles.arenaLight]} />
      <View style={[styles.arenaEdge, theme.mode === 'dark' ? styles.edgeDark : styles.edgeLight]} />
      <Text style={[styles.watermark, theme.mode === 'dark' ? styles.watermarkDark : styles.watermarkLight]}>VS</Text>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    right: -90,
    top: -70,
    opacity: 0.35,
  },
  bottomGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    left: -120,
    bottom: -160,
    opacity: 0.22,
  },
  topGlowDark: {
    backgroundColor: 'rgba(124,114,242,0.24)',
  },
  topGlowLight: {
    backgroundColor: 'rgba(90,79,233,0.16)',
  },
  bottomGlowDark: {
    backgroundColor: 'rgba(255,184,0,0.16)',
  },
  bottomGlowLight: {
    backgroundColor: 'rgba(91,79,233,0.08)',
  },
  arena: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -18,
    height: 180,
    transform: [{ scaleX: 1.2 }, { translateY: 10 }],
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
  },
  arenaDark: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  arenaLight: {
    backgroundColor: 'rgba(20, 25, 50, 0.04)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(20, 25, 50, 0.08)',
  },
  arenaEdge: {
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 26,
    height: 88,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderWidth: 1.2,
  },
  edgeDark: {
    borderColor: 'rgba(255,255,255,0.08)',
  },
  edgeLight: {
    borderColor: 'rgba(20,25,50,0.14)',
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    fontSize: 120,
    fontWeight: '900',
    letterSpacing: 16,
    opacity: 0.05,
    transform: [{ rotate: '-10deg' }],
  },
  watermarkDark: {
    color: '#FFFFFF',
  },
  watermarkLight: {
    color: '#111827',
  },
});
