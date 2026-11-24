/**
 * Website logic shared by the build script (Node) and the Netlify edge function (Deno).
 * Pure functions only: no file system, no network.
 */

export const SITE = 'https://wombtales.in';
export const IST_OFFSET = '+05:30';
/** Two articles a day, India time. */
export const SLOTS = ['09:30', '18:30'];

/**
 * Publish time of the n-th article (0-based) in the queue.
 * @param {number} index
 * @param {{ startDate: string, startSlot: number }} cfg startDate 'YYYY-MM-DD' (IST), startSlot 0 or 1
 * @returns {string} ISO time with the IST offset, e.g. 2026-11-24T18:30:00+05:30
 */
export function slotTime(index, cfg) {
  const total = cfg.startSlot + index;
  const day = Math.floor(total / SLOTS.length);
  const slot = SLOTS[total % SLOTS.length];
  const [y, m, d] = cfg.startDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + day));
  const iso = date.toISOString().slice(0, 10);
  return `${iso}T${slot}:00${IST_OFFSET}`;
}

export const isPublished = (item, now) => Date.parse(item.publishAt) <= now.getTime();

export function publishedArticles(articles, now) {
  return articles
    .filter((a) => isPublished(a, now))
    .sort((a, b) => Date.parse(b.publishAt) - Date.parse(a.publishAt));
}

/** '/articles/x', '/articles/x/', '/articles/x/index.html' → 'x'. '/articles/' → ''. */
export function articleSlugFromPath(pathname) {
  const m = /^\/articles\/?([^/]*)(?:\/(?:index\.html)?)?$/.exec(pathname);
  return m ? decodeURIComponent(m[1] ?? '') : null;
}

export const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export function sitemapXml(staticUrls, articles, now) {
  const urls = [
    ...staticUrls.map((u) => ({ loc: SITE + u.path, lastmod: u.lastmod })),
    ...publishedArticles(articles, now).map((a) => ({
      loc: `${SITE}/articles/${a.slug}/`,
      lastmod: a.publishAt.slice(0, 10),
    })),
  ];
  const body = urls
    .map(
      (u) =>
        `  <url><loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function rssXml(articles, now) {
  const items = publishedArticles(articles, now)
    .slice(0, 30)
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE}/articles/${a.slug}/</link>
      <guid>${SITE}/articles/${a.slug}/</guid>
      <pubDate>${new Date(a.publishAt).toUTCString()}</pubDate>
      <description>${escapeXml(a.description)}</description>
    </item>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Wombtales articles</title>
    <link>${SITE}/articles/</link>
    <description>Calm, honest reading for mothers-to-be, in English and Hindi. General information only, not medical advice.</description>
    <language>en-IN</language>
${items}
  </channel>
</rss>
`;
}

/** llms.txt: a plain map of the site for AI assistants and answer engines. */
export function llmsTxt(staticUrls, articles, now) {
  const pub = publishedArticles(articles, now);
  const lines = [
    '# Wombtales',
    '',
    "> Wombtales (https://wombtales.in) is a free, private pregnancy companion web app from India, in English and Hindi. It offers a daily shloka, story, gentle game, raga and talk-to-baby idea. No login, no ads, and all personal data stays on the user's phone. Content is general information only, not medical advice; readers should consult their doctor.",
    '',
    '## Key pages',
    ...staticUrls.filter((u) => u.title).map((u) => `- [${u.title}](${SITE}${u.path})`),
    '',
    '## Articles',
    ...pub.map((a) => `- [${a.title}](${SITE}/articles/${a.slug}/): ${a.description}`),
    '',
  ];
  return lines.join('\n');
}
