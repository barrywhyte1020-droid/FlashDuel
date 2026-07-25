import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { Surface } from '../components/Surface';
import { Pill, EmptyState } from '../components/Pill';
import { useAuthStore } from '../store/useAuthStore';
import { duelsApi } from '../api/duels';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius } from '../theme/tokens';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  const theme = useTheme();
  const me = useAuthStore((s) => s.user);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      duelsApi
        .globalLeaderboard()
        .then(setRankings)
        .finally(() => setLoading(false));
    }, [])
  );

  return (
    <Screen>
      <AppText variant="h1" style={{ marginBottom: spacing.lg }}>
        🏆 Leaderboard
      </AppText>

      {!loading && rankings.length === 0 && (
        <EmptyState title="No duels yet" subtitle="Be the first to climb the ranks." />
      )}

      <View style={{ gap: spacing.sm }}>
        {rankings.map((r, i) => {
          const isMe = r._id === me?.id;
          return (
            <Surface
              key={r._id}
              elevated={false}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: isMe ? theme.primary : theme.border,
                borderWidth: isMe ? 2 : 1,
              }}
            >
              <AppText variant="h3" style={{ width: 36 }}>
                {MEDALS[i] || `#${i + 1}`}
              </AppText>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.pill,
                  backgroundColor: r.avatarColor || theme.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.sm,
                }}
              >
                <AppText variant="bodyStrong" color="#FFFFFF">
                  {r.name?.charAt(0).toUpperCase()}
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{r.name}{isMe ? ' (you)' : ''}</AppText>
                <AppText variant="caption" muted>{r.stats.wins}W - {r.stats.losses}L</AppText>
              </View>
              {r.stats.currentStreak > 0 && <Pill label={`🔥 ${r.stats.currentStreak}`} tone="accent" />}
            </Surface>
          );
        })}
      </View>
    </Screen>
  );
}
