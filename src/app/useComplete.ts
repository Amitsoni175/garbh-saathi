import { useCallback } from 'react';
import { recordCompletion } from '@/lib/activity';
import type { CompletionKind } from '@/lib/db';
import { useCelebrate } from './celebrate';
import { useT } from './useT';

/** Record an activity, add a flower, and celebrate softly (petals, chime, toast). */
export function useComplete() {
  const celebrate = useCelebrate();
  const t = useT();
  return useCallback(
    async (kind: CompletionKind, refId?: string, message?: string) => {
      const ok = await recordCompletion(kind, refId);
      if (ok) celebrate(message ?? t('journey.flowerAdded'));
      return ok;
    },
    [celebrate, t],
  );
}
