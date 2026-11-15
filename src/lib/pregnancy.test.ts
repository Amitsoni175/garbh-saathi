import {
  computePregnancy,
  dateForWeek,
  eddFromLmp,
  lmpFromEdd,
  parseLocalDate,
  resolveDateInput,
  toLocalISO,
  trimesterForWeeks,
} from './pregnancy';

/** Local-midnight date helper for readable tests. */
const d = (iso: string) => {
  const date = parseLocalDate(iso);
  if (!date) throw new Error(iso);
  return date;
};

describe('parseLocalDate / toLocalISO', () => {
  it('round-trips a date', () => {
    expect(toLocalISO(d('2026-03-09'))).toBe('2026-03-09');
  });

  it('parses as local midnight, not UTC', () => {
    const date = d('2026-01-01');
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([
      2026, 0, 1, 0,
    ]);
  });

  it('rejects malformed or impossible dates', () => {
    expect(parseLocalDate('2026-02-31')).toBeNull();
    expect(parseLocalDate('2026-13-01')).toBeNull();
    expect(parseLocalDate('12/03/2026')).toBeNull();
    expect(parseLocalDate('')).toBeNull();
  });

  it('accepts a leap day', () => {
    expect(parseLocalDate('2028-02-29')).not.toBeNull();
  });
});

describe("Naegele's rule", () => {
  it('EDD = LMP + 280 days', () => {
    expect(eddFromLmp('2026-06-01')).toBe('2027-03-08');
  });

  it('LMP = EDD − 280 days', () => {
    expect(lmpFromEdd('2027-03-08')).toBe('2026-06-01');
  });

  it('crosses a leap year correctly', () => {
    expect(eddFromLmp('2027-06-01')).toBe('2028-03-07');
    expect(lmpFromEdd('2028-03-07')).toBe('2027-06-01');
  });

  it('crosses the March daylight-saving change correctly', () => {
    // Matters only for users outside India, but must never shift by a day.
    expect(eddFromLmp('2026-01-01')).toBe('2026-10-08');
  });
});

describe('computePregnancy', () => {
  const lmp = '2026-06-01';

  it('Week 22 · Day 3', () => {
    const s = computePregnancy(lmp, d(dateForWeek(lmp, 22, 3)));
    expect(s.weeks).toBe(22);
    expect(s.days).toBe(3);
    expect(s.contentWeek).toBe(23);
    expect(s.trimester).toBe(2);
    expect(s.gestationalDays).toBe(157);
    expect(s.dayNumber).toBe(158);
    expect(s.daysToGo).toBe(123);
    expect(s.stage).toBe('normal');
    expect(s.edd).toBe('2027-03-08');
  });

  it('day of LMP is Week 0 · Day 0, content week 1, day 1', () => {
    const s = computePregnancy(lmp, d(lmp));
    expect([s.weeks, s.days, s.contentWeek, s.dayNumber, s.percent]).toEqual([0, 0, 1, 1, 0]);
    expect(s.trimester).toBe(1);
  });

  it('ignores the time of day of `today`', () => {
    const late = d('2026-06-10');
    late.setHours(23, 59, 59);
    expect(computePregnancy(lmp, late).gestationalDays).toBe(9);
  });

  it('computes percent complete', () => {
    expect(computePregnancy(lmp, d(dateForWeek(lmp, 20))).percent).toBe(50);
  });

  it.each([
    [0, 1],
    [13, 1],
    [14, 2],
    [27, 2],
    [28, 3],
    [41, 3],
  ])('week %i is trimester %i', (week, tri) => {
    expect(trimesterForWeeks(week)).toBe(tri);
    expect(computePregnancy(lmp, d(dateForWeek(lmp, week, 6))).trimester).toBe(tri);
  });

  it('on the EDD: 40 weeks, any-day-now mode, 0 days to go', () => {
    const s = computePregnancy(lmp, d('2027-03-08'));
    expect([s.weeks, s.days, s.daysToGo, s.dayNumber, s.percent]).toEqual([40, 0, 0, 280, 100]);
    expect(s.stage).toBe('anyDay');
  });

  it('day before EDD is still normal', () => {
    expect(computePregnancy(lmp, d('2027-03-07')).stage).toBe('normal');
  });

  it('past 42 weeks: overdue mode, values clamped', () => {
    const s = computePregnancy(lmp, d(dateForWeek(lmp, 42, 2)));
    expect(s.stage).toBe('overdue');
    expect(s.contentWeek).toBe(42);
    expect(s.dayNumber).toBe(280);
    expect(s.percent).toBe(100);
    expect(s.daysToGo).toBe(0);
  });

  it('before LMP (scan-revised EDD): early stage, values clamped', () => {
    const s = computePregnancy(lmp, d('2026-05-25'));
    expect(s.stage).toBe('early');
    expect([s.weeks, s.days, s.contentWeek, s.dayNumber, s.percent]).toEqual([0, 0, 1, 1, 0]);
  });

  it('throws on an invalid stored LMP', () => {
    expect(() => computePregnancy('nope', d('2026-06-01'))).toThrow();
  });
});

describe('resolveDateInput: validation and edge cases', () => {
  const today = d('2026-11-15');

  it('accepts a valid LMP and returns the EDD', () => {
    expect(resolveDateInput('lmp', '2026-07-01', today)).toEqual({
      ok: true,
      lmp: '2026-07-01',
      edd: '2027-04-07',
    });
  });

  it('accepts LMP = today', () => {
    expect(resolveDateInput('lmp', '2026-11-15', today).ok).toBe(true);
  });

  it('rejects an LMP in the future', () => {
    expect(resolveDateInput('lmp', '2026-11-16', today)).toEqual({
      ok: false,
      error: 'lmpInFuture',
    });
  });

  it('asks her to check an LMP more than 300 days ago', () => {
    expect(resolveDateInput('lmp', toLocalISO(new Date(2026, 10, 15 - 300)), today).ok).toBe(true);
    expect(resolveDateInput('lmp', toLocalISO(new Date(2026, 10, 15 - 301)), today)).toEqual({
      ok: false,
      error: 'lmpTooOld',
    });
  });

  it('accepts a valid EDD and returns the LMP', () => {
    expect(resolveDateInput('edd', '2027-04-07', today)).toEqual({
      ok: true,
      lmp: '2026-07-01',
      edd: '2027-04-07',
    });
  });

  it('rejects an EDD more than 300 days ahead', () => {
    expect(resolveDateInput('edd', toLocalISO(new Date(2026, 10, 15 + 300)), today).ok).toBe(true);
    expect(resolveDateInput('edd', toLocalISO(new Date(2026, 10, 15 + 301)), today)).toEqual({
      ok: false,
      error: 'eddTooFarAhead',
    });
  });

  it('rejects an EDD more than 30 days in the past', () => {
    expect(resolveDateInput('edd', '2026-10-16', today).ok).toBe(true);
    expect(resolveDateInput('edd', '2026-10-15', today)).toEqual({
      ok: false,
      error: 'eddTooFarPast',
    });
  });

  it('rejects garbage', () => {
    expect(resolveDateInput('lmp', '2026-02-30', today)).toEqual({
      ok: false,
      error: 'invalidDate',
    });
  });
});

describe('timezone safety', () => {
  // vi.stubEnv sets process.env.TZ; Node applies a TZ change immediately.
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('no off-by-one at midnight in IST', () => {
    vi.stubEnv('TZ', 'Asia/Kolkata');
    // 00:05 IST on 15 Nov is still 14 Nov in UTC (18:35). A UTC-based
    // implementation would report yesterday here.
    const justAfterMidnight = new Date(2026, 10, 15, 0, 5);
    expect(justAfterMidnight.toISOString().slice(0, 10)).toBe('2026-11-14'); // the trap
    expect(toLocalISO(justAfterMidnight)).toBe('2026-11-15'); // what we use

    const justBeforeMidnight = new Date(2026, 10, 14, 23, 55);
    const lmp = '2026-06-01';
    const before = computePregnancy(lmp, justBeforeMidnight);
    const after = computePregnancy(lmp, justAfterMidnight);
    expect(after.gestationalDays - before.gestationalDays).toBe(1);
    expect(after.gestationalDays).toBe(167); // 1 Jun → 15 Nov
    expect(`Week ${after.weeks} · Day ${after.days}`).toBe('Week 23 · Day 6');
  });

  it('stored dates parse to the same calendar day in IST and in a negative-offset zone', () => {
    for (const tz of ['Asia/Kolkata', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
      vi.stubEnv('TZ', tz);
      expect(toLocalISO(d('2026-11-15'))).toBe('2026-11-15');
      expect(computePregnancy('2026-06-01', d('2026-11-15')).gestationalDays).toBe(167);
    }
  });
});
