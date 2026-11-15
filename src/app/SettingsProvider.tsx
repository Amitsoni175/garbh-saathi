import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { kvGet, kvSet } from '@/lib/db';
import { setFeedbackPrefs } from '@/lib/feedback';
import { logError } from '@/lib/logger';
import { resolveNight } from '@/lib/timeOfDay';
import { DEFAULT_SETTINGS, normaliseSettings, SettingsContext, type Settings } from './settings';
import { useNow } from './useClock';

const SETTINGS_KEY = 'settings';
const THEME_COLOURS = { day: '#FFF8F3', night: '#2B2840' };

function useSystemDark(): boolean {
  const [dark, setDark] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return Boolean(dark);
}

/** Loads settings from the DB, saves changes, and applies theme / text size to <html>. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const systemDark = useSystemDark();
  const hour = useNow().getHours();
  const isNight = resolveNight(settings.nightMode, hour, systemDark);

  useEffect(() => {
    let cancelled = false;
    kvGet<unknown>(SETTINGS_KEY, null)
      .then((stored) => {
        if (!cancelled) setSettings(normaliseSettings(stored));
      })
      .catch((err: unknown) => void logError(err))
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void kvSet(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = isNight ? 'night' : 'day';
    root.dataset.textSize = settings.textSize;
    root.lang = settings.textLang === 'en' ? 'en' : 'hi-Latn';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isNight ? THEME_COLOURS.night : THEME_COLOURS.day);
  }, [isNight, settings.textSize, settings.textLang]);

  useEffect(() => {
    setFeedbackPrefs({ sounds: settings.sounds, vibration: settings.vibration });
  }, [settings.sounds, settings.vibration]);

  const value = useMemo(
    () => ({ settings, ready, isNight, update }),
    [settings, ready, isNight, update],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
