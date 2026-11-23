import { describe, expect, it } from 'vitest';
import raw from '@/content/prompts.json';
import { getPrompts } from './content';

describe('talk-to-baby prompts', () => {
  const talk = getPrompts().talk;

  it('has 30 valid prompts, each with an example line in both languages', () => {
    expect(talk).toHaveLength(raw.talk.length);
    expect(talk.length).toBeGreaterThanOrEqual(30);
    expect(new Set(talk.map((p) => p.id)).size).toBe(talk.length);
    for (const p of talk) {
      expect(p.say?.en, p.id).toBeTruthy();
      expect(p.say?.hinglish, p.id).toBeTruthy();
      expect(p.emoji, p.id).toBeTruthy();
    }
  });

  it('feels varied: prompts do not all start the same way', () => {
    const openings = new Set(talk.map((p) => p.text.en.split(' ').slice(0, 2).join(' ')));
    expect(openings.size).toBeGreaterThanOrEqual(talk.length * 0.6);
    expect(new Set(talk.map((p) => p.emoji)).size).toBe(talk.length);
  });
});
