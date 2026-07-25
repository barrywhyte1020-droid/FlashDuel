import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import FlashCard from '../components/FlashCard';
import Button from '../components/Button';
import TimerRing from '../components/TimerRing';
import VsBadge from '../components/VsBadge';
import { Pill } from '../components/Pill';
import { duelsApi } from '../api/duels';
import { getSocket } from '../api/socket';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius } from '../theme/tokens';

export default function DuelPlayScreen({ route, navigation }) {
  const theme = useTheme();
  const me = useAuthStore((s) => s.user);
  const { duelId } = route.params;
  const [duel, setDuel] = useState(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [opponentProgress, setOpponentProgress] = useState(null); // { cardIndex, runningScore }
  const [opponentJoined, setOpponentJoined] = useState(false);
  const cardStartRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    duelsApi.get(duelId).then((d) => {
      setDuel(d);
      setSecondsLeft(d.secondsPerCard || 15);
      cardStartRef.current = Date.now();
    });
  }, [duelId]);

  // Live layer: joins a socket room keyed by the duel's invite code so both
  // players can see each other's progress as they play. This is additive —
  // async scoring/comparison (via duelsApi.submit) still works with or
  // without a live connection.
  useEffect(() => {
    if (!duel?.code) return;
    const socket = getSocket();
    socket.emit('duel:join-room', { duelCode: duel.code, userId: me?.id, userName: me?.name });

    const onOpponentJoined = () => setOpponentJoined(true);
    const onOpponentProgress = (payload) => setOpponentProgress(payload);
    const onOpponentFinished = (payload) => setOpponentProgress({ cardIndex: Infinity, runningScore: payload.finalScore });

    socket.on('duel:opponent-joined', onOpponentJoined);
    socket.on('duel:opponent-progress', onOpponentProgress);
    socket.on('duel:opponent-finished', onOpponentFinished);

    return () => {
      socket.off('duel:opponent-joined', onOpponentJoined);
      socket.off('duel:opponent-progress', onOpponentProgress);
      socket.off('duel:opponent-finished', onOpponentFinished);
    };
  }, [duel?.code]);

  const deck = duel?.deck;
  const current = deck?.cards?.[index];
  const finished = deck && index >= deck.cards.length;
  const runningScore = answers.filter((a) => a.correct).length * 100;

  useEffect(() => {
    if (!current || finished) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          recordAnswer(false); // ran out of time -> counts as wrong
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [index, current]);

  const recordAnswer = (correct) => {
    clearInterval(timerRef.current);
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
    ).catch(() => {});

    const responseTimeMs = Date.now() - cardStartRef.current;
    const nextAnswers = [...answers, { cardId: current._id, correct, responseTimeMs }];
    setAnswers(nextAnswers);
    setRevealed(false);

    const socket = getSocket();
    const nextScore = nextAnswers.filter((a) => a.correct).length * 100;
    socket.emit('duel:progress', { duelCode: duel.code, userId: me?.id, cardIndex: index + 1, runningScore: nextScore });

    setIndex((i) => i + 1);
    setSecondsLeft(duel.secondsPerCard || 15);
    cardStartRef.current = Date.now();
  };

  useEffect(() => {
    if (finished && duel && !submitting) {
      setSubmitting(true);
      const socket = getSocket();
      socket.emit('duel:finished', { duelCode: duel.code, userId: me?.id, finalScore: runningScore });
      duelsApi.submit(duelId, answers).then((updatedDuel) => {
        navigation.replace('DuelResults', { duelId: updatedDuel._id });
      });
    }
  }, [finished]);

  if (!duel || !deck) {
    return (
      <Screen>
        <AppText>Loading duel…</AppText>
      </Screen>
    );
  }

  if (finished) {
    return (
      <Screen contentStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText variant="h2">Submitting your round…</AppText>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <VsBadge leftName={duel.players?.[0]?.user?.name} rightName={duel.players?.[1]?.user?.name || '?'} />

      {duel.mode === 'live' && (
        <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <Pill
            label={opponentJoined || opponentProgress ? '🟢 Opponent is live' : '⚪ Playing solo round'}
            tone={opponentJoined || opponentProgress ? 'success' : 'default'}
          />
        </View>
      )}

      <View style={{ marginVertical: spacing.lg }}>
        <TimerRing totalSeconds={duel.secondsPerCard || 15} secondsLeft={secondsLeft} />
      </View>

      <AppText variant="caption" muted style={{ textAlign: 'center', marginBottom: spacing.sm }}>
        CARD {index + 1} OF {deck.cards.length}
      </AppText>

      {duel.mode === 'live' && opponentProgress && (
        <View style={{ marginBottom: spacing.md }}>
          <View style={{ height: 4, borderRadius: radius.pill, backgroundColor: theme.surfaceAlt, overflow: 'hidden' }}>
            <View
              style={{
                width: `${Math.min(100, (Math.min(opponentProgress.cardIndex, deck.cards.length) / deck.cards.length) * 100)}%`,
                height: '100%',
                backgroundColor: theme.accent,
              }}
            />
          </View>
          <AppText variant="caption" muted style={{ marginTop: 4, textAlign: 'center' }}>
            Opponent: card {Math.min(opponentProgress.cardIndex, deck.cards.length)}/{deck.cards.length} · {opponentProgress.runningScore} pts
          </AppText>
        </View>
      )}

      <FlashCard question={current.question} answer={current.answer} revealed={revealed} onFlip={setRevealed} />

      {revealed && (
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
          <Button label="✗ Wrong" kind="danger" onPress={() => recordAnswer(false)} style={{ flex: 1 }} />
          <Button label="✓ Right" onPress={() => recordAnswer(true)} style={{ flex: 1, backgroundColor: theme.success }} />
        </View>
      )}
    </Screen>
  );
}
