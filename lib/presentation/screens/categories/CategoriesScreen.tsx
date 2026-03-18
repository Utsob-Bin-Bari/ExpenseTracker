import React, { useMemo } from 'react';
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
import type { CategoryWithSpent } from '@/lib/types';

export const CategoriesScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const categories = useCategoryStore((s) => s.categories);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const expenses = useExpenseStore((s) => s.expenses);

  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const categoriesWithSpent = useMemo<CategoryWithSpent[]>(() => {
    return categories.map((c) => {
      const spent = expenses
        .filter((e) => e.categoryId === c.id)
        .reduce((s, e) => s + e.amount, 0);
      return {
        ...c,
        spent,
        percentage: totalSpent > 0 ? (spent / totalSpent) * 100 : 0,
      };
    });
  }, [categories, expenses, totalSpent]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Category',
      `Delete "${name}"? Associated expenses will remain but be uncategorized.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(id) },
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: theme.colors.surface }]}>
        <Text textThemeName="h2">Categories</Text>
        <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>
          {categories.length} categories
        </Text>
      </View>

      <ScrollView
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
                    router.push({ pathname: '/(modals)/edit-category', params: { id: cat.id } })
                  }
                />
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.colors.primaryLight }]}
                    onPress={() => router.push({ pathname: '/(modals)/edit-category', params: { id: cat.id } })}
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
        onPress={() => router.push('/(modals)/add-category')}
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
