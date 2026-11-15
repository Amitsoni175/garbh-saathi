import { createContext, useContext } from 'react';
import type { Lang } from '@/lib/i18n';
import { DEFAULT_SCHEDULE, normaliseSchedule, type ScheduleSettings } from '@/lib/schedule';
import type { NightModeSetting } from '@/lib/timeOfDay';

export type AudioLang = 'hi' | 'en';
export type TextSize = 'normal' | 'large' | 'xl';

export interface Settings {
  textLang: Lang;
  audioLang: AudioLang;
  nightMode: NightModeSetting;
  textSize: TextSize;
  sounds: boolean;
  vibration: boolean;
  /** Show a relaxed count-up timer in games (off by default: no pressure). */
  relaxedTimer: boolean;
  schedule: ScheduleSettings;
}

export const DEFAULT_SETTINGS: Settings = {
  textLang: 'hinglish',
  audioLang: 'hi',
  nightMode: 'auto',
  textSize: 'normal',
  sounds: true,
  vibration: true,
  relaxedTimer: false,
  schedule: DEFAULT_SCHEDULE,
};

/** Merge stored settings over defaults, ignoring unknown or wrongly-typed values. */
export function normaliseSettings(stored: unknown): Settings {
  const out: Settings = { ...DEFAULT_SETTINGS };
  if (!stored || typeof stored !== 'object') return out;
  const s = stored as Record<string, unknown>;
  if (s.textLang === 'en' || s.textLang === 'hinglish') out.textLang = s.textLang;
  if (s.audioLang === 'hi' || s.audioLang === 'en') out.audioLang = s.audioLang;
  if (s.nightMode === 'auto' || s.nightMode === 'day' || s.nightMode === 'night') {
    out.nightMode = s.nightMode;
  }
  if (s.textSize === 'normal' || s.textSize === 'large' || s.textSize === 'xl') {
    out.textSize = s.textSize;
  }
  if (typeof s.sounds === 'boolean') out.sounds = s.sounds;
  if (typeof s.vibration === 'boolean') out.vibration = s.vibration;
  if (typeof s.relaxedTimer === 'boolean') out.relaxedTimer = s.relaxedTimer;
  out.schedule = normaliseSchedule(s.schedule);
  return out;
}

export interface SettingsContextValue {
  settings: Settings;
  /** True once stored settings have been read from the DB. */
  ready: boolean;
  isNight: boolean;
  update: (patch: Partial<Settings>) => void;
}

export const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  ready: false,
  isNight: false,
  update: () => undefined,
});

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
