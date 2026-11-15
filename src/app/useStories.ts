import { useEffect, useState } from 'react';
import { getLoadedStories, loadStories, type Story } from '@/lib/content';

/** All valid stories (loaded lazily). null while loading. */
export function useStories(): Story[] | null {
  const [stories, setStories] = useState<Story[] | null>(getLoadedStories);
  useEffect(() => {
    if (stories) return;
    let cancelled = false;
    void loadStories().then((s) => {
      if (!cancelled) setStories(s);
    });
    return () => {
      cancelled = true;
    };
  }, [stories]);
  return stories;
}
