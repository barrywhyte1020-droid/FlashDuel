import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { Surface, Input } from '../components/Surface';
import Button from '../components/Button';
import VsBadge from '../components/VsBadge';
import { Pill } from '../components/Pill';
import { useDeckStore } from '../store/useDeckStore';
import { useAuthStore } from '../store/useAuthStore';
import { duelsApi } from '../api/duels';
import { apiErrorMessage } from '../api/client';
import { getSocket } from '../api/socket';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/tokens';

const MODES = [
  { key: 'async', label: 'Async', hint: 'Play separately, compare when both finish' },
  { key: 'live', label: 'Live', hint: 'See your opponent play in real time' },
];

export default function DuelSetupScreen({ navigation }) {
  const theme = useTheme();
  const { decks, fetchDecks } = useDeckStore();
  const user = useAuthStore((s) => s.user);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [mode, setMode] = useState('async');
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [hostedDuel, setHostedDuel] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchDecks();
    }, [])
  );

  // While waiting in the invite screen, listen for a friend joining the
  // room so the host sees "opponent joined" live instead of guessing.
  useEffect(() => {
    if (!hostedDuel?.code) return;
    const socket = getSocket();
    socket.emit('duel:join-room', { duelCode: hostedDuel.code, userId: user?.id, userName: user?.name });
    const onJoined = () => setOpponentJoined(true);
    socket.on('duel:opponent-joined', onJoined);
    return () => socket.off('duel:opponent-joined', onJoined);
  }, [hostedDuel?.code]);

  const hostDuel = async () => {
    if (!selectedDeck) return;
    setCreating(true);
    setError(null);
    try {
      const duel = await duelsApi.create({ deckId: selectedDeck._id, mode, secondsPerCard: 15 });
      setHostedDuel(duel);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const startHostedDuel = () => navigation.navigate('DuelPlay', { duelId: hostedDuel._id });

  const joinDuel = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    setError(null);
    try {
      const duel = await duelsApi.join(joinCode.trim().toUpperCase());
      navigation.navigate('DuelPlay', { duelId: duel._id });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setJoining(false);
    }
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <VsBadge leftName={user?.name} rightName="?" />
        <AppText variant="h2" style={{ marginTop: spacing.md }}>
          Start a duel
        </AppText>
      </View>

      {!hostedDuel ? (
        <>
          <AppText variant="bodyStrong" style={{ marginBottom: spacing.sm }}>
            Duel mode
          </AppText>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
            {MODES.map((m) => (
              <Surface
                key={m.key}
                elevated={false}
                style={{ flex: 1, borderColor: mode === m.key ? theme.primary : theme.border, borderWidth: mode === m.key ? 2 : 1 }}
              >
                <Button label={m.label} kind="ghost" onPress={() => setMode(m.key)} />
                <AppText variant="caption" muted style={{ textAlign: 'center', marginTop: -spacing.xs, paddingBottom: spacing.xs }}>
                  {m.hint}
                </AppText>
              </Surface>
            ))}
          </View>

          <AppText variant="bodyStrong" style={{ marginBottom: spacing.sm }}>
            Pick a deck to duel on
          </AppText>
          <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
            {decks.map((deck) => (
              <Surface
                key={deck._id}
                style={{
                  borderColor: selectedDeck?._id === deck._id ? theme.primary : theme.border,
                  borderWidth: selectedDeck?._id === deck._id ? 2 : 1,
                }}
                elevated={false}
              >
                <Button label={`${deck.title} · ${deck.cards?.length ?? deck.cardCount ?? 0} cards`} kind="ghost" onPress={() => setSelectedDeck(deck)} />
              </Surface>
            ))}
          </View>

          <Button label="Create duel invite" onPress={hostDuel} loading={creating} disabled={!selectedDeck} />

          <AppText variant="caption" muted style={{ textAlign: 'center', marginVertical: spacing.lg }}>
            — or join a friend's duel —
          </AppText>
          <Input placeholder="Enter invite code" autoCapitalize="characters" value={joinCode} onChangeText={setJoinCode} />
          <Button label="Join duel" kind="secondary" onPress={joinDuel} loading={joining} disabled={!joinCode} style={{ marginTop: spacing.sm }} />
        </>
      ) : (
        <Surface style={{ alignItems: 'center' }}>
          <AppText variant="caption" muted>SHARE THIS CODE WITH YOUR OPPONENT</AppText>
          <AppText variant="h1" style={{ marginVertical: spacing.sm }}>{hostedDuel.code}</AppText>
          {hostedDuel.mode === 'live' && (
            <Pill label={opponentJoined ? '🟢 Opponent joined' : '⏳ Waiting for opponent…'} tone={opponentJoined ? 'success' : 'default'} />
          )}
          <Button
            label="Copy code"
            kind="ghost"
            onPress={() => Clipboard.setStringAsync(hostedDuel.code)}
            style={{ marginTop: spacing.md, marginBottom: spacing.md }}
          />
          <Button label="Start my round" onPress={startHostedDuel} />
        </Surface>
      )}

      {error ? <AppText color={theme.danger} style={{ marginTop: spacing.md }}>{error}</AppText> : null}
    </Screen>
  );
}
