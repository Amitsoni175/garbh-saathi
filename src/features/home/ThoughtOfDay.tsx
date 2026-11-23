import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { useCompleteOnce } from '@/app/useComplete';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { BottomSheet, Button, Card } from '@/components/ui';
import { useFloatBurst } from '@/components/ui/FloatBurst';
import { speakOnce } from '@/lib/audio';
import { getTodayISO } from '@/lib/clock';
import { db, kvGet, kvSet } from '@/lib/db';
import { chime } from '@/lib/feedback';
import { THOUGHT_SEEN_KEY, shouldAutoOpen, thoughtForDay, type Thought } from '@/lib/thoughts';

/** The thought itself: source, original words, English + Hindi, and a line for baby. */
function ThoughtBody({ thought, today }: { thought: Thought; today: string }) {
  const t = useT();
  const completeOnce = useCompleteOnce();
  const { burst, layer } = useFloatBurst();
  const saidToday =
    useLiveQuery(
      () =>
        db.completions
          .where('date')
          .equals(today)
          .filter((c) => c.kind === 'thought')
          .count(),
      [today],
    ) ?? 0;

  return (
    <div className="relative flex flex-col gap-3">
      {layer}
      <p className="text-text-muted text-sm font-semibold">
        {thought.emoji} {thought.source.en} · <span lang="hi">{thought.source.hi}</span>
      </p>
      {thought.original && (
        <p lang="sa" className="text-center text-lg font-semibold italic">
          “{thought.original}”
        </p>
      )}
      <p className="text-xl leading-snug font-bold">{thought.text.en}</p>
      <p lang="hi" className="text-xl leading-snug font-bold">
        {thought.text.hi}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() =>
            void speakOnce(`${thought.text.hi} ${thought.say.hi}`, 'hi', t('thought.title'))
          }
        >
          🔊 हिंदी
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            void speakOnce(`${thought.text.en} ${thought.say.en}`, 'en', t('thought.title'))
          }
        >
          🔊 English
        </Button>
      </div>

      <div className="rounded-soft bg-primary/40 p-4">
        <p className="text-sm font-semibold">💛 {t('thought.recite')}</p>
        <p className="mt-2 font-semibold">{thought.say.en}</p>
        <p lang="hi" className="mt-1 font-semibold">
          {thought.say.hi}
        </p>
        <Button
          variant={saidToday > 0 ? 'primary' : 'secondary'}
          className="mt-3"
          onClick={() => {
            burst(['💛', '🌸', '✨'], 7);
            if (saidToday === 0) chime();
            void completeOnce('thought', thought.id, t('thought.done'));
          }}
        >
          {saidToday > 0 ? `💛 ${t('thought.said')}` : t('thought.iSaid')}
        </Button>
      </div>
    </div>
  );
}

/**
 * Today's thought: a card on the Today screen, and a sheet that opens by
 * itself the first time she opens the app each day.
 */
export function ThoughtOfDay({ index = 0 }: { index?: number }) {
  const t = useT();
  const { offset } = useTodayPlan();
  const today = getTodayISO();
  const thought = thoughtForDay(offset);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void kvGet<string | null>(THOUGHT_SEEN_KEY, null).then((seen) => {
      if (cancelled || !shouldAutoOpen(seen, today)) return;
      setOpen(true);
      void kvSet(THOUGHT_SEEN_KEY, today);
    });
    return () => {
      cancelled = true;
    };
  }, [today]);

  if (!thought) return null;

  return (
    <>
      <Card
        index={index}
        tone="accent"
        onClick={() => setOpen(true)}
        ariaLabel={t('thought.title')}
      >
        <p className="text-sm font-semibold">
          ☀️ {t('thought.title')} · <span lang="hi">आज का विचार</span>
        </p>
        <p className="mt-1 line-clamp-3 font-bold">{thought.text.en}</p>
        <p lang="hi" className="mt-1 line-clamp-3 font-semibold">
          {thought.text.hi}
        </p>
        <p className="text-text-muted mt-1 text-xs">
          {thought.emoji} {thought.source.en} · {t('thought.tapToRecite')}
        </p>
      </Card>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={`☀️ ${t('thought.title')} · आज का विचार`}
        closeLabel={t('ui.close')}
      >
        <ThoughtBody thought={thought} today={today} />
        <Button className="mt-4 w-full" onClick={() => setOpen(false)}>
          {t('thought.start')}
        </Button>
      </BottomSheet>
    </>
  );
}
