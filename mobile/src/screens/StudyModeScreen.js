import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import FlashCard from '../components/FlashCard';
import Button from '../components/Button';
import { EmptyState } from '../components/Pill';
import { decksApi } from '../api/decks';
import { spacing, radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeContext';

export default function StudyModeScreen({ route, navigation }) {
  const theme = useTheme();
  const { deckId } = route.params;
  const [deck, setDeck] = useState(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    decksApi.get(deckId).then((d) => {
      setDeck(d);
      // Lower Leitner box = higher priority (needs more practice); cards due
      // soonest come first. Shuffle within the same box for variety.
      const sorted = [...d.cards].sort((a, b) => a.box - b.box || Math.random() - 0.5);
      setQueue(sorted);
    });
  }, [deckId]);

  const current = queue[index];
  const progress = queue.length ? index / queue.length : 0;

  const mark = async (correct) => {
    await decksApi.reviewCard(deckId, current._id, correct);
    setSessionStats((s) => ({ ...s, [correct ? 'correct' : 'wrong']: s[correct ? 'correct' : 'wrong'] + 1 }));
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  if (!deck) return <Screen><AppText>Loading…</AppText></Screen>;

  if (!queue.length) {
    return (
      <Screen>
        <EmptyState title="Nothing to study yet" subtitle="Add some cards to this deck first." />
      </Screen>
    );
  }

  if (index >= queue.length) {
    return (
      <Screen contentStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText variant="h1">🎉</AppText>
        <AppText variant="h2" style={{ marginTop: spacing.sm }}>
          Session complete!
        </AppText>
        <AppText variant="body" muted style={{ marginTop: spacing.xs }}>
          {sessionStats.correct} correct · {sessionStats.wrong} to review again
        </AppText>
        <Button label="Back to deck" onPress={() => navigation.goBack()} style={{ marginTop: spacing.xl }} />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: theme.surfaceAlt, marginBottom: spacing.lg, overflow: 'hidden' }}>
        <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: theme.primary }} />
      </View>
      <AppText variant="caption" muted style={{ textAlign: 'center', marginBottom: spacing.md }}>
        CARD {index + 1} OF {queue.length}
      </AppText>

      <FlashCard question={current.question} answer={current.answer} hint={current.hint} revealed={revealed} onFlip={setRevealed} />

      {revealed && (
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
          <Button label="✗ Got it wrong" kind="danger" onPress={() => mark(false)} style={{ flex: 1 }} />
          <Button label="✓ Got it right" onPress={() => mark(true)} style={{ flex: 1, backgroundColor: theme.success }} />
        </View>
      )}
    </Screen>
  );
}
