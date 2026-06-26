import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/lib/presentation/ui/text.ui';
import { PieChart, type PieSlice } from '@/lib/presentation/components/PieChart';
import { BarChart, type BarDatum } from '@/lib/presentation/components/BarChart';
import { CategoryCard } from '@/lib/presentation/components/CategoryCard';
import { useExpenseStore } from '@/lib/application/store/expenseStore';
import { useCategoryStore } from '@/lib/application/store/categoryStore';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING, CARD_RADIUS } from '@/lib/presentation/styles/variables.style';
import { trailingMonths, toMonthKey } from '@/lib/infrastructure/utils/date';
import { resolveMonthlyBudget } from '@/lib/infrastructure/utils/budget';
import { isCategoryVisibleInMonth, categoryMergeKey } from '@/lib/infrastructure/utils/category';
import type { CategoryWithSpent } from '@/lib/types';

export const YearlyScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const expenses = useExpenseStore((s) => s.expenses);
  const categories = useCategoryStore((s) => s.categories);

  const now = new Date();
  const months = useMemo(() => trailingMonths(now), [now.getFullYear(), now.getMonth()]);
  const monthKeys = useMemo(() => new Set(months.map((m) => m.key)), [months]);

  const windowExpenses = useMemo(
    () => expenses.filter((e) => monthKeys.has(toMonthKey(new Date(e.date)))),
    [expenses, monthKeys]
  );

  const totalSpent = useMemo(
    () => windowExpenses.reduce((s, e) => s + e.amount, 0),
    [windowExpenses]
  );

  const rangeLabel = useMemo(() => {
    const first = months[0]!;
    const last = months[months.length - 1]!;
    return `${first.shortLabel} ${first.year} – ${last.shortLabel} ${last.year}`;
  }, [months]);

  // Spent grouped by month key.
  const spentByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    windowExpenses.forEach((e) => {
      const k = toMonthKey(new Date(e.date));
      map[k] = (map[k] ?? 0) + e.amount;
    });
    return map;
  }, [windowExpenses]);

  const barData = useMemo<BarDatum[]>(() => {
    const currentKey = toMonthKey(now);
    return months.map((m) => ({
      label: m.shortLabel,
      value: spentByMonth[m.key] ?? 0,
      highlight: m.key === currentKey,
    }));
  }, [months, spentByMonth]);

  // Spent grouped by category (window).
  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    windowExpenses.forEach((e) => {
      map[e.categoryId] = (map[e.categoryId] ?? 0) + e.amount;
    });
    return map;
  }, [windowExpenses]);

  const pieData = useMemo<PieSlice[]>(() => {
    const merged = new Map<string, PieSlice>();
    categories.forEach((c) => {
      const value = spentByCategory[c.id] ?? 0;
      if (value <= 0) return;
      const key = categoryMergeKey(c.name, c.color);
      const existing = merged.get(key);
      if (existing) existing.value += value;
      else merged.set(key, { value, color: c.color, label: c.name });
    });
    return Array.from(merged.values());
  }, [categories, spentByCategory]);

  // Category+month combos that have an expense in the window.
  const activeCatMonths = useMemo(() => {
    const set = new Set<string>();
    windowExpenses.forEach((e) => set.add(`${e.categoryId}:${toMonthKey(new Date(e.date))}`));
    return set;
  }, [windowExpenses]);

  // Budget vs actual: yearly budget = sum of resolved budgets over the months the
  // category was active (existed & not closed). Only categories active at least once
  // in the window (or with spend) are listed.
  const budgetVsActual = useMemo<CategoryWithSpent[]>(() => {
    // Merge records with the same name + color into one row.
    const merged = new Map<string, CategoryWithSpent>();
    categories.forEach((c) => {
      let yearlyBudget = 0;
      let activeMonths = 0;
      months.forEach((m) => {
        const hasActivity =
          activeCatMonths.has(`${c.id}:${m.key}`) || c.monthlyBudgets?.[m.key] != null;
        if (isCategoryVisibleInMonth(c, m.key, hasActivity)) {
          yearlyBudget += resolveMonthlyBudget(c, m.key);
          activeMonths += 1;
        }
      });
      const spent = spentByCategory[c.id] ?? 0;
      if (activeMonths === 0 && spent === 0) return;

      const key = categoryMergeKey(c.name, c.color);
      const existing = merged.get(key);
      if (existing) {
        existing.budget += yearlyBudget;
        existing.spent += spent;
      } else {
        merged.set(key, { ...c, budget: yearlyBudget, spent, percentage: 0 });
      }
    });
    // Percentage from the merged spend.
    return Array.from(merged.values()).map((c) => ({
      ...c,
      percentage: totalSpent > 0 ? (c.spent / totalSpent) * 100 : 0,
    }));
  }, [categories, months, spentByCategory, activeCatMonths, totalSpent]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: theme.colors.surface }]}>
        <Text textThemeName="h2">Yearly</Text>
        <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>
          {rangeLabel}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Range total strip */}
        <View style={[styles.summaryStrip, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.summaryItem}>
            <Text textThemeName="caption" style={styles.summaryLabel}>
              Total Spent
            </Text>
            <Text textThemeName="h3" style={styles.summaryValue}>
              ৳{Math.round(totalSpent).toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text textThemeName="caption" style={styles.summaryLabel}>
              Transactions
            </Text>
            <Text textThemeName="h3" style={styles.summaryValue}>
              {windowExpenses.length}
            </Text>
          </View>
        </View>

        {/* Monthly breakdown */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
          <Text textThemeName="h4" style={{ marginBottom: SPACING.md }}>
            Monthly breakdown
          </Text>
          <BarChart data={barData} />
        </View>

        {/* Category breakdown */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
          <Text textThemeName="h4" style={{ marginBottom: SPACING.md }}>
            By category
          </Text>
          <View style={{ alignItems: 'center' }}>
            <PieChart data={pieData} size={200} totalLabel="Spent" totalAmount={`৳${Math.round(totalSpent)}`} />
          </View>
          {pieData.length > 0 ? (
            <View style={styles.legend}>
              {pieData.map((slice, i) => (
                <View key={i} style={[styles.legendItem, { borderTopColor: theme.colors.border }]}>
                  <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
                  <Text textThemeName="caption" style={{ color: theme.colors.textSecondary, flex: 1 }} numberOfLines={1}>
                    {slice.label}
                  </Text>
                  <Text textThemeName="captionMedium" style={{ color: theme.colors.text }}>
                    {totalSpent > 0 ? ((slice.value / totalSpent) * 100).toFixed(0) : 0}%
                  </Text>
                  <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>
                    ৳{Math.round(slice.value)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text textThemeName="caption" style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: SPACING.md }}>
              No expenses in this period
            </Text>
          )}
        </View>

        {/* Budget vs actual */}
        <View style={styles.sectionTitle}>
          <Text textThemeName="h4">Budget vs actual</Text>
        </View>
        <View style={styles.list}>
          {budgetVsActual.map((cat) => (
            <CategoryCard key={cat.id} category={cat} onPress={() => {}} />
          ))}
        </View>
      </ScrollView>
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
  summaryStrip: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    margin: SPACING.md,
    borderRadius: CARD_RADIUS,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryLabel: { color: 'rgba(255,255,255,0.7)' },
  summaryValue: { color: '#FFFFFF' },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 2,
  },
  card: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: CARD_RADIUS,
    padding: SPACING.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  legend: { width: '100%', marginTop: SPACING.md },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  sectionTitle: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  list: {
    paddingHorizontal: SPACING.md,
  },
});
