import { describe, expect, it } from 'vitest';
import raw from '@/content/thoughts.json';
import { getThoughts, isThought, shouldAutoOpen, thoughtForDay } from './thoughts';

describe('thought of the day', () => {
  it('every thought is valid, bilingual and has a line for baby', () => {
    expect(raw.length).toBeGreaterThanOrEqual(50);
    for (const t of raw) expect(isThought(t), t.id).toBe(true);
    expect(getThoughts()).toHaveLength(raw.length);
    expect(new Set(raw.map((t) => t.id)).size).toBe(raw.length);
    // Hindi text really is in Devanagari.
    for (const t of getThoughts()) expect(t.text.hi, t.id).toMatch(/[ऀ-ॿ]/);
  });

  it('gives a different thought each day and wraps around', () => {
    const list = getThoughts();
    expect(thoughtForDay(0)?.id).toBe(list[0]?.id);
    expect(thoughtForDay(1)?.id).not.toBe(thoughtForDay(0)?.id);
    expect(thoughtForDay(list.length)?.id).toBe(list[0]?.id);
    expect(thoughtForDay(-1)?.id).toBe(list[list.length - 1]?.id);
  });

  it('opens by itself only on the first visit of the day', () => {
    expect(shouldAutoOpen(null, '2026-11-23')).toBe(true);
    expect(shouldAutoOpen('2026-11-22', '2026-11-23')).toBe(true);
    expect(shouldAutoOpen('2026-11-23', '2026-11-23')).toBe(false);
  });

  it('stays gentle: no gender preference, no IQ claims', () => {
    const all = JSON.stringify(raw).toLowerCase();
    for (const banned of ['iq', 'putra prapti', 'boy or girl', 'gender'])
      expect(all).not.toContain(banned);
  });
});
