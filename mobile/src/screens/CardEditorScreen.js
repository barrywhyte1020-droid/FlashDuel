import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import { Input } from '../components/Surface';
import Button from '../components/Button';
import AppText from '../components/AppText';
import { decksApi } from '../api/decks';
import { spacing } from '../theme/tokens';

export default function CardEditorScreen({ route, navigation }) {
  const { deckId, cardId } = route.params;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (cardId) {
      decksApi.get(deckId).then((deck) => {
        const card = deck.cards.find((c) => c._id === cardId);
        if (card) {
          setQuestion(card.question);
          setAnswer(card.answer);
          setHint(card.hint || '');
        }
      });
    }
  }, [deckId, cardId]);

  const save = async () => {
    setSaving(true);
    try {
      if (cardId) {
        await decksApi.updateCard(deckId, cardId, { question, answer, hint });
      } else {
        await decksApi.addCard(deckId, { question, answer, hint });
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    await decksApi.removeCard(deckId, cardId);
    navigation.goBack();
  };

  return (
    <Screen>
      <AppText variant="h2" style={{ marginBottom: spacing.lg }}>
        {cardId ? 'Edit card' : 'New card'}
      </AppText>
      <View style={{ gap: spacing.md }}>
        <Input placeholder="Question" value={question} onChangeText={setQuestion} multiline />
        <Input placeholder="Answer" value={answer} onChangeText={setAnswer} multiline />
        <Input placeholder="Hint (optional)" value={hint} onChangeText={setHint} />
        <Button label="Save card" onPress={save} loading={saving} disabled={!question || !answer} />
        {cardId ? <Button label="Delete card" kind="danger" onPress={onDelete} /> : null}
      </View>
    </Screen>
  );
}
