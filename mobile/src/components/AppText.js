import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type } from '../theme/tokens';

// variant maps to a type-scale + font-family pairing so screens never
// hardcode font sizes/families inline.
const VARIANTS = {
  h1: { fontSize: type.scale.h1, fontFamily: type.display, lineHeight: 38 },
  h2: { fontSize: type.scale.h2, fontFamily: type.display, lineHeight: 30 },
  h3: { fontSize: type.scale.h3, fontFamily: type.displayMedium, lineHeight: 24 },
  body: { fontSize: type.scale.body, fontFamily: type.body, lineHeight: 21 },
  bodyStrong: { fontSize: type.scale.body, fontFamily: type.bodySemibold, lineHeight: 21 },
  caption: { fontSize: type.scale.caption, fontFamily: type.bodyMedium, lineHeight: 16 },
};

export default function AppText({ variant = 'body', color, muted, style, children, ...rest }) {
  const theme = useTheme();
  const resolvedColor = color || (muted ? theme.textMuted : theme.text);
  return (
    <Text style={[VARIANTS[variant], { color: resolvedColor }, style]} {...rest}>
      {children}
    </Text>
  );
}
