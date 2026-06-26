import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Expense } from '@/lib/types';
import { trailingMonths } from '@/lib/infrastructure/utils/date';

interface ExpenseState {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void;
  deleteExpense: (id: string) => void;
  purgeOldExpenses: () => void;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      expenses: [],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            {
              ...expense,
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              createdAt: new Date().toISOString(),
            },
            ...state.expenses,
          ],
        })),
      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      purgeOldExpenses: () =>
        set((state) => {
          // Keep only expenses within the trailing 12-month window.
          const oldest = trailingMonths(new Date())[0]!;
          const cutoff = new Date(oldest.year, oldest.monthIdx, 1);
          return {
            expenses: state.expenses.filter((e) => new Date(e.date) >= cutoff),
          };
        }),
    }),
    {
      name: 'expenses-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
