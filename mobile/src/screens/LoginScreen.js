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

export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <AppText variant="h1" style={{ textAlign: 'center' }}>
          ⚔️ FlashDuel
        </AppText>
        <AppText variant="body" muted style={{ textAlign: 'center', marginTop: spacing.xs }}>
          Enter the arena and train with every duel.
        </AppText>
        <View style={{ marginTop: spacing.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: 999, backgroundColor: theme.primary, opacity: 0.12 }}>
          <AppText style={{ color: theme.primary, fontWeight: '700' }}>Know. Learn. Win.</AppText>
        </View>
      </View>

      <View style={{ gap: spacing.md }}>
        <Input placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        {error ? <AppText color={theme.danger}>{error}</AppText> : null}
        <Button label="Log in" onPress={onSubmit} loading={loading} disabled={!email || !password} />
        <Button label="Create an account" kind="ghost" onPress={() => navigation.navigate('Register')} />
      </View>
    </Screen>
  );
}
