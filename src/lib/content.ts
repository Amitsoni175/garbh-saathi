/**
 * Typed access to the JSON content in src/content/, with a runtime check at load.
 * A malformed entry is logged, skipped, and listed in the debug panel's
 * "content validation report". The app never crashes because of content.
 *
 * Stories are big, so they load lazily (loadStories). Everything else is small
 * and loads with the app.
 */
import babySizeRaw from '@/content/babySize.json';
import dailyPlanRaw from '@/content/dailyPlan.json';
import festivalsRaw from '@/content/festivals.json';
import memorySetsRaw from '@/content/games/memorySets.json';
import paheliRaw from '@/content/games/paheli.json';
import patternsRaw from '@/content/games/patterns.json';
import sudokuRaw from '@/content/games/sudoku.json';
import vedicRaw from '@/content/games/vedicTricks.json';
import lokGeetRaw from '@/content/lokGeet.json';
import mantrasRaw from '@/content/mantras.json';
import promptsRaw from '@/content/prompts.json';
import ragasRaw from '@/content/ragas.json';
import shlokasRaw from '@/content/shlokas.json';
import tipsRaw from '@/content/tips.json';
import type { Lang } from './i18n';

// ---------- Types ----------

export interface L10n {
  en: string;
  hinglish: string;
}

export interface StoryChoice {
  question: L10n;
  options: { label: L10n; lesson: L10n }[];
}

export interface StoryCard {
  text: L10n & { hi?: string };
  image?: string;
  say?: L10n;
  choice?: StoryChoice;
}

export interface Story {
  id: string;
  emoji: string;
  series?: string;
  part?: number;
  week?: number;
  shlokaId?: string;
  title: L10n;
  cards: StoryCard[];
  moral: L10n;
  reflection: L10n;
  audio: { hi?: string; en?: string };
  quiz: { q: L10n; answer: boolean }[];
  words: string[];
}

export interface Shloka {
  id: string;
  title: L10n;
  devanagari: string;
  transliteration: string;
  /** Plain-letter transliteration, used by the Shloka Fill-in game. */
  simple: string;
  meaning: L10n;
  audio?: string;
}

export interface BabySize {
  week: number;
  emoji: string;
  name: L10n;
  lengthCm: number;
  weightG: number;
  development: L10n[];
}

export interface Prompt {
  id: string;
  text: L10n;
  /** Optional emoji shown with the prompt. */
  emoji?: string;
  /** Optional example words she can say (talk-to-baby prompts). */
  say?: L10n;
}

export interface Prompts {
  talk: Prompt[];
  papa: Prompt[];
  journal: Prompt[];
}

export type RagaSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Raga {
  id: string;
  slot: RagaSlot;
  emoji: string;
  name: L10n;
  mood: L10n;
  time: L10n;
  note: L10n;
}

export interface Mantra {
  id: string;
  name: L10n;
  devanagari: string;
  transliteration: string;
  meaning: L10n;
  audio?: string;
}

export interface LokGeet {
  id: string;
  type: 'lori' | 'lokgeet' | 'jachcha';
  emoji: string;
  title: L10n;
  about: L10n;
  lines: string[];
}

export interface Festival {
  id: string;
  emoji: string;
  name: L10n;
  blurb: L10n;
  activity: { kind: string; label: L10n; to: string };
  caution?: L10n;
}

export type SeasonKey = 'heat' | 'monsoon' | 'fog' | 'spring' | 'autumn';

export interface FoodTip {
  id: string;
  text: L10n;
  season?: SeasonKey;
  caution?: boolean;
  askDoctor?: boolean;
}

export interface YogaCard {
  id: string;
  title: L10n;
  steps: L10n;
}

export interface Tips {
  seasonal: Record<SeasonKey, { title: L10n; tips: L10n[] }>;
  food: FoodTip[];
  yoga: Record<'1' | '2' | '3', YogaCard[]>;
}

export interface Paheli {
  id: string;
  riddle: L10n;
  answer: L10n;
  emoji: string;
}

export type VedicKind = 'squareEnding5' | 'times11' | 'near100' | 'times5' | 'add9';

export interface VedicTrick {
  id: string;
  kind: VedicKind;
  name: L10n;
  sutra: string;
  steps: L10n[];
}

export interface NumberPattern {
  id: string;
  sequence: number[];
  answer: number;
  options: number[];
  hint: L10n;
}

export interface MemorySet {
  id: string;
  name: L10n;
  items: { emoji: string; label: L10n }[];
}

export interface SudokuLevel {
  id: string;
  size: 4 | 6;
  holes: number;
}

export interface DailyPlanEntry {
  storyId?: string;
  shlokaId?: string;
  gameType?: string;
  ragaSlot?: RagaSlot;
  promptId?: string;
}

// ---------- Validation helpers ----------

export interface ContentIssue {
  file: string;
  index: number | string;
  id?: string;
  reason: string;
}

const issues: ContentIssue[] = [];

export function getContentIssues(): ContentIssue[] {
  return [...issues];
}

type Check = (x: Record<string, unknown>) => string | null;

const isObj = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

/** An {en, hinglish} pair. Missing Hinglish is filled from English (and noted). */
export function isL10n(x: unknown): boolean {
  return isObj(x) && isStr(x.en) && (x.hinglish === undefined || typeof x.hinglish === 'string');
}

function fixL10n(x: unknown): L10n {
  const o = x as { en: string; hinglish?: string };
  return { en: o.en, hinglish: o.hinglish && o.hinglish.trim() ? o.hinglish : o.en };
}

function need(cond: boolean, reason: string): string | null {
  return cond ? null : reason;
}

function firstError(...checks: (string | null)[]): string | null {
  return checks.find((c) => c !== null) ?? null;
}

/**
 * Validate a list: bad entries are skipped and recorded. Duplicate ids are skipped too.
 * Exported for tests.
 */
export function validateList<T>(
  file: string,
  raw: unknown,
  check: Check,
  fix?: (x: Record<string, unknown>) => T,
): T[] {
  if (!Array.isArray(raw)) {
    issues.push({ file, index: '-', reason: 'File is not a list' });
    return [];
  }
  const seen = new Set<string>();
  const out: T[] = [];
  raw.forEach((entry, index) => {
    if (!isObj(entry)) {
      issues.push({ file, index, reason: 'Entry is not an object' });
      return;
    }
    const id = typeof entry.id === 'string' ? entry.id : undefined;
    const reason = check(entry) ?? (id && seen.has(id) ? `Duplicate id "${id}"` : null);
    if (reason) {
      issues.push({ file, index, id, reason });
      if (import.meta.env.DEV) console.warn(`[content] ${file}[${index}] skipped: ${reason}`);
      return;
    }
    if (id) seen.add(id);
    out.push(fix ? fix(entry) : (entry as T));
  });
  return out;
}

// ---------- Per-file checks ----------

const checkStoryCard = (c: unknown): string | null => {
  if (!isObj(c)) return 'card is not an object';
  if (!isL10n(c.text)) return 'card.text needs {en, hinglish}';
  if (c.say !== undefined && !isL10n(c.say)) return 'card.say needs {en, hinglish}';
  if (c.choice !== undefined) {
    const ch = c.choice;
    if (!isObj(ch) || !isL10n(ch.question) || !Array.isArray(ch.options) || ch.options.length < 2)
      return 'card.choice needs a question and at least 2 options';
    if (!ch.options.every((o) => isObj(o) && isL10n(o.label) && isL10n(o.lesson)))
      return 'each choice option needs {label, lesson}';
  }
  return null;
};

export const checkStory: Check = (s) =>
  firstError(
    need(isStr(s.id), 'missing id'),
    need(isL10n(s.title), 'title needs {en, hinglish}'),
    need(Array.isArray(s.cards) && s.cards.length > 0, 'needs at least one card'),
    Array.isArray(s.cards) ? (s.cards.map(checkStoryCard).find((e) => e) ?? null) : null,
    need(isL10n(s.moral), 'moral needs {en, hinglish}'),
    need(isL10n(s.reflection), 'reflection needs {en, hinglish}'),
    need(
      s.quiz === undefined ||
        (Array.isArray(s.quiz) &&
          s.quiz.every((q) => isObj(q) && isL10n(q.q) && typeof q.answer === 'boolean')),
      'quiz items need {q, answer: true/false}',
    ),
    need(
      s.words === undefined ||
        (Array.isArray(s.words) &&
          s.words.every((w) => typeof w === 'string' && /^[A-Z]{2,10}$/.test(w))),
      'words must be CAPITAL letters only (2–10 letters)',
    ),
  );

function fixStory(s: Record<string, unknown>): Story {
  const raw = s as unknown as Story;
  return {
    ...raw,
    emoji: typeof raw.emoji === 'string' ? raw.emoji : '📖',
    title: fixL10n(raw.title),
    moral: fixL10n(raw.moral),
    reflection: fixL10n(raw.reflection),
    audio: isObj(raw.audio) ? raw.audio : {},
    quiz: (raw.quiz ?? []).map((q) => ({ q: fixL10n(q.q), answer: q.answer })),
    words: raw.words ?? [],
    cards: raw.cards.map((c) => ({
      ...c,
      text: { ...fixL10n(c.text), ...(c.text.hi ? { hi: c.text.hi } : {}) },
      say: c.say ? fixL10n(c.say) : undefined,
    })),
  };
}

const checkShloka: Check = (s) =>
  firstError(
    need(isStr(s.id), 'missing id'),
    need(isL10n(s.title), 'title needs {en, hinglish}'),
    need(isStr(s.devanagari), 'missing devanagari'),
    need(isStr(s.transliteration), 'missing transliteration'),
    need(isStr(s.simple), 'missing simple transliteration'),
    need(isL10n(s.meaning), 'meaning needs {en, hinglish}'),
  );

const checkBabySize: Check = (b) =>
  firstError(
    need(isNum(b.week) && b.week >= 1 && b.week <= 42, 'week must be 1–42'),
    need(isStr(b.emoji), 'missing emoji'),
    need(isL10n(b.name), 'name needs {en, hinglish}'),
    need(isNum(b.lengthCm) && isNum(b.weightG), 'needs lengthCm and weightG numbers'),
    need(
      Array.isArray(b.development) && b.development.every(isL10n),
      'development needs {en, hinglish} lines',
    ),
  );

const checkPrompt: Check = (p) =>
  firstError(
    need(isStr(p.id), 'missing id'),
    need(isL10n(p.text), 'text needs {en, hinglish}'),
    need(p.say === undefined || isL10n(p.say), 'say needs {en, hinglish}'),
    need(p.emoji === undefined || isStr(p.emoji), 'emoji must be text'),
  );

const checkRaga: Check = (r) =>
  firstError(
    need(isStr(r.id), 'missing id'),
    need(
      ['morning', 'afternoon', 'evening', 'night'].includes(r.slot as string),
      'slot must be morning/afternoon/evening/night',
    ),
    need(
      isL10n(r.name) && isL10n(r.mood) && isL10n(r.time) && isL10n(r.note),
      'name, mood, time and note need {en, hinglish}',
    ),
  );

const checkMantra: Check = (m) =>
  firstError(
    need(isStr(m.id), 'missing id'),
    need(isL10n(m.name) && isL10n(m.meaning), 'name and meaning need {en, hinglish}'),
    need(isStr(m.devanagari), 'missing devanagari'),
  );

const checkLokGeet: Check = (g) =>
  firstError(
    need(isStr(g.id), 'missing id'),
    need(
      ['lori', 'lokgeet', 'jachcha'].includes(g.type as string),
      'type must be lori/lokgeet/jachcha',
    ),
    need(isL10n(g.title) && isL10n(g.about), 'title and about need {en, hinglish}'),
    need(
      Array.isArray(g.lines) && g.lines.every((l) => typeof l === 'string'),
      'lines must be a list of text',
    ),
  );

const checkFestival: Check = (f) =>
  firstError(
    need(isStr(f.id), 'missing id'),
    need(isL10n(f.name) && isL10n(f.blurb), 'name and blurb need {en, hinglish}'),
    need(
      isObj(f.activity) && isL10n(f.activity.label) && isStr(f.activity.to),
      'activity needs {label, to}',
    ),
  );

const checkPaheli: Check = (p) =>
  firstError(
    need(isStr(p.id), 'missing id'),
    need(isL10n(p.riddle) && isL10n(p.answer), 'riddle and answer need {en, hinglish}'),
  );

const checkVedic: Check = (v) =>
  firstError(
    need(isStr(v.id), 'missing id'),
    need(
      ['squareEnding5', 'times11', 'near100', 'times5', 'add9'].includes(v.kind as string),
      'unknown kind',
    ),
    need(
      isL10n(v.name) && Array.isArray(v.steps) && v.steps.every(isL10n),
      'name and steps need {en, hinglish}',
    ),
  );

const checkPattern: Check = (p) =>
  firstError(
    need(isStr(p.id), 'missing id'),
    need(
      Array.isArray(p.sequence) && p.sequence.length >= 3 && p.sequence.every(isNum),
      'sequence needs at least 3 numbers',
    ),
    need(isNum(p.answer), 'answer must be a number'),
    need(
      Array.isArray(p.options) && p.options.includes(p.answer),
      'options must include the answer',
    ),
    need(isL10n(p.hint), 'hint needs {en, hinglish}'),
  );

const checkMemorySet: Check = (m) =>
  firstError(
    need(isStr(m.id), 'missing id'),
    need(
      Array.isArray(m.items) &&
        m.items.length >= 8 &&
        m.items.every((i) => isObj(i) && isStr(i.emoji) && isL10n(i.label)),
      'needs at least 8 items with {emoji, label}',
    ),
  );

const checkSudoku: Check = (s) =>
  firstError(
    need(isStr(s.id), 'missing id'),
    need(s.size === 4 || s.size === 6, 'size must be 4 or 6'),
    need(isNum(s.holes) && s.holes > 0, 'holes must be a positive number'),
  );

// ---------- Loaded content ----------

function once<T>(fn: () => T): () => T {
  let value: T | undefined;
  let done = false;
  return () => {
    if (!done) {
      value = fn();
      done = true;
    }
    return value as T;
  };
}

const fixAll = <T>(x: Record<string, unknown>): T => {
  const out: Record<string, unknown> = { ...x };
  for (const [k, v] of Object.entries(x)) if (isL10n(v)) out[k] = fixL10n(v);
  return out as T;
};

export const getShlokas = once(() =>
  validateList<Shloka>('shlokas.json', shlokasRaw, checkShloka, fixAll),
);
export const getBabySizes = once(() =>
  validateList<BabySize>('babySize.json', babySizeRaw, checkBabySize, (b) => ({
    ...(b as unknown as BabySize),
    name: fixL10n(b.name),
    development: (b.development as unknown[]).map(fixL10n),
  })),
);
export const getRagas = once(() => validateList<Raga>('ragas.json', ragasRaw, checkRaga, fixAll));
export const getMantras = once(() =>
  validateList<Mantra>('mantras.json', mantrasRaw, checkMantra, fixAll),
);
export const getLokGeet = once(() =>
  validateList<LokGeet>('lokGeet.json', lokGeetRaw, checkLokGeet, fixAll),
);
export const getPahelis = once(() =>
  validateList<Paheli>('games/paheli.json', paheliRaw, checkPaheli, fixAll),
);
export const getVedicTricks = once(() =>
  validateList<VedicTrick>('games/vedicTricks.json', vedicRaw, checkVedic, (v) => ({
    ...(v as unknown as VedicTrick),
    name: fixL10n(v.name),
    steps: (v.steps as unknown[]).map(fixL10n),
  })),
);
export const getPatterns = once(() =>
  validateList<NumberPattern>('games/patterns.json', patternsRaw, checkPattern, fixAll),
);
export const getMemorySets = once(() =>
  validateList<MemorySet>('games/memorySets.json', memorySetsRaw, checkMemorySet, (m) => ({
    ...(m as unknown as MemorySet),
    name: fixL10n(m.name),
    items: (m.items as { emoji: string; label: unknown }[]).map((i) => ({
      emoji: i.emoji,
      label: fixL10n(i.label),
    })),
  })),
);
export const getSudokuLevels = once(() =>
  validateList<SudokuLevel>(
    'games/sudoku.json',
    isObj(sudokuRaw) ? sudokuRaw.levels : sudokuRaw,
    checkSudoku,
  ),
);

export const getPrompts = once((): Prompts => {
  const raw = promptsRaw as unknown as Record<string, unknown>;
  return {
    talk: validateList<Prompt>('prompts.json#talk', raw.talk, checkPrompt, fixAll),
    papa: validateList<Prompt>('prompts.json#papa', raw.papa, checkPrompt, fixAll),
    journal: validateList<Prompt>('prompts.json#journal', raw.journal, checkPrompt, fixAll),
  };
});

const FALLBACK_SEASON = { title: { en: 'Seasonal tip', hinglish: 'Mausam ki salaah' }, tips: [] };

export const getTips = once((): Tips => {
  const raw = tipsRaw as unknown as Record<string, unknown>;
  const seasonalRaw = isObj(raw.seasonal) ? raw.seasonal : {};
  const seasonal = {} as Tips['seasonal'];
  for (const key of ['heat', 'monsoon', 'fog', 'spring', 'autumn'] as SeasonKey[]) {
    const s = seasonalRaw[key];
    if (isObj(s) && isL10n(s.title) && Array.isArray(s.tips)) {
      const tips = s.tips.filter(isL10n).map(fixL10n);
      if (tips.length !== s.tips.length)
        issues.push({
          file: 'tips.json#seasonal',
          index: key,
          reason: 'some tips need {en, hinglish}',
        });
      seasonal[key] = { title: fixL10n(s.title), tips };
    } else {
      issues.push({
        file: 'tips.json#seasonal',
        index: key,
        reason: 'missing or malformed season',
      });
      seasonal[key] = FALLBACK_SEASON;
    }
  }
  const food = validateList<FoodTip>('tips.json#food', raw.food, checkPrompt, fixAll);
  const yogaRaw = isObj(raw.yoga) ? raw.yoga : {};
  const yogaCheck: Check = (y) =>
    firstError(
      need(isStr(y.id), 'missing id'),
      need(isL10n(y.title) && isL10n(y.steps), 'title and steps need {en, hinglish}'),
    );
  const yoga = {
    '1': validateList<YogaCard>('tips.json#yoga.1', yogaRaw['1'], yogaCheck, fixAll),
    '2': validateList<YogaCard>('tips.json#yoga.2', yogaRaw['2'], yogaCheck, fixAll),
    '3': validateList<YogaCard>('tips.json#yoga.3', yogaRaw['3'], yogaCheck, fixAll),
  };
  return { seasonal, food, yoga };
});

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const getFestivals = once(() => {
  const raw = festivalsRaw as unknown as Record<string, unknown>;
  const list = validateList<Festival>(
    'festivals.json#festivals',
    raw.festivals,
    checkFestival,
    (f) => ({
      ...(f as unknown as Festival),
      name: fixL10n(f.name),
      blurb: fixL10n(f.blurb),
      caution: f.caution ? fixL10n(f.caution) : undefined,
      activity: {
        ...(f.activity as Festival['activity']),
        label: fixL10n((f.activity as Record<string, unknown>).label),
      },
    }),
  );
  const ids = new Set(list.map((f) => f.id));
  const dates: { id: string; date: string }[] = [];
  const years = isObj(raw.dates) ? raw.dates : {};
  for (const [year, map] of Object.entries(years)) {
    if (!isObj(map)) continue;
    for (const [id, date] of Object.entries(map)) {
      if (!ids.has(id))
        issues.push({
          file: 'festivals.json#dates',
          index: year,
          id,
          reason: 'no festival with this id',
        });
      else if (typeof date !== 'string' || !DATE_RE.test(date))
        issues.push({
          file: 'festivals.json#dates',
          index: year,
          id,
          reason: 'date must be YYYY-MM-DD',
        });
      else dates.push({ id, date });
    }
  }
  dates.sort((a, b) => a.date.localeCompare(b.date));
  return { list, dates };
});

export const getExplicitPlan = once((): Record<string, DailyPlanEntry> => {
  const raw = dailyPlanRaw as unknown as Record<string, unknown>;
  const days = isObj(raw.days) ? raw.days : {};
  const out: Record<string, DailyPlanEntry> = {};
  for (const [day, entry] of Object.entries(days)) {
    if (!/^\d+$/.test(day) || !isObj(entry)) {
      issues.push({
        file: 'dailyPlan.json',
        index: day,
        reason: 'day must be a number with an object entry',
      });
      continue;
    }
    out[day] = entry as DailyPlanEntry;
  }
  return out;
});

let storiesPromise: Promise<Story[]> | null = null;
let storiesCache: Story[] | null = null;

/** Stories load lazily (they are the biggest content file). */
export function loadStories(): Promise<Story[]> {
  storiesPromise ??= import('@/content/stories.json')
    .then((mod) => {
      storiesCache = validateList<Story>('stories.json', mod.default, checkStory, fixStory);
      return storiesCache;
    })
    .catch((err: unknown) => {
      issues.push({ file: 'stories.json', index: '-', reason: `Could not load: ${String(err)}` });
      storiesPromise = null;
      return [];
    });
  return storiesPromise;
}

export function getLoadedStories(): Story[] | null {
  return storiesCache;
}

/** Run every validator once (debug panel report). */
export async function validateAllContent(): Promise<ContentIssue[]> {
  getShlokas();
  getBabySizes();
  getRagas();
  getMantras();
  getLokGeet();
  getPahelis();
  getVedicTricks();
  getPatterns();
  getMemorySets();
  getSudokuLevels();
  getPrompts();
  getTips();
  getFestivals();
  getExplicitPlan();
  await loadStories();
  return getContentIssues();
}

/** Pick the text in her language (Hinglish falls back to English). */
export function tx(value: L10n | undefined, lang: Lang): string {
  if (!value) return '';
  return lang === 'hinglish' ? value.hinglish || value.en : value.en;
}

export function babySizeForWeek(week: number): BabySize | undefined {
  const sizes = getBabySizes();
  if (sizes.length === 0) return undefined;
  const clamped = Math.min(40, Math.max(4, week));
  return (
    sizes.find((s) => s.week === clamped) ??
    sizes.reduce((best, s) =>
      Math.abs(s.week - clamped) < Math.abs(best.week - clamped) ? s : best,
    )
  );
}
