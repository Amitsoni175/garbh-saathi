import { dayPart, isNightHour, resolveNight } from './timeOfDay';

describe('timeOfDay', () => {
  it.each([
    [4, 'night'],
    [5, 'morning'],
    [11, 'morning'],
    [12, 'afternoon'],
    [16, 'afternoon'],
    [17, 'evening'],
    [19, 'evening'],
    [20, 'night'],
    [23, 'night'],
  ] as const)('hour %i is %s', (hour, part) => {
    expect(dayPart(hour)).toBe(part);
  });

  it('night window is 20:00–05:59', () => {
    expect([19, 20, 0, 5, 6].map(isNightHour)).toEqual([false, true, true, true, false]);
  });

  it('manual override beats time and system', () => {
    expect(resolveNight('day', 22, true)).toBe(false);
    expect(resolveNight('night', 10, false)).toBe(true);
  });

  it('auto follows the clock or the system dark setting', () => {
    expect(resolveNight('auto', 10, false)).toBe(false);
    expect(resolveNight('auto', 21, false)).toBe(true);
    expect(resolveNight('auto', 10, true)).toBe(true);
  });
});
