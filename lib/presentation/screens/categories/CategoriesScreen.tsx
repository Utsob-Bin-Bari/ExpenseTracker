import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon, Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons';
import { Text } from '@/lib/presentation/ui/text.ui';
import { CategoryCard } from '@/lib/presentation/components/CategoryCard';
import { useCategoryStore } from '@/lib/application/store/categoryStore';
import { useExpenseStore } from '@/lib/application/store/expenseStore';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING, CARD_RADIUS } from '@/lib/presentation/styles/variables.style';
import { trailingMonths, toMonthKey, MONTH_NAMES } from '@/lib/infrastructure/utils/date';
import { resolveMonthlyBudget } from '@/lib/infrastructure/utils/budget';
import { isCategoryVisibleInMonth } from '@/lib/infrastructure/utils/category';
import type { CategoryWithSpent } from '@/lib/types';

export const CategoriesScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const categories = useCategoryStore((s) => s.categories);
  const removeMonthlyBudget = useCategoryStore((s) => s.removeMonthlyBudget);
  const expenses = useExpenseStore((s) => s.expenses);
  const deleteExpensesByCategoryInMonth = useExpenseStore((s) => s.deleteExpensesByCategoryInMonth);

  const now = new Date();
  const months = useMemo(() => trailingMonths(now), [now.getFullYear(), now.getMonth()]);
  const monthChips = useMemo(() => [...months].reverse(), [months]); // newest -> oldest
  const [selectedMonthKey, setSelectedMonthKey] = useState(toMonthKey(now));

  const monthExpenses = useMemo(
    () => expenses.filter((e) => toMonthKey(new Date(e.date)) === selectedMonthKey),
    [expenses, selectedMonthKey]
  );

  const totalSpent = useMemo(
    () => monthExpenses.reduce((s, e) => s + e.amount, 0),
    [monthExpenses]
  );

  const idsWithMonthExpenses = useMemo(
    () => new Set(monthExpenses.map((e) => e.categoryId)),
    [monthExpenses]
  );

  const categoriesWithSpent = useMemo<CategoryWithSpent[]>(() => {
    return categories
      .filter((c) => {
        const hasActivity =
          idsWithMonthExpenses.has(c.id) || c.monthlyBudgets?.[selectedMonthKey] != null;
        return isCategoryVisibleInMonth(c, selectedMonthKey, hasActivity);
      })
      .map((c) => {
        const spent = monthExpenses
          .filter((e) => e.categoryId === c.id)
          .reduce((s, e) => s + e.amount, 0);
        return {
          ...c,
          budget: resolveMonthlyBudget(c, selectedMonthKey),
          spent,
          percentage: totalSpent > 0 ? (spent / totalSpent) * 100 : 0,
        };
      });
  }, [categories, monthExpenses, idsWithMonthExpenses, totalSpent, selectedMonthKey]);

  const selectedMonthLabel = useMemo(() => {
    const [year, month] = selectedMonthKey.split('-');
    return `${MONTH_NAMES[Number(month) - 1] ?? ''} ${year}`;
  }, [selectedMonthKey]);

  const handleDelete = (id: string, name: string) => {
    const count = monthExpenses.filter((e) => e.categoryId === id).length;
    const expensePart =
      count > 0 ? ` and its ${count} expense${count === 1 ? '' : 's'}` : '';
    Alert.alert(
      'Remove Category',
      `Remove "${name}"${expensePart} for ${selectedMonthLabel}? Other months are unaffected.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            deleteExpensesByCategoryInMonth(id, selectedMonthKey);
            removeMonthlyBudget(id, selectedMonthKey);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: theme.colors.surface }]}>
        <Text textThemeName="h2">Categories</Text>
        <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>
          {categoriesWithSpent.length} categories
        </Text>
      </View>

      {/* Month filter */}
      <View style={[styles.monthFilterRow, { backgroundColor: theme.colors.surface }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthChips}
        >
          {monthChips.map((m) => {
            const isSelected = m.key === selectedMonthKey;
            return (
              <TouchableOpacity
                key={m.key}
                onPress={() => setSelectedMonthKey(m.key)}
                activeOpacity={0.7}
                style={[
                  styles.monthChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Text
                  textThemeName="caption"
                  numberOfLines={1}
                  style={{ color: isSelected ? '#fff' : theme.colors.textSecondary }}
                >
                  {m.shortLabel} {String(m.year).slice(2)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.list}>
          {categoriesWithSpent.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
              <Text textThemeName="body" style={{ color: theme.colors.textMuted, textAlign: 'center' }}>
                No categories yet.{'\n'}Create one to get started.
              </Text>
            </View>
          ) : (
            categoriesWithSpent.map((cat) => (
              <View key={cat.id} style={styles.cardWithActions}>
                <CategoryCard
                  category={cat}
                  headerPaddingRight={76}
                  onPress={() =>
                    router.push({ pathname: '/(modals)/edit-category', params: { id: cat.id, monthKey: selectedMonthKey } })
                  }
                />
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.colors.primaryLight }]}
                    onPress={() => router.push({ pathname: '/(modals)/edit-category', params: { id: cat.id, monthKey: selectedMonthKey } })}
                  >
                    <HugeiconsIcon icon={Edit02Icon} size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.colors.errorLight }]}
                    onPress={() => handleDelete(cat.id, cat.name)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary, bottom: insets.bottom + SPACING.xl }]}
        onPress={() => router.push({ pathname: '/(modals)/add-category', params: { monthKey: selectedMonthKey } })}
        activeOpacity={0.85}
      >
        <HugeiconsIcon icon={Add01Icon} size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    gap: 4,
  },
  monthFilterRow: {
    height: 56,
    justifyContent: 'center',
  },
  monthChips: { paddingHorizontal: SPACING.md, gap: SPACING.xs, alignItems: 'center' },
  monthChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  list: {
    padding: SPACING.md,
  },
  cardWithActions: {
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    borderRadius: CARD_RADIUS,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: SPACING.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
