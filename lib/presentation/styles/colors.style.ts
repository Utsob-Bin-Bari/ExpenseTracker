// Only file allowed to contain raw hex values (besides app.json).
export const Colors = {
  // Indigo — primary brand
  indigo50:  '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo200: '#C7D2FE',
  indigo300: '#A5B4FC',
  indigo400: '#818CF8',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',
  indigo800: '#3730A3',
  indigo900: '#312E81',

  // Slate — neutrals
  slate50:  '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',

  // Semantic
  green500:  '#22C55E',
  green100:  '#DCFCE7',
  red500:    '#EF4444',
  red100:    '#FEE2E2',
  amber500:  '#F59E0B',
  amber100:  '#FEF3C7',

  // Dark semantic backgrounds
  red900:   '#7F1D1D',
  green900: '#14532D',
  amber900: '#78350F',

  // Extra dark bg
  slate950: '#020617',

  white: '#FFFFFF',
  black: '#000000',

  // Category palette — used when creating new categories
  categoryColors: [
    '#EF4444', // red
    '#F97316', // orange
    '#F59E0B', // amber
    '#22C55E', // green
    '#14B8A6', // teal
    '#3B82F6', // blue
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#84CC16', // lime
  ],
} as const;
