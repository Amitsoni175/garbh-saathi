/**
 * HTML templates for the Wombtales website pages. Pure string functions, used by the
 * build script (Node) and the edge function (Deno).
 */
import { SITE, escapeXml as esc, publishedArticles } from './lib.mjs';

export const DISCLAIMER = {
  en: 'General information only, not medical advice. Wombtales is not a healthcare provider, and every pregnancy is different. Please consult your doctor before making any health decision. In an emergency, call 108 or 102, or go to the nearest hospital.',
  hi: 'यह केवल सामान्य जानकारी है, चिकित्सा सलाह नहीं। Wombtales कोई स्वास्थ्य सेवा प्रदाता नहीं है, और हर प्रेग्नेंसी अलग होती है। कोई भी स्वास्थ्य निर्णय लेने से पहले कृपया अपने डॉक्टर से सलाह लें। आपात स्थिति में 108 या 102 पर कॉल करें, या नज़दीकी अस्पताल जाएँ।',
};

export function disclaimerBox() {
  return `<aside class="disclaimer" role="note" aria-label="Disclaimer">
  <strong>⚕️ Please note</strong>
  <p data-lang="en">${esc(DISCLAIMER.en)}</p>
  <p data-lang="hi" lang="hi">${esc(DISCLAIMER.hi)}</p>
</aside>`;
}

const NAV = [
  ['/articles/', 'Articles'],
  ['/pregnancy-week/', 'Week by week'],
  ['/calendar/', 'Calendar'],
  ['/stories/', 'Stories'],
  ['/thoughts/', 'Thoughts'],
  ['/about/', 'Our story'],
];

export function header(active) {
  const links = NAV.map(
    ([href, label]) =>
      `<a href="${href}"${active === href ? ' aria-current="page"' : ''}>${label}</a>`,
  ).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"><span></span></div>
<header class="site-header">
  <a class="brand" href="/"><img src="/icons/icon.svg" alt="" width="34" height="34" /><span>Wombtales</span></a>
  <nav aria-label="Main">${links}</nav>
  <a class="btn btn-small" href="/">Open app</a>
</header>`;
}

export function footer() {
  return `<footer class="site-footer">
  <div class="cta-card">
    <p><strong>Wombtales</strong> is a free, private pregnancy companion: a daily shloka, story, gentle game, raga and talk-to-baby idea. No login, no ads, works offline.</p>
    <a class="btn" href="/">🌸 Open the app</a>
  </div>
  <nav aria-label="Footer">
    <a href="/articles/">Articles</a><a href="/pregnancy-week/">Week by week</a><a href="/calendar/">Calendar</a><a href="/stories/">Stories</a><a href="/thoughts/">Thoughts</a><a href="/about/">Our story</a><a href="/privacy/">Privacy</a><a href="/feed.xml">RSS</a>
  </nav>
  <p class="small">${esc(DISCLAIMER.en)}</p>
</footer>`;
}

/**
 * Full page shell.
 * @param {{ path: string, title: string, description: string, body: string, active?: string,
 *   jsonLd?: object[], ogType?: string, published?: string, bilingual?: boolean, noindex?: boolean }} p
 */
export function page(p) {
  const url = SITE + p.path;
  const ld = (p.jsonLd ?? [])
    .map(
      (o) =>
        `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`,
    )
    .join('\n    ');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.description)}" />
    ${p.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`}
    <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
    <link rel="alternate" type="application/rss+xml" title="Wombtales articles" href="/feed.xml" />
    <meta property="og:type" content="${p.ogType ?? 'website'}" />
    <meta property="og:site_name" content="Wombtales" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og-image.png" />
    <meta property="og:locale" content="en_IN" />
    ${p.published ? `<meta property="article:published_time" content="${p.published}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#FFF8F3" />
    <link rel="stylesheet" href="/site.css" />
    ${ld}
  </head>
  <body${p.bilingual ? ' class="bilingual"' : ''}>
    ${header(p.active)}
    <main id="main">
${p.body}
    </main>
    ${footer()}
    <script src="/site.js" defer></script>
  </body>
</html>
`;
}

export const langToggle = (
  hiLabel = 'हिंदी',
) => `<div class="lang-toggle" role="group" aria-label="Language">
  <button type="button" data-set-lang="en" aria-pressed="true">English</button>
  <button type="button" data-set-lang="hi" aria-pressed="false">${esc(hiLabel)}</button>
</div>`;

export const shareBar = (title) => `<div class="share" data-share-title="${esc(title)}">
  <button type="button" class="btn btn-ghost" data-share>📤 Share</button>
  <a class="btn btn-ghost" data-whatsapp href="#" target="_blank" rel="noopener">WhatsApp</a>
  <button type="button" class="btn btn-ghost" data-copy>🔗 Copy link</button>
</div>`;

export const searchBox = (placeholder) => `<label class="search">
  <span class="sr-only">${esc(placeholder)}</span>
  <input type="search" placeholder="🔎 ${esc(placeholder)}" data-filter />
</label>`;

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

export function articleCard(a) {
  return `<a class="card article-card" href="/articles/${a.slug}/" data-search="${esc(`${a.title} ${a.title_hi} ${a.description} ${a.category}`.toLowerCase())}">
  <span class="chip">${a.emoji} ${esc(a.category)}</span>
  <h2>${esc(a.title)}</h2>
  <p lang="hi" class="muted">${esc(a.title_hi)}</p>
  <p>${esc(a.description)}</p>
  <span class="meta">${fmtDate(a.publishAt)} · ${a.readingMin} min read</span>
</a>`;
}

/** The /articles/ list: built at request time so only published articles appear. */
export function articlesIndexPage(articles, now) {
  const pub = publishedArticles(articles, now);
  const cards = pub.length
    ? pub.map(articleCard).join('\n')
    : '<p class="card">The first articles arrive soon: new reading every day at 9:30 AM and 6:30 PM (India time). 🌸</p>';
  return page({
    path: '/articles/',
    active: '/articles/',
    title: 'Pregnancy articles in English & Hindi – Wombtales',
    description:
      'Calm, honest reading for mothers-to-be: Garbh Sanskar, week-by-week guides, Indian food, stories and shlokas. Two new articles every day. General information, not medical advice.',
    body: `      <section class="hero">
        <h1>Articles</h1>
        <p class="lead">Calm, honest reading for mothers-to-be, in English and Hindi. New every day at <strong>9:30 AM</strong> and <strong>6:30 PM</strong> (IST).</p>
        ${searchBox('Search articles')}
      </section>
      ${disclaimerBox()}
      <section class="grid" data-filter-list>
${cards}
      </section>
      <p class="empty-note" hidden data-empty>No articles match your search.</p>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Wombtales articles',
        url: `${SITE}/articles/`,
        hasPart: pub.slice(0, 50).map((a) => ({
          '@type': 'Article',
          headline: a.title,
          url: `${SITE}/articles/${a.slug}/`,
          datePublished: a.publishAt,
        })),
      },
    ],
  });
}

export function comingSoonPage(path) {
  return page({
    path,
    noindex: true,
    title: 'Coming soon – Wombtales',
    description: 'This article will be published soon.',
    body: `      <section class="hero"><h1>Coming soon 🌸</h1>
      <p class="lead">This article isn't published yet. New articles arrive every day at 9:30 AM and 6:30 PM (India time).</p>
      <p><a class="btn" href="/articles/">See all articles</a></p></section>`,
  });
}
