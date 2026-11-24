# Changelog

## 1.5.0 · The Wombtales website: articles on schedule, week by week, stories (2026-11-24)

- **Articles publish by themselves, two a day, at 9:30 AM and 6:30 PM IST.**
  - All written articles are deployed in advance. A Netlify edge function (`site/gate.mjs`) shows
    each one only after its publish time. Until then its address returns "Coming soon" (404).
  - The article list, `sitemap.xml`, `feed.xml` (RSS) and `llms.txt` are built live, so they only
    ever include published articles.
  - Order and times come from `docs/articles/schedule.json` (first slot: 24 Nov 2026, 6:30 PM).
    New `day-NNx` files simply take the next free slots.
- **Every article and guide page carries a disclaimer**: general information only, not medical
  advice, consult your doctor, and in an emergency call 108/102.
- **SEO and AI-friendly pages**: clean titles and descriptions, canonical links, Article /
  BreadcrumbList / CollectionPage structured data, "In this article" summaries, RSS, and `llms.txt`
  for AI assistants.
- **New pages built from the app's content** (`site/build.mjs`, runs after the app build):
  37 week-by-week pages (`/pregnancy-week/4/` to `/40/`), 62 story pages (`/stories/<id>/`), a
  Thoughts page, About and Privacy.
- **Interactive and smooth**: English/हिंदी (or Hinglish) switch that remembers your choice, live
  search on list pages, reading progress bar, Share / WhatsApp / Copy link, cards that float in,
  dark mode, and a sticky menu.
- **Privacy page** now explains HIPAA (USA) and India's DPDP Act 2023: Wombtales collects no personal
  or health data at all.
- **App**: a "Today's reading" card on Today, and Articles / Our story / Privacy links in Me → About.

## 1.4.0 · Garbh Saathi is now Wombtales (2026-11-24)

- **New name: Wombtales**, everywhere she sees it: home-screen name, welcome screen, notifications,
  calendar, media player, install button, backups (`wombtales-backup-….json`).
  - Kept on purpose: the phone's storage name (no data lost) and calendar event IDs (no duplicate
    reminders). Backups made before the rename still restore.
- **Search basics** for https://wombtales.in:
  - A real title and description, canonical link, WhatsApp/Facebook preview image (`og-image.png`)
    and `WebApplication` structured data.
  - `robots.txt` and `sitemap.xml`.
  - Plain pages Google can read: **Our story** (`/about/`, English and Hindi) and **Privacy**
    (`/privacy/`), linked from Me → About. The offline service worker leaves them alone.
- The bottom bar now moves above the Netlify badge on any address where the badge appears (not
  only `netlify.app`).

## 1.3.0 · New talk-to-baby prompts (2026-11-23)

- **All 30 talk-to-baby prompts replaced** after feedback that they felt repetitive (most began
  "Tell your baby about…").
  - The new ones are varied: good-morning chats, describing the smell of chai, introducing a family
    member, counting taps, humming, a "window radio show", answering kicks, a recipe, a childhood
    game, three thanks, a word of the day, Papa's voice, a walk of sounds, crops and animals, a tiny
    story with baby as the hero, Chanda Mama, the night sky, and the first minute you'll meet.
  - Each prompt now has its own emoji and a **"You could say…"** example line in English and
    Hinglish. Blanks (___) invite her own words.
  - A test keeps them varied and checks every prompt has an example line.

## 1.2.0 · Thought of the Day (2026-11-23)

- **Thought of the Day / आज का विचार**: a new, hope-giving thought every day, shown in **English and
  Hindi (Devanagari)**, with the original words where there are any (Sanskrit, Tulsidas, Gurbani,
  Kabir).
  - 57 thoughts from the Bhagavad Gita, the Ramayana and Ramcharitmanas, the Mahabharata and the
    Upanishads, the Bible, Gurbani and the Ardas, Socrates, Lao Tzu, Aristotle, Roy T. Bennett,
    The Alchemist, Tagore, Vivekananda, Kabir, Kalam, Gandhi, the Buddha, Helen Keller and Mother
    Teresa. The sources alternate so consecutive days feel different.
  - It opens by itself the **first time she opens the app each day**, and stays as a card on Today.
  - Every thought ends with a line to **recite to baby** in both languages. "I recited it to baby"
    adds a flower (once a day).
  - She can listen in Hindi or English with the phone voice.
  - Content lives in `src/content/thoughts.json` and is checked by tests (both languages, a baby line,
    real Devanagari, no banned words).

## 1.1.0 · More stories, more play, 5-minute calm, auto refresh (2026-11-23)

- **50 new stories (62 in total)**, so about two months pass before a story repeats.
  - First batch of 30: Ramayana and Mahabharata, the Puranas, Panchatantra and Jataka, Birbal and
    Tenali, and inspiring Indians (Kalam, Savitribai Phule, Neeraj Chopra, Mary Kom, Sakshi Malik,
    Sardar Patel).
  - New batch of 20: Kevat, Yashoda sees the universe, Daanveer Karna, Valmiki, the Akshaya Patra,
    Ganesha writes the Mahabharata, Lav-Kush, Satyakam, the elephants and the mice, the dreamer and
    the pot of flour, the doves who flew together, Birbal's line, Birbal and the well, the sparrow and
    the grain of dal, the wise old swan, C. V. Raman, Ramanujan, Saina Nehwal (Hisar), Bachendri Pal
    and Dr. Kurien.
  - 20 new riddles (36 in total) and 10 new number patterns (28 in total).
- **More interactive stories**:
  - Tap the picture on any card to make it wiggle and sparkle.
  - React to each card with 💛 😊 😮 🙏 (little floating emoji).
  - "I said it to baby" on each say-line, which answers with floating hearts.
  - A **Quick check** card after the lesson: one true/false question with a gentle answer.
- **Two new games (13 in total)**:
  - **Sargam Echo**: the flowers sing a short tune on Sa Re Ga Ma Pa, and she plays it back. The
    tunes grow from 2 to 5 notes; a slip simply replays the tune.
  - **Shabd Khoj**: a 6×6 word search in five themes (family, baby things, sky and earth, village
    life, good feelings), in English or Hinglish. Tap a word's first and last letter.
- **5-minute calm**: a guided breathing session in five parts:
  1. settle
  2. belly breathing (4 in, 4 out)
  3. long out-breath (4 in, 6 out)
  4. gentle Bhramari hum
  5. a hug for baby
  - It never asks her to hold her breath, and carries a doctor note.
  - Optional voice guide and a soft bell between parts; the screen stays awake where supported.
  - Open it from Today, Music and Wellness.
- **Auto refresh every 6 hours** (on by default, Me → App care):
  - The app checks for a new version and recomputes today.
  - A new version is applied only at a quiet moment: in the background, or on Today with nothing
    playing. Never mid-story.

## 1.0.0 · Phase 9: PWA, backup, polish, deploy (2026-11-15)

- **Offline and installable** (vite-plugin-pwa / Workbox):
  - The app shell, every code chunk and the woff2 fonts are precached; audio and images are cached
    the first time they are used. Checked by loading the app, going offline and opening Today,
    stories, games, music, calendar and wellness.
  - The manifest has 192/512 and maskable lotus icons, an apple-touch-icon and iOS meta tags.
  - Relative paths (`base: './'`) make one build work on Netlify, Vercel and GitHub Pages.
- **Updates and repair**:
  - **Update toast**: "A new version is ready ✨ Refresh" (`registerType: 'prompt'`). The app checks
    hourly, on pull-to-refresh and from Me → Refresh app.
  - **Fix app**: after a confirmation it unregisters the service worker and clears caches. It keeps
    all of her data.
  - **Cache headers** (`public/_headers`, `vercel.json`) keep index.html, sw.js and the manifest from
    being cached aggressively; hashed assets are cached for a year.
- **Install**: an install button on Android Chrome, and step-by-step instructions on iPhone.
  Persistent storage is requested after onboarding.
- **Backup & restore**:
  - One `garbh-saathi-backup-YYYY-MM-DD.json` file, with photos and recordings base64-encoded,
    shared or downloaded.
  - Restore checks the file first and shows a summary ("14 letters, 6 photos…"). It then replaces
    the data in one all-or-nothing transaction.
  - A gentle monthly backup reminder appears on Today.
- **Keepsake letters**: a printable page of her letters (Print → Save as PDF).
- **Debug panel finished**:
  - today's plan IDs and the season
  - the content validation report and the list of speech voices
  - Hindi/English voice tests and a test notification
  - reset onboarding, and wipe-all with two confirmations
- **Playwright smoke test** (`npm run e2e`): onboarding with LMP → correct week → story → game →
  the garden count goes up → still there after a reload.
- **Lighthouse (mobile, onboarding screen)**: Performance 88, Accessibility 100, Best Practices 100.
  The first-load JavaScript is about 94 KB gzipped (budget 250 KB).
- **Docs**: full README (run, phone install, adding content with copy-paste examples, audio file
  names, Netlify drag-and-drop / GitHub Pages / Vercel, backup, troubleshooting) and the
  CONTENT_GUIDE. A GitHub Pages workflow is included.
- Sanjhi image saving works on older iPhones (`roundRect` fallback).

## 0.8.0 · Phase 8: Haryana layer + Festivals (2026-11-15)

- **festivals.json** with 2026 and 2027 dates for Lohri, Makar Sankranti, Basant Panchami,
  Holi/Dhulandi, Baisakhi, Hariyali Teej, Raksha Bandhan, Janmashtami, Navratri/Sanjhi, Dussehra,
  Karva Chauth, Ahoi Ashtami, Diwali and Gita Jayanti (Kurukshetra). Dates are never computed. ⚠️
  They were filled in from memory and must be checked against a panchang (README TODO).
- **Festival banner** on Today on the day and up to 3 days before ("Aaj hai! 🎉" / "Kal" / "2 din
  mein"), with a linked activity:
  - Teej → swing and monsoon song
  - Navratri → Sanjhi Decorator
  - Ahoi Ashtami → letter to baby
  - Gita Jayanti → Gita Week (and it unlocks the whole series)
  - Diwali → rangoli
  - Holi → Prahlad
  - Janmashtami → Baby Krishna
  - …and so on.
- **Gentle festival care notes**: no fasting in pregnancy for Karva Chauth and Ahoi Ashtami (talk to
  the doctor), distance from smoke and crackers, only a soft sit on the Teej swing, natural colours
  for Holi.
- **Festival pages**, including an animated Teej swing under a neem branch, and a **festival list**
  with "N days away".
- **Godh Bharai memories**: several photos (compressed) and family notes.
- **After-birth placeholder**: congratulations, "coming soon: Kuan Pujan, Chhuchhak, Namkaran,
  lullabies", and a button to mark that baby has arrived. It opens from the 42-week card.
- Festival markers in the calendar and festival treasures in the garden (from Phase 6/2), now tested
  against the real festival data.
- Buttons with long labels now wrap instead of overflowing.

## 0.7.0 · Phase 7: Bonding + Wellness (2026-11-15)

- **Kick counter**: a big pulsing tap button and a timer that starts at the first kick. It saves
  "10 kicks in X minutes" automatically (or a shorter session on request), shows a soft line chart
  of the last 14 sessions, and always shows the note "fewer movements than usual → call your
  doctor right away".
- **Letters to Baby**: a prompt of the day, text or voice letters, filters (letters / story thoughts
  / talks) and a confirmed delete. Festival links can open the composer directly.
- **Talk to baby** and **Papa's Corner**: daily prompts and short read-aloud tales for Papa, with
  optional recording.
- **Belly photos**: take or choose a photo. It is compressed to about 300 KB (JPEG, max 1280px) and
  saved with the week. There is a gallery, a full-screen slideshow, and a Sanjhi-art tab for saved
  Sanjhi designs.
- **Wellness**:
  - **Mood**: a one-tap check-in with 5 emoji, an optional note and a weekly strip. After 3 low
    days in a row, a gentle card shows the Tele-MANAS 14416 call button and encourages talking to
    family and the doctor.
  - **Tablet and water**: an iron / calcium tablet tracker (one flower a day), and a water tracker
    with a goal of 9 glasses, or 12 in April–June.
  - **Food and seasonal tips**: food tips from the Haryanvi kitchen (season first, cautions marked,
    "ask your doctor" for panjiri and gond laddoos), and seasonal tips.
  - **Yoga**: yoga and pranayama cards for the current trimester, with "only with your doctor's
    approval".
- **Care row** on Today (tablet, water, mood, kicks), and the low-mood card on Today when needed.
- **Help card**: tap-to-call 108, 104 and 14416, editable doctor and hospital numbers, and calm
  danger signs.
- **Profile**: edit names and the LMP/EDD (with validation). Every screen recomputes.
- **Me tab is now a hub**: journey summary, bonding and care shortcuts, then settings (including the
  relaxed game timer).

## 0.6.0 · Phase 6: Calendar + Schedule (2026-11-15)

- **Month calendar**: soft dots for each day's stories, games, letters and kick counts. Markers for
  trimester changes, week 20, week 28, week 37, the due date and Haryana festivals.
- **Day sheet**: milestones and festivals, her events (with a confirmed delete), stories to replay,
  games, tablet, mood, water, kick sessions, letters and voice notes, and photos.
- **Own events**: doctor visits, scans, Godh Bharai or anything else, with an optional reminder
  (an hour before, or at 8 AM for all-day events).
- **Schedule & reminders** (Me → Schedule): the default rhythm (07:00 shloka and raga, 09:00
  tablet, 13:00 story, 17:00 game, 21:00 lullaby/talk/journal). Each can be edited or switched off.
  There are water reminders every 2 or 3 hours, and a kick-count reminder suggested from week 28.
  The wording is always gentle.
- **.ics export** ("Add to my phone calendar"): daily recurring events in IST with alarms (VALARM)
  until two weeks after the EDD, plus her events. Lines are folded and text is escaped (RFC 5545),
  and the file is checked with a standard iCalendar parser. Phones can share it straight to the
  calendar app.
- **In-app notifications**: she sees an explanation before the permission prompt, and a test
  notification is available. If permission is denied there is clear help, and the app keeps
  working. There is an honest note about iPhone (iOS 16.4+, added to the Home Screen).
- **"Coming up next"** on Today, and an in-app reminder check every 30 seconds (a toast when she is
  looking, a notification when the app is in the background).

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
