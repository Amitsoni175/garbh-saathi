import { strings, t, type StringKey } from './i18n';

describe('i18n', () => {
  it('returns English by default', () => {
    expect(t('placeholder.begin', 'en')).toBe('Begin');
  });

  it('returns Hinglish when asked', () => {
    expect(t('placeholder.begin', 'hinglish')).toBe('Shuru karein');
  });

  it('every string has non-empty English text', () => {
    for (const key of Object.keys(strings) as StringKey[]) {
      expect(strings[key].en.trim().length).toBeGreaterThan(0);
    }
  });
});
