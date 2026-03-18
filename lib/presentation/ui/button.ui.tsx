import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from './text.ui';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { BUTTON_HEIGHT, SPACING } from '@/lib/presentation/styles/variables.style';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';

type ButtonProps = {
  onPress: () => void;
  label: string;
  isLoading?: boolean;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
} & Omit<TouchableOpacityProps, 'onPress' | 'style'>;

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  isLoading = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();

  const bgColor =
    variant === 'primary' ? theme.colors.buttonBackground
    : variant === 'danger'  ? theme.colors.error
    : 'transparent';

  const textColor =
    variant === 'primary' ? theme.colors.buttonPrimaryText
    : variant === 'danger'  ? theme.colors.buttonPrimaryText
    : theme.colors.buttonTransparentText;

  const borderColor =
    variant === 'outline' ? theme.colors.primary : 'transparent';

  const hasIcon = icon && !isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.75}
      {...props}
    >
      <View
        style={[
          styles.base,
          fullWidth && styles.fullWidth,
          {
            backgroundColor: bgColor,
            borderColor,
            borderWidth: variant === 'outline' ? 1.5 : 0,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {iconPosition === 'left' && hasIcon && icon}
        {isLoading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <Text textThemeName="bodyBold" style={{ color: textColor }}>
            {label}
          </Text>
        )}
        {iconPosition === 'right' && hasIcon && icon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: BUTTON_HEIGHT,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  fullWidth: {
    width: '100%',
  },
});
