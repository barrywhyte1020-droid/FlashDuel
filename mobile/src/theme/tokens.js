// FlashDuel design tokens.
// Palette built around a "duel arena" idea: deep indigo night-mode base,
// warm parchment day-mode base, electric violet as the competitive accent,
// gold for wins/streaks, coral-red reserved only for the countdown timer.

export const palette = {
  violet: '#5B4FE9',
  violetDark: '#443BC7',
  gold: '#FFB800',
  green: '#2ECC71',
  red: '#FF5252',
  ink: '#14162B',
  ink2: '#1E2140',
  ink3: '#2A2E55',
  paper: '#FBF8F3',
  paper2: '#FFFFFF',
  paper3: '#F0EBE1',
};

export const lightTheme = {
  mode: 'light',
  bg: palette.paper,
  surface: palette.paper2,
  surfaceAlt: palette.paper3,
  text: '#1B1D2E',
  textMuted: '#6B6F8C',
  border: '#E7E1D4',
  primary: palette.violet,
  primaryText: '#FFFFFF',
  accent: palette.gold,
  success: palette.green,
  danger: palette.red,
  tabBar: palette.paper2,
  shadow: 'rgba(20, 22, 43, 0.08)',
};

export const darkTheme = {
  mode: 'dark',
  bg: palette.ink,
  surface: palette.ink2,
  surfaceAlt: palette.ink3,
  text: '#F3F2FA',
  textMuted: '#A9ACC7',
  border: '#33375E',
  primary: '#7C72F2',
  primaryText: '#FFFFFF',
  accent: palette.gold,
  success: palette.green,
  danger: '#FF6E6E',
  tabBar: palette.ink2,
  shadow: 'rgba(0, 0, 0, 0.35)',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };

// Type scale. Display face = Space Grotesk (geometric, competitive),
// body/utility face = Inter. Loaded via expo-google-fonts in App.js;
// falls back to system font until loaded.
export const type = {
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  scale: {
    h1: 32,
    h2: 24,
    h3: 19,
    body: 15,
    caption: 12,
  },
};
