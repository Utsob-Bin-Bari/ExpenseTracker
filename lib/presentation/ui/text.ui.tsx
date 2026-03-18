import React from 'react';
import { Text as NativeText, StyleSheet, type TextProps } from 'react-native';
import { GlobalTextStyles } from '@/lib/presentation/styles/global.text.style';
import { useTheme } from '@/lib/application/context/ThemeContext';

type GlobalTextStyleName = keyof typeof GlobalTextStyles;

export type TextComponentProps = Omit<TextProps, 'style'> & {
  textThemeName?: GlobalTextStyleName;
  style?: TextProps['style'];
} & React.PropsWithChildren;

export const Text: React.FC<TextComponentProps> = ({ textThemeName, style, ...props }) => {
  const { theme } = useTheme();
  const namedStyle = textThemeName ? GlobalTextStyles[textThemeName] : styles.default;

  return (
    <NativeText
      {...props}
      style={[{ color: theme.colors.text }, namedStyle, style]}
      ellipsizeMode="tail"
    >
      {props.children}
    </NativeText>
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    fontWeight: '400',
    includeFontPadding: false,
  },
});
