import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/lib/presentation/ui/text.ui';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING, CARD_RADIUS } from '@/lib/presentation/styles/variables.style';
import type { Expense, Category } from '@/lib/types';
import { format } from 'date-fns';

interface ExpenseItemProps {
  expense: Expense;
  category: Category | undefined;
  onPress: () => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, category, onPress }) => {
  const { theme } = useTheme();
  const color = category?.color ?? theme.colors.border;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: color + '22' }]}>
          <View style={[styles.innerDot, { backgroundColor: color }]} />
        </View>
        <View style={styles.info}>
          <Text textThemeName="bodyMedium" numberOfLines={1}>
            {expense.description}
          </Text>
          <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>
            {category?.name ?? 'Uncategorized'} · {format(new Date(expense.date), 'MMM d')}
          </Text>
        </View>
        <Text textThemeName="bodyBold" style={{ color: theme.colors.text }}>
          ৳{Math.round(expense.amount).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: CARD_RADIUS,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  innerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
