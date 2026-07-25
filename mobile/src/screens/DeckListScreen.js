import React, { useCallback, useEffect } from 'react';
import { View, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import DeckTile from '../components/DeckTile';
import Button from '../components/Button';
import { EmptyState } from '../components/Pill';
import { DeckGridSkeleton } from '../components/Skeleton';
import { useDeckStore } from '../store/useDeckStore';
import { useAuthStore } from '../store/useAuthStore';
import { spacing } from '../theme/tokens';

export default function DeckListScreen({ navigation }) {
  const { decks, loading, fetchDecks } = useDeckStore();
  const user = useAuthStore((s) => s.user);

  useFocusEffect(
    useCallback(() => {
      fetchDecks();
    }, [])
  );

  return (
    <Screen
      contentStyle={{ flexGrow: 1 }}
      // pull-to-refresh needs the underlying ScrollView props; Screen forwards style/contentStyle only,
      // so we keep the list simple and re-fetch on focus + a manual refresh button instead.
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <AppText variant="caption" muted>
            WELCOME BACK
          </AppText>
          <AppText variant="h1">{user?.name?.split(' ')[0] || 'Duelist'}</AppText>
        </View>
      </View>

      <View style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
        <Button label="+ New Deck" onPress={() => navigation.navigate('DeckEditor', {})} />
      </View>

      {loading && decks.length === 0 ? (
        <DeckGridSkeleton />
      ) : !loading && decks.length === 0 ? (
        <EmptyState
          title="No decks yet"
          subtitle="Create your first deck to start studying — or challenge a friend."
        />
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {decks.map((deck) => (
            <DeckTile key={deck._id} deck={deck} onPress={() => navigation.navigate('DeckEditor', { deckId: deck._id })} />
          ))}
        </View>
      )}
    </Screen>
  );
}
