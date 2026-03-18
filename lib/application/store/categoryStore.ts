import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category } from '@/lib/types';
import { Colors } from '@/lib/presentation/styles/colors.style';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) => void;
  deleteCategory: (id: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: Colors.categoryColors[3]!, icon: 'restaurant', budget: 500, createdAt: new Date().toISOString() },
  { id: '2', name: 'Transport', color: Colors.categoryColors[5]!, icon: 'car', budget: 200, createdAt: new Date().toISOString() },
  { id: '3', name: 'Shopping', color: Colors.categoryColors[7]!, icon: 'shopping-bag', budget: 300, createdAt: new Date().toISOString() },
  { id: '4', name: 'Entertainment', color: Colors.categoryColors[8]!, icon: 'music', budget: 150, createdAt: new Date().toISOString() },
  { id: '5', name: 'Health', color: Colors.categoryColors[1]!, icon: 'medicine', budget: 100, createdAt: new Date().toISOString() },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              ...category,
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'categories-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
