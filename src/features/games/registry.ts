import { lazy, type ComponentType } from 'react';
import type { GameId } from '@/lib/plan';

export interface GameEntry {
  id: GameId;
  emoji: string;
  Component: ComponentType;
}

/** Every game loads on demand (keeps the first load small). */
export const GAMES: GameEntry[] = [
  { id: 'memory', emoji: '🃏', Component: lazy(() => import('./memory/MemoryGame')) },
  { id: 'bubbleMaths', emoji: '🫧', Component: lazy(() => import('./bubble/BubbleMaths')) },
  { id: 'storyQuiz', emoji: '👍', Component: lazy(() => import('./quiz/StoryQuiz')) },
  { id: 'wordGarden', emoji: '🌷', Component: lazy(() => import('./word/WordGarden')) },
  { id: 'babySize', emoji: '🥭', Component: lazy(() => import('./size/BabySizeGuess')) },
  { id: 'paheli', emoji: '🧩', Component: lazy(() => import('./paheli/PaheliGame')) },
  { id: 'sudoku', emoji: '🔢', Component: lazy(() => import('./sudoku/MiniSudoku')) },
  { id: 'patterns', emoji: '🔁', Component: lazy(() => import('./patterns/NumberPatterns')) },
  { id: 'rangoli', emoji: '🪷', Component: lazy(() => import('./rangoli/RangoliTap')) },
  { id: 'sanjhi', emoji: '🌝', Component: lazy(() => import('./sanjhi/SanjhiDecorator')) },
  { id: 'shlokaFill', emoji: '📿', Component: lazy(() => import('./fill/ShlokaFill')) },
];
