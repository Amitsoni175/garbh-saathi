/**
 * All UI text lives in src/lib/strings/*.ts as { en, hinglish }, merged here.
 * Components never hard-code text.
 * Use `useT()` (src/app/useT.ts) inside components so text updates when the
 * language setting changes. `{name}`-style placeholders are filled by `vars`.
 */
import { appStrings } from './strings/app';
import { bondingStrings } from './strings/bonding';
import { calendarStrings } from './strings/calendar';
import { coreStrings } from './strings/core';
import { gameStrings } from './strings/games';
import { haryanaStrings } from './strings/haryana';
import { musicStrings } from './strings/music';
import { storyStrings } from './strings/stories';
import { todayStrings } from './strings/today';
import { wellnessStrings } from './strings/wellness';

export type Lang = 'en' | 'hinglish';

export interface Translation {
  en: string;
  hinglish?: string;
}

export const strings = {
  ...coreStrings,
  ...todayStrings,
  ...storyStrings,
  ...gameStrings,
  ...musicStrings,
  ...calendarStrings,
  ...bondingStrings,
  ...wellnessStrings,
  ...haryanaStrings,
  ...appStrings,
};

export type StringKey = keyof typeof strings;
export type Vars = Record<string, string | number>;

function fill(text: string, vars?: Vars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

const warned = new Set<string>();

/** Look up a UI string. Missing Hinglish falls back to English (with a dev warning). */
export function t(key: StringKey, lang: Lang = 'en', vars?: Vars): string {
  const entry: Translation | undefined = strings[key];
  if (!entry) return key;
  if (lang === 'hinglish') {
    if (entry.hinglish) return fill(entry.hinglish, vars);
    if (import.meta.env.DEV && !key.startsWith('debug.') && !warned.has(key)) {
      warned.add(key);
      console.warn(`[i18n] Missing Hinglish for "${key}"`);
    }
  }
  return fill(entry.en, vars);
}
