import { hasLowMoodStreak, moodEmoji } from './wellness';

describe('low mood streak', () => {
  const day = (date: string, mood?: number) => ({ date, mood });

  it('is true after three low days in a row', () => {
    expect(
      hasLowMoodStreak(
        [day('2026-11-13', 2), day('2026-11-14', 1), day('2026-11-15', 2)],
        '2026-11-15',
      ),
    ).toBe(true);
  });

  it('is false if one of the days was okay or better', () => {
    expect(
      hasLowMoodStreak(
        [day('2026-11-13', 2), day('2026-11-14', 3), day('2026-11-15', 1)],
        '2026-11-15',
      ),
    ).toBe(false);
  });

  it('never assumes a low mood for a missing day', () => {
    expect(hasLowMoodStreak([day('2026-11-14', 1), day('2026-11-15', 1)], '2026-11-15')).toBe(
      false,
    );
  });

  it('maps moods to emoji', () => {
    expect(moodEmoji(5)).toBe('😄');
    expect(moodEmoji(undefined)).toBeUndefined();
  });
});
