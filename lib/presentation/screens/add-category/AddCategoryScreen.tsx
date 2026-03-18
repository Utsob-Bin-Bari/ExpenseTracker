import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Controller } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { Text } from '@/lib/presentation/ui/text.ui';
import { Input } from '@/lib/presentation/ui/input.ui';
import { Button } from '@/lib/presentation/ui/button.ui';
import { useCategoryForm } from '@/lib/presentation/hooks/useCategoryForm';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING, CARD_RADIUS } from '@/lib/presentation/styles/variables.style';
import { Colors } from '@/lib/presentation/styles/colors.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingComponent } from '@/lib/presentation/wrappers/keyboard.wrapper';

export const AddCategoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { form, onSubmit } = useCategoryForm();
  const { control, formState: { errors }, watch, setValue } = form;
  const selectedColor = watch('color');

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm, backgroundColor: theme.colors.surface }]}>
        <Text textThemeName="h4">New Category</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <HugeiconsIcon icon={Cancel01Icon} size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingComponent
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.xl }]}
      >
        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <Input label="Category Name" placeholder="e.g. Groceries" value={value}
              onChangeText={onChange} error={errors.name?.message} required />
          )}
        />

        {/* Budget */}
        <Controller
          control={control}
          name="budget"
          render={({ field: { value, onChange } }) => (
            <Input label="Monthly Budget" placeholder="0.00" value={value}
              onChangeText={onChange} keyboardType="decimal-pad" error={errors.budget?.message} required />
          )}
        />

        {/* Color Picker */}
        <View style={styles.fieldGroup}>
          <Text textThemeName="label" style={{ color: theme.colors.textSecondary, marginBottom: SPACING.sm }}>
            Color
          </Text>
          <View style={styles.colorGrid}>
            {Colors.categoryColors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setValue('color', color, { shouldValidate: true })}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedSwatch,
                ]}
              />
            ))}
          </View>
          {errors.color && (
            <Text textThemeName="caption" style={{ color: theme.colors.error, marginTop: 4 }}>
              {errors.color.message}
            </Text>
          )}
        </View>

        {/* Preview */}
        <View style={[styles.preview, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.previewDot, { backgroundColor: selectedColor + '22' }]}>
            <View style={[styles.previewInnerDot, { backgroundColor: selectedColor }]} />
          </View>
          <Text textThemeName="title">{watch('name') || 'Category name'}</Text>
        </View>

        <Button label="Create Category" onPress={onSubmit} style={{ marginTop: SPACING.md }} />
      </KeyboardAvoidingComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  content: { padding: SPACING.md },
  fieldGroup: { marginBottom: SPACING.md },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  colorSwatch: { width: 40, height: 40, borderRadius: 20 },
  selectedSwatch: { borderWidth: 3, borderColor: 'white', transform: [{ scale: 1.15 }] },
  preview: { borderRadius: CARD_RADIUS, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  previewDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  previewInnerDot: { width: 16, height: 16, borderRadius: 8 },
});
