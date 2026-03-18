import { Dimensions, Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const KEYBOARD_AVOIDING_VIEW = {
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
  keyboardVerticalOffset: 28,
} as const;

export const NATIVE_SAFE_AREA_INSETS = {
  getPaddingTop: (insets: { top: number }) => insets.top,
  width: windowWidth * 0.92,
} as const;

export const NATIVE_Z_INDEX = {
  view:    1,
  loading: 10,
  header:  15,
  tabs:    15,
  modals:  30,
} as const;

export const CARD_RADIUS = 16;
export const INPUT_HEIGHT = 52;
export const BUTTON_HEIGHT = 52;
export const TAB_BAR_HEIGHT = 72;
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
