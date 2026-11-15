import { getFestivals } from './content';
import { festivalsAround, nextDateOf, upcomingFestivals } from './festivals';

describe('festivals', () => {
  it('has dates for 2026 and 2027 for every festival', () => {
    const { list, dates } = getFestivals();
    for (const f of list) {
      expect(
        dates.some((d) => d.id === f.id && d.date.startsWith('2026')),
        `${f.id} 2026`,
      ).toBe(true);
      expect(
        dates.some((d) => d.id === f.id && d.date.startsWith('2027')),
        `${f.id} 2027`,
      ).toBe(true);
    }
  });

  it('shows Diwali on the day and up to 3 days before', () => {
    expect(festivalsAround('2026-11-08').map((f) => f.festival.id)).toContain('diwali');
    expect(festivalsAround('2026-11-05').find((f) => f.festival.id === 'diwali')?.daysAway).toBe(3);
    expect(festivalsAround('2026-11-04').map((f) => f.festival.id)).not.toContain('diwali');
    expect(festivalsAround('2026-11-09').map((f) => f.festival.id)).not.toContain('diwali');
  });

  it('shows Hariyali Teej 2027', () => {
    expect(festivalsAround('2027-08-05').map((f) => f.festival.id)).toContain('hariyali-teej');
  });

  it('lists upcoming festivals soonest first', () => {
    const list = upcomingFestivals('2026-11-15');
    expect(list[0]?.festival.id).toBe('gita-jayanti');
    expect(list.every((f, i) => i === 0 || f.daysAway >= (list[i - 1]?.daysAway ?? 0))).toBe(true);
  });

  it('finds the next date of a festival', () => {
    expect(nextDateOf('diwali', '2026-11-15')).toBe('2027-10-29');
  });

  it('links every festival activity to a real screen', () => {
    for (const f of getFestivals().list)
      expect(f.activity.to).toMatch(/^\/(stories|play|music|shloka|talk|bonding|festival)\b/);
  });
});
