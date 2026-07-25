import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function Button({ title, onPress, variant = 'primary', disabled = false }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    color: colors.textInverse,
    fontSize: typography.fontSizeBody,
    fontWeight: typography.fontWeightBold,
  },
});