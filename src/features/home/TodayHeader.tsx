import { useProfile } from '@/app/profile';
import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { ProgressRing } from '@/components/ui';
import type { PregnancyState } from '@/lib/pregnancy';
import { dayPart } from '@/lib/timeOfDay';

export function TodayHeader({ state }: { state: PregnancyState }) {
  const t = useT();
  const { profile } = useProfile();
  const now = useNow();
  const name = profile?.motherName || t('today.defaultName');
  return (
    <header className="flex items-center justify-between gap-4 px-5 pt-6 pb-2">
      <div className="min-w-0">
        <h1 className="text-2xl leading-snug font-bold">
          {t(`hello.${dayPart(now.getHours())}`, { name })}
        </h1>
        <p className="mt-1 text-lg font-semibold">
          {t('today.weekDay', { week: state.weeks, day: state.days })}
        </p>
        <p className="text-text-muted text-sm">{t('today.trimester', { tri: state.trimester })}</p>
      </div>
      <ProgressRing
        percent={state.percent}
        size={92}
        label={t('today.progressLabel', { percent: Math.round(state.percent) })}
      >
        <span className="text-lg leading-none font-bold">{state.daysToGo}</span>
        <span className="text-text-muted max-w-14 text-[0.65rem] leading-tight">
          {t('today.daysToGo', { days: '' }).trim()}
        </span>
      </ProgressRing>
    </header>
  );
}
