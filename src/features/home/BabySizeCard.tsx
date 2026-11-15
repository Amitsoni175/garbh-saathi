import { m } from 'motion/react';
import { useSettings } from '@/app/settings';
import { useT } from '@/app/useT';
import { Card } from '@/components/ui';
import { babySizeForWeek, tx } from '@/lib/content';

export function BabySizeCard({ week, index = 0 }: { week: number; index?: number }) {
  const t = useT();
  const { settings } = useSettings();
  const size = babySizeForWeek(week);
  if (!size) return null;
  const lang = settings.textLang;
  const weight =
    size.weightG < 1
      ? t('size.lessThanGram')
      : size.weightG < 1000
        ? t('size.grams', { g: size.weightG })
        : t('size.kg', { kg: (size.weightG / 1000).toFixed(1) });
  return (
    <Card index={index} tone="accent" ariaLabel={t('size.title')}>
      <div className="flex items-center gap-4">
        <m.span
          className="text-6xl"
          aria-hidden="true"
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {size.emoji}
        </m.span>
        <div className="min-w-0">
          <p className="text-sm">{t('size.title')}</p>
          <p className="text-xl font-bold first-letter:uppercase">{tx(size.name, lang)}</p>
          <p className="text-sm">{t('size.measure', { cm: size.lengthCm, weight })}</p>
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-1">
        {size.development.map((d) => (
          <li key={d.en}>🌱 {tx(d, lang)}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs">{t('size.approx')}</p>
    </Card>
  );
}
