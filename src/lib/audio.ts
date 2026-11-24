/**
 * One audio player for the whole app (so the mini-player can follow her around).
 *
 * Source priority for anything that can be heard:
 *   1. The family's own recording (IndexedDB), if one exists and is preferred
 *   2. A pre-made MP3 in public/audio/{dir}/{file}.mp3, if it exists
 *   3. Text-to-speech (Web Speech API) in hi-IN / en-IN. If no Hindi voice is
 *      installed, English is used and a one-time notice explains how to add one.
 *
 * iOS rule: audio may only start from a tap. play() rejections are caught and
 * shown as "tap to play" instead of crashing.
 */
import { db } from './db';
import { logError } from './logger';

export type AudioLang = 'hi' | 'en';
export type SourceKind = 'recording' | 'file' | 'tts';

export interface TrackRequest {
  /** Stable id, e.g. "story:abhimanyu". */
  id: string;
  title: string;
  lang: AudioLang;
  /** Look for a family recording with this refId (recordings table). */
  recordingRef?: string;
  /** false = skip family recordings (the "default voice" toggle). */
  preferRecording?: boolean;
  /** A specific recording id to play. */
  recordingId?: number;
  /** MP3 base name to look for. */
  file?: string;
  /** Folder under public/audio/. Defaults to the language (hi / en). */
  fileDir?: string;
  /** Text-to-speech fallback. `hi` may be Devanagari or Hinglish text. */
  tts?: { hi?: string[]; en: string[] };
  loop?: boolean;
  /** Called when the TTS reader moves to another segment (e.g. story card). */
  onSegment?: (index: number) => void;
  onEnded?: () => void;
}

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface PlayerState {
  track: { id: string; title: string; kind: SourceKind; lang: AudioLang } | null;
  status: PlayerStatus;
  /** Seconds for audio files; segment index for TTS. */
  position: number;
  /** Seconds for audio files; number of segments for TTS. */
  duration: number;
  rate: 0.75 | 1;
  sleepAt: number | null;
  error?: 'tapToPlay' | 'missing' | 'failed';
  /** Set when Hindi was asked for but no Hindi voice exists. */
  notice?: 'noHindiVoice';
}

type Listener = () => void;

const BASE = import.meta.env.BASE_URL;

// ---------- File existence check ----------

const fileCache = new Map<string, boolean>();

/**
 * True only if the URL serves real audio. Dev servers and some hosts answer
 * missing files with index.html (status 200), so the content type is checked.
 */
export async function audioFileExists(url: string): Promise<boolean> {
  const cached = fileCache.get(url);
  if (cached !== undefined) return cached;
  let ok: boolean;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const type = res.headers.get('content-type') ?? '';
    ok =
      res.ok &&
      (type.startsWith('audio/') || type.includes('mpeg') || type.includes('octet-stream'));
  } catch {
    ok = false;
  }
  fileCache.set(url, ok);
  return ok;
}

export function audioFileUrl(file: string, dir: string): string {
  return `${BASE}audio/${dir}/${file}.mp3`;
}

// ---------- Voices ----------

export function speechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

export async function getVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!speechSupported()) return [];
  const now = window.speechSynthesis.getVoices();
  if (now.length) return now;
  // Chrome loads voices asynchronously.
  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    window.setTimeout(done, 1500);
  });
}

export function pickVoice(
  voices: SpeechSynthesisVoice[],
  lang: AudioLang,
): SpeechSynthesisVoice | undefined {
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  if (lang === 'hi')
    return voices.find((v) => norm(v) === 'hi-in') ?? voices.find((v) => norm(v).startsWith('hi'));
  return (
    voices.find((v) => norm(v) === 'en-in') ??
    voices.find((v) => norm(v).startsWith('en-gb')) ??
    voices.find((v) => norm(v).startsWith('en'))
  );
}

/** Split long text into sentences (Chrome cuts off very long utterances). */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?।॥])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------- Player ----------

interface TtsQueueItem {
  segment: number;
  text: string;
}

class Player {
  private state: PlayerState = {
    track: null,
    status: 'idle',
    position: 0,
    duration: 0,
    rate: 1,
    sleepAt: null,
  };
  private listeners = new Set<Listener>();
  private audio: HTMLAudioElement | null = null;
  private objectUrl: string | null = null;
  private request: TrackRequest | null = null;
  private queue: TtsQueueItem[] = [];
  private queueIndex = 0;
  private voice: SpeechSynthesisVoice | undefined;
  private ttsLang: AudioLang = 'en';
  private sleepTimer: number | undefined;
  private token = 0;

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };

  getState = () => this.state;

  private set(patch: Partial<PlayerState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  private ensureAudio(): HTMLAudioElement {
    if (this.audio) return this.audio;
    const a = new Audio();
    a.preload = 'metadata';
    a.addEventListener('timeupdate', () => this.set({ position: a.currentTime }));
    a.addEventListener('loadedmetadata', () =>
      this.set({ duration: Number.isFinite(a.duration) ? a.duration : 0 }),
    );
    a.addEventListener('play', () => this.set({ status: 'playing', error: undefined }));
    a.addEventListener('pause', () => {
      if (this.state.status === 'playing') this.set({ status: 'paused' });
    });
    a.addEventListener('ended', () => this.finish());
    a.addEventListener('error', () => {
      if (this.state.track?.kind !== 'tts' && this.state.track)
        this.set({ status: 'error', error: 'failed' });
    });
    this.audio = a;
    return a;
  }

  private releaseObjectUrl() {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
  }

  private stopSources() {
    if (speechSupported()) window.speechSynthesis.cancel();
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.releaseObjectUrl();
  }

  private finish() {
    const req = this.request;
    this.set({ status: 'ended' });
    this.clearMediaSession();
    req?.onEnded?.();
  }

  /** Must be called from a tap (iOS). Resolves the best source and starts playing. */
  async play(req: TrackRequest): Promise<SourceKind | null> {
    const token = ++this.token;
    this.stopSources();
    this.request = req;
    this.set({ status: 'loading', error: undefined, notice: undefined, position: 0, duration: 0 });

    // Unlock audio on iOS within the tap, before any await.
    const audio = this.ensureAudio();
    if (speechSupported()) window.speechSynthesis.cancel();

    try {
      // 1. Family recording
      let blob: Blob | undefined;
      if (req.recordingId !== undefined) {
        blob = (await db.recordings.get(req.recordingId))?.blob;
      } else if (req.recordingRef && req.preferRecording !== false) {
        const rows = await db.recordings
          .where('refId')
          .equals(req.recordingRef)
          .sortBy('createdAt');
        blob = rows.at(-1)?.blob;
      }
      if (token !== this.token) return null;
      if (blob) {
        this.objectUrl = URL.createObjectURL(blob);
        return await this.playUrl(this.objectUrl, 'recording', req, token);
      }

      // 2. MP3 file
      if (req.file) {
        const url = audioFileUrl(req.file, req.fileDir ?? req.lang);
        if (await audioFileExists(url)) {
          if (token !== this.token) return null;
          return await this.playUrl(url, 'file', req, token);
        }
      }

      // 3. Text-to-speech
      if (req.tts && speechSupported()) {
        return await this.playTts(req, token);
      }
      audio.removeAttribute('src');
      this.set({
        track: { id: req.id, title: req.title, kind: 'file', lang: req.lang },
        status: 'error',
        error: 'missing',
      });
      return null;
    } catch (err) {
      void logError(err);
      this.set({ status: 'error', error: 'failed' });
      return null;
    }
  }

  private async playUrl(
    url: string,
    kind: SourceKind,
    req: TrackRequest,
    token: number,
  ): Promise<SourceKind | null> {
    const a = this.ensureAudio();
    a.src = url;
    a.loop = Boolean(req.loop);
    a.playbackRate = this.state.rate;
    this.set({ track: { id: req.id, title: req.title, kind, lang: req.lang } });
    this.setMediaSession(req.title);
    try {
      await a.play();
    } catch (err) {
      if (token !== this.token) return null;
      // Usually NotAllowedError on iOS: needs a direct tap.
      this.set({
        status: 'paused',
        error: (err as Error)?.name === 'NotAllowedError' ? 'tapToPlay' : 'failed',
      });
    }
    return kind;
  }

  private async playTts(req: TrackRequest, token: number): Promise<SourceKind | null> {
    const voices = await getVoices();
    if (token !== this.token) return null;
    let lang: AudioLang = req.lang;
    let voice = pickVoice(voices, lang);
    let notice: PlayerState['notice'];
    if (lang === 'hi' && !voice) {
      notice = 'noHindiVoice';
      lang = 'en';
      voice = pickVoice(voices, 'en');
    }
    const segments = lang === 'hi' && req.tts?.hi?.length ? req.tts.hi : (req.tts?.en ?? []);
    this.queue = segments.flatMap((text, segment) =>
      splitSentences(text).map((t) => ({ segment, text: t })),
    );
    this.queueIndex = 0;
    this.voice = voice;
    this.ttsLang = lang;
    this.set({
      track: { id: req.id, title: req.title, kind: 'tts', lang },
      duration: segments.length,
      position: 0,
      notice,
    });
    this.setMediaSession(req.title);
    this.speakNext(token);
    return 'tts';
  }

  private speakNext(token: number) {
    if (token !== this.token) return;
    const item = this.queue[this.queueIndex];
    if (!item) {
      if (this.request?.loop && this.queue.length) {
        this.queueIndex = 0;
        this.speakNext(token);
        return;
      }
      this.finish();
      return;
    }
    if (item.segment !== this.state.position || this.queueIndex === 0) {
      this.set({ position: item.segment });
      this.request?.onSegment?.(item.segment);
    }
    const u = new SpeechSynthesisUtterance(item.text);
    u.lang = this.ttsLang === 'hi' ? 'hi-IN' : 'en-IN';
    if (this.voice) u.voice = this.voice;
    u.rate = this.state.rate === 1 ? 0.95 : 0.75;
    u.pitch = 1.05;
    u.onend = () => {
      if (token !== this.token || this.state.status !== 'playing') return;
      this.queueIndex += 1;
      this.speakNext(token);
    };
    u.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      void logError(new Error(`TTS error: ${e.error}`));
      this.set({ status: 'error', error: 'failed' });
    };
    this.set({ status: 'playing' });
    window.speechSynthesis.speak(u);
  }

  pause() {
    if (this.state.track?.kind === 'tts') {
      // speechSynthesis.pause() is unreliable on Android: cancel and remember the place.
      this.token += 1;
      window.speechSynthesis.cancel();
      this.set({ status: 'paused' });
    } else {
      this.audio?.pause();
      this.set({ status: 'paused' });
    }
  }

  /** Resume (call from a tap). */
  resume() {
    if (!this.state.track) return;
    if (this.state.status === 'ended' && this.request) {
      void this.play(this.request);
      return;
    }
    if (this.state.track.kind === 'tts') {
      const token = ++this.token;
      this.speakNext(token);
    } else if (this.audio) {
      this.audio.play().catch(() => this.set({ status: 'paused', error: 'tapToPlay' }));
    }
  }

  toggle() {
    if (this.state.status === 'playing') this.pause();
    else this.resume();
  }

  /** Seconds for audio; segment index for TTS. */
  seek(value: number) {
    if (this.state.track?.kind === 'tts') {
      const idx = this.queue.findIndex((q) => q.segment === Math.round(value));
      if (idx < 0) return;
      this.queueIndex = idx;
      const wasPlaying = this.state.status === 'playing';
      this.token += 1;
      window.speechSynthesis.cancel();
      this.set({ position: Math.round(value) });
      this.request?.onSegment?.(Math.round(value));
      if (wasPlaying) this.speakNext(this.token);
    } else if (this.audio) {
      this.audio.currentTime = value;
    }
  }

  setRate(rate: 0.75 | 1) {
    this.set({ rate });
    if (this.audio) this.audio.playbackRate = rate;
    if (this.state.track?.kind === 'tts' && this.state.status === 'playing') {
      const token = ++this.token;
      window.speechSynthesis.cancel();
      this.speakNext(token);
    }
  }

  /** Minutes, or null to cancel. */
  setSleep(minutes: number | null) {
    window.clearTimeout(this.sleepTimer);
    if (minutes === null) {
      this.set({ sleepAt: null });
      return;
    }
    const at = Date.now() + minutes * 60_000;
    this.sleepTimer = window.setTimeout(() => {
      this.pause();
      this.set({ sleepAt: null });
    }, minutes * 60_000);
    this.set({ sleepAt: at });
  }

  stop() {
    this.token += 1;
    this.stopSources();
    window.clearTimeout(this.sleepTimer);
    this.request = null;
    this.queue = [];
    this.clearMediaSession();
    this.set({
      track: null,
      status: 'idle',
      position: 0,
      duration: 0,
      sleepAt: null,
      error: undefined,
      notice: undefined,
    });
  }

  clearNotice() {
    this.set({ notice: undefined });
  }

  private setMediaSession(title: string) {
    try {
      if (!('mediaSession' in navigator)) return;
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: 'Wombtales',
        album: 'Wombtales',
      });
      navigator.mediaSession.setActionHandler('play', () => this.resume());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('stop', () => this.stop());
      navigator.mediaSession.setActionHandler('seekbackward', () =>
        this.seek(Math.max(0, this.state.position - (this.state.track?.kind === 'tts' ? 1 : 10))),
      );
      navigator.mediaSession.setActionHandler('seekforward', () =>
        this.seek(this.state.position + (this.state.track?.kind === 'tts' ? 1 : 10)),
      );
    } catch {
      // Media Session not fully supported: lock-screen controls just won't show.
    }
  }

  private clearMediaSession() {
    try {
      if ('mediaSession' in navigator) navigator.mediaSession.metadata = null;
    } catch {
      // ignore
    }
  }
}

export const player = new Player();

/** Speak a short text once (e.g. a shloka meaning, a debug voice test). */
export function speakOnce(
  text: string,
  lang: AudioLang,
  title = 'Wombtales',
): Promise<SourceKind | null> {
  return player.play({ id: `tts:${title}`, title, lang, tts: { hi: [text], en: [text] } });
}

/** Whole minutes (at least 1) until a timestamp, for the sleep-timer label. */
export function minutesUntil(timestamp: number): number {
  return Math.max(1, Math.round((timestamp - Date.now()) / 60000));
}
