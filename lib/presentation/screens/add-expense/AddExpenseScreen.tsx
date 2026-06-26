import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { Controller } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { Text } from '@/lib/presentation/ui/text.ui';
import { Input } from '@/lib/presentation/ui/input.ui';
import { Button } from '@/lib/presentation/ui/button.ui';
import { useExpenseForm } from '@/lib/presentation/hooks/useExpenseForm';
import { useCategoryStore } from '@/lib/application/store/categoryStore';
import { useExpenseStore } from '@/lib/application/store/expenseStore';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING, CARD_RADIUS } from '@/lib/presentation/styles/variables.style';
import { toMonthKey } from '@/lib/infrastructure/utils/date';
import { resolveMonthlyBudget } from '@/lib/infrastructure/utils/budget';
import { isCategoryVisibleInMonth } from '@/lib/infrastructure/utils/category';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingComponent } from '@/lib/presentation/wrappers/keyboard.wrapper';

export const AddExpenseScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const categories = useCategoryStore((s) => s.categories);
  const expenses = useExpenseStore((s) => s.expenses);
  const { form, onSubmit } = useExpenseForm();
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  const { control, formState: { errors }, watch, setValue } = form;
  const selectedCategoryId = watch('categoryId');
  const dateValue = watch('date');

  const dateMonthKey = useMemo(() => {
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? toMonthKey(new Date()) : toMonthKey(d);
  }, [dateValue]);

  const monthCategories = useMemo(() => {
    const idsWithExpenses = new Set(
      expenses.filter((e) => toMonthKey(new Date(e.date)) === dateMonthKey).map((e) => e.categoryId)
    );
    return categories.filter((c) =>
      isCategoryVisibleInMonth(c, dateMonthKey, idsWithExpenses.has(c.id))
    );
  }, [categories, expenses, dateMonthKey]);

  const selectedCategory = monthCategories.find((c) => c.id === selectedCategoryId);

  // Clear a selection that no longer belongs to the picked date's month.
  useEffect(() => {
    if (selectedCategoryId && !monthCategories.some((c) => c.id === selectedCategoryId)) {
      setValue('categoryId', '');
    }
  }, [monthCategories, selectedCategoryId, setValue]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm, backgroundColor: theme.colors.surface }]}>
        <Text textThemeName="h4">Add Expense</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <HugeiconsIcon icon={Cancel01Icon} size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingComponent
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.xl }]}
      >
        {/* Amount */}
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Amount"
              placeholder="0.00"
              value={value}
              onChangeText={onChange}
              keyboardType="decimal-pad"
              error={errors.amount?.message}
              required
            />
          )}
        />

        {/* Description */}
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Description"
              placeholder="What did you spend on?"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
              required
            />
          )}
        />

        {/* Date */}
        <Controller
          control={control}
          name="date"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Date"
              placeholder="YYYY-MM-DD"
              value={value}
              onChangeText={onChange}
              error={errors.date?.message}
              required
            />
          )}
        />

        {/* Category Picker */}
        <View style={styles.fieldGroup}>
          <Text textThemeName="label" style={{ color: theme.colors.textSecondary, marginBottom: SPACING.xs }}>
            Category <Text textThemeName="label" style={{ color: theme.colors.error }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => { Keyboard.dismiss(); setCategoryPickerOpen(true); }}
            style={[
              styles.pickerButton,
              {
                borderColor: errors.categoryId ? theme.colors.error : theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBackground,
              },
            ]}
          >
            {selectedCategory ? (
              <View style={styles.selectedCategory}>
                <View style={[styles.colorDot, { backgroundColor: selectedCategory.color }]} />
                <Text textThemeName="body">{selectedCategory.name}</Text>
              </View>
            ) : (
              <Text textThemeName="body" style={{ color: theme.colors.inputPlaceholder }}>
                Select a category
              </Text>
            )}
            <HugeiconsIcon icon={ArrowDown01Icon} size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
          {errors.categoryId && (
            <Text textThemeName="caption" style={{ color: theme.colors.error, marginTop: 4 }}>
              {errors.categoryId.message}
            </Text>
          )}
        </View>

        <Button label="Add Expense" onPress={onSubmit} style={{ marginTop: SPACING.md }} />
      </KeyboardAvoidingComponent>

      {/* Category picker overlay */}
      {categoryPickerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setCategoryPickerOpen(false)}
          />
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.surface, paddingBottom: insets.bottom + SPACING.md }]}>
            <View style={styles.sheetHandle} />
            <Text textThemeName="h4" style={{ marginBottom: SPACING.md, paddingHorizontal: SPACING.md }}>
              Select Category
            </Text>
            <FlatList
              data={monthCategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    { backgroundColor: item.id === selectedCategoryId ? theme.colors.primaryLight : 'transparent' },
                  ]}
                  onPress={() => {
                    setValue('categoryId', item.id, { shouldValidate: true });
                    setCategoryPickerOpen(false);
                  }}
                >
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text textThemeName="body">{item.name}</Text>
                  <Text textThemeName="caption" style={{ marginLeft: 'auto', color: theme.colors.textMuted }}>
                    ৳{Math.round(resolveMonthlyBudget(item, dateMonthKey))}/mo
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text
                  textThemeName="body"
                  style={{ color: theme.colors.textMuted, textAlign: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.lg }}
                >
                  No categories for this month.{'\n'}Add one on the Categories tab.
                </Text>
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  content: {
    padding: SPACING.md,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  pickerButton: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.md,
    maxHeight: '65%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: CARD_RADIUS,
    marginHorizontal: SPACING.sm,
  },
});
