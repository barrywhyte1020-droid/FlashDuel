import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../store/useAuthStore';
import { apiErrorMessage } from '../api/client';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { Input } from '../components/Surface';
import Button from '../components/Button';
import { spacing } from '../theme/tokens';

export default function RegisterScreen() {
  const theme = useTheme();
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <AppText variant="h2" style={{ marginBottom: spacing.sm }}>
          Create your account
        </AppText>
        <AppText variant="body" muted style={{ textAlign: 'center', marginBottom: spacing.md }}>
          Join the duel and unlock flashcard mastery.
        </AppText>
        <View style={{ paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: 999, backgroundColor: theme.primary, opacity: 0.12 }}>
          <AppText style={{ color: theme.primary, fontWeight: '700' }}>Your next match starts now</AppText>
        </View>
      </View>
      <View style={{ gap: spacing.md }}>
        <Input placeholder="Name" value={name} onChangeText={setName} />
        <Input placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        {error ? <AppText color={theme.danger}>{error}</AppText> : null}
        <Button label="Sign up" onPress={onSubmit} loading={loading} disabled={!name || !email || !password} />
      </View>
    </Screen>
  );
}
