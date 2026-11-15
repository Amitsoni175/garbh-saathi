import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { Card } from '@/components/ui';
import { upcoming } from '@/lib/schedule';
import { useTodayReminders } from './useReminders';

/** "Coming up next" on the Today screen. */
export function UpNext({ index = 0 }: { index?: number }) {
  const t = useT();
  const now = useNow();
  const { all, label } = useTodayReminders();
  const next = upcoming(all, now);
  return (
    <Card index={index} ariaLabel={t('next.title')}>
      <h2 className="mb-2 font-bold">⏰ {t('next.title')}</h2>
      {next.length === 0 ? (
        <p className="text-text-muted">{t('next.none')}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {next.map((r) => (
            <li key={r.key} className="flex items-center gap-3">
              <span className="bg-secondary/60 text-on-fill w-14 shrink-0 rounded-full py-1 text-center text-sm font-bold">
                {r.time}
              </span>
              <span>{label(r)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
