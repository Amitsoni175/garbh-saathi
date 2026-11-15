import { useNavigate } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Card, EmptyState } from '@/components/ui';
import { tx } from '@/lib/content';
import { useUnlockedStories } from './useUnlockedStories';

export default function StoryLibraryScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const data = useUnlockedStories();
  const { plan } = useTodayPlan();

  return (
    <>
      <ScreenHeader title={t('stories.title')} subtitle={t('stories.subtitle')} fallback="/play" />
      {!data ? (
        <EmptyState emoji="📖" title={t('stories.loading')} />
      ) : (
        <ul className="flex flex-col gap-3 px-4 pb-6">
          {data.unlocked.map((s, i) => (
            <li key={s.id}>
              <Card
                index={i}
                onClick={() => void navigate(`/stories/${s.id}`)}
                ariaLabel={tx(s.title, settings.textLang)}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="bg-secondary flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl"
                    aria-hidden="true"
                  >
                    {s.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{tx(s.title, settings.textLang)}</p>
                    <p className="text-text-muted flex flex-wrap gap-2 text-sm">
                      {s.id === plan?.storyId && (
                        <span className="bg-primary text-on-fill rounded-full px-2">
                          {t('stories.today')}
                        </span>
                      )}
                      {data.heard.has(s.id) && (
                        <span className="bg-calm text-on-fill rounded-full px-2">
                          ✓ {t('stories.heard')}
                        </span>
                      )}
                      {s.part && <span>{t('stories.part', { part: s.part })}</span>}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
          {data.lockedCount > 0 && (
            <p className="text-text-muted px-2 text-center">
              {t('stories.moreComing', { count: data.lockedCount })}
            </p>
          )}
        </ul>
      )}
    </>
  );
}
