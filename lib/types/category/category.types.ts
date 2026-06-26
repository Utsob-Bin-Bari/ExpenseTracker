export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  budget: number; // legacy baseline; still collected by the form to seed the creation month
  monthlyBudgets?: Record<string, number>; // 'YYYY-MM' -> budget for that month (per-month, no inheritance)
  createdAt: string;
}

export interface CategoryWithSpent extends Category {
  spent: number;
  percentage: number;
}
