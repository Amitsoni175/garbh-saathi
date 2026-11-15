/**
 * "Garden for Baby": grows over the whole pregnancy and never shrinks.
 * Everything is derived from completions (which are never deleted) and the week.
 */
import type { CompletionKind, CompletionRow } from './db';

export type GardenStage = 'seed' | 'sprout' | 'sapling' | 'young' | 'tree' | 'bloom';

export function gardenStage(week: number): GardenStage {
  if (week < 8) return 'seed';
  if (week < 14) return 'sprout';
  if (week < 20) return 'sapling';
  if (week < 28) return 'young';
  if (week < 37) return 'tree';
  return 'bloom';
}

export const STAGE_EMOJI: Record<GardenStage, string> = {
  seed: '🌰',
  sprout: '🌱',
  sapling: '🌿',
  young: '🪴',
  tree: '🌳',
  bloom: '🌳',
};

/** Weekly milestones: something special appears as the weeks pass. */
export const MILESTONES: { week: number; emoji: string; id: string }[] = [
  { week: 8, emoji: '🐞', id: 'ladybird' },
  { week: 12, emoji: '🦋', id: 'butterfly' },
  { week: 16, emoji: '🐝', id: 'bee' },
  { week: 20, emoji: '🐦', id: 'sparrow' },
  { week: 24, emoji: '🌈', id: 'rainbow' },
  { week: 28, emoji: '🐿️', id: 'squirrel' },
  { week: 32, emoji: '🦚', id: 'peacock' },
  { week: 37, emoji: '🪺', id: 'nest' },
  { week: 40, emoji: '🌕', id: 'moon' },
];

export function milestonesReached(week: number) {
  return MILESTONES.filter((m) => week >= m.week);
}

/** Special items earned by doing anything on a festival day. */
export const FESTIVAL_ITEMS: Record<string, string> = {
  'hariyali-teej': '🎐',
  diwali: '🪔',
  holi: '🎨',
  lohri: '🔥',
  navratri: '🌺',
  janmashtami: '🪈',
  'gita-jayanti': '📜',
  baisakhi: '🌾',
  'basant-panchami': '🪁',
  'raksha-bandhan': '🧵',
  'karva-chauth': '🌕',
};

const FLOWER_FOR_KIND: Partial<Record<CompletionKind, string>> = {
  story: '🌸',
  game: '🌼',
  shloka: '🪷',
  raga: '🌺',
  talk: '🌷',
  tablet: '🍃',
  mood: '🍀',
  journal: '💮',
  kicks: '🌻',
  photo: '🌹',
  mantra: '🪻',
  breathe: '🍃',
  song: '🌺',
  papa: '🌻',
  yoga: '🌿',
};

export function flowerFor(kind: CompletionKind): string {
  return FLOWER_FOR_KIND[kind] ?? '🌸';
}

/** Deterministic pseudo-random position (0–1) so flowers stay put between visits. */
export function flowerPosition(index: number): { x: number; y: number } {
  const a = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  const b = Math.sin(index * 39.3468 + 11.135) * 24634.6345;
  return { x: a - Math.floor(a), y: b - Math.floor(b) };
}

export interface WeekSummary {
  stories: number;
  games: number;
  letters: number;
  other: number;
  total: number;
}

export function summarise(rows: Pick<CompletionRow, 'kind'>[]): WeekSummary {
  const s = { stories: 0, games: 0, letters: 0, other: 0, total: rows.length };
  for (const r of rows) {
    if (r.kind === 'story') s.stories += 1;
    else if (r.kind === 'game') s.games += 1;
    else if (r.kind === 'journal' || r.kind === 'talk') s.letters += 1;
    else s.other += 1;
  }
  return s;
}
