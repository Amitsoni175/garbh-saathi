/** Seasons in Haryana, chosen by calendar month (1–12). */
import type { SeasonKey } from './content';

export function seasonForMonth(month: number): SeasonKey {
  if (month === 5 || month === 6) return 'heat';
  if (month >= 7 && month <= 9) return 'monsoon';
  if (month === 12 || month === 1) return 'fog';
  if (month >= 2 && month <= 4) return 'spring';
  return 'autumn'; // October, November
}

/** April–June are hot enough to raise the water goal. */
export function isHotMonth(month: number): boolean {
  return month >= 4 && month <= 6;
}

export function waterGoal(month: number): number {
  return isHotMonth(month) ? 12 : 9;
}

/** Raga slot by hour: 04–10 morning, 11–16 afternoon, 17–20 evening, 21–03 night. */
export function ragaSlotForHour(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 4 && hour <= 10) return 'morning';
  if (hour >= 11 && hour <= 16) return 'afternoon';
  if (hour >= 17 && hour <= 20) return 'evening';
  return 'night';
}
