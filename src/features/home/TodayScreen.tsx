import { format } from 'date-fns';
import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { EmptyState, PageHeader } from '@/components/ui';
import { dayPart } from '@/lib/timeOfDay';

/** Phase 1 placeholder. The real "Today's Journey" arrives in Phase 2. */
export default function TodayScreen() {
  const t = useT();
  const now = useNow();
  return (
    <>
      <PageHeader
        title={t(`greeting.${dayPart(now.getHours())}`)}
        subtitle={format(now, 'EEEE, d MMMM')}
      />
      <EmptyState emoji="🌱" title={t('today.comingTitle')} text={t('today.comingText')} />
    </>
  );
}
