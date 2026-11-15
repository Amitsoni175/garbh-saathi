import { useState } from 'react';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useT } from '@/app/useT';
import { Card } from '@/components/ui';
import { GardenSummarySheet } from './GardenSummarySheet';
import { GardenView } from './GardenView';
import { useGarden } from './useGarden';

export default function GardenScreen() {
  const t = useT();
  const g = useGarden();
  const [open, setOpen] = useState(false);
  return (
    <>
      <ScreenHeader title={t('garden.title')} subtitle={t('garden.subtitle', { count: g.count })} />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <button type="button" onClick={() => setOpen(true)} className="block w-full text-left">
          <GardenView
            stage={g.stage}
            completions={g.completions}
            milestones={g.milestones}
            festivalTreasures={g.festivalTreasures}
            tall
          />
        </button>
        <p className="text-center font-semibold">{t(`garden.stage.${g.stage}`)}</p>
        {g.count === 0 && <p className="text-text-muted text-center">{t('garden.empty')}</p>}
        <Card>
          <p className="font-semibold">
            {t('garden.weekSummary', {
              stories: g.weekSummary.stories,
              games: g.weekSummary.games,
              letters: g.weekSummary.letters,
            })}
          </p>
          {g.weekSummary.other > 0 && (
            <p className="text-text-muted text-sm">
              {t('garden.otherSummary', { other: g.weekSummary.other })}
            </p>
          )}
        </Card>
        {g.milestones.length > 0 && (
          <Card>
            <h2 className="mb-2 font-semibold">{t('garden.milestones')}</h2>
            <p className="text-3xl tracking-widest" aria-hidden="true">
              {g.milestones.map((m) => m.emoji).join(' ')}
            </p>
          </Card>
        )}
        {g.festivalTreasures.length > 0 && (
          <Card>
            <h2 className="mb-2 font-semibold">{t('garden.festivals')}</h2>
            <p className="text-3xl tracking-widest" aria-hidden="true">
              {g.festivalTreasures.map((f) => f.emoji).join(' ')}
            </p>
          </Card>
        )}
        <p className="text-text-muted text-center text-sm">{t('garden.neverShrinks')}</p>
      </div>
      <GardenSummarySheet
        open={open}
        onClose={() => setOpen(false)}
        summary={g.weekSummary}
        count={g.count}
      />
    </>
  );
}
