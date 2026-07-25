import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { Surface } from '../components/Surface';
import Button from '../components/Button';
import { Pill } from '../components/Pill';
import { useAuthStore } from '../store/useAuthStore';
import { duelsApi } from '../api/duels';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius } from '../theme/tokens';

function StatRow({ label, mine, theirs }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs }}>
      <AppText variant="bodyStrong" style={{ width: 70, textAlign: 'left' }}>{mine}</AppText>
      <AppText variant="caption" muted>{label}</AppText>
      <AppText variant="bodyStrong" style={{ width: 70, textAlign: 'right' }}>{theirs}</AppText>
    </View>
  );
}

export default function DuelResultsScreen({ route, navigation }) {
  const theme = useTheme();
  const { duelId } = route.params;
  const me = useAuthStore((s) => s.user);
  const [duel, setDuel] = useState(null);

  useEffect(() => {
    duelsApi.get(duelId).then(setDuel);
  }, [duelId]);

  if (!duel) {
    return (
      <Screen>
        <AppText>Loading results…</AppText>
      </Screen>
    );
  }

  const mine = duel.players.find((p) => (p.user?._id || p.user) === me?.id);
  const theirs = duel.players.find((p) => (p.user?._id || p.user) !== me?.id);
  const waitingOnOpponent = duel.status !== 'completed';
  const iWon = duel.winner && (duel.winner === me?.id || duel.winner?._id === me?.id);

  return (
    <Screen contentStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      {waitingOnOpponent ? (
        <View style={{ alignItems: 'center' }}>
          <AppText variant="h1">⏳</AppText>
          <AppText variant="h2" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
            Waiting on your opponent
          </AppText>
          <AppText variant="body" muted style={{ textAlign: 'center', marginTop: spacing.xs }}>
            Your score is locked in. We'll compare as soon as they finish their round.
          </AppText>
        </View>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <AppText variant="h1">{iWon ? '🏆' : duel.winner ? '💪' : '🤝'}</AppText>
          <AppText variant="h2" style={{ marginTop: spacing.sm }}>
            {iWon ? 'You won!' : duel.winner ? 'So close!' : "It's a tie!"}
          </AppText>
        </View>
      )}

      <Surface style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <Pill label="YOU" tone={iWon ? 'success' : 'default'} />
          <Pill label={theirs?.user?.name || 'OPPONENT'} tone={!iWon && duel.winner ? 'success' : 'default'} />
        </View>
        <View style={{ height: 1, backgroundColor: theme.border, marginBottom: spacing.sm }} />
        <StatRow label="Score" mine={mine?.score ?? '—'} theirs={theirs?.score ?? '—'} />
        <StatRow label="Accuracy" mine={mine ? `${Math.round(mine.accuracy * 100)}%` : '—'} theirs={theirs ? `${Math.round(theirs.accuracy * 100)}%` : '—'} />
        <StatRow
          label="Avg speed"
          mine={mine ? `${(mine.avgResponseTimeMs / 1000).toFixed(1)}s` : '—'}
          theirs={theirs ? `${(theirs.avgResponseTimeMs / 1000).toFixed(1)}s` : '—'}
        />
      </Surface>

      <Button label="Back to duels" onPress={() => navigation.popToTop()} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
}
