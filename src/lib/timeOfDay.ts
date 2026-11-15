/** Pure helpers for anything that depends on the hour of the day. */

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night';

/** 05–11 morning, 12–16 afternoon, 17–19 evening, 20–04 night. */
export function dayPart(hour: number): DayPart {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

/** Auto night mode window: from 8 PM until 6 AM. */
export function isNightHour(hour: number): boolean {
  return hour >= 20 || hour < 6;
}

export type NightModeSetting = 'auto' | 'day' | 'night';

export function resolveNight(
  setting: NightModeSetting,
  hour: number,
  systemDark: boolean,
): boolean {
  if (setting === 'day') return false;
  if (setting === 'night') return true;
  return isNightHour(hour) || systemDark;
}
