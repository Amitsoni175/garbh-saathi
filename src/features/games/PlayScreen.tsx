import { useNavigate } from 'react-router';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Card, PageHeader } from '@/components/ui';
import { useAllCompletions } from '@/lib/activity';
import { GAMES } from './registry';

export default function PlayScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { plan } = useTodayPlan();
  const completions = useAllCompletions();
  const daily = GAMES.find((g) => g.id === plan?.gameType) ?? GAMES[0];
  const played = (id: string) =>
    (completions ?? []).filter((c) => c.kind === 'game' && c.refId === id).length;

  return (
    <>
      <PageHeader title={t('play.title')} subtitle={t('play.subtitle')} />
      <div className="flex flex-col gap-4 px-4 pb-6">
        {daily && (
          <Card
            tone="primary"
            onClick={() => void navigate(`/play/${daily.id}?daily=1`)}
            ariaLabel={`${t('play.gameOfDay')}: ${t(`game.${daily.id}.name`)}`}
          >
            <p className="text-sm font-semibold">✨ {t('play.gameOfDay')}</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="animate-breathe text-5xl" aria-hidden="true">
                {daily.emoji}
              </span>
              <div>
                <p className="text-xl font-bold">{t(`game.${daily.id}.name`)}</p>
                <p className="text-sm">{t(`game.${daily.id}.blurb`)}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Card
            index={1}
            tone="secondary"
            onClick={() => void navigate('/music')}
            ariaLabel={t('play.musicCorner')}
          >
            <span className="text-3xl" aria-hidden="true">
              🎵
            </span>
            <p className="mt-1 font-bold">{t('play.musicCorner')}</p>
            <p className="text-xs">{t('play.musicText')}</p>
          </Card>
          <Card
            index={2}
            tone="calm"
            onClick={() => void navigate('/stories')}
            ariaLabel={t('stories.title')}
          >
            <span className="text-3xl" aria-hidden="true">
              📚
            </span>
            <p className="mt-1 font-bold">{t('stories.title')}</p>
            <p className="text-xs">{t('play.storiesText')}</p>
          </Card>
        </div>

        <h2 className="mt-2 text-lg font-bold">{t('play.allGames')}</h2>
        <ul className="grid grid-cols-2 gap-3">
          {GAMES.map((g, i) => (
            <li key={g.id}>
              <Card
                index={i}
                onClick={() => void navigate(`/play/${g.id}`)}
                ariaLabel={t(`game.${g.id}.name`)}
                className="h-full"
              >
                <span className="text-3xl" aria-hidden="true">
                  {g.emoji}
                </span>
                <p className="mt-1 leading-tight font-bold">{t(`game.${g.id}.name`)}</p>
                <p className="text-text-muted mt-1 text-xs">{t(`game.${g.id}.blurb`)}</p>
                {played(g.id) > 0 && (
                  <p className="mt-1 text-xs">🌼 {t('play.played', { count: played(g.id) })}</p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
