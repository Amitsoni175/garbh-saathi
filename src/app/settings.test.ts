import { DEFAULT_SETTINGS, normaliseSettings } from './settings';

describe('normaliseSettings', () => {
  it('returns defaults for nothing', () => {
    expect(normaliseSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps valid values and drops bad ones', () => {
    expect(
      normaliseSettings({ textLang: 'en', textSize: 'huge', sounds: false, extra: 1 }),
    ).toEqual({
      ...DEFAULT_SETTINGS,
      textLang: 'en',
      sounds: false,
    });
  });
});
