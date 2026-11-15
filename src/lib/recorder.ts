/**
 * Voice recording with MediaRecorder (Mummy, Papa, Dadi, Nani…).
 * Recordings stay on the phone, in IndexedDB.
 */
import { db, type RecordingKind } from './db';

export class RecorderError extends Error {
  constructor(public code: 'unsupported' | 'denied' | 'failed') {
    super(code);
  }
}

export function isRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'MediaRecorder' in window &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/aac',
  'audio/ogg;codecs=opus',
];

export function pickMime(
  isSupported: (m: string) => boolean = (m) => MediaRecorder.isTypeSupported(m),
): string {
  return (
    MIME_CANDIDATES.find((m) => {
      try {
        return isSupported(m);
      } catch {
        return false;
      }
    }) ?? ''
  );
}

export interface RecorderHandle {
  stop: () => Promise<{ blob: Blob; mime: string; durationMs: number }>;
  cancel: () => void;
  startedAt: number;
}

export async function startRecording(): Promise<RecorderHandle> {
  if (!isRecordingSupported()) throw new RecorderError('unsupported');
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    });
  } catch (err) {
    const name = (err as Error)?.name;
    throw new RecorderError(
      name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'failed',
    );
  }
  const mime = pickMime();
  let recorder: MediaRecorder;
  try {
    recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  } catch {
    stream.getTracks().forEach((t) => t.stop());
    throw new RecorderError('failed');
  }
  const chunks: Blob[] = [];
  recorder.addEventListener('dataavailable', (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  });
  const startedAt = Date.now();
  recorder.start(1000);
  const release = () => stream.getTracks().forEach((t) => t.stop());

  return {
    startedAt,
    stop: () =>
      new Promise((resolve, reject) => {
        recorder.addEventListener(
          'stop',
          () => {
            release();
            const type = recorder.mimeType || mime || 'audio/webm';
            const blob = new Blob(chunks, { type });
            if (blob.size === 0) reject(new RecorderError('failed'));
            else resolve({ blob, mime: type, durationMs: Date.now() - startedAt });
          },
          { once: true },
        );
        try {
          recorder.stop();
        } catch {
          release();
          reject(new RecorderError('failed'));
        }
      }),
    cancel: () => {
      try {
        recorder.stop();
      } catch {
        // already stopped
      }
      release();
    },
  };
}

export async function saveRecording(input: {
  refId: string;
  kind: RecordingKind;
  who: string;
  label?: string;
  blob: Blob;
  mime: string;
  durationMs: number;
}): Promise<number> {
  return db.recordings.add({ ...input, createdAt: Date.now() });
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
