import { getNow, getToday, setDateOverride, setTimeOverride } from './clock';
import { toLocalISO } from './pregnancy';

describe('clock', () => {
  afterEach(() => {
    setDateOverride(null);
    setTimeOverride(null);
  });

  const real = new Date(2026, 10, 15, 14, 30);

  it('returns the real date at local midnight with no override', () => {
    const today = getToday(real);
    expect(toLocalISO(today)).toBe('2026-11-15');
    expect(today.getHours()).toBe(0);
  });

  it('honours a date override but keeps the real time', () => {
    setDateOverride('2027-01-26');
    expect(toLocalISO(getToday(real))).toBe('2027-01-26');
    expect(getNow(real).getHours()).toBe(14);
  });

  it('honours a time override', () => {
    setTimeOverride('21:15');
    const now = getNow(real);
    expect([now.getHours(), now.getMinutes()]).toEqual([21, 15]);
    expect(toLocalISO(now)).toBe('2026-11-15');
  });

  it('ignores invalid overrides', () => {
    setDateOverride('2026-02-30');
    setTimeOverride('25:00');
    expect(getNow(real).getTime()).toBe(real.getTime());
  });
});
