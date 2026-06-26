import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategorySchema, type CategoryFormDTO } from '@/lib/application/validators/categoryValidator';
import { useCategoryStore } from '@/lib/application/store/categoryStore';
import { showMessage } from 'react-native-flash-message';
import { router } from 'expo-router';
import type { Category } from '@/lib/types';
import { Colors } from '@/lib/presentation/styles/colors.style';
import { resolveMonthlyBudget } from '@/lib/infrastructure/utils/budget';

export function useCategoryForm(existing?: Category, monthKey?: string) {
  const { addCategory, updateCategory, setMonthlyBudget } = useCategoryStore();

  const defaultBudget = existing
    ? (monthKey ? resolveMonthlyBudget(existing, monthKey) : existing.budget).toString()
    : '';

  const form = useForm<CategoryFormDTO>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: existing?.name ?? '',
      color: existing?.color ?? (Colors.categoryColors[0] ?? '#EF4444'),
      icon: existing?.icon ?? 'restaurant',
      budget: defaultBudget,
    },
  });

  const onSubmit = form.handleSubmit((dto) => {
    const budget = parseFloat(dto.budget);
    if (existing) {
      updateCategory(existing.id, { name: dto.name, color: dto.color, icon: dto.icon });
      if (monthKey) {
        // Per-month budget edit: set this month's override (carries forward).
        setMonthlyBudget(existing.id, monthKey, budget);
      } else {
        updateCategory(existing.id, { budget });
      }
      router.back();
      showMessage({ message: 'Category updated', type: 'success' });
    } else {
      addCategory({ name: dto.name, color: dto.color, icon: dto.icon, budget }, monthKey);
      router.back();
      showMessage({ message: 'Category created', type: 'success' });
    }
  });

  return { form, onSubmit, isEditing: !!existing };
}
