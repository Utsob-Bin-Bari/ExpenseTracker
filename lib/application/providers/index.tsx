import React, { ReactNode } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ThemeProvider } from './theme.provider';
import { OnlineManagerProvider } from './online-manager.provider';
import { FlashMessageWrapper } from '@/lib/presentation/wrappers/flash-message.wrapper';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <OnlineManagerProvider>
        <KeyboardProvider>
          {children}
        </KeyboardProvider>
        <FlashMessageWrapper />
      </OnlineManagerProvider>
    </ThemeProvider>
  );
};
