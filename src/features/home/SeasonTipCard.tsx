import { useSettings } from '@/app/settings';
import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { Card } from '@/components/ui';
import { getTips, tx } from '@/lib/content';
import { rotate } from '@/lib/plan';
import { seasonForMonth } from '@/lib/season';

export function SeasonTipCard({ dayNumber, index = 0 }: { dayNumber: number; index?: number }) {
  const t = useT();
  const { settings } = useSettings();
  const now = useNow();
  const season = getTips().seasonal[seasonForMonth(now.getMonth() + 1)];
  const tip = rotate(season.tips, dayNumber);
  if (!tip) return null;
  return (
    <Card index={index} tone="calm" ariaLabel={t('tip.ofTheDay')}>
      <p className="text-sm font-semibold">
        {tx(season.title, settings.textLang)} · {t('tip.ofTheDay')}
      </p>
      <p className="mt-1">{tx(tip, settings.textLang)}</p>
      <p className="mt-2 text-xs">{t('tip.checkDoctor')}</p>
    </Card>
  );
}
