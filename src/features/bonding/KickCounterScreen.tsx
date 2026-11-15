import { useLiveQuery } from 'dexie-react-hooks';
import { m } from 'motion/react';
import { useEffect, useState } from 'react';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useComplete } from '@/app/useComplete';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { Button, Card, ProgressRing, useToast } from '@/components/ui';
import { getTodayISO } from '@/lib/clock';
import { db } from '@/lib/db';
import { vibrate } from '@/lib/feedback';
import { logError } from '@/lib/logger';
import { KICKS_FROM_WEEK } from '@/lib/schedule';
import { KickChart } from './KickChart';

const GOAL = 10;

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export default function KickCounterScreen() {
  const t = useT();
  const toast = useToast();
  const complete = useComplete();
  const state = usePregnancy();
  const [count, setCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const sessions = useLiveQuery(() => db.kicks.orderBy('id').toArray(), []) ?? [];

  useEffect(() => {
    if (startedAt === null) return;
    const id = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [startedAt]);

  async function save(finalCount: number, start: number) {
    const seconds = Math.max(1, Math.floor((Date.now() - start) / 1000));
    try {
      await db.kicks.add({ date: getTodayISO(), startedAt: start, seconds, count: finalCount });
      const min = Math.max(1, Math.round(seconds / 60));
      if (finalCount >= GOAL) await complete('kicks', undefined, t('kick.done', { min }));
      else toast({ message: t('kick.saved', { count: finalCount, min }) });
    } catch (err) {
      void logError(err);
    }
    setCount(0);
    setStartedAt(null);
    setElapsed(0);
  }

  function tap() {
    const start = startedAt ?? Date.now();
    if (startedAt === null) setStartedAt(start);
    const next = count + 1;
    setCount(next);
    vibrate(20);
    if (next >= GOAL) void save(next, start);
  }

  return (
    <>
      <ScreenHeader title={t('kick.title')} fallback="/me" />
      <div className="flex flex-col items-center gap-4 px-4 pb-6">
        {state && state.weeks < KICKS_FROM_WEEK && (
          <p className="rounded-soft bg-secondary/40 p-3 text-sm">{t('kick.early')}</p>
        )}
        <p className="text-text-muted text-sm">{t('kick.howTo')}</p>
        <m.button
          type="button"
          onClick={tap}
          whileTap={{ scale: 0.92 }}
          aria-label={t('kick.tapLabel', { count })}
          className="rounded-full"
        >
          <ProgressRing
            percent={(count / GOAL) * 100}
            size={220}
            stroke={12}
            label={t('kick.of', { count })}
            colour="calm"
          >
            <span className="animate-breathe bg-primary text-on-fill flex h-40 w-40 flex-col items-center justify-center rounded-full">
              <span className="text-5xl" aria-hidden="true">
                👣
              </span>
              <span className="text-2xl font-bold">{t('kick.of', { count })}</span>
            </span>
          </ProgressRing>
        </m.button>
        <p role="status" className="text-text-muted">
          {startedAt ? t('kick.elapsed', { time: fmt(elapsed) }) : t('kick.tap')}
        </p>
        {count > 0 && startedAt !== null && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => void save(count, startedAt)}>
              {t('kick.saveNow')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setCount(0);
                setStartedAt(null);
                setElapsed(0);
              }}
            >
              {t('kick.reset')}
            </Button>
          </div>
        )}
        <Card className="w-full">
          <KickChart sessions={sessions} />
        </Card>
        <p className="rounded-soft bg-accent/70 text-on-fill p-4" role="note">
          💛 {t('kick.safety')}
        </p>
      </div>
    </>
  );
}
