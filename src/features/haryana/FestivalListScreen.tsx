import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { Card } from '@/components/ui';
import { tx } from '@/lib/content';
import { upcomingFestivals } from '@/lib/festivals';
import { parseLocalDate, toLocalISO } from '@/lib/pregnancy';

export default function FestivalListScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const list = upcomingFestivals(toLocalISO(useNow()));
  return (
    <>
      <ScreenHeader title={t('fest.list')} fallback="/me" />
      <div className="flex flex-col gap-3 px-4 pb-6">
        <p className="text-text-muted text-sm">{t('fest.listNote')}</p>
        {list.map((f, i) => {
          const d = parseLocalDate(f.date);
          return (
            <Card
              key={`${f.festival.id}-${f.date}`}
              index={Math.min(i, 6)}
              onClick={() => void navigate(`/festival/${f.festival.id}`)}
              ariaLabel={tx(f.festival.name, settings.textLang)}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {f.festival.emoji}
                </span>
                <div className="flex-1">
                  <p className="font-bold">{tx(f.festival.name, settings.textLang)}</p>
                  <p className="text-text-muted text-sm">
                    {d ? format(d, 'd MMMM yyyy') : f.date} ·{' '}
                    {f.daysAway === 0
                      ? t('fest.today')
                      : f.daysAway === 1
                        ? t('fest.tomorrow')
                        : t('fest.inDays', { days: f.daysAway })}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
