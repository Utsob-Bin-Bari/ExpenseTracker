export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export interface MonthInfo {
  key: string; // 'YYYY-MM'
  year: number;
  monthIdx: number; // 0-11
  shortLabel: string; // e.g. 'Jun'
}

/** Format a date as a 'YYYY-MM' month key. */
export function toMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** First day (noon, to avoid tz edge) of a 'YYYY-MM' month key. */
export function startOfMonthKey(key: string): Date {
  const parts = key.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, 1, 12);
}

/**
 * Returns the trailing `count` months ending at `now` (inclusive), oldest -> newest.
 * Crosses year boundaries cleanly (e.g. Jul 2025 ... Jun 2026).
 */
export function trailingMonths(now: Date, count = 12): MonthInfo[] {
  const out: MonthInfo[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: toMonthKey(d),
      year: d.getFullYear(),
      monthIdx: d.getMonth(),
      shortLabel: MONTH_NAMES[d.getMonth()]!,
    });
  }
  return out;
}
