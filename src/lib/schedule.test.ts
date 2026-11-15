import { buildIcs, escapeText, foldLine, scheduleToIcsEvents } from './ics';
import {
  DEFAULT_SCHEDULE,
  dueBetween,
  normaliseSchedule,
  remindersForDay,
  scheduleEndDate,
  upcoming,
  waterTimes,
} from './schedule';

const at = (h: number, m = 0) => new Date(2026, 10, 15, h, m);

describe('schedule', () => {
  it('has the gentle default rhythm', () => {
    expect(DEFAULT_SCHEDULE.items.map((i) => `${i.id}@${i.time}`)).toEqual([
      'shloka@07:00',
      'tablet@09:00',
      'story@13:00',
      'game@17:00',
      'night@21:00',
    ]);
  });

  it('keeps valid stored values and ignores bad ones', () => {
    const s = normaliseSchedule({
      items: [
        { id: 'story', time: '14:30', enabled: false },
        { id: 'tablet', time: '25:00' },
      ],
      water: { enabled: true, everyHours: 5 },
    });
    expect(s.items.find((i) => i.id === 'story')).toEqual({
      id: 'story',
      time: '14:30',
      enabled: false,
    });
    expect(s.items.find((i) => i.id === 'tablet')?.time).toBe('09:00');
    expect(s.water.enabled).toBe(true);
    expect(s.water.everyHours).toBe(2);
  });

  it('spaces water reminders every 2 hours', () => {
    expect(waterTimes({ enabled: true, everyHours: 2, from: '08:00', to: '20:00' })).toEqual([
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
      '20:00',
    ]);
  });

  it('suggests kick counts only from week 28', () => {
    expect(remindersForDay(DEFAULT_SCHEDULE, 27).some((r) => r.kind === 'kicks')).toBe(false);
    expect(remindersForDay(DEFAULT_SCHEDULE, 28).some((r) => r.kind === 'kicks')).toBe(true);
  });

  it('reminds an hour before timed events and at 8 AM for all-day ones', () => {
    const r = remindersForDay(DEFAULT_SCHEDULE, 20, [
      { id: 1, title: 'Scan', time: '11:30', reminder: true },
      { id: 2, title: 'Godh Bharai', reminder: true },
      { id: 3, title: 'No reminder', time: '10:00', reminder: false },
    ]);
    expect(r.filter((x) => x.kind === 'event').map((x) => `${x.title}@${x.time}`)).toEqual([
      'Godh Bharai@08:00',
      'Scan@10:30',
    ]);
  });

  it('lists what is coming up next', () => {
    const all = remindersForDay(DEFAULT_SCHEDULE, 20);
    expect(upcoming(all, at(12, 0)).map((r) => r.kind)).toEqual(['story', 'game', 'night']);
    expect(upcoming(all, at(22, 0))).toEqual([]);
  });

  it('finds reminders due since the last check', () => {
    const all = remindersForDay(DEFAULT_SCHEDULE, 20);
    expect(dueBetween(all, 8 * 60 + 59, 9 * 60).map((r) => r.kind)).toEqual(['tablet']);
    expect(dueBetween(all, 9 * 60, 9 * 60 + 1)).toEqual([]);
  });

  it('ends recurring reminders two weeks after the due date', () => {
    expect(scheduleEndDate('2027-03-08')).toBe('2027-03-22');
  });
});

describe('.ics export', () => {
  const now = new Date(Date.UTC(2026, 10, 15, 6, 0, 0));
  const ics = buildIcs(
    scheduleToIcsEvents({
      schedule: { ...DEFAULT_SCHEDULE, water: { ...DEFAULT_SCHEDULE.water, enabled: true } },
      labels: {
        shloka: '🌅 Morning shloka, with your little one?',
        tablet: '💊 Iron tablet time',
        story: '📖 Story time',
        game: '🎮 Game break',
        night: '🌙 Lullaby time',
        water: '💧 Sip some water',
        kicks: '👣 Kick count',
      },
      startDate: '2026-11-15',
      endDate: '2027-03-22',
      kicksStartDate: '2026-12-14',
      events: [
        {
          id: 7,
          date: '2026-12-01',
          time: '10:30',
          title: 'Doctor visit, Dr. Sharma; bring reports',
          reminder: true,
        },
        { id: 8, date: '2027-01-10', title: 'Godh Bharai', reminder: true },
      ],
    }),
    now,
  );
  const lines = ics.split('\r\n');

  it('uses CRLF and balanced BEGIN/END blocks', () => {
    expect(ics.endsWith('\r\n')).toBe(true);
    expect(ics.includes('\n') && !ics.replace(/\r\n/g, '').includes('\n')).toBe(true);
    for (const block of ['VCALENDAR', 'VEVENT', 'VALARM', 'VTIMEZONE']) {
      expect(lines.filter((l) => l === `BEGIN:${block}`).length).toBe(
        lines.filter((l) => l === `END:${block}`).length,
      );
    }
  });

  it('creates daily recurring events in IST with alarms', () => {
    expect(ics).toContain('DTSTART;TZID=Asia/Kolkata:20261115T070000');
    expect(ics).toContain('RRULE:FREQ=DAILY;UNTIL=20270322T182959Z');
    expect(ics).toContain('TRIGGER:PT0M');
    expect(ics).toContain('UID:gs-water-1000@garbh-saathi');
    expect(ics).toContain('DTSTART;TZID=Asia/Kolkata:20261214T190000'); // kicks from week 28
  });

  it('adds her own events with reminders, escaping commas and semicolons', () => {
    expect(ics).toContain('SUMMARY:Doctor visit\\, Dr. Sharma\\; bring reports');
    expect(ics).toContain('TRIGGER:-PT60M');
    expect(ics).toContain('DTSTART;VALUE=DATE:20270110');
    expect(ics).toContain('DTEND;VALUE=DATE:20270111');
    expect(ics).toContain('TRIGGER:-PT900M');
  });

  it('folds long lines at 75 bytes without breaking emoji', () => {
    const encoder = new TextEncoder();
    for (const l of lines) expect(encoder.encode(l).length).toBeLessThanOrEqual(75);
    const folded = foldLine(`SUMMARY:${'🌸'.repeat(40)}`);
    expect(folded.split('\r\n ').join('')).toBe(`SUMMARY:${'🌸'.repeat(40)}`);
  });

  it('escapes newlines and backslashes', () => {
    expect(escapeText('a\\b\nc')).toBe('a\\\\b\\nc');
  });
});
