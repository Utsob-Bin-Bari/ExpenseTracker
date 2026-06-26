import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category } from '@/lib/types';
import { Colors } from '@/lib/presentation/styles/colors.style';
import { startOfMonthKey, toMonthKey } from '@/lib/infrastructure/utils/date';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>, createdAtMonthKey?: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) => void;
  setMonthlyBudget: (id: string, monthKey: string, amount: number) => void;
  removeMonthlyBudget: (id: string, monthKey: string) => void;
  deleteCategory: (id: string) => void;
}

const SEED_MONTH = toMonthKey(new Date());

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: Colors.categoryColors[3]!, icon: 'restaurant', budget: 500, monthlyBudgets: { [SEED_MONTH]: 500 }, createdAt: new Date().toISOString() },
  { id: '2', name: 'Transport', color: Colors.categoryColors[5]!, icon: 'car', budget: 200, monthlyBudgets: { [SEED_MONTH]: 200 }, createdAt: new Date().toISOString() },
  { id: '3', name: 'Shopping', color: Colors.categoryColors[7]!, icon: 'shopping-bag', budget: 300, monthlyBudgets: { [SEED_MONTH]: 300 }, createdAt: new Date().toISOString() },
  { id: '4', name: 'Entertainment', color: Colors.categoryColors[8]!, icon: 'music', budget: 150, monthlyBudgets: { [SEED_MONTH]: 150 }, createdAt: new Date().toISOString() },
  { id: '5', name: 'Health', color: Colors.categoryColors[1]!, icon: 'medicine', budget: 100, monthlyBudgets: { [SEED_MONTH]: 100 }, createdAt: new Date().toISOString() },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      addCategory: (category, createdAtMonthKey) =>
        set((state) => {
          const monthKey = createdAtMonthKey ?? toMonthKey(new Date());
          return {
            categories: [
              ...state.categories,
              {
                ...category,
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                // Per-month clean slate: the entered budget applies to the creation month only.
                monthlyBudgets: { [monthKey]: category.budget },
                createdAt: startOfMonthKey(monthKey).toISOString(),
              },
            ],
          };
        }),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      setMonthlyBudget: (id, monthKey, amount) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id
              ? { ...c, monthlyBudgets: { ...c.monthlyBudgets, [monthKey]: amount } }
              : c
          ),
        })),
      removeMonthlyBudget: (id, monthKey) =>
        set((state) => ({
          categories: state.categories.map((c) => {
            if (c.id !== id || !c.monthlyBudgets) return c;
            const { [monthKey]: _removed, ...rest } = c.monthlyBudgets;
            return { ...c, monthlyBudgets: rest };
          }),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'categories-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // Existing data predates per-month budgets: seed the current month from the
      // legacy baseline so categories don't vanish when inheritance is removed.
      migrate: (persisted: any, version) => {
        if (version < 1 && persisted?.categories) {
          const seedMonth = toMonthKey(new Date());
          persisted.categories = persisted.categories.map((c: Category) =>
            c.monthlyBudgets && Object.keys(c.monthlyBudgets).length > 0
              ? c
              : { ...c, monthlyBudgets: { [seedMonth]: c.budget ?? 0 } }
          );
        }
        return persisted;
      },
    }
  )
);
