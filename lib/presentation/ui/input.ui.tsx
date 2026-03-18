import React from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { Text } from './text.ui';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { INPUT_HEIGHT, SPACING } from '@/lib/presentation/styles/variables.style';

type InputProps = {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
} & Omit<TextInputProps, 'style'>;

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error = '',
  required = false,
  rightElement,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {label ? (
        <Text textThemeName="label" style={{ color: theme.colors.textSecondary, marginBottom: SPACING.xs }}>
          {label}{required && <Text textThemeName="label" style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      ) : null}
      <View style={[
        styles.inputRow,
        {
          borderColor: error ? theme.colors.error : theme.colors.inputBorder,
          backgroundColor: theme.colors.inputBackground,
        },
      ]}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={theme.colors.inputPlaceholder}
          selectionColor={theme.colors.primary}
          style={[styles.input, { color: theme.colors.inputText, flex: 1 }]}
          {...props}
        />
        {rightElement}
      </View>
      {error ? (
        <Text textThemeName="caption" style={{ color: theme.colors.error, marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  inputRow: {
    height: INPUT_HEIGHT,
    borderWidth: 1.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    includeFontPadding: false,
  },
});
