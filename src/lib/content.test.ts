import {
  checkStory,
  getContentIssues,
  isL10n,
  loadStories,
  validateAllContent,
  validateList,
} from './content';

describe('content validation', () => {
  it('all shipped content is valid', async () => {
    const issues = await validateAllContent();
    expect(issues).toEqual([]);
  });

  it('ships at least 10 stories, with Abhimanyu first, in both languages', async () => {
    const stories = await loadStories();
    expect(stories.length).toBeGreaterThanOrEqual(10);
    expect(stories[0]?.id).toBe('abhimanyu');
    expect(stories[0]?.cards.every((c) => c.text.hi)).toBe(true);
    for (const s of stories) {
      expect(s.cards.length).toBeGreaterThanOrEqual(5);
      expect(s.cards.every((c) => c.text.en && c.text.hinglish)).toBe(true);
    }
    const gita = stories.filter((s) => s.series === 'gita-week').map((s) => s.part);
    expect(gita).toEqual([1, 2, 3]);
  });

  it('never mentions gender prediction or IQ claims', async () => {
    const text = JSON.stringify(await loadStories()).toLowerCase();
    for (const banned of ['putra prapti', 'iq', 'boy or girl', 'gender'])
      expect(text).not.toContain(banned);
  });

  it('skips a malformed entry and reports why, keeping the good ones', () => {
    const before = getContentIssues().length;
    const good = {
      id: 'ok',
      title: { en: 'A', hinglish: 'A' },
      cards: [{ text: { en: 'x', hinglish: 'x' } }],
      moral: { en: 'm' },
      reflection: { en: 'r' },
    };
    const bad = { id: 'bad', title: { en: 'B' }, cards: [] };
    const out = validateList('test.json', [good, bad, 'nonsense', good], checkStory);
    expect(out).toHaveLength(1);
    const added = getContentIssues().slice(before);
    expect(added.map((i) => i.reason)).toEqual([
      'needs at least one card',
      'Entry is not an object',
      'Duplicate id "ok"',
    ]);
  });

  it('rejects words that are not capital letters', () => {
    expect(
      checkStory({
        id: 'w',
        title: { en: 'x' },
        cards: [{ text: { en: 'x' } }],
        moral: { en: 'm' },
        reflection: { en: 'r' },
        words: ['dhruva'],
      }),
    ).toMatch(/CAPITAL/);
  });

  it('isL10n needs English text', () => {
    expect(isL10n({ en: 'hi', hinglish: 'hi' })).toBe(true);
    expect(isL10n({ en: 'hi' })).toBe(true);
    expect(isL10n({ hinglish: 'hi' })).toBe(false);
    expect(isL10n('hi')).toBe(false);
  });

  it('reports a non-list file', () => {
    expect(validateList('x.json', { not: 'a list' }, () => null)).toEqual([]);
  });
});
