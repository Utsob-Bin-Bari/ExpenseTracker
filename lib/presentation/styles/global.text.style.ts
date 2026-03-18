import { StyleSheet } from 'react-native';

// System font-based type scale. includeFontPadding: false on every entry.
export const GlobalTextStyles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  h2: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    includeFontPadding: false,
  },
  h4: {
    fontSize: 17,
    fontWeight: '600' as const,
    includeFontPadding: false,
  },
  title: {
    fontSize: 15,
    fontWeight: '600' as const,
    includeFontPadding: false,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    includeFontPadding: false,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    includeFontPadding: false,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    includeFontPadding: false,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    includeFontPadding: false,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    includeFontPadding: false,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    includeFontPadding: false,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
});
