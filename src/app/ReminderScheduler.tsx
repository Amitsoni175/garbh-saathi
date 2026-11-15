import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/toastContext';
import { useTodayReminders } from '@/features/schedule/useReminders';
import { getNow } from '@/lib/clock';
import { showNotification } from '@/lib/notify';
import { toLocalISO } from '@/lib/pregnancy';
import { dueBetween } from '@/lib/schedule';
import { useSettings } from './settings';

/**
 * Checks every 30 seconds while the app is open (or recently backgrounded) and
 * shows any reminder whose time has just passed: a toast if she is looking at
 * the app, a system notification if allowed and the app is in the background.
 */
export function ReminderScheduler() {
  const { settings } = useSettings();
  const toast = useToast();
  const { all, label } = useTodayReminders();
  const last = useRef<{ day: string; minute: number } | null>(null);
  const latest = useRef({ all, label, settings, toast });
  useEffect(() => {
    latest.current = { all, label, settings, toast };
  });

  useEffect(() => {
    const check = () => {
      const now = getNow();
      const day = toLocalISO(now);
      const minute = now.getHours() * 60 + now.getMinutes();
      const prev = last.current;
      last.current = { day, minute };
      // First check, or a new day: only remember where we are (no burst of old reminders).
      if (!prev || prev.day !== day) return;
      const { all: list, label: lbl, settings: s, toast: show } = latest.current;
      for (const r of dueBetween(list, prev.minute, minute)) {
        const text = lbl(r);
        if (document.visibilityState === 'visible') show({ message: text, duration: 8000 });
        else if (s.schedule.notifications)
          void showNotification('Garbh Saathi', text, `gs-${day}-${r.key}`);
      }
    };
    check();
    const id = window.setInterval(check, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
