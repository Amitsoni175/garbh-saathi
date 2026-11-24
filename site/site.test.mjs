import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { loadArticles, parseFrontMatter, splitLanguages } from './build.mjs';
import { handle } from './gate.mjs';
import { articleSlugFromPath, llmsTxt, rssXml, sitemapXml, slotTime } from './lib.mjs';
import { DISCLAIMER } from './templates.mjs';

const cfg = { startDate: '2026-11-24', startSlot: 1 };
const art = (slug, publishAt) => ({
  slug,
  publishAt,
  title: `T ${slug}`,
  title_hi: '',
  description: `D ${slug}`,
  category: 'Guide',
  emoji: '📘',
  readingMin: 3,
});
const data = {
  staticUrls: [{ path: '/', title: 'Home' }],
  articles: [art('old', '2026-11-24T18:30:00+05:30'), art('soon', '2026-11-25T09:30:00+05:30')],
};
const before = new Date('2026-11-25T09:29:00+05:30');
const after = new Date('2026-11-25T09:30:00+05:30');
const next = () => new Response('STATIC');

describe('publishing schedule', () => {
  it('uses 9:30 AM and 6:30 PM India time, two a day, forever', () => {
    expect(slotTime(0, cfg)).toBe('2026-11-24T18:30:00+05:30');
    expect(slotTime(1, cfg)).toBe('2026-11-25T09:30:00+05:30');
    expect(slotTime(2, cfg)).toBe('2026-11-25T18:30:00+05:30');
    expect(slotTime(3, cfg)).toBe('2026-11-26T09:30:00+05:30');
    expect(slotTime(2 * 365, cfg)).toBe('2027-11-24T18:30:00+05:30');
    // 09:30 IST is 04:00 UTC
    expect(new Date(slotTime(1, cfg)).toISOString()).toBe('2026-11-25T04:00:00.000Z');
  });

  it('reads article paths', () => {
    expect(articleSlugFromPath('/articles/')).toBe('');
    expect(articleSlugFromPath('/articles')).toBe('');
    expect(articleSlugFromPath('/articles/abc/')).toBe('abc');
    expect(articleSlugFromPath('/articles/abc')).toBe('abc');
    expect(articleSlugFromPath('/articles/abc/index.html')).toBe('abc');
    expect(articleSlugFromPath('/stories/x/')).toBeNull();
  });
});

describe('edge gate', () => {
  it('hides an article until its time, then serves it', async () => {
    const r1 = await handle(new Request('https://wombtales.in/articles/soon/'), before, next, data);
    expect(r1.status).toBe(404);
    expect(await r1.text()).toContain('Coming soon');
    const r2 = await handle(new Request('https://wombtales.in/articles/soon/'), after, next, data);
    expect(await r2.text()).toBe('STATIC');
    const r3 = await handle(new Request('https://wombtales.in/articles/nope/'), after, next, data);
    expect(r3.status).toBe(404);
  });

  it('lists, maps and feeds only published articles', async () => {
    const list = await (
      await handle(new Request('https://wombtales.in/articles/'), before, next, data)
    ).text();
    expect(list).toContain('/articles/old/');
    expect(list).not.toContain('/articles/soon/');
    expect(list).toContain(DISCLAIMER.en.slice(0, 40));
    const map = await (
      await handle(new Request('https://wombtales.in/sitemap.xml'), after, next, data)
    ).text();
    expect(map).toContain('https://wombtales.in/articles/soon/');
    expect(sitemapXml(data.staticUrls, data.articles, before)).not.toContain('/articles/soon/');
    expect(rssXml(data.articles, before)).not.toContain('/articles/soon/');
    expect(llmsTxt(data.staticUrls, data.articles, after)).toContain('/articles/soon/');
  });

  it('leaves other pages alone', async () => {
    const r = await handle(
      new Request('https://wombtales.in/stories/abhimanyu/'),
      before,
      next,
      data,
    );
    expect(await r.text()).toBe('STATIC');
  });
});

describe('articles', () => {
  it('parses front matter and splits English / Hindi', () => {
    const { meta, body } = parseFrontMatter(
      "---\nday: 3\ntitle: 'It''s here'\n---\n# A\n\nhello\n\n---\n\n# बी\n\nनमस्ते",
    );
    expect(meta).toEqual({ day: 3, title: "It's here" });
    const { en, hi } = splitLanguages(body);
    expect(en).toContain('hello');
    expect(hi).toContain('नमस्ते');
  });

  it('every written article is complete, scheduled in order, and medically careful', async () => {
    const list = await loadArticles();
    expect(list.length).toBeGreaterThanOrEqual(16);
    const slugs = new Set(list.map((a) => a.slug));
    expect(slugs.size).toBe(list.length);
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      expect(a.publishAt).toBe(slotTime(i, cfg));
      expect(a.title, a.file).toBeTruthy();
      expect(a.description, a.file).toBeTruthy();
      expect(a.description.length, a.file).toBeLessThanOrEqual(170);
      expect(a.en.length, a.file).toBeGreaterThan(500);
      expect(a.hi.length, a.file).toBeGreaterThan(200);
      const all = (a.en + a.hi).toLowerCase();
      for (const banned of ['putra prapti', 'boy or girl', 'guaranteed', 'cure'])
        expect(all, `${a.file}: ${banned}`).not.toContain(banned);
    }
  });

  it('schedule file matches the tested start', async () => {
    const s = JSON.parse(await readFile('docs/articles/schedule.json', 'utf8'));
    expect({ startDate: s.startDate, startSlot: s.startSlot }).toEqual(cfg);
  });
});
