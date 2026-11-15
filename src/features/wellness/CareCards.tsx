import { addDays } from 'date-fns';
import { m } from 'motion/react';
import { useState } from 'react';
import { useCompleteOnce } from '@/app/useComplete';
import { useT } from '@/app/useT';
import { Button, Card, useToast } from '@/components/ui';
import { textareaClass } from '@/components/ui/styles';
import { chime } from '@/lib/feedback';
import { parseLocalDate, toLocalISO } from '@/lib/pregnancy';
import { isHotMonth } from '@/lib/season';
import { hasLowMoodStreak, MOODS, updateDaily, useDailyRange } from '@/lib/wellness';
import { useCare } from './useCare';

export function MoodCard({ index = 0 }: { index?: number }) {
  const t = useT();
  const toast = useToast();
  const completeOnce = useCompleteOnce();
  const care = useCare();
  const [note, setNote] = useState('');
  const from = toLocalISO(addDays(parseLocalDate(care.today) ?? new Date(), -6));
  const week = useDailyRange(from, care.today) ?? [];

  async function pick(value: number) {
    await updateDaily(care.today, { mood: value });
    const added = await completeOnce('mood', undefined, t('mood.saved'));
    if (!added) toast({ message: t('mood.saved') });
  }

  const strip = Array.from({ length: 7 }, (_, i) => {
    const date = toLocalISO(addDays(parseLocalDate(from) ?? new Date(), i));
    return { date, mood: week.find((d) => d.date === date)?.mood };
  });

  return (
    <Card index={index} ariaLabel={t('mood.title')}>
      <h2 className="mb-2 font-bold">{t('mood.title')}</h2>
      <div className="flex justify-between gap-1" role="radiogroup" aria-label={t('mood.title')}>
        {MOODS.map((mo) => (
          <m.button
            key={mo.value}
            type="button"
            role="radio"
            aria-checked={care.mood === mo.value}
            aria-label={t(`mood.${mo.value}` as 'mood.1')}
            onClick={() => void pick(mo.value)}
            whileTap={{ scale: 0.85 }}
            className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl transition-all ${care.mood === mo.value ? 'bg-primary shadow-soft scale-110' : 'bg-background'}`}
          >
            {mo.emoji}
          </m.button>
        ))}
      </div>
      {care.mood !== undefined && (
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            className={`${textareaClass} min-h-16`}
            value={note || care.moodNote || ''}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('mood.note')}
            aria-label={t('mood.note')}
          />
          <Button
            variant="ghost"
            onClick={() => {
              void updateDaily(care.today, { moodNote: note.trim() });
              toast({ message: t('mood.saved') });
            }}
            disabled={!note.trim()}
          >
            {t('mood.saveNote')}
          </Button>
        </div>
      )}
      <p className="mt-3 text-sm font-semibold">{t('mood.week')}</p>
      <div className="mt-1 flex justify-between" aria-hidden="true">
        {strip.map((d) => (
          <span key={d.date} className="text-text-muted flex flex-col items-center text-xs">
            <span className="text-xl">{MOODS.find((x) => x.value === d.mood)?.emoji ?? '·'}</span>
            {d.date.slice(8)}
          </span>
        ))}
      </div>
    </Card>
  );
}

export function LowMoodCard() {
  const t = useT();
  const care = useCare();
  const from = toLocalISO(addDays(parseLocalDate(care.today) ?? new Date(), -2));
  const rows = useDailyRange(from, care.today) ?? [];
  if (!hasLowMoodStreak(rows, care.today)) return null;
  return (
    <Card tone="secondary">
      <h2 className="text-lg font-bold">{t('mood.lowTitle')}</h2>
      <p className="mt-1">{t('mood.lowText')}</p>
      <a
        href="tel:14416"
        className="bg-surface text-text shadow-soft mt-3 inline-flex min-h-12 items-center rounded-full px-5 font-bold"
      >
        📞 {t('mood.callTeleManas')}
      </a>
    </Card>
  );
}

export function TabletCard({ index = 0 }: { index?: number }) {
  const t = useT();
  const completeOnce = useCompleteOnce();
  const care = useCare();
  return (
    <Card index={index} tone={care.tablet ? 'calm' : 'surface'} ariaLabel={t('tablet.title')}>
      <h2 className="font-bold">💊 {t('tablet.title')}</h2>
      <p className="mt-1 text-sm">{t('tablet.why')}</p>
      {care.tablet ? (
        <p className="mt-3 font-bold">{t('tablet.done')}</p>
      ) : (
        <Button
          className="mt-3"
          breathe
          onClick={() => void completeOnce('tablet', undefined, t('tablet.thanks'))}
        >
          {t('tablet.take')}
        </Button>
      )}
    </Card>
  );
}

export function WaterCard({ index = 0 }: { index?: number }) {
  const t = useT();
  const care = useCare();
  const max = Math.max(care.goal, care.water);
  async function set(n: number) {
    const next = Math.max(0, n);
    await updateDaily(care.today, { water: next });
    if (next > care.water) chime();
  }
  return (
    <Card index={index} ariaLabel={t('water.title')}>
      <div className="flex items-center justify-between">
        <h2 className="font-bold">💧 {t('water.title')}</h2>
        <span className="text-sm font-semibold" role="status">
          {t('water.count', { count: care.water, goal: care.goal })}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => (
          <m.span
            key={i}
            className={`text-2xl ${i < care.water ? '' : 'opacity-25 grayscale'}`}
            animate={i === care.water - 1 ? { scale: [0.6, 1.2, 1] } : {}}
          >
            🥛
          </m.span>
        ))}
      </div>
      {care.water >= care.goal && <p className="mt-2 font-semibold">{t('water.goalMet')}</p>}
      {isHotMonth(care.month) && (
        <p className="text-text-muted mt-2 text-sm">{t('water.summer')}</p>
      )}
      <div className="mt-3 flex gap-2">
        <Button onClick={() => void set(care.water + 1)} icon="➕">
          {t('water.add')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => void set(care.water - 1)}
          disabled={care.water === 0}
          aria-label={t('water.remove')}
        >
          ➖
        </Button>
      </div>
    </Card>
  );
}
