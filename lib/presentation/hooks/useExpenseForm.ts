import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseSchema, type ExpenseFormDTO } from '@/lib/application/validators/expenseValidator';
import { useExpenseStore } from '@/lib/application/store/expenseStore';
import { showMessage } from 'react-native-flash-message';
import { router } from 'expo-router';
import { format } from 'date-fns';
import type { Expense } from '@/lib/types';

export function useExpenseForm(existing?: Expense) {
  const { addExpense, updateExpense } = useExpenseStore();

  const form = useForm<ExpenseFormDTO>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      amount: existing ? existing.amount.toString() : '',
      description: existing?.description ?? '',
      categoryId: existing?.categoryId ?? '',
      date: existing?.date ?? format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const onSubmit = form.handleSubmit((dto) => {
    const amount = parseFloat(dto.amount);
    if (existing) {
      updateExpense(existing.id, { amount, description: dto.description, categoryId: dto.categoryId, date: dto.date });
      router.back();
      showMessage({ message: 'Expense updated', type: 'success' });
    } else {
      addExpense({ amount, description: dto.description, categoryId: dto.categoryId, date: dto.date });
      router.back();
      showMessage({ message: 'Expense added', type: 'success' });
    }
  });

  return { form, onSubmit, isEditing: !!existing };
}
