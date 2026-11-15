# Changelog

## 0.5.0 · Phase 5: Music (2026-11-15)

- **Music corner** (from the Play tab or the raga stone).
- **Raga of the moment**: Bhairav / Ahir Bhairav in the morning, Bhimpalasi in the afternoon, Yaman
  in the evening, Bageshree / Darbari at night. It follows the clock, including the debug time
  override, and alternates by day. Each raga card shows the mood, best time and a short note. If the
  MP3 is missing, a friendly "Add an audio file" note says exactly where to put
  `public/audio/ragas/<id>.mp3`.
- **Mantra counter**: Om, Gayatri and Mahamrityunjaya with a big tap button, a progress ring,
  11 / 21 / 108 repetitions, a soft synthesised temple bell at the end, and an optional looping
  mantra audio.
- **Breathing bubble**: 4-in / 4-out for 1, 3 or 5 minutes, optionally over the raga (if its file
  exists). The circle still works with reduced motion.
- **Lok Geet shelf**: traditional loris (Chanda Mama, Lalla lalla lori), a Haryanvi-flavoured lori
  and a Teej song written for the app, and a jachcha geet card that invites Dadi or Nani to record.
  There is a big "Record a song" button, recordings per song, and family songs.
- **Sing to Baby** (karaoke): lyrics scroll line by line at a slow or normal pace, she can tap any
  line, with optional background audio (family recording or MP3).

## 0.4.0 · Phase 4: Games (2026-11-15)

- **GameShell** shared by every game: title, how-to-play sheet, hint button, an optional relaxed
  count-up timer (off by default, never a countdown), a finish card with "Shabaash!" and a flower
  for the garden. There are no scores, no leaderboards and no losing.
- **11 games**, each lazy-loaded and wrapped in its own error boundary:
  - **Memory Match**: 3×4, then 4×4 after two games. Matched cards wiggle and glow; the hint wiggles
    a pair.
  - **Bubble Maths**: a Vedic trick of the day with step-by-step "how it works" (squares ending in 5 /
    Ekadhikena Purvena, ×11, Nikhilam near 100, ×5, +9), then 5 floating bubbles to pop. Wrong
    bubbles just drift away.
  - **Story Quiz Swipe**: true/false cards about yesterday's story (swipe or buttons), with a gentle
    correction when an answer is wrong.
  - **Word Garden**: tap letter tiles to spell 3 words from the story. Each word grows a tulip, and the
    hint lights up the next letter.
  - **Baby Size Guess**: this week's fruit against a far-off one, then a cute reveal.
  - **Paheli of the Day**: 16 riddles, revealed with a canvas scratch card (or a button).
  - **Mini Sudoku**: generated 4×4 / 6×6 puzzles, pencil marks, soft clash colours, and a hint that
    fills a square.
  - **Number Patterns**: 3 sequences per round, with the hint shown after a miss.
  - **Rangoli Tap**: tap the glowing dot to draw a star, diamond, lotus or hexagram. A wrong tap only
    nudges the glow.
  - **Sanjhi Decorator**: drag 14 stickers onto a Haryanvi Sanjhi face, save it to the in-app
    gallery, and download it as a PNG.
  - **Shloka Fill-in**: find the missing word in shlokas she has already heard.
- **Play tab**: game of the day, all games (with "played N×"), and links to the music corner and the
  story library.
- Unit tests for the game logic: seeded shuffle, memory pairing and levels, bubble questions for every
  trick, Sudoku generation/clashes/validity, word scramble and check, rangoli paths and shloka
  fill-in.

## 0.3.0 · Phase 3: Stories + Audio (2026-11-15)

- **12 seed stories** in English and Hinglish: Abhimanyu (story #1, with Devanagari text for the
  Hindi voice), Gita Week parts 1–3 (one Gita shloka each), Dhruva, Prahlad, Baby Krishna and the
  butter (with Surdas' line), Eklavya, Kalpana Chawla, the Phogat sisters and Saina Nehwal, the
  clever rabbit (Panchatantra) and Savitri.
- **Story player**: swipeable cards (or buttons), a read-aloud mode with big text and "say this to
  your baby" lines, gentle choice points where both answers teach something, a moral card, "Part N
  tomorrow ✨" for series, and a reflection she can type or record (saved to her letters).
- **Record in your voice**: Mummy, Papa, Dadi or Nani can record any story. The family voice
  replaces the default audio, with a toggle to switch back.
- **Audio system** (`src/lib/audio.ts`): family recording → MP3 file → phone voice (hi-IN / en-IN).
  It falls back to English with a one-time "how to install a Hindi voice" notice. Missing MP3s are
  detected properly (even when the server answers with index.html).
- **Player**: play/pause, seek (by card for the phone voice), 0.75×/1× speed, a 10/20/30-minute sleep
  timer, a mini-player above the tabs, lock-screen controls (Media Session), and a gentle "tap to
  play" if iOS blocks autoplay.
- **Story library**: every unlocked story (from the daily rotation, those already heard, and series
  unlocked by festivals), with Today / Heard badges.
- Tests: content validation (all shipped content is valid, malformed entries are skipped), voice
  picking, sentence splitting, recording format.

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
