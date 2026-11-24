#!/usr/bin/env node
/**
 * Builds the website pages next to the app in dist/:
 *   /articles/<slug>/      every written article (published on schedule by the edge function)
 *   /pregnancy-week/...    weeks 4–40 from the app's baby-size content
 *   /stories/...           every story from the app
 *   /thoughts/             all Thoughts of the Day
 *   /about/, /privacy/
 * and site/.generated/data.mjs (article schedule + page list) for the edge function.
 *
 * Usage: node site/build.mjs [outDir]   (default: dist)
 * Article pages are only written on Netlify (where the edge function controls publishing),
 * or when BUILD_ARTICLES=1, so other hosts never show unpublished articles.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { SITE, escapeXml as esc, llmsTxt, sitemapXml, slotTime } from './lib.mjs';
import { disclaimerBox, langToggle, page, searchBox, shareBar } from './templates.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, process.argv[2] ?? 'dist');
const WITH_ARTICLES = process.env.NETLIFY === 'true' || process.env.BUILD_ARTICLES === '1';
const TODAY = new Date().toISOString().slice(0, 10);

const readJson = async (p) => JSON.parse(await readFile(join(ROOT, p), 'utf8'));
async function write(path, html) {
  const file = join(OUT, path, path.endsWith('.xml') || path.endsWith('.txt') ? '' : 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9ऀ-ॿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

// ---------- Markdown helpers ----------

export function parseFrontMatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"')))
      v = v.slice(1, -1).replace(/''/g, "'");
    meta[kv[1]] = /^\d+$/.test(v) ? Number(v) : v;
  }
  return { meta, body: m[2] };
}

/** English part before the first "---" rule, Hindi after it. */
export function splitLanguages(body) {
  const parts = body.split(/\n---\n/);
  return { en: (parts[0] ?? '').trim(), hi: parts.slice(1).join('\n---\n').trim() };
}

function renderMd(md) {
  const html = marked.parse(md, { async: false });
  // Give h2s ids for the "In this article" links.
  return html.replace(/<h2>(.*?)<\/h2>/g, (_, inner) => {
    const id = slugify(inner.replace(/<[^>]+>/g, ''));
    return `<h2 id="${id}">${inner}</h2>`;
  });
}

const headings = (md) =>
  [...md.matchAll(/^## (.+)$/gm)].map((m) => ({
    text: m[1].replace(/[*_`]/g, ''),
    id: slugify(m[1].replace(/[*_`]/g, '')),
  }));
const words = (s) => s.split(/\s+/).filter(Boolean).length;
const stripFirstH1 = (md) => md.replace(/^# .+\n+/, '');

// ---------- Articles ----------

async function loadArticles() {
  const dir = join(ROOT, 'docs/articles');
  const schedule = await readJson('docs/articles/schedule.json');
  const files = (await readdir(dir)).filter((f) => /^day-\d+[ab]-.+\.md$/.test(f)).sort();
  const story = await readFile(join(ROOT, 'docs/OUR_STORY.md'), 'utf8');
  const items = [];
  for (const f of files) {
    const { meta, body } = parseFrontMatter(await readFile(join(dir, f), 'utf8'));
    let { en, hi } = splitLanguages(body);
    if (/OUR_STORY\.md/.test(body)) {
      en =
        '# ' +
        meta.title +
        '\n\n' +
        story
          .split('## English')[1]
          .split('## हिंदी')[0]
          .replace(/^### .+\n/m, '');
      hi = story.split('## हिंदी')[1].split('## Notes')[0].replace(/^### /m, '# ');
    }
    items.push({ meta, en, hi, file: f });
  }
  items.sort(
    (a, b) => a.meta.day - b.meta.day || String(a.meta.slot).localeCompare(String(b.meta.slot)),
  );
  return items.map((it, index) => {
    const guide = it.meta.slot === 'A';
    return {
      ...it,
      slug: it.meta.slug,
      title: it.meta.title,
      title_hi: it.meta.title_hi ?? '',
      description: it.meta.description ?? '',
      keyword: it.meta.keyword ?? '',
      category: guide ? 'Guide' : 'Story & culture',
      emoji: guide ? '📘' : '🪷',
      readingMin: Math.max(2, Math.round(words(it.en) / 200)),
      publishAt: slotTime(index, schedule),
    };
  });
}

function articlePage(a) {
  const enBody = stripFirstH1(a.en);
  const hiBody = stripFirstH1(a.hi);
  const toc = headings(enBody);
  const tocHi = headings(hiBody);
  const url = `${SITE}/articles/${a.slug}/`;
  const body = `      <article class="article">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="/articles/">Articles</a> › <span>${esc(a.category)}</span></nav>
        <h1>${esc(a.title)}</h1>
        ${a.title_hi ? `<p class="subtitle" lang="hi">${esc(a.title_hi)}</p>` : ''}
        <p class="meta">${a.emoji} ${esc(a.category)} · ${a.readingMin} min read · <time datetime="${a.publishAt}" data-local-date>${a.publishAt.slice(0, 10)}</time></p>
        ${disclaimerBox()}
        <div class="key-points">
          <p class="lead">${esc(a.description)}</p>
          ${toc.length ? `<details open><summary>In this article</summary><ol data-lang="en">${toc.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol><ol data-lang="hi" lang="hi">${tocHi.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></details>` : ''}
        </div>
        ${a.hi ? langToggle() : ''}
        <div class="prose" data-lang="en">
${renderMd(enBody)}
        </div>
        ${a.hi ? `<div class="prose" data-lang="hi" lang="hi">\n${renderMd(hiBody)}\n        </div>` : ''}
        ${disclaimerBox()}
        ${shareBar(a.title)}
        <p class="more"><a class="btn" href="/articles/">More articles</a></p>
      </article>`;
  return page({
    path: `/articles/${a.slug}/`,
    active: '/articles/',
    title: `${a.title} | Wombtales`,
    description: a.description,
    ogType: 'article',
    published: a.publishAt,
    bilingual: Boolean(a.hi),
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title,
        alternativeHeadline: a.title_hi || undefined,
        description: a.description,
        keywords: a.keyword,
        inLanguage: a.hi ? ['en', 'hi'] : 'en',
        datePublished: a.publishAt,
        dateModified: a.publishAt,
        image: `${SITE}/og-image.png`,
        isAccessibleForFree: true,
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'Wombtales', url: SITE },
        publisher: {
          '@type': 'Organization',
          name: 'Wombtales',
          logo: { '@type': 'ImageObject', url: `${SITE}/icons/icon-512.png` },
        },
      },
      breadcrumb([
        ['Articles', '/articles/'],
        [a.title, `/articles/${a.slug}/`],
      ]),
    ],
  });
}

function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: SITE + path,
    })),
  };
}

// ---------- Week by week ----------

const trimesterOf = (w) => (w <= 12 ? 1 : w <= 27 ? 2 : 3);

function weekPage(s, prev, next) {
  const w = s.week;
  const grams =
    s.weightG < 1
      ? 'less than 1 g'
      : s.weightG >= 1000
        ? `${(s.weightG / 1000).toFixed(1)} kg`
        : `${s.weightG} g`;
  const title = `Pregnancy week ${w}: baby is about the size of a ${s.name.en.toLowerCase()}`;
  const desc = `Week ${w} of pregnancy in English and Hinglish: your baby is about the size of a ${s.name.en.toLowerCase()} (about ${s.lengthCm} cm, ${grams}). What is developing this week, and a line to say to your baby.`;
  const devEn = s.development.map((d) => `<li>${esc(d.en)}</li>`).join('');
  const devHi = s.development.map((d) => `<li>${esc(d.hinglish)}</li>`).join('');
  const body = `      <article class="article">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="/pregnancy-week/">Week by week</a> › <span>Week ${w}</span></nav>
        <h1>${esc(title)}</h1>
        <p class="meta">Trimester ${trimesterOf(w)} · about ${Math.max(0, 40 - w)} weeks to go</p>
        <div class="week-hero card"><span class="big-emoji" aria-hidden="true">${s.emoji}</span>
          <div><p class="lead"><strong>${esc(s.name.en)}</strong> · <span lang="hi-Latn">${esc(s.name.hinglish)}</span></p>
          <p>About <strong>${s.lengthCm} cm</strong> · <strong>${grams}</strong></p></div></div>
        ${disclaimerBox()}
        ${langToggle('Hinglish')}
        <div class="prose" data-lang="en"><h2>This week</h2><ul>${devEn}</ul>
          <p>Every baby grows at their own pace; these sizes are rough averages. Your doctor reads your scans.</p>
          <blockquote>Little one, this week you are as big as a ${esc(s.name.en.toLowerCase())}. I love you more every day.</blockquote></div>
        <div class="prose" data-lang="hi" lang="hi-Latn"><h2>Is hafte</h2><ul>${devHi}</ul>
          <p>Har baby apni raftaar se badhta hai; yeh andaaze hain. Scan aapke doctor dekhte hain.</p>
          <blockquote>Mere chhote, is hafte tum ${esc(s.name.hinglish)} jitne bade ho. Main tumse roz aur zyada pyaar karti hoon.</blockquote></div>
        <nav class="pager" aria-label="Weeks">${prev ? `<a class="btn btn-ghost" href="/pregnancy-week/${prev.week}/">← Week ${prev.week}</a>` : '<span></span>'}${next ? `<a class="btn btn-ghost" href="/pregnancy-week/${next.week}/">Week ${next.week} →</a>` : ''}</nav>
        ${shareBar(title)}
      </article>`;
  return page({
    path: `/pregnancy-week/${w}/`,
    active: '/pregnancy-week/',
    title: `${title} | Wombtales`,
    description: desc,
    bilingual: true,
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: desc,
        inLanguage: ['en', 'hi'],
        image: `${SITE}/og-image.png`,
        author: { '@type': 'Organization', name: 'Wombtales' },
        publisher: { '@type': 'Organization', name: 'Wombtales' },
        mainEntityOfPage: `${SITE}/pregnancy-week/${w}/`,
        dateModified: TODAY,
      },
      breadcrumb([
        ['Week by week', '/pregnancy-week/'],
        [`Week ${w}`, `/pregnancy-week/${w}/`],
      ]),
    ],
  });
}

function weeksHub(sizes) {
  const cards = sizes
    .map(
      (s) =>
        `<a class="card week-card" href="/pregnancy-week/${s.week}/" data-search="${esc(`week ${s.week} ${s.name.en} ${s.name.hinglish}`.toLowerCase())}"><span class="big-emoji" aria-hidden="true">${s.emoji}</span><strong>Week ${s.week}</strong><span>${esc(s.name.en)}</span></a>`,
    )
    .join('\n');
  return page({
    path: '/pregnancy-week/',
    active: '/pregnancy-week/',
    title: 'Pregnancy week by week in English & Hinglish – baby size and growth | Wombtales',
    description:
      'Week-by-week pregnancy guide from week 4 to 40: how big your baby is (as a fruit), what is developing, and a sweet line to say to your baby. General information, not medical advice.',
    body: `      <section class="hero"><h1>Pregnancy week by week</h1>
      <p class="lead">How big is your baby this week? Pick your week.</p>${searchBox('Find a week or fruit')}</section>
      <section class="grid grid-weeks" data-filter-list>
${cards}
      </section>
      <p class="empty-note" hidden data-empty>No week matches your search.</p>
      ${disclaimerBox()}`,
  });
}

// ---------- Stories ----------

function storyPage(s) {
  const cardsEn = s.cards
    .map(
      (c) =>
        `<p><span class="card-emoji" aria-hidden="true">${c.image ?? ''}</span> ${esc(c.text.en)}</p>${c.say ? `<blockquote>💛 ${esc(c.say.en)}</blockquote>` : ''}`,
    )
    .join('\n');
  const cardsHi = s.cards
    .map(
      (c) =>
        `<p><span class="card-emoji" aria-hidden="true">${c.image ?? ''}</span> ${esc(c.text.hi ?? c.text.hinglish)}</p>${c.say ? `<blockquote>💛 ${esc(c.say.hinglish)}</blockquote>` : ''}`,
    )
    .join('\n');
  const title = `${s.title.en}: a story for Garbh Sanskar`;
  const desc = `${s.title.en} (${s.title.hinglish}), retold gently in English and Hinglish for mothers-to-be to read aloud to their baby. Lesson: ${s.moral.en}`;
  const body = `      <article class="article">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="/stories/">Stories</a> › <span>${esc(s.title.en)}</span></nav>
        <h1><span aria-hidden="true">${s.emoji}</span> ${esc(s.title.en)}</h1>
        <p class="subtitle" lang="hi-Latn">${esc(s.title.hinglish)}</p>
        <p class="meta">A story to read aloud · ${s.cards.length} short parts</p>
        ${langToggle('Hinglish')}
        <div class="prose story" data-lang="en">${cardsEn}
          <h2>The lesson</h2><p class="lead">🌟 ${esc(s.moral.en)}</p>
          <h2>A thought for you</h2><p>${esc(s.reflection.en)}</p></div>
        <div class="prose story" data-lang="hi" lang="hi-Latn">${cardsHi}
          <h2>Seekh</h2><p class="lead">🌟 ${esc(s.moral.hinglish)}</p>
          <h2>Aapke liye ek sawaal</h2><p>${esc(s.reflection.hinglish)}</p></div>
        <div class="cta-card"><p>Listen to this story, record it in your own voice, and play its quiz in the Wombtales app.</p><a class="btn" href="/#/stories/${s.id}">🎧 Open in the app</a></div>
        ${shareBar(title)}
      </article>`;
  return page({
    path: `/stories/${s.id}/`,
    active: '/stories/',
    title: `${title} | Wombtales`,
    description: desc,
    bilingual: true,
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: s.title.en,
        alternateName: s.title.hinglish,
        description: desc,
        inLanguage: ['en', 'hi'],
        genre: 'Story',
        audience: { '@type': 'PeopleAudience', audienceType: 'Expecting parents' },
        publisher: { '@type': 'Organization', name: 'Wombtales' },
        url: `${SITE}/stories/${s.id}/`,
      },
      breadcrumb([
        ['Stories', '/stories/'],
        [s.title.en, `/stories/${s.id}/`],
      ]),
    ],
  });
}

function storiesHub(stories) {
  const cards = stories
    .map(
      (s) =>
        `<a class="card story-card" href="/stories/${s.id}/" data-search="${esc(`${s.title.en} ${s.title.hinglish} ${s.moral.en}`.toLowerCase())}"><span class="big-emoji" aria-hidden="true">${s.emoji}</span><h2>${esc(s.title.en)}</h2><p class="muted" lang="hi-Latn">${esc(s.title.hinglish)}</p><p>${esc(s.moral.en)}</p></a>`,
    )
    .join('\n');
  return page({
    path: '/stories/',
    active: '/stories/',
    title:
      'Garbh Sanskar stories in English & Hinglish – Ramayana, Mahabharata, Panchatantra | Wombtales',
    description: `${stories.length} gentle stories to read aloud to your baby: Abhimanyu, Dhruva, Prahlad, Krishna, Panchatantra, Birbal and inspiring Indians like Kalpana Chawla and Saina Nehwal.`,
    body: `      <section class="hero"><h1>Stories for your baby</h1>
      <p class="lead">${stories.length} gentle stories to read aloud, each with a lesson and a line to say to your baby.</p>${searchBox('Search stories')}</section>
      <section class="grid" data-filter-list>
${cards}
      </section>
      <p class="empty-note" hidden data-empty>No story matches your search.</p>`,
  });
}

// ---------- Thoughts ----------

function thoughtsHub(thoughts) {
  const items = thoughts
    .map(
      (
        t,
      ) => `<article class="card thought" id="${t.id}" data-search="${esc(`${t.source.en} ${t.text.en}`.toLowerCase())}">
  <p class="chip">${t.emoji} ${esc(t.source.en)}</p>
  ${t.original ? `<p class="original" lang="sa">“${esc(t.original)}”</p>` : ''}
  <p class="lead">${esc(t.text.en)}</p>
  <p lang="hi">${esc(t.text.hi)}</p>
  <p class="say">💛 ${esc(t.say.en)}<br /><span lang="hi">${esc(t.say.hi)}</span></p>
</article>`,
    )
    .join('\n');
  return page({
    path: '/thoughts/',
    active: '/thoughts/',
    title:
      'Positive thoughts for pregnancy in Hindi & English – Gita, Ramayana, Bible, Gurbani | Wombtales',
    description: `${thoughts.length} hope-giving thoughts for mothers-to-be from the Bhagavad Gita, Ramayana, Mahabharata, Bible, Gurbani, Socrates, Lao Tzu, Aristotle, Roy T. Bennett and The Alchemist, each with a line to say to your baby.`,
    body: `      <section class="hero"><h1>Thoughts for the journey</h1>
      <p class="lead">One a day in the app. All of them here, in English and Hindi.</p>${searchBox('Search by source or word')}</section>
      <section class="stack" data-filter-list>
${items}
      </section>
      <p class="empty-note" hidden data-empty>No thought matches your search.</p>`,
  });
}

// ---------- About and Privacy ----------

function storySection(md) {
  return md
    .trim()
    .split('\n\n')
    .map((p) =>
      p
        .split('\n')
        .map((l) => l.trim())
        .join(' '),
    )
    .map((p) =>
      p.startsWith('### ')
        ? `<h2>${esc(p.slice(4))}</h2>`
        : `<p>${esc(p)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/_(.+?)_/g, '<em>$1</em>')}</p>`,
    )
    .join('\n');
}

async function aboutPage() {
  const story = await readFile(join(ROOT, 'docs/OUR_STORY.md'), 'utf8');
  const en = story
    .split('## English')[1]
    .split('## हिंदी')[0]
    .replace(/^\s*### .+\n/, '');
  const hi = story
    .split('## हिंदी')[1]
    .split('## Notes')[0]
    .replace(/^\s*### .+\n/, '');
  return page({
    path: '/about/',
    active: '/about/',
    title: 'Our story – Wombtales',
    description:
      'We tried more than ten pregnancy apps and none felt right. So we built a light, private, offline companion for a mother-to-be.',
    bilingual: true,
    body: `      <article class="article">
        <h1>Our story: how Wombtales began</h1>
        ${langToggle()}
        <div class="prose" data-lang="en">${storySection(en)}</div>
        <div class="prose" data-lang="hi" lang="hi"><h2>हमारी कहानी</h2>${storySection(hi)}</div>
        <p><a class="btn" href="/">🌸 Open Wombtales</a></p>
      </article>`,
  });
}

function privacyPage() {
  return page({
    path: '/privacy/',
    title: 'Privacy – Wombtales',
    description:
      'Wombtales has no login, no ads and no trackers, and collects no personal or health data. Everything you add stays only on your phone.',
    bilingual: true,
    body: `      <article class="article">
        <h1>Privacy: your data stays on your phone</h1>
        ${langToggle()}
        <div class="prose" data-lang="en">
          <p class="lead">Wombtales was built because pregnancy apps kept asking for our data. So this one asks for nothing.</p>
          <div class="card"><h2>The short version</h2><ul>
            <li><strong>No account, no login.</strong> We never ask for your phone number or email.</li>
            <li><strong>We collect no personal or health information.</strong> Your dates, name, letters to baby, voice recordings, photos, moods, kicks and progress are saved only in your phone's browser storage. They are never sent to us or anyone else.</li>
            <li><strong>No ads, no analytics, no trackers, no cookies.</strong></li>
            <li><strong>Nothing is sold or shared</strong>, because we never have it.</li></ul></div>
          <h2>Health-data laws (HIPAA, DPDP Act)</h2>
          <p>Laws like <strong>HIPAA</strong> (USA) and India's <strong>Digital Personal Data Protection Act, 2023</strong> set rules for organisations that collect and store people's personal or health information. Wombtales is not a hospital, clinic or insurer, and it does not collect, store or process anyone's personal or health data on any server, so there is nothing for us to hold, share or lose. We designed it this way on purpose: privacy by design.</p>
          <h2>Not medical advice</h2>
          <p>Everything in the app and on this website is general information for comfort and bonding. It is <strong>not medical advice</strong>, diagnosis or treatment. Please consult your doctor for any health question. In an emergency, call 108 or 102, or go to the nearest hospital. Wombtales never predicts or helps choose a baby's sex (illegal in India under the PCPNDT Act).</p>
          <h2>Backups</h2><p>If you tap Backup, the app makes a file on your own phone. You decide where it goes. We never see it.</p>
          <h2>Reminders and the phone voice</h2><p>Reminders are made by your phone, and "Listen" uses your phone's own voice. Neither sends your data to us.</p>
          <h2>Hosting</h2><p>The website's files are delivered by a hosting service (Netlify). Like any website host, it may keep standard technical logs such as IP addresses for security, for a short time. Wombtales does not collect or read them.</p>
          <h2>Deleting your data</h2><p>Clearing the site's data in your browser, or uninstalling the app, deletes it from your phone. Make a backup first if you want to keep your letters and photos.</p>
          <p class="muted"><em>Last updated: November 2026.</em></p>
        </div>
        <div class="prose" data-lang="hi" lang="hi">
          <p class="lead">Wombtales इसलिए बना क्योंकि प्रेग्नेंसी ऐप हमारा डेटा माँगते रहे। यह ऐप कुछ नहीं माँगता।</p>
          <div class="card"><ul>
            <li><strong>कोई अकाउंट या लॉगिन नहीं।</strong> हम कभी फ़ोन नंबर या ईमेल नहीं माँगते।</li>
            <li><strong>हम कोई निजी या स्वास्थ्य जानकारी इकट्ठा नहीं करते।</strong> आपकी तारीखें, नाम, चिट्ठियाँ, रिकॉर्डिंग, फ़ोटो, सब कुछ सिर्फ़ आपके फ़ोन में रहता है।</li>
            <li><strong>न विज्ञापन, न एनालिटिक्स, न ट्रैकर, न कुकीज़।</strong></li>
            <li><strong>कुछ भी बेचा या साझा नहीं होता</strong>, क्योंकि वह हमारे पास होता ही नहीं।</li></ul></div>
          <h2>स्वास्थ्य-डेटा कानून (HIPAA, DPDP)</h2>
          <p>HIPAA (अमेरिका) और भारत का डिजिटल पर्सनल डेटा प्रोटेक्शन एक्ट, 2023 उन संस्थाओं पर लागू होते हैं जो लोगों की निजी या स्वास्थ्य जानकारी इकट्ठा करती हैं। Wombtales किसी की भी जानकारी किसी सर्वर पर नहीं रखता, इसलिए हमारे पास रखने, बाँटने या खोने को कुछ नहीं है।</p>
          <h2>चिकित्सा सलाह नहीं</h2>
          <p>ऐप और वेबसाइट की हर बात सामान्य जानकारी है, <strong>चिकित्सा सलाह नहीं</strong>। किसी भी स्वास्थ्य प्रश्न के लिए कृपया अपने डॉक्टर से सलाह लें। आपात स्थिति में 108 या 102 पर कॉल करें।</p>
        </div>
      </article>`,
  });
}

// ---------- Main ----------

async function main() {
  const [sizes, stories, thoughts] = await Promise.all([
    readJson('src/content/babySize.json'),
    readJson('src/content/stories.json'),
    readJson('src/content/thoughts.json'),
  ]);
  const weekList = (Array.isArray(sizes) ? sizes : sizes.sizes)
    .slice()
    .sort((a, b) => a.week - b.week);
  const articles = await loadArticles();

  const staticUrls = [
    { path: '/', title: 'Wombtales app (home)', lastmod: TODAY },
    { path: '/articles/', title: 'Articles', lastmod: TODAY },
    { path: '/pregnancy-week/', title: 'Pregnancy week by week', lastmod: TODAY },
    { path: '/stories/', title: 'Stories for Garbh Sanskar', lastmod: TODAY },
    { path: '/thoughts/', title: 'Thoughts for pregnancy', lastmod: TODAY },
    { path: '/about/', title: 'Our story', lastmod: TODAY },
    { path: '/privacy/', title: 'Privacy', lastmod: TODAY },
    ...weekList.map((s) => ({ path: `/pregnancy-week/${s.week}/`, lastmod: TODAY })),
    ...stories.map((s) => ({ path: `/stories/${s.id}/`, lastmod: TODAY })),
  ];

  await write('/about/', await aboutPage());
  await write('/privacy/', privacyPage());
  await write('/pregnancy-week/', weeksHub(weekList));
  for (let i = 0; i < weekList.length; i++)
    await write(
      `/pregnancy-week/${weekList[i].week}/`,
      weekPage(weekList[i], weekList[i - 1], weekList[i + 1]),
    );
  await write('/stories/', storiesHub(stories));
  for (const s of stories) await write(`/stories/${s.id}/`, storyPage(s));
  await write('/thoughts/', thoughtsHub(thoughts));
  if (WITH_ARTICLES) for (const a of articles) await write(`/articles/${a.slug}/`, articlePage(a));

  // Fallback search files for hosts without the edge function (no articles listed there).
  await write('/sitemap.xml', sitemapXml(staticUrls, [], new Date()));
  await write('/llms.txt', llmsTxt(staticUrls, [], new Date()));

  // Data for the edge function (schedule + page list).
  const meta = articles.map(
    ({ slug, title, title_hi, description, category, emoji, readingMin, publishAt }) => ({
      slug,
      title,
      title_hi,
      description,
      category,
      emoji,
      readingMin,
      publishAt,
    }),
  );
  await mkdir(join(ROOT, 'site/.generated'), { recursive: true });
  await writeFile(
    join(ROOT, 'site/.generated/data.mjs'),
    `// Generated by site/build.mjs. Do not edit.\nexport const articles = ${JSON.stringify(meta, null, 2)};\nexport const staticUrls = ${JSON.stringify(staticUrls)};\n`,
  );

  console.log(
    `site: ${weekList.length} week pages, ${stories.length} story pages, ${thoughts.length} thoughts, ${articles.length} articles ${WITH_ARTICLES ? 'written' : 'skipped (not Netlify)'}; next to publish: ${articles.find((a) => Date.parse(a.publishAt) > Date.now())?.publishAt ?? 'none queued'}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { loadArticles };
