import type { Category } from '@/lib/types';

/**
 * The budget for a category in a given month ('YYYY-MM').
 * Per-month clean slate: only the explicit override for that month counts —
 * no carry-forward from prior months, no baseline fallback. Unset months are 0.
 */
export function resolveMonthlyBudget(category: Category, monthKey: string): number {
  return category.monthlyBudgets?.[monthKey] ?? 0;
}
