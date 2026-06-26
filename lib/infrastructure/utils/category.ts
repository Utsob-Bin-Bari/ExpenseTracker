import type { Category } from '@/lib/types';

/**
 * Whether a category should be shown for a given month ('YYYY-MM').
 * Per-month clean slate: visible only when it has a budget set for that month
 * OR has activity (expenses) that month.
 */
export function isCategoryVisibleInMonth(
  c: Category,
  monthKey: string,
  hasActivity: boolean
): boolean {
  return c.monthlyBudgets?.[monthKey] != null || hasActivity;
}

/**
 * Identity key for treating categories as "the same" — same name (trimmed,
 * case-insensitive) and same color. Used to merge duplicate per-month records
 * in yearly aggregations.
 */
export function categoryMergeKey(name: string, color: string): string {
  return `${name.trim().toLowerCase()}|${color.toLowerCase()}`;
}
