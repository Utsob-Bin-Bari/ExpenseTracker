import { Colors } from './colors.style';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    primaryLight: string;
    border: string;
    error: string;
    errorLight: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    tabBar: string;
    tabBarBorder: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;
    inputBackground: string;
    buttonBackground: string;
    buttonPrimaryText: string;
    buttonTransparentText: string;
    card: string;
    cardShadow: string;
  };
}

export const darkTheme: Theme = {
  colors: {
    background:             Colors.slate950,
    surface:                Colors.slate900,
    surfaceSecondary:       Colors.slate800,
    text:                   Colors.slate50,
    textSecondary:          Colors.slate300,
    textMuted:              Colors.slate500,
    primary:                Colors.indigo400,
    primaryLight:           Colors.indigo900,
    border:                 Colors.slate800,
    error:                  Colors.red500,
    errorLight:             Colors.red900,
    success:                Colors.green500,
    successLight:           Colors.green900,
    warning:                Colors.amber500,
    warningLight:           Colors.amber900,
    tabBar:                 Colors.slate900,
    tabBarBorder:           Colors.slate800,
    inputBorder:            Colors.slate700,
    inputText:              Colors.slate50,
    inputPlaceholder:       Colors.slate500,
    inputBackground:        Colors.slate800,
    buttonBackground:       Colors.indigo500,
    buttonPrimaryText:      Colors.white,
    buttonTransparentText:  Colors.indigo400,
    card:                   Colors.slate900,
    cardShadow:             Colors.black,
  },
};

export const lightTheme: Theme = {
  colors: {
    background:          Colors.slate50,
    surface:             Colors.white,
    surfaceSecondary:    Colors.slate100,
    text:                Colors.slate800,
    textSecondary:       Colors.slate600,
    textMuted:           Colors.slate400,
    primary:             Colors.indigo500,
    primaryLight:        Colors.indigo50,
    border:              Colors.slate200,
    error:               Colors.red500,
    errorLight:          Colors.red100,
    success:             Colors.green500,
    successLight:        Colors.green100,
    warning:             Colors.amber500,
    warningLight:        Colors.amber100,
    tabBar:              Colors.white,
    tabBarBorder:        Colors.slate200,
    inputBorder:         Colors.slate300,
    inputText:           Colors.slate800,
    inputPlaceholder:    Colors.slate400,
    inputBackground:     Colors.white,
    buttonBackground:    Colors.indigo500,
    buttonPrimaryText:   Colors.white,
    buttonTransparentText: Colors.indigo500,
    card:                Colors.white,
    cardShadow:          Colors.slate200,
  },
};
