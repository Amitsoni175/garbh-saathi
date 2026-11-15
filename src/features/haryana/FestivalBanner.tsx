import { m } from 'motion/react';
import { useNavigate } from 'react-router';
import { useSettings } from '@/app/settings';
import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { Button } from '@/components/ui';
import { tx } from '@/lib/content';
import { festivalsAround } from '@/lib/festivals';
import { toLocalISO } from '@/lib/pregnancy';

/** Festival today or within 3 days: banner with its little activity. */
export function FestivalBanner() {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const list = festivalsAround(toLocalISO(useNow()));
  if (list.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      {list.map(({ festival, daysAway, date }) => (
        <m.section
          key={`${festival.id}-${date}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-softer text-on-fill shadow-soft p-4"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
          }}
          aria-label={tx(festival.name, lang)}
        >
          <p className="text-sm font-semibold">
            {daysAway === 0
              ? t('fest.today')
              : daysAway === 1
                ? t('fest.tomorrow')
                : t('fest.inDays', { days: daysAway })}
          </p>
          <h2 className="text-xl font-bold">
            <span aria-hidden="true">{festival.emoji}</span> {tx(festival.name, lang)}
          </h2>
          <p className="mt-1 text-sm">{tx(festival.blurb, lang)}</p>
          {festival.caution && (
            <p className="rounded-soft bg-surface/70 text-text mt-2 p-2 text-sm">
              💛 {tx(festival.caution, lang)}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void navigate(festival.activity.to)}>
              {tx(festival.activity.label, lang)}
            </Button>
            <Button variant="ghost" onClick={() => void navigate(`/festival/${festival.id}`)}>
              {t('fest.open')} →
            </Button>
          </div>
        </m.section>
      ))}
    </div>
  );
}
