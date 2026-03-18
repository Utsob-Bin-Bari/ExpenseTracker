import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Theme } from './theme.style';
import { NATIVE_SAFE_AREA_INSETS, SPACING } from './variables.style';

export const useGlobalContainerStyles = (theme: Theme) => {
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    screenWithTop: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: NATIVE_SAFE_AREA_INSETS.getPaddingTop(insets),
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    contentWidth: {
      width: NATIVE_SAFE_AREA_INSETS.width,
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    section: {
      marginBottom: SPACING.lg,
    },
    paddedContent: {
      paddingHorizontal: SPACING.md,
    },
  });
};
