import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';
import AppText from './AppText';

// A 3D-style flip card: front shows the question, back shows the answer.
// Tap anywhere on the card to flip.
export default function FlashCard({ question, answer, hint, revealed, onFlip }) {
  const theme = useTheme();
  const spin = useRef(new Animated.Value(0)).current;
  const [showBack, setShowBack] = useState(false);

  const flip = () => {
    const toValue = showBack ? 0 : 1;
    Animated.spring(spin, { toValue, useNativeDriver: true, friction: 8, tension: 10 }).start();
    setShowBack(!showBack);
    onFlip?.(!showBack);
  };

  const isRevealed = revealed !== undefined ? revealed : showBack;

  const frontInterpolate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = spin.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <Pressable onPress={flip} style={styles.wrap}>
      <Animated.View
        style={[
          styles.face,
          { backgroundColor: theme.surface, borderColor: theme.border, transform: [{ rotateY: frontInterpolate }] },
          isRevealed && styles.hidden,
        ]}
      >
        {hint ? (
          <AppText variant="caption" muted style={styles.hint}>
            HINT · {hint}
          </AppText>
        ) : null}
        <AppText variant="h2" style={{ textAlign: 'center' }}>
          {question}
        </AppText>
        <AppText variant="caption" muted style={styles.tapHint}>
          Tap to reveal
        </AppText>
      </Animated.View>

      <Animated.View
        style={[
          styles.face,
          styles.back,
          { backgroundColor: theme.primary, transform: [{ rotateY: backInterpolate }] },
          !isRevealed && styles.hidden,
        ]}
      >
        <AppText variant="caption" color="rgba(255,255,255,0.75)" style={styles.hint}>
          ANSWER
        </AppText>
        <AppText variant="h2" color="#FFFFFF" style={{ textAlign: 'center' }}>
          {answer}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { minHeight: 220 },
  face: {
    position: 'absolute',
    width: '100%',
    minHeight: 220,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  back: { borderWidth: 0 },
  hidden: { opacity: 0.001 },
  hint: { position: 'absolute', top: spacing.md, alignSelf: 'center', letterSpacing: 1 },
  tapHint: { position: 'absolute', bottom: spacing.md },
});
