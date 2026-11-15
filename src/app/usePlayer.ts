import { useSyncExternalStore } from 'react';
import { player, type PlayerState } from '@/lib/audio';

export function usePlayer(): PlayerState {
  return useSyncExternalStore(player.subscribe, player.getState, player.getState);
}
