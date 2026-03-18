import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  SectionList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon, Sun01Icon, Moon02Icon } from '@hugeicons/core-free-icons';
import { Text } from '@/lib/presentation/ui/text.ui';
import { PieChart, type PieSlice } from '@/lib/presentation/components/PieChart';
import { ExpenseItem } from '@/lib/presentation/components/ExpenseItem';
import { useExpenseStore } from '@/lib/application/store/expenseStore';
import { useCategoryStore } from '@/lib/application/store/categoryStore';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING, CARD_RADIUS } from '@/lib/presentation/styles/variables.style';
import { format } from 'date-fns';
import type { Expense } from '@/lib/types';

const PAGE_SIZE = 15;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type DaySection = {
  date: string;
  dayLabel: string;
  dayTotal: number;
  data: Expense[];
};

export const HomeScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const expenses = useExpenseStore((s) => s.expenses);
  const categories = useCategoryStore((s) => s.categories);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();
  const todayStr = format(now, 'yyyy-MM-dd');
  const yesterdayStr = format(new Date(now.getTime() - 86400000), 'yyyy-MM-dd');

  const [selectedMonth, setSelectedMonth] = useState(currentMonthIdx);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);

  const availableMonths = useMemo(
    () => Array.from({ length: currentMonthIdx + 1 }, (_, i) => i),
    [currentMonthIdx]
  );

  const monthExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === currentYear && d.getMonth() === selectedMonth;
      }),
    [expenses, selectedMonth, currentYear]
  );

  const sortedExpenses = useMemo(() => {
    const isCurrentMonth = selectedMonth === currentMonthIdx;
    return [...monthExpenses].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return isCurrentMonth ? db - da : da - db;
    });
  }, [monthExpenses, selectedMonth, currentMonthIdx]);

  const totalSpent = useMemo(
    () => monthExpenses.reduce((s, e) => s + e.amount, 0),
    [monthExpenses]
  );

  const pieData = useMemo<PieSlice[]>(() => {
    const byCategory: Record<string, number> = {};
    monthExpenses.forEach((e) => {
      byCategory[e.categoryId] = (byCategory[e.categoryId] ?? 0) + e.amount;
    });
    return categories
      .map((c) => ({ value: byCategory[c.id] ?? 0, color: c.color, label: c.name }))
      .filter((s) => s.value > 0);
  }, [monthExpenses, categories]);

  const sections = useMemo<DaySection[]>(() => {
    const paginated = sortedExpenses.slice(0, displayedCount);
    const groups = new Map<string, Expense[]>();
    paginated.forEach((e) => {
      const key = format(new Date(e.date), 'yyyy-MM-dd');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(e);
    });
    return Array.from(groups.entries()).map(([date, data]) => {
      let dayLabel: string;
      if (date === todayStr) dayLabel = 'Today';
      else if (date === yesterdayStr) dayLabel = 'Yesterday';
      else dayLabel = format(new Date(date), 'EEE, d MMM');
      return { date, dayLabel, dayTotal: data.reduce((s, e) => s + e.amount, 0), data };
    });
  }, [sortedExpenses, displayedCount, todayStr, yesterdayStr]);

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const handleMonthSelect = useCallback((month: number) => {
    setSelectedMonth(month);
    setDisplayedCount(PAGE_SIZE);
  }, []);

  const loadMore = useCallback(() => {
    if (displayedCount < sortedExpenses.length) {
      setDisplayedCount((prev) => prev + PAGE_SIZE);
    }
  }, [displayedCount, sortedExpenses.length]);

  const hasMore = displayedCount < sortedExpenses.length;

  const renderListHeader = useCallback(
    () => (
      <View>
        {/* Summary strip */}
        <View style={[styles.summaryStrip, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.summaryItem}>
            <Text textThemeName="caption" style={styles.summaryLabel}>
              {MONTH_NAMES[selectedMonth]} {currentYear}
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
              {monthExpenses.length}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text textThemeName="caption" style={styles.summaryLabel}>
              Categories
            </Text>
            <Text textThemeName="h3" style={styles.summaryValue}>
              {pieData.length}
            </Text>
          </View>
        </View>

        {/* Pie chart card */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow },
          ]}
        >
          <PieChart
            data={pieData}
            size={200}
            totalLabel="Spent"
            totalAmount={`৳${Math.round(totalSpent)}`}
          />
          {pieData.length > 0 && (
            <View style={styles.legend}>
              {pieData.map((slice, i) => (
                <View
                  key={i}
                  style={[styles.legendItem, { borderTopColor: theme.colors.border }]}
                >
                  <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
                  <Text
                    textThemeName="caption"
                    style={{ color: theme.colors.textSecondary, flex: 1 }}
                    numberOfLines={1}
                  >
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
          )}
          {pieData.length === 0 && (
            <Text
              textThemeName="caption"
              style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: SPACING.md }}
            >
              No expenses this month
            </Text>
          )}
        </View>

        {/* Month filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthChips}
          style={styles.monthFilterRow}
        >
          {availableMonths.map((month) => {
            const isSelected = month === selectedMonth;
            return (
              <TouchableOpacity
                key={month}
                onPress={() => handleMonthSelect(month)}
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
                  style={{ color: isSelected ? '#fff' : theme.colors.textSecondary }}
                >
                  {MONTH_NAMES[month]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Transactions title */}
        <View style={styles.txHeader}>
          <Text textThemeName="h4">Transactions</Text>
          {monthExpenses.length > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primaryLight }]}>
              <Text textThemeName="caption" style={{ color: theme.colors.primary }}>
                {monthExpenses.length}
              </Text>
            </View>
          )}
        </View>
      </View>
    ),
    [
      theme,
      totalSpent,
      monthExpenses.length,
      pieData,
      availableMonths,
      selectedMonth,
      currentYear,
      handleMonthSelect,
    ]
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Fixed header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + SPACING.md,
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>
              {format(now, 'MMMM yyyy')}
            </Text>
            <Text textThemeName="h2">My Expenses</Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={[styles.themeToggle, { backgroundColor: theme.colors.surfaceSecondary }]}
          >
            <HugeiconsIcon
              icon={isDark ? Sun01Icon : Moon02Icon}
              size={20}
              color={isDark ? theme.colors.warning : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <SectionList<Expense, DaySection>
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.daySectionHeader,
              {
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.border,
              },
            ]}
          >
            <Text textThemeName="captionMedium" style={{ color: theme.colors.textSecondary }}>
              {section.dayLabel}
            </Text>
            <Text textThemeName="captionMedium" style={{ color: theme.colors.textMuted }}>
              ৳{Math.round(section.dayTotal).toLocaleString()}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ExpenseItem
              expense={item}
              category={getCategoryById(item.categoryId)}
              onPress={() =>
                router.push({ pathname: '/(modals)/edit-expense', params: { id: item.id } })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                marginHorizontal: SPACING.md,
              },
            ]}
          >
            <Text
              textThemeName="body"
              style={{ color: theme.colors.textMuted, textAlign: 'center' }}
            >
              No expenses in {MONTH_NAMES[selectedMonth]}.{'\n'}Tap + to add one.
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <View style={styles.loader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: theme.colors.primary, bottom: insets.bottom + SPACING.xl },
        ]}
        onPress={() => router.push('/(modals)/add-expense')}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryStrip: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryLabel: { color: 'rgba(255,255,255,0.7)' },
  summaryValue: { color: '#FFFFFF' },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 2,
  },
  chartCard: {
    margin: SPACING.md,
    borderRadius: CARD_RADIUS,
    padding: SPACING.md,
    alignItems: 'center',
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
  monthFilterRow: { paddingVertical: SPACING.sm },
  monthChips: { paddingHorizontal: SPACING.md, gap: SPACING.xs },
  monthChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  txHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  daySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemWrapper: { paddingHorizontal: SPACING.md, paddingTop: SPACING.xs },
  emptyCard: {
    borderRadius: CARD_RADIUS,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  loader: { padding: SPACING.md, alignItems: 'center' },
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
