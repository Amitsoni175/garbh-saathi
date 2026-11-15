import { createContext, useContext } from 'react';

/** Petals + chime + vibration + an optional toast. Use for "you did it" moments. */
export const CelebrateContext = createContext<(message?: string) => void>(() => undefined);

export function useCelebrate() {
  return useContext(CelebrateContext);
}
