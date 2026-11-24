/**
 * Tell Bing, Yandex, Seznam, Naver and other IndexNow search engines about new or changed pages.
 * Usage: node site/indexnow.mjs [hours=24]   (sends pages published in the last N hours, plus lists)
 * The key file is public/<key>.txt (IndexNow keys are public by design).
 */
import { readFile } from 'node:fs/promises';
import { loadArticles } from './build.mjs';
import { SITE } from './lib.mjs';

const KEY = '83b86afeb1f24081899db0f6f0a77423';

export function recentUrls(articles, now, hours) {
  const since = now.getTime() - hours * 3_600_000;
  const fresh = articles
    .filter((a) => {
      const t = Date.parse(a.publishAt);
      return t <= now.getTime() && t > since;
    })
    .map((a) => `${SITE}/articles/${a.slug}/`);
  return [
    ...fresh,
    `${SITE}/articles/`,
    `${SITE}/sitemap.xml`,
    `${SITE}/feed.xml`,
    `${SITE}/llms.txt`,
  ];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await readFile(new URL(`../public/${KEY}.txt`, import.meta.url), 'utf8');
  const hours = Number(process.argv[2] ?? 24);
  const urlList = recentUrls(await loadArticles(), new Date(), hours);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'wombtales.in',
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList,
    }),
  });
  console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
  for (const u of urlList) console.log(' ', u);
}
