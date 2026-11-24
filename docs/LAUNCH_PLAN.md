# Launch plan: Garbh Saathi → Wombtales (wombtales.in)

Status: **in progress.** Domain bought and live with HTTPS (2026-11-24); rename and search basics done in 1.4.0. Next: Step 2 (move her data) and Search Console. Agreed on 2026-11-23. Nothing below has been changed in the app yet.

## Step 0 · Owner buys the domain

- [x] Buy **wombtales.in** (BigRock) (1 year, no add-ons: no privacy, email, builder, hosting or SSL).
- [ ] Tell Claude it is bought.

## Step 1 · Connect the domain

- [x] Netlify → project `garbh-saathi` → Domain management → Add a domain → `wombtales.in`.
- [ ] At the registrar's DNS: `A @ → 75.2.60.5` (check the value Netlify shows) and
      `CNAME www → garbh-saathi.netlify.app`. Delete any old `A @` record.
- [x] Wait for free HTTPS, then check `https://wombtales.in` and `https://www.wombtales.in`.
      Done 2026-11-24: DNS moved to Netlify DNS (name servers changed at BigRock); certificate issued;
      `www` redirects to `wombtales.in`.
- [ ] Optional: in Netlify, rename the project to `wombtales` (→ `wombtales.netlify.app`).
- [ ] Optional: link the GitHub repo in Netlify (Build & deploy → Link repository) so every push
      deploys by itself.
- [ ] Remove the `gs-host-badge` space on the custom domain if no badge shows there (it only applies
      to `*.netlify.app`).

## Step 2 · Move her data to the new address

Each web address keeps its own data on the phone, so her letters, photos, recordings and garden
must be carried over by hand:

1. On the **old** address she uses (Netlify or GitHub link): Me → **Backup** → save the file.
2. Open **https://wombtales.in** → finish onboarding quickly → Me → **Backup** → **Restore** the
   file.
3. Check letters, photos, recordings and garden count.
4. Install the new address to her home screen; remove the old home-screen icon.
5. Later: show a gentle "We've moved to wombtales.in" note on the old addresses (keep them working).

## Step 3 · Rename the app to Wombtales

- [ ] Name in `index.html` (`<title>`, `apple-mobile-web-app-title`), the PWA manifest
      (`vite.config.ts`: name, short_name, description), onboarding welcome text, Me → About,
      keepsake page, backup file name (`wombtales-backup-…json`, but keep restoring old
      `garbh-saathi` backups), `.ics` calendar names, notifications.
- [ ] Keep the internal database name `garbh-saathi` (renaming it would lose data on the phone).
- [ ] Icons: keep the lotus, or a new Wombtales icon.
- [ ] README, CONTENT_GUIDE, CHANGELOG; GitHub repo rename optional (GitHub redirects old links).
- [ ] Tagline idea: "Wombtales: stories, shlokas and calm for you and your baby".

## Step 4 · Search basics (technical SEO)

- [x] Real `<title>` and meta description, e.g. "Wombtales – Free Garbh Sanskar App in Hindi &
      English | Daily Stories, Shlokas, Music".
- [x] A static landing page with real text that Google can read without JavaScript (what it is,
      features, privacy, "Open the app").
- [x] Open Graph / WhatsApp preview image and text.
- [x] Structured data (`WebApplication`, free, Health & Lifestyle).
- [x] `robots.txt` and `sitemap.xml`.
- [x] About and Privacy pages (who made it, why, no data collected). Use the text in
      [OUR_STORY.md](OUR_STORY.md) for "Our story" in the app (Me → About) and on the website.
- [x] Google Search Console: Domain property verified by TXT record in Netlify DNS (keep it);
      sitemap submitted; `/`, `/about/`, `/privacy/` requested for indexing (2026-11-24).
- [ ] Bing Webmaster Tools: import from Google Search Console.

## Step 5 · Content website (the main ranking driver)

Static, readable HTML pages built from the app's existing content (outside the `#/` app routes):

- [ ] 40 week-by-week pages ("Pregnancy week 24 in Hindi: baby size, tips, a shloka").
- [ ] 62 story pages ("Abhimanyu story for Garbh Sanskar, Hindi/English").
- [ ] 57 Thought of the Day pages ("Gita quotes for pregnancy in Hindi").
- [ ] Haryana pages: Teej, Sanjhi, Godh Bharai, lok geet.
- [ ] Blog: 2–3 new articles a week afterwards.
- [ ] Every page links into the app ("Listen to this story in Wombtales").

Target long phrases first: garbh sanskar stories in hindi, garbh sanskar app free, pregnancy
shlokas with meaning, abhimanyu story garbh sanskar, haryanvi lok geet pregnancy, pregnancy week by
week in hindi, godh bharai rasam haryana.

## Step 6 · Getting found and trusted

- [ ] Doctor review of health pages ("Reviewed by Dr. ___"), danger signs, wellness tips.
- [ ] Verify festival dates and facts about real people.
- [ ] YouTube Shorts / Instagram reels: story or shloka of the day, linking to the site.
- [ ] Share in mom groups (WhatsApp, Facebook, Reddit r/India, r/BabyBumps), PWA directories,
      local Haryana blogs/news.
- [ ] Later: Google Play listing via Bubblewrap/PWABuilder ($25 once, needs a privacy policy page).

Expect first results for long phrases in 4–8 weeks, wider ranking in 3–6 months with steady content.

## Principles that stay

- Private: no login, no ads, no analytics; her data stays on her phone.
- Honest: no IQ or "dream baby" claims, no gender prediction (PCPNDT Act), "please check with your
  doctor" on health content.
- Free.

## Competitors (researched 2026-11-23)

Garbh Sanskar apps: Garbh Sanskar Guru, DreamChild, Garbh Sanskar: Krishna Coming, DreamStar Baby,
Abhimanyu Garbh Sanskar, AADEE. Indian parenting sites with blogs: Healofy, BabyChakra, Mylo,
FirstCry Parenting, Momspresso, Parentune. Global: BabyCenter (babycenter.in), What to Expect, Flo.
They lead on articles, experts, community and regional languages; Wombtales stands out on privacy,
a daily ritual (shloka, story, game, raga, talk), the Haryanvi touch, honesty and being free.
