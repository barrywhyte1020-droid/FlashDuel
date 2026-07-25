import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { Input, Surface } from '../components/Surface';
import Button from '../components/Button';
import { Pill, EmptyState } from '../components/Pill';
import { useTheme } from '../theme/ThemeContext';
import { decksApi } from '../api/decks';
import { useDeckStore } from '../store/useDeckStore';
import { spacing } from '../theme/tokens';

const ACCENT_CHOICES = ['#5B4FE9', '#FFB800', '#2ECC71', '#FF5252', '#00B8D9', '#E84393'];

export default function DeckEditorScreen({ route, navigation }) {
  const theme = useTheme();
  const deckId = route.params?.deckId;
  const { createDeck, updateDeck, removeDeck } = useDeckStore();

  const [deck, setDeck] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(ACCENT_CHOICES[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (deckId) {
      decksApi.get(deckId).then((d) => {
        setDeck(d);
        setTitle(d.title);
        setSubject(d.subject);
        setDescription(d.description || '');
        setColor(d.color || ACCENT_CHOICES[0]);
      });
    }
  }, [deckId]);

  const save = async () => {
    setSaving(true);
    try {
      if (deckId) {
        const updated = await updateDeck(deckId, { title, subject, description, color });
        setDeck(updated);
      } else {
        const created = await createDeck({ title, subject, description, color });
        navigation.replace('DeckEditor', { deckId: created._id });
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleShare = async () => {
    const updated = await updateDeck(deckId, { isPublic: !deck.isPublic });
    setDeck(updated);
  };

  const onDelete = async () => {
    await removeDeck(deckId);
    navigation.goBack();
  };

  return (
    <Screen>
      <View style={{ gap: spacing.md }}>
        <Input placeholder="Deck title (e.g. Cell Biology)" value={title} onChangeText={setTitle} />
        <Input placeholder="Subject (e.g. Biology)" value={subject} onChangeText={setSubject} />
        <Input placeholder="Description (optional)" value={description} onChangeText={setDescription} multiline />

        <AppText variant="caption" muted>
          ACCENT COLOR
        </AppText>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {ACCENT_CHOICES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: c,
                borderWidth: color === c ? 3 : 0,
                borderColor: theme.text,
              }}
            />
          ))}
        </View>

        <Button label={deckId ? 'Save changes' : 'Create deck'} onPress={save} loading={saving} disabled={!title || !subject} />
      </View>

      {deckId && deck && (
        <>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
            <Button label="Study solo" kind="secondary" onPress={() => navigation.navigate('StudyMode', { deckId })} style={{ flex: 1 }} />
            <Button
              label={deck.isPublic ? 'Sharing: ON' : 'Sharing: OFF'}
              kind={deck.isPublic ? 'primary' : 'secondary'}
              onPress={toggleShare}
              style={{ flex: 1 }}
            />
          </View>
          {deck.isPublic && deck.shareCode && (
            <Surface style={{ marginTop: spacing.md, alignItems: 'center' }}>
              <AppText variant="caption" muted>SHARE CODE</AppText>
              <AppText variant="h2">{deck.shareCode}</AppText>
            </Surface>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl }}>
            <AppText variant="h3">Cards ({deck.cards.length})</AppText>
            <Button label="+ Add card" kind="ghost" onPress={() => navigation.navigate('CardEditor', { deckId })} />
          </View>

          {deck.cards.length === 0 ? (
            <EmptyState title="No cards yet" subtitle="Add your first question/answer pair." />
          ) : (
            <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
              {deck.cards.map((card) => (
                <Pressable key={card._id} onPress={() => navigation.navigate('CardEditor', { deckId, cardId: card._id })}>
                  <Surface style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginRight: spacing.sm }}>
                      <AppText variant="bodyStrong" numberOfLines={1}>{card.question}</AppText>
                      <AppText variant="caption" muted numberOfLines={1}>{card.answer}</AppText>
                    </View>
                    <Pill label={`Box ${card.box}`} tone={card.box >= 4 ? 'success' : 'default'} />
                  </Surface>
                </Pressable>
              ))}
            </View>
          )}

          <Button label="Delete deck" kind="danger" onPress={onDelete} style={{ marginTop: spacing.xl }} />
        </>
      )}
    </Screen>
  );
}
