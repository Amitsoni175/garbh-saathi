import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSettings } from '@/app/settings';
import { usePregnancy } from '@/app/usePregnancy';
import { useRagaNow, shlokaById, useTodayPlan } from '@/app/useTodayPlan';
import { useStories } from '@/app/useStories';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import { GardenSummarySheet } from '@/features/garden/GardenSummarySheet';
import { GardenView } from '@/features/garden/GardenView';
import { useGarden } from '@/features/garden/useGarden';
import { FestivalBanner } from '@/features/haryana/FestivalBanner';
import { UpNext } from '@/features/schedule/UpNext';
import { BackupReminder } from '@/features/settings/BackupReminder';
import { CareRow } from '@/features/wellness/CareRow';
import { LowMoodCard } from '@/features/wellness/CareCards';
import { useCompletionsOn } from '@/lib/activity';
import { getNow, getTodayISO } from '@/lib/clock';
import { getPrompts, tx } from '@/lib/content';
import { BabySizeCard } from './BabySizeCard';
import { JourneyPath, type Stone } from './JourneyPath';
import { PullToRefresh } from './PullToRefresh';
import { SeasonTipCard } from './SeasonTipCard';
import { StageCard } from './StageCard';
import { TodayHeader } from './TodayHeader';

const JOURNEY_KINDS = ['shloka', 'story', 'game', 'raga', 'talk'] as const;

export default function TodayScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const state = usePregnancy();
  const { plan, dayNumber } = useTodayPlan();
  const stories = useStories();
  const raga = useRagaNow(dayNumber, plan?.ragaSlot ?? null);
  const today = getTodayISO();
  const doneRows = useCompletionsOn(today);
  const garden = useGarden();
  const [gardenOpen, setGardenOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!state || !plan) return null;

  const done = new Set((doneRows ?? []).map((r) => r.kind as string));
  const story = stories?.find((s) => s.id === plan.storyId);
  const shloka = shlokaById(plan.shlokaId);
  const prompt = getPrompts().talk.find((p) => p.id === plan.promptId);

  const stones: Stone[] = [
    {
      kind: 'shloka',
      emoji: '🌅',
      title: shloka ? tx(shloka.title, lang) : '',
      to: `/shloka/${plan.shlokaId ?? ''}`,
    },
    {
      kind: 'story',
      emoji: '📖',
      title: story ? tx(story.title, lang) : '…',
      to: `/stories/${plan.storyId ?? ''}`,
    },
    {
      kind: 'game',
      emoji: '🎮',
      title: t(`game.${plan.gameType}.name`),
      to: `/play/${plan.gameType}?daily=1`,
    },
    {
      kind: 'raga',
      emoji: '🎵',
      title: raga ? tx(raga.name, lang) : '',
      to: `/music/raga${raga ? `/${raga.id}` : ''}`,
    },
    { kind: 'talk', emoji: '💌', title: prompt ? tx(prompt.text, lang) : '', to: '/talk' },
  ];
  const allDone = JOURNEY_KINDS.every((k) => done.has(k));

  return (
    <PullToRefresh onRefresh={() => setRefreshKey((k) => k + 1)}>
      <div key={refreshKey} className="flex flex-col gap-4 pb-6">
        <TodayHeader state={state} />
        <div className="flex flex-col gap-4 px-4">
          <StageCard state={state} />
          <FestivalBanner />
          <BackupReminder nowMs={getNow().getTime()} />
          <LowMoodCard />
          <CareRow />

          <section
            aria-labelledby="journey-title"
            className="rounded-softer bg-surface shadow-soft p-4"
          >
            <h2 id="journey-title" className="text-xl font-bold">
              {t('journey.title')}
            </h2>
            <p className="text-text-muted mb-2 text-sm">{t('journey.subtitle')}</p>
            <JourneyPath stones={stones} done={done} />
          </section>

          {allDone && (
            <Card tone="primary">
              <h2 className="text-lg font-bold">{t('journey.allDoneTitle')}</h2>
              <p className="mt-1">{t('journey.allDoneText')}</p>
            </Card>
          )}

          <UpNext index={1} />
          <BabySizeCard week={state.contentWeek} index={1} />
          <SeasonTipCard dayNumber={dayNumber} index={2} />

          <section
            aria-label={t('garden.title')}
            className="rounded-softer bg-surface shadow-soft p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold">{t('garden.title')}</h2>
                <p className="text-text-muted text-sm">
                  {t('garden.subtitle', { count: garden.count })}
                </p>
              </div>
              <Button variant="secondary" onClick={() => void navigate('/garden')}>
                {t('garden.open')}
              </Button>
            </div>
            <button
              type="button"
              className="block w-full"
              onClick={() => setGardenOpen(true)}
              aria-label={t('garden.title')}
            >
              <GardenView
                stage={garden.stage}
                completions={garden.completions}
                milestones={garden.milestones}
                festivalTreasures={garden.festivalTreasures}
              />
            </button>
          </section>
        </div>
      </div>
      <GardenSummarySheet
        open={gardenOpen}
        onClose={() => setGardenOpen(false)}
        summary={garden.weekSummary}
        count={garden.count}
      />
    </PullToRefresh>
  );
}
