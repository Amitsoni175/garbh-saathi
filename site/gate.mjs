/**
 * Publishing gate, run by the Netlify edge function on every request to the
 * article pages and search files. Articles become visible at their publish time
 * (9:30 AM and 6:30 PM IST); nothing needs to be redeployed for that.
 */
import { articleSlugFromPath, isPublished, llmsTxt, rssXml, sitemapXml } from './lib.mjs';
import { articlesIndexPage, comingSoonPage } from './templates.mjs';

const HEADERS = { 'cache-control': 'public, max-age=0, must-revalidate' };
const html = (body, status = 200) =>
  new Response(body, {
    status,
    headers: { ...HEADERS, 'content-type': 'text/html; charset=utf-8' },
  });
const text = (body, type) =>
  new Response(body, { headers: { ...HEADERS, 'content-type': `${type}; charset=utf-8` } });

/**
 * @param {Request} req
 * @param {Date} now
 * @param {() => Promise<Response> | Response} next  serve the static file
 * @param {{ articles: any[], staticUrls: any[] }} data
 */
export async function handle(req, now, next, data) {
  const { pathname } = new URL(req.url);
  if (pathname === '/sitemap.xml')
    return text(sitemapXml(data.staticUrls, data.articles, now), 'application/xml');
  if (pathname === '/feed.xml') return text(rssXml(data.articles, now), 'application/rss+xml');
  if (pathname === '/llms.txt')
    return text(llmsTxt(data.staticUrls, data.articles, now), 'text/plain');

  const slug = articleSlugFromPath(pathname);
  if (slug === null) return next();
  if (slug === '') return html(articlesIndexPage(data.articles, now));
  const article = data.articles.find((a) => a.slug === slug);
  if (!article || !isPublished(article, now)) return html(comingSoonPage(pathname), 404);
  return next();
}
