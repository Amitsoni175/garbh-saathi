# Garbh Saathi 🌸

A personal, non-commercial pregnancy companion for one expecting mother and her family in Haryana.
It offers daily stories, ragas, mantras, Haryanvi lok geet, small puzzle games and gentle wellness
habits. Everything is about **bonding, calm and joy**. It makes **no IQ claims** and does
**no gender prediction**.

- **Private:** all data stays on the phone. There is no login, server, analytics or trackers.
- **Offline-first:** an installable PWA that works on low-cost Android phones and iPhone Safari.

> Status: **Phase 1 (foundation)**. See [CHANGELOG.md](CHANGELOG.md).

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev -- --host  # also open it on a phone on the same Wi-Fi (use the Network URL)
npm run check        # typecheck + lint + format check + tests (must pass every phase)
npm run build        # static files in dist/
```

Requires Node 20+ (developed on Node 22).

## Tech stack

Vite · React · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Dexie (IndexedDB) ·
date-fns · vite-plugin-pwa · Vitest · Playwright · ESLint + Prettier. Fonts (Nunito, Noto Sans
Devanagari) are self-hosted from `@fontsource` packages so they work offline.

## Folder structure

```
src/
  app/          routing, layout, providers, ErrorBoundary
  features/     onboarding, home, stories, music, games, calendar, schedule,
                bonding, wellness, garden, settings
  lib/          pregnancy.ts (date maths), db.ts, audio.ts, i18n.ts, notify.ts, logger.ts, clock.ts
  content/      JSON content (stories, shlokas, babySize, festivals, games/…)
  components/ui reusable Button, Card, Sheet, Toggle, ProgressRing…
public/
  audio/hi/  audio/en/  images/  icons/
```

**Rule:** all text and stories live in `src/content/*.json` or `src/lib/i18n.ts`, never in components.

## Theme

Colours are CSS variables in `src/index.css`, exposed as Tailwind tokens (`bg-primary`,
`text-text-muted`, `bg-surface`, `shadow-soft`, `rounded-softer`…). Night mode is set with
`data-theme="night"` on `<html>`. Text sizes come from `data-text-size="large" | "xl"`.

## Debug panel

Me → About → tap the version number **7 times**. There you can pretend today is any date or time,
jump to any pregnancy week, see the computed state, view, copy or export the error log, and
simulate errors.

## Code rules worth knowing

- Never call `new Date()` for app logic: use `getToday()` / `getNow()` from `src/lib/clock.ts`
  (or the `useNow()` hook), so the debug override works everywhere.
- Never use `new Date('YYYY-MM-DD')` or `toISOString()` for calendar dates: use `parseLocalDate` /
  `toLocalISO` from `src/lib/pregnancy.ts`.
- Animations use `m.div` (not `motion.div`) inside the app-wide `LazyMotion`.
- Database changes: add a new `this.version(n)` block in `src/lib/db.ts` and never edit an old one.

## Install on a phone

_Coming in Phase 9._

## How to add content

_Coming in Phase 3. This section will have copy-paste examples for adding a story, puzzle or festival._

## How to add audio files

_Coming in Phase 3 (naming convention: `public/audio/{hi|en}/{id}.mp3`)._

## Deploy

_Coming in Phase 9 (Netlify drag-and-drop and GitHub Pages)._

## Backup

_Coming in Phase 9._

## TODO

- [ ] Verify the 2026 and 2027 festival dates in `festivals.json` against a panchang (Phase 8).
- [ ] Ask her doctor to review the wellness tips, danger signs and yoga cards.

## Troubleshooting

| Problem                            | Likely cause                                | Fix                                                                          |
| ---------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| Blank white screen after an update | Old service worker cache                    | Settings → Fix app, or clear site data in the browser                        |
| Week is off by one day             | Timezone or date parsing                    | Check that `pregnancy.ts` uses local dates and run the tests                 |
| No sound on iPhone                 | Audio started without a tap / silent switch | Tap play, and check that the silent switch is off                            |
| Hindi voice sounds English         | No Hindi TTS voice installed                | Android: Settings → Text-to-speech → install Hindi, or record your own voice |
| Reminders not showing              | Permission denied / app not installed (iOS) | Allow notifications and add to the home screen, or use the calendar export   |
| Data missing on a new phone        | Data is stored per device                   | Export a backup on the old phone and import it on the new one                |
| A story or game doesn't appear     | Bad JSON entry                              | Debug panel → content validation report                                      |
