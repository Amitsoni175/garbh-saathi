import { useT } from '@/app/useT';
import { EmptyState, PageHeader } from '@/components/ui';

export default function CalendarScreen() {
  const t = useT();
  return (
    <>
      <PageHeader title={t('tab.calendar')} />
      <EmptyState emoji="📅" title={t('calendar.comingTitle')} text={t('calendar.comingText')} />
    </>
  );
}
