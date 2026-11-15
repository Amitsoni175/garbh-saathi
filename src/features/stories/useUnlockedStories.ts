import { useMemo } from 'react';
import { useJourneyOffset } from '@/app/usePregnancy';
import { useStories } from '@/app/useStories';
import { useAllCompletions } from '@/lib/activity';
import { getTodayISO } from '@/lib/clock';
import { getFestivals, type Story } from '@/lib/content';
import { unlockedStoryIds } from '@/lib/plan';

/**
 * Stories she can see in the library: everything the daily rotation has offered
 * so far, anything she has played, and whole series unlocked by a festival
 * (e.g. Gita Jayanti unlocks Gita Week).
 */
export function useUnlockedStories(): {
  unlocked: Story[];
  lockedCount: number;
  heard: Set<string>;
} | null {
  const stories = useStories();
  const offset = useJourneyOffset();
  const completions = useAllCompletions();
  return useMemo(() => {
    if (!stories) return null;
    const ids = new Set(
      unlockedStoryIds(
        offset,
        stories.map((s) => s.id),
      ),
    );
    const heard = new Set(
      (completions ?? [])
        .filter((c) => c.kind === 'story' && c.refId)
        .map((c) => c.refId as string),
    );
    heard.forEach((id) => ids.add(id));
    const today = getTodayISO();
    const { list, dates } = getFestivals();
    for (const d of dates) {
      if (d.date > today) continue;
      const fest = list.find((f) => f.id === d.id);
      const match = fest?.activity.to.match(/^\/stories\/([\w-]+)/);
      const story = match ? stories.find((s) => s.id === match[1]) : undefined;
      if (!story) continue;
      ids.add(story.id);
      if (story.series)
        stories.filter((s) => s.series === story.series).forEach((s) => ids.add(s.id));
    }
    const unlocked = stories.filter((s) => ids.has(s.id));
    return { unlocked, lockedCount: stories.length - unlocked.length, heard };
  }, [stories, offset, completions]);
}
