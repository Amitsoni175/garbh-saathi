# Changelog

## 0.2.0 · Phase 2: Onboarding + Today (2026-11-15)

- **Onboarding** (3 screens): welcome with the language choice; last-period or due date with an
  instant "Week X · Day Y, baby due on…" result and gentle validation; name, baby nickname and audio
  language (skippable).
- **Today**: Haryanvi Hinglish greeting by time of day, Week · Day, trimester, a progress ring with
  days to go, and stage cards (any day now at 40 weeks, "has your little one arrived?" at 42 weeks,
  and a before-the-journey note).
- **Journey path**: 5 stones on a winding path (shloka, story, game, raga, talk to baby). They can be
  done in any order. Done stones glow and get a ✓, petals fall, a chime plays and a flower is added.
  A celebration card appears when all 5 are done.
- **Baby size card** (weeks 4–40, Indian fruit and vegetables) and a **seasonal tip card**.
- **Garden for Baby**: grows from a seed to a tree in bloom by week. One flower per activity, weekly
  visitors (ladybird, butterfly, sparrow, peacock…) and festival treasures. It never shrinks. Tapping
  it shows the week's summary.
- **Shloka screen**: Devanagari, transliteration, meaning and Listen. **Talk to baby**: a prompt
  of the day with optional voice recording, saved to her letters.
- **Content system**: typed JSON with runtime validation (bad entries are skipped and reported). The
  daily plan uses explicit entries plus a deterministic rotation counted from her first day, so story
  #1 is always Abhimanyu and Gita Week parts arrive on consecutive days.
- **Database v2** migration (recordings, journal, kicks, photos, daily, events). If IndexedDB is
  blocked, an in-memory fallback keeps the whole app working.
- **Pull to refresh** on Today.

## 0.1.0 · Phase 1: Foundation (2026-11-15)

- **Pregnancy dates (`src/lib/pregnancy.ts`)**: pure, fully tested functions.
  - Naegele's rule (EDD = LMP + 280, LMP = EDD − 280).
  - "Week X · Day Y", content week (1–42), trimester, days to go, % complete and day number (1–280).
  - Stages: `early`, `normal`, `anyDay` (40+ weeks) and `overdue` (42+ weeks).
  - Validation with gentle messages: LMP in the future, LMP more than 300 days ago, EDD more than
    300 days ahead or more than 30 days past, and malformed or impossible dates.
  - Dates are stored as local `YYYY-MM-DD`. Tests prove there is no off-by-one at IST midnight, and
    that dates stay stable in negative-offset zones, across a leap year and across DST changes.
- **Clock (`src/lib/clock.ts`)**: `getToday()` and `getNow()`, with date and time overrides from
  the debug panel.
- **Database (`src/lib/db.ts`)**: Dexie schema v1 (`kv`, `errors`, `completions`), with migration
  rules documented. If IndexedDB is unavailable, the app falls back to memory and shows a gentle
  banner.
- **Error log (`src/lib/logger.ts`)**: the last 200 errors, with time, version, route and source.
  Global `error` / `unhandledrejection` handlers feed it.
- **ErrorBoundary**: one around every tab screen, with "Try again" and "Go home". It resets when
  the route changes, and the tab bar keeps working while a screen is broken.
- **UI kit (`src/components/ui`)**: Button (with breathing), Card (float-in), BottomSheet (swipe
  down, Escape, focus handling), Toggle (switch role), ProgressRing, Chip / ChipGroup, EmptyState,
  Toast (`useToast`, no `alert()`), ConfettiPetals, PageHeader.
- **Feedback (`src/lib/feedback.ts`)**: a soft synthesised chime (no audio file needed) and a 15 ms
  vibration, both controlled by the Settings toggles.
- **App shell**: hash routing (works on any static host), a 4-tab bottom bar (Today · Calendar ·
  Play · Me) with an animated pill, safe-area padding and scroll-to-top on tab change.
- **Settings (Me tab)**: text language, audio language, night mode (Auto / Always day / Always
  night), text size, sounds and vibration. They are saved to IndexedDB. Auto night mode turns on
  from 8 PM to 6 AM, or when the phone is in dark mode.
- **i18n**: `useT()` hook, `{placeholder}` support, and English fallback for missing Hinglish (a
  test makes sure no user-facing Hinglish is missing).
- **Hidden debug panel** (tap the version 7 times): date and time override, test LMP + "jump to
  week" slider, computed state, error log (copy / export / clear), simulate a render or async
  error, test toast, storage usage.
- **Performance**: motion runs through `LazyMotion`. The animation features (34 KB gz) load after
  first paint, and the initial JS is about 161 KB gzipped (budget 250 KB).

## 0.0.1 · Phase 0: Setup (2026-11-15)

- Vite 8 + React 19 + TypeScript 6 (strict, `noUncheckedIndexedAccess`), `@/` import alias.
- Tailwind CSS v4 with the Garbh Saathi theme tokens for day and night, soft radii and shadows,
  breathe and float-in animations, `prefers-reduced-motion` support, and text-size hooks.
- Accessibility: `text-muted` darkened from `#8C7F90` to `#6E6173` so it passes WCAG AA on cream
  and white. Night tokens already passed. Text on pastel fills uses `--on-fill`.
- Self-hosted Nunito and Noto Sans Devanagari via `@fontsource`.
- ESLint (flat config, typescript-eslint, react-hooks, `no-alert`) + Prettier (with Tailwind class sorting).
- Vitest + Testing Library (jsdom). `npm run check` runs typecheck, lint, format check and tests.
- Folder structure from the spec, an i18n skeleton (`t()` with English fallback), and a soft-themed
  placeholder screen with a night-mode preview button.
- README, CHANGELOG and CONTENT_GUIDE skeletons.
