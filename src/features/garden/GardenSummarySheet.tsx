import { useT } from '@/app/useT';
import { BottomSheet } from '@/components/ui';
import type { WeekSummary } from '@/lib/garden';

export function GardenSummarySheet({
  open,
  onClose,
  summary,
  count,
}: {
  open: boolean;
  onClose: () => void;
  summary: WeekSummary;
  count: number;
}) {
  const t = useT();
  return (
    <BottomSheet open={open} onClose={onClose} title={t('garden.title')} closeLabel={t('ui.close')}>
      <p className="text-lg font-semibold">
        {t('garden.weekSummary', {
          stories: summary.stories,
          games: summary.games,
          letters: summary.letters,
        })}
      </p>
      {summary.other > 0 && (
        <p className="text-text-muted mt-1">{t('garden.otherSummary', { other: summary.other })}</p>
      )}
      <p className="mt-3">{t('garden.subtitle', { count })}</p>
      <p className="text-text-muted mt-3 text-sm">{t('garden.neverShrinks')}</p>
    </BottomSheet>
  );
}
