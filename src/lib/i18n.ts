/**
 * All UI text lives here as { en, hinglish }. Components never hard-code text.
 * Phase 0 skeleton: the language setting and Dexie persistence arrive in Phase 1.
 */
export type Lang = 'en' | 'hinglish';

export interface Translation {
  en: string;
  hinglish?: string;
}

export const strings = {
  'app.welcome': { en: 'Ram Ram ji 🙏', hinglish: 'Ram Ram ji 🙏' },
  'app.tagline': {
    en: 'A calm space for you and your baby',
    hinglish: 'Aapke aur baby ke liye ek shaant si jagah',
  },
  'placeholder.shlokaTitle': { en: 'Shloka of the day', hinglish: 'Aaj ka shloka' },
  'placeholder.shlokaMeaning': {
    en: 'May we be protected together, may we be nourished together.',
    hinglish: 'Hum saath mein surakshit rahein, saath mein poshit hon.',
  },
  'placeholder.colours': { en: 'Theme colours', hinglish: 'Theme ke rang' },
  'placeholder.begin': { en: 'Begin', hinglish: 'Shuru karein' },
  'placeholder.nightPreview': { en: 'Preview night mode', hinglish: 'Raat ka mode dekhein' },
  'placeholder.dayPreview': { en: 'Back to day mode', hinglish: 'Din ka mode' },
} satisfies Record<string, Translation>;

export type StringKey = keyof typeof strings;

let currentLang: Lang = 'en';

export function setLang(lang: Lang): void {
  currentLang = lang;
}

export function getLang(): Lang {
  return currentLang;
}

/** Look up a UI string. Missing Hinglish falls back to English (with a dev warning). */
export function t(key: StringKey, lang: Lang = currentLang): string {
  const entry: Translation = strings[key];
  if (lang === 'hinglish') {
    if (entry.hinglish) return entry.hinglish;
    if (import.meta.env.DEV) console.warn(`[i18n] Missing Hinglish for "${key}"`);
  }
  return entry.en;
}
