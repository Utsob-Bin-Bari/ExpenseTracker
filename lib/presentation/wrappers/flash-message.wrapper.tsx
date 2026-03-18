import React from 'react';
import FlashMessage from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const FlashMessageWrapper: React.FC = () => {
  const { top } = useSafeAreaInsets();
  return <FlashMessage statusBarHeight={top} />;
};
