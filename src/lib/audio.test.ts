import { pickVoice, splitSentences } from './audio';
import { formatDuration, pickMime } from './recorder';

const voice = (lang: string, name = lang) => ({ lang, name }) as SpeechSynthesisVoice;

describe('audio helpers', () => {
  it('prefers hi-IN for Hindi and en-IN for English', () => {
    const voices = [voice('en-US'), voice('en-IN'), voice('hi-IN')];
    expect(pickVoice(voices, 'hi')?.lang).toBe('hi-IN');
    expect(pickVoice(voices, 'en')?.lang).toBe('en-IN');
  });

  it('returns no Hindi voice when none is installed', () => {
    expect(pickVoice([voice('en-US')], 'hi')).toBeUndefined();
  });

  it('handles underscore language tags (some Android voices)', () => {
    expect(pickVoice([voice('hi_IN')], 'hi')?.lang).toBe('hi_IN');
  });

  it('splits sentences in English and Devanagari', () => {
    expect(splitSentences('One. Two! Three?')).toEqual(['One.', 'Two!', 'Three?']);
    expect(splitSentences('पहला वाक्य। दूसरा वाक्य।')).toEqual(['पहला वाक्य।', 'दूसरा वाक्य।']);
  });

  it('picks the first supported recording format', () => {
    expect(pickMime((m) => m === 'audio/mp4')).toBe('audio/mp4');
    expect(pickMime(() => false)).toBe('');
  });

  it('formats durations', () => {
    expect(formatDuration(65_400)).toBe('1:05');
  });
});
