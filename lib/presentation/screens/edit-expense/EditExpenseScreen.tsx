import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon, ArrowDown01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { Text } from '@/lib/presentation/ui/text.ui';
import { Input } from '@/lib/presentation/ui/input.ui';
import { Button } from '@/lib/presentation/ui/button.ui';
import { useExpenseForm } from '@/lib/presentation/hooks/useExpenseForm';
import { useExpenseStore } from '@/lib/application/store/expenseStore';
import { useCategoryStore } from '@/lib/application/store/categoryStore';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING, CARD_RADIUS } from '@/lib/presentation/styles/variables.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingComponent } from '@/lib/presentation/wrappers/keyboard.wrapper';

export const EditExpenseScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const expenses = useExpenseStore((s) => s.expenses);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const categories = useCategoryStore((s) => s.categories);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  const expense = expenses.find((e) => e.id === id);
  const { form, onSubmit } = useExpenseForm(expense);
  const { control, formState: { errors }, watch, setValue } = form;
  const selectedCategoryId = watch('categoryId');
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          if (id) deleteExpense(id);
          router.back();
        },
      },
    ]);
  };

  if (!expense) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text textThemeName="body" style={{ color: theme.colors.textMuted }}>Expense not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm, backgroundColor: theme.colors.surface }]}>
        <Text textThemeName="h4">Edit Expense</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleDelete}>
            <HugeiconsIcon icon={Delete02Icon} size={22} color={theme.colors.error} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <HugeiconsIcon icon={Cancel01Icon} size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingComponent
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.xl }]}
      >
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange } }) => (
            <Input label="Amount" placeholder="0.00" value={value} onChangeText={onChange}
              keyboardType="decimal-pad" error={errors.amount?.message} required />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <Input label="Description" placeholder="What did you spend on?" value={value}
              onChangeText={onChange} error={errors.description?.message} required />
          )}
        />
        <Controller
          control={control}
          name="date"
          render={({ field: { value, onChange } }) => (
            <Input label="Date" placeholder="YYYY-MM-DD" value={value}
              onChangeText={onChange} error={errors.date?.message} required />
          )}
        />

        <View style={styles.fieldGroup}>
          <Text textThemeName="label" style={{ color: theme.colors.textSecondary, marginBottom: SPACING.xs }}>
            Category <Text textThemeName="label" style={{ color: theme.colors.error }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setCategoryPickerOpen(true)}
            style={[styles.pickerButton, { borderColor: errors.categoryId ? theme.colors.error : theme.colors.inputBorder, backgroundColor: theme.colors.inputBackground }]}
          >
            {selectedCategory ? (
              <View style={styles.selectedCategory}>
                <View style={[styles.colorDot, { backgroundColor: selectedCategory.color }]} />
                <Text textThemeName="body">{selectedCategory.name}</Text>
              </View>
            ) : (
              <Text textThemeName="body" style={{ color: theme.colors.inputPlaceholder }}>Select a category</Text>
            )}
            <HugeiconsIcon icon={ArrowDown01Icon} size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
          {errors.categoryId && (
            <Text textThemeName="caption" style={{ color: theme.colors.error, marginTop: 4 }}>{errors.categoryId.message}</Text>
          )}
        </View>

        <Button label="Save Changes" onPress={onSubmit} style={{ marginTop: SPACING.md }} />
      </KeyboardAvoidingComponent>

      {categoryPickerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCategoryPickerOpen(false)} />
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.surface, paddingBottom: insets.bottom + SPACING.md }]}>
            <View style={styles.sheetHandle} />
            <Text textThemeName="h4" style={{ marginBottom: SPACING.md, paddingHorizontal: SPACING.md }}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryOption, { backgroundColor: item.id === selectedCategoryId ? theme.colors.primaryLight : 'transparent' }]}
                  onPress={() => { setValue('categoryId', item.id, { shouldValidate: true }); setCategoryPickerOpen(false); }}
                >
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text textThemeName="body">{item.name}</Text>
                  <Text textThemeName="caption" style={{ marginLeft: 'auto', color: theme.colors.textMuted }}>${item.budget}/mo</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  content: { padding: SPACING.md },
  fieldGroup: { marginBottom: SPACING.md },
  pickerButton: { height: 52, borderWidth: 1.5, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md },
  selectedCategory: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: SPACING.md, maxHeight: '65%' },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: SPACING.md },
  categoryOption: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, borderRadius: CARD_RADIUS, marginHorizontal: SPACING.sm },
});
