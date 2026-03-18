import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { KeyboardGestureArea } from 'react-native-keyboard-controller';
import { KEYBOARD_AVOIDING_VIEW } from '@/lib/presentation/styles/variables.style';

type KeyboardAvoidingComponentProps = {
  children: React.ReactNode | React.ReactNode[];
  keyboardVerticalOffset?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
} & ScrollViewProps;

export const KeyboardAvoidingComponent: React.FC<KeyboardAvoidingComponentProps> = ({
  children,
  contentContainerStyle,
  keyboardVerticalOffset = KEYBOARD_AVOIDING_VIEW.keyboardVerticalOffset,
  style,
  ...rest
}) => {
  return (
    <KeyboardGestureArea interpolator="ios" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          {...rest}
          style={[{ flex: 1 }, style]}
          contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </KeyboardGestureArea>
  );
};
