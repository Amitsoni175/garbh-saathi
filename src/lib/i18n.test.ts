import { strings, t, type StringKey } from './i18n';

describe('i18n', () => {
  it('returns English by default', () => {
    expect(t('error.tryAgain')).toBe('Try again');
  });

  it('returns Hinglish when asked', () => {
    expect(t('error.tryAgain', 'hinglish')).toBe('Phir se koshish');
  });

  it('falls back to English when Hinglish is missing', () => {
    expect(t('debug.clear', 'hinglish')).toBe('Clear');
  });

  it('fills placeholders', () => {
    expect(t('settings.version', 'en', { version: '1.2.3' })).toBe('Version 1.2.3');
    expect(t('debug.errorLog', 'en', { count: 0 })).toBe('Error log (0)');
  });

  it('every string has non-empty English text', () => {
    for (const key of Object.keys(strings) as StringKey[]) {
      expect(strings[key].en.trim().length, key).toBeGreaterThan(0);
    }
  });

  it('every non-debug string has Hinglish', () => {
    const missing = (Object.keys(strings) as StringKey[]).filter(
      (k) => !k.startsWith('debug.') && !('hinglish' in strings[k]),
    );
    expect(missing).toEqual([]);
  });
});
