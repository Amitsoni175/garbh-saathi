# Wombtales 🌸 (formerly Garbh Saathi)

A personal, non-commercial pregnancy companion for one expecting mother and her family in Haryana.
It offers daily stories (Vedic, Puranic, Mahabharata and true stories), ragas, mantras, Haryanvi lok
geet, small puzzle games and gentle wellness habits. Everything is about **bonding, calm and joy for
the mother**. It makes **no IQ claims** and does **no gender prediction**.

**Website and articles:** see [Website and publishing](#website-and-publishing) below.

**Live:** https://wombtales.in (also https://garbh-saathi.netlify.app and the GitHub Pages copy). Each
address keeps its own data on the phone, so pick one to install.

- **Private:** all data stays on the phone. There is no login, server, analytics or trackers.
- **Works offline:** after the first visit it works in airplane mode. It is installable on Android
  and iPhone.
- **Gentle:** one main action per screen, 1–3 minute activities, no losing, no red badges.

> Garbh Saathi is a placeholder name. Change it in `index.html`, `vite.config.ts` (manifest) and
> `src/lib/strings/core.ts`.

## Contents

- [Run it](#run-it)
- [Install on a phone](#install-on-a-phone)
- [How the app is organised](#how-the-app-is-organised)
- [How to add content](#how-to-add-content) (stories, puzzles, festivals, daily plan)
- [How to add audio files](#how-to-add-audio-files)
- [Deploy](#deploy)
- [Backup and moving to a new phone](#backup-and-moving-to-a-new-phone)
- [Debug panel](#debug-panel)
- [Testing](#testing)
- [TODO before relying on it](#todo-before-relying-on-it)
- [Troubleshooting](#troubleshooting)

## Run it

You need [Node.js](https://nodejs.org) 20 or newer (developed on Node 22).

```bash
npm install
npm run dev            # http://localhost:5173
```

To try it on her phone while you develop (both on the same Wi-Fi), run the command below and open
the **Network** address it prints on the phone:

```bash
npm run dev -- --host
```

Other commands:

| Command           | What it does                                                          |
| ----------------- | --------------------------------------------------------------------- |
| `npm run check`   | Typecheck + lint + format check + unit tests (must pass)              |
| `npm run build`   | Production build into `dist/` (static files)                          |
| `npm run preview` | Serve the production build locally (offline mode works here)          |
| `npm run e2e`     | Playwright smoke test (first time: `npx playwright install chromium`) |
| `npm run format`  | Auto-format everything with Prettier                                  |

> The service worker (offline mode, update toast) only runs in the production build
> (`npm run build && npm run preview`, or once deployed), not in `npm run dev`.

## Install on a phone

The app must be served over **https** (any of the hosts in [Deploy](#deploy) do this), or from
`localhost`.

- **Android (Chrome):** open the site and go to Me → App care → **Install Garbh Saathi**, or ⋮ →
  **Install app**.
- **iPhone (Safari):** open the site, tap **Share** → **Add to Home Screen**. Notifications on iPhone
  need iOS 16.4+ and the app added to the Home Screen.

Open it once while online. After that it works without internet. New versions show a soft
"A new version is ready ✨ Refresh" message.

## How the app is organised

```
src/
  app/            routing, layout, providers (settings, profile, toasts, celebration), ErrorBoundary,
                  mini-player, reminder scheduler, PWA updater
  features/
    onboarding/   3-screen onboarding
    home/         Today's Journey, baby size, tips, shloka screen, pull-to-refresh
    stories/      story player + library
    calm/         5-minute guided breathing (timing logic in lib/calm5.ts)
    music/        ragas, mantra counter, breathing, lok geet, karaoke
    games/        GameShell + one folder per game (logic.ts files are unit-tested)
    calendar/     month view, day sheet, own events
    schedule/     schedule editor, "coming up next", reminders
    bonding/      kick counter, letters, talk to baby, papa corner, belly photos
    wellness/     mood, tablet, water, food, yoga, seasonal tips
    garden/       Garden for Baby
    haryana/      festivals, Teej swing, Godh Bharai, after-birth placeholder
    settings/     Me hub, profile, help, backup, keepsake, app care, debug panel
  lib/
    pregnancy.ts  ALL date maths (pure, tested)
    clock.ts      getToday()/getNow() with debug override
    db.ts         Dexie schema + migrations (in-memory fallback)
    content.ts    typed content loading + validation
    plan.ts       daily plan + rotation
    audio.ts      player: family recording → MP3 → text-to-speech
    recorder.ts   voice recording
    ics.ts        calendar export      notify.ts   notifications
    backup.ts     export / restore     logger.ts   local error log
    strings/      every UI text as { en, hinglish }
  content/        JSON content (stories, shlokas, babySize, festivals, games/…)
  components/ui/  Button, Card, BottomSheet, Toggle, ProgressRing, Chip, EmptyState, Toast…
public/
  audio/          your MP3 files (see below)    icons/   app icons
```

**Rule:** text and stories live in `src/content/*.json` or `src/lib/strings/*.ts`, never in
components. You can add or edit content without touching code.

## How to add content

After editing any JSON file, run `npm run check`. A test checks that **all shipped content is
valid**. If something is wrong, the app skips that one entry (it never crashes), and **Debug panel →
Content validation report** shows exactly which entry failed and why. See
[CONTENT_GUIDE.md](CONTENT_GUIDE.md) for tone rules and a checklist.

### Add a story

Add an object to the list in `src/content/stories.json`. The **order of the list is the order
stories arrive day by day** (story #1 on her first day). Keep series parts next to each other.

```json
{
  "id": "nachiketa",
  "emoji": "🔥",
  "title": { "en": "Nachiketa's questions", "hinglish": "Nachiketa ke sawaal" },
  "cards": [
    {
      "image": "👦",
      "text": {
        "en": "Long ago there lived a curious boy named Nachiketa…",
        "hinglish": "Bahut pehle Nachiketa naam ka ek jigyaasu baalak rehta tha…",
        "hi": "बहुत पहले नचिकेता नाम का एक जिज्ञासु बालक रहता था…"
      }
    },
    {
      "image": "🤔",
      "text": { "en": "He asked big questions…", "hinglish": "Usne bade sawaal poochhe…" },
      "choice": {
        "question": {
          "en": "What should Nachiketa do?",
          "hinglish": "Nachiketa ko kya karna chahiye?"
        },
        "options": [
          {
            "label": { "en": "Keep asking", "hinglish": "Poochhta rahe" },
            "lesson": { "en": "Curiosity is a gift.", "hinglish": "Jigyaasa ek vardaan hai." }
          },
          {
            "label": { "en": "Listen patiently", "hinglish": "Dheeraj se sune" },
            "lesson": {
              "en": "Patience brings answers.",
              "hinglish": "Dheeraj se jawaab milte hain."
            }
          }
        ]
      }
    },
    {
      "image": "💛",
      "text": { "en": "And so he learned…", "hinglish": "Aur aise usne seekha…" },
      "say": {
        "en": "Little one, never stop asking questions.",
        "hinglish": "Mere chhote, sawaal poochhna kabhi mat chhodna."
      }
    }
  ],
  "moral": {
    "en": "Curiosity and patience lead to wisdom.",
    "hinglish": "Jigyaasa aur dheeraj se gyaan milta hai."
  },
  "reflection": {
    "en": "What question would you love your child to ask you?",
    "hinglish": "Aap chahengi bachcha aapse kaun sa sawaal poochhe?"
  },
  "audio": {},
  "quiz": [
    {
      "q": { "en": "Nachiketa was curious.", "hinglish": "Nachiketa jigyaasu tha." },
      "answer": true
    }
  ],
  "words": ["QUESTION", "PATIENT"]
}
```

- `text.hi` (Devanagari) is optional. It makes the Hindi phone voice sound natural. Without it, the
  Hinglish text is read.
- `say` adds a highlighted "say this to your baby" line. `choice` adds a gentle choice point where
  both answers teach something.
- `series` + `part` (e.g. `"series": "gita-week", "part": 2`) show "Part 3 tomorrow ✨".
- `words` are for Word Garden: CAPITAL letters only, 2–10 letters.

### Add a puzzle

**Paheli** (`src/content/games/paheli.json`):

```json
{
  "id": "p-kite",
  "riddle": {
    "en": "I fly without wings and dance on a string. What am I?",
    "hinglish": "Bina pankh udti hoon, dhaage par naachti hoon. Main kaun?"
  },
  "answer": { "en": "A kite", "hinglish": "Patang" },
  "emoji": "🪁"
}
```

**Number pattern** (`src/content/games/patterns.json`). The `options` must include the `answer`:

```json
{
  "id": "n19",
  "sequence": [3, 5, 7, 9],
  "answer": 11,
  "options": [10, 11, 12],
  "hint": { "en": "Add 2 each time.", "hinglish": "Har baar 2 jodo." }
}
```

Other game content: `memorySets.json` (8+ emoji items per set), `vedicTricks.json` (steps for each
trick), and `sudoku.json` (how many empty squares per level).

### Add a festival

Festival details live in the `festivals` list in `src/content/festivals.json`. Dates go in `dates` by
year. **Lunar dates are never calculated; check them against a panchang.**

```json
"dates": {
  "2028": { "diwali": "2028-10-17" }
}
```

```json
{
  "id": "chhath",
  "emoji": "🌅",
  "name": { "en": "Chhath", "hinglish": "Chhath" },
  "blurb": {
    "en": "Prayers to the setting and rising sun.",
    "hinglish": "Doobte aur ugte suraj ki puja."
  },
  "activity": {
    "kind": "shloka",
    "label": { "en": "Say the Gayatri mantra", "hinglish": "Gayatri mantra boliye" },
    "to": "/music/mantra/gayatri"
  },
  "caution": {
    "en": "No fasting during pregnancy; please ask your doctor.",
    "hinglish": "Garbhavastha mein vrat nahi; doctor se poochhiye."
  }
}
```

`activity.to` can be any screen: `/stories/<id>`, `/play/<gameId>`, `/music/…`, `/shloka/<id>`,
`/talk`, `/bonding/journal?new=1`, `/festival/<id>`. A banner shows on Today on the day and up to 3
days before.

### Plan specific days (optional)

`src/content/dailyPlan.json` can fix what she gets on a pregnancy day number (1–280). Any day you
don't list rotates automatically, so every day always has something.

```json
"days": {
  "140": { "storyId": "kalpana", "gameType": "babySize", "shlokaId": "gayatri", "promptId": "t-stars" }
}
```

Game types: `memory`, `bubbleMaths`, `storyQuiz`, `wordGarden`, `babySize`, `paheli`, `sudoku`,
`patterns`, `rangoli`, `sanjhi`, `shlokaFill`.

### Other content files

| File                                           | What                                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `shlokas.json`                                 | Devanagari, transliteration, simple letters (for the fill-in game), meaning       |
| `babySize.json`                                | Weeks 4–40: Indian fruit/vegetable, emoji, length, weight, 2 lines of development |
| `ragas.json` / `mantras.json` / `lokGeet.json` | Music corner (lok geet `lines` drive the karaoke)                                 |
| `prompts.json`                                 | Talk-to-baby, Papa's corner and journal prompts                                   |
| `tips.json`                                    | Seasonal tips, food tips (with `caution` / `askDoctor`), yoga per trimester       |
| `src/lib/strings/*.ts`                         | Every button and label, as `{ en, hinglish }`                                     |

## How to add audio files

Put MP3 files in `public/audio/` with these exact names, then rebuild and redeploy. A missing file
never breaks anything: the app uses a family recording or the phone voice, and the music screens
show a friendly "Add an audio file" note with the exact name.

| What             | Folder                  | File name            | Example                                   |
| ---------------- | ----------------------- | -------------------- | ----------------------------------------- |
| Story (Hindi)    | `public/audio/hi/`      | `<story id>.mp3`     | `public/audio/hi/abhimanyu.mp3`           |
| Story (English)  | `public/audio/en/`      | `<story id>.mp3`     | `public/audio/en/dhruva.mp3`              |
| Raga             | `public/audio/ragas/`   | `<raga id>.mp3`      | `public/audio/ragas/yaman.mp3`            |
| Mantra (looping) | `public/audio/mantras/` | `<mantra audio>.mp3` | `public/audio/mantras/mantra-gayatri.mp3` |
| Shloka           | `public/audio/shlokas/` | `<shloka id>.mp3`    | `public/audio/shlokas/gita-2-47.mp3`      |
| Lok geet / lori  | `public/audio/lokgeet/` | `<song id>.mp3`      | `public/audio/lokgeet/chanda-mama.mp3`    |

Order of preference for anything that can be heard: **family recording** (recorded in the app) →
**MP3 file** → **phone text-to-speech**. Use only audio you have the right to use (your own
recordings, or properly licensed/public-domain music). Audio is cached on the phone the first time it
plays, so it works offline afterwards.

## Deploy

It's a static site: `npm run build` creates `dist/`, and that folder is the whole app.

### Netlify (current setup)

The live Netlify project `garbh-saathi` was created and deployed by upload (not linked to GitHub),
so it is redeployed by hand after changes. To make it update itself on every push: Netlify →
**garbh-saathi → Project configuration → Build & deploy → Link repository** and pick this repo.
On the free plan Netlify shows a "Powered by Netlify" badge; the app keeps its bottom bar and
buttons above it (`gs-host-badge` in `src/main.tsx` / `src/index.css`).

### Netlify from GitHub (updates itself)

1. Sign in at [app.netlify.com](https://app.netlify.com) with GitHub.
2. **Add new project → Import an existing project → GitHub →** pick `garbh-saathi`.
3. The build settings fill in from `netlify.toml` (`npm run build`, publish `dist`, Node 22). Click
   **Deploy**.
4. Optional: **Site configuration → Change site name** (e.g. `garbh-saathi` gives
   `garbh-saathi.netlify.app`).

Every push to `main` then redeploys Netlify and GitHub Pages together.

### Netlify (drag and drop, easiest)

1. Run `npm run build`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the **`dist`** folder onto the
   page.
3. Netlify gives you an https address. Open it on her phone and install (see above).

To update later: build again and drag `dist` onto your site's **Deploys** page. The cache headers in
`public/_headers` make sure updates arrive. With **Auto refresh** on (the default, Me → App care) the
app checks every 6 hours and applies a new version at a quiet moment (in the background, or on Today
with nothing playing). With it off, it shows "A new version is ready ✨".

### GitHub Pages

1. Push this project to a GitHub repository (branch `main`).
2. In the repository, go to **Settings → Pages → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy-pages.yml` runs the checks, builds and publishes on every
   push to `main`. Your site appears at `https://<you>.github.io/<repo>/`.

The app uses relative paths and `#/` page addresses, so it works under `/<repo>/` with no extra
configuration.

### Vercel

Import the repository at [vercel.com/new](https://vercel.com/new). The defaults (build
`npm run build`, output `dist`) are correct, and `vercel.json` sets the cache headers.

## Backup and moving to a new phone

Everything is stored **only on the phone**, in the browser's storage for this site.

- **Me → Backup & restore → Export backup file** creates `garbh-saathi-backup-YYYY-MM-DD.json`
  containing letters, photos, recordings, garden, events, kicks, settings and profile. Keep it
  somewhere safe (Google Drive, WhatsApp to yourself, a computer).
- On the new phone, open the app and go to **Restore from a backup file**. It checks the file, shows
  a summary ("14 letters, 6 photos…") and asks before replacing anything.
- A gentle monthly reminder appears on Today once there is something worth keeping.
- Clearing the browser's site data for this app, or uninstalling the browser, deletes the data.
  **Fix app** does not delete it.
- With many recordings and photos the file can be tens of MB. That's fine; one JSON file is the
  simplest thing to keep.

## Debug panel

Me → About → tap the version number **7 times**. It can:

- pretend today is any date or time, or jump to any week
- show the computed state (LMP, EDD, week, trimester, day number, season, today's plan IDs)
- view, copy, export or clear the local error log
- show the content validation report, storage usage and the installed speech voices
- test the Hindi and English voice, send a test notification, simulate a render or async error
- reset onboarding, or wipe all data (two confirmations, the second needs you to type DELETE)

## Testing

- `npm run check`: typecheck, lint, format and **unit tests** (Vitest). They cover:
  - date maths, including IST midnight and the edge cases
  - the daily plan rotation, the content validators, the `.ics` export
  - the season and raga-by-time selectors, the garden, low mood, backup round-trip
  - all game logic (Sudoku validity, memory pairs, word check, bubble questions…)
- `npm run e2e`: one Playwright smoke test. It goes through onboarding with an LMP → checks Today
  shows the correct week → finishes a story → finishes a game → checks the garden count went up →
  reloads and checks everything is still there.

Coding rules worth knowing:

- Never call `new Date()` for app logic. Use `getToday()` / `getNow()` (or the `useNow()` hook) so
  the debug clock works everywhere.
- Never use `new Date('YYYY-MM-DD')` or `toISOString()` for calendar dates. Use `parseLocalDate` /
  `toLocalISO`.
- Animations use `m.div` (not `motion.div`) inside the app-wide `LazyMotion`.
- Database changes: add a new `this.version(n)` block in `src/lib/db.ts` and never edit an old one,
  so her data survives updates.

## TODO before relying on it

- [ ] **Verify every 2026 and 2027 date in `src/content/festivals.json` against a panchang.** They
      were filled in from memory and lunar dates shift every year.
- [ ] **Ask her doctor to look over** the wellness tips, the danger signs (Me → Help), the yoga cards
      and the food cautions.
- [ ] Record family voices for the stories, and add raga/mantra MP3s you have rights to.
- [ ] Fill `dailyPlan.json` and add more stories over time (content matters more than code).

## Troubleshooting

| Problem                              | Likely cause                                | Fix                                                                          |
| ------------------------------------ | ------------------------------------------- | ---------------------------------------------------------------------------- |
| Blank white screen after an update   | Old service worker cache                    | Settings → Fix app, or clear site data in the browser                        |
| Week is off by one day               | Timezone or date parsing                    | Check that `pregnancy.ts` uses local dates and run the tests                 |
| No sound on iPhone                   | Audio started without a tap / silent switch | Tap play, and check that the silent switch is off                            |
| Hindi voice sounds English           | No Hindi TTS voice installed                | Android: Settings → Text-to-speech → install Hindi, or record your own voice |
| Reminders not showing                | Permission denied / app not installed (iOS) | Allow notifications and add to the home screen, or use the calendar export   |
| Data missing on a new phone          | Data is stored per device                   | Export a backup on the old phone and import it on the new one                |
| A story or game doesn't appear       | Bad JSON entry                              | Debug panel → content validation report                                      |
| "Add an audio file" note on a raga   | The MP3 isn't there or is misnamed          | Check the [audio file names](#how-to-add-audio-files), rebuild, redeploy     |
| Microphone doesn't record            | Permission blocked                          | Browser site settings (lock icon) → Microphone → Allow                       |
| Changes don't appear after deploying | The phone still has the old version         | Wait for "A new version is ready", or Me → Refresh app                       |

## Website and publishing

`npm run build` builds the app, then `site/build.mjs` builds the website pages into `dist/`:
articles, week by week, stories, thoughts, About and Privacy.

- **Articles** live in `docs/articles/day-NN{a,b}-slug.md` (front matter, English, `---`, Hindi). They
  publish in order at **9:30 AM and 6:30 PM IST**, from the start slot in
  `docs/articles/schedule.json`. To add more, write the next day's two files; they get the next free
  slots. Never change the start slot, or published dates shift.
- **Publishing gate**: `netlify/edge-functions/site-gate.mjs` → `site/gate.mjs`. Unpublished
  articles return "Coming soon"; `/articles/`, `/sitemap.xml`, `/feed.xml` and `/llms.txt` are
  generated per request from `site/.generated/data.mjs`.
- Article pages are only built on Netlify (or with `BUILD_ARTICLES=1`), so the GitHub Pages copy
  never shows unpublished articles.
- Every page shows the medical disclaimer (`site/templates.mjs` → `DISCLAIMER`).
- Tests: `site/site.test.mjs` (schedule, gate, sitemap, article completeness).
