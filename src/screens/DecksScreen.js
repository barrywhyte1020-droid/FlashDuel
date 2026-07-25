import { View, Text, StyleSheet } from 'react-native';

export default function DecksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Decks Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: '600' },
});