/**
 * Gentle success feedback: a soft synthesised chime (no audio file needed,
 * works offline) and a light 15 ms vibration. Both respect the Settings toggles
 * and fail silently on devices that don't support them.
 */
let ctx: AudioContext | null = null;
let soundsOn = true;
let vibrationOn = true;

export function setFeedbackPrefs(prefs: { sounds: boolean; vibration: boolean }): void {
  soundsOn = prefs.sounds;
  vibrationOn = prefs.vibration;
}

export function chime(): void {
  if (!soundsOn) return;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    const now = ctx.currentTime;
    // Two soft sine notes (E6 then A6) with a slow fade: a small "ting-ting".
    [1318.5, 1760].forEach((freq, i) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.12;
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1);
    });
  } catch {
    // Audio not available: stay quiet.
  }
}

export function vibrate(ms = 15): void {
  if (!vibrationOn) return;
  try {
    navigator.vibrate?.(ms);
  } catch {
    // Not supported (e.g. iPhone): that's fine.
  }
}

/** Chime + vibration together, for "you did it" moments. */
export function celebrate(): void {
  chime();
  vibrate();
}

/** A soft temple-bell sound, for the end of a mantra round. */
export function bell(): void {
  if (!soundsOn) return;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    const now = ctx.currentTime;
    [523.25, 1046.5, 1568, 2093].forEach((freq, i) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const peak = 0.07 / (i + 1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2 - i * 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 3.3);
    });
  } catch {
    // stay quiet
  }
}

/**
 * One soft note (used by Sargam Echo). It is the game itself, so it plays even
 * when the "sounds" setting is off; the game lights up too, so it works muted.
 */
export function playNote(freq: number, seconds = 0.6): void {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    const now = ctx.currentTime;
    // A warm, reed-like tone: a sine with a quieter octave above.
    [
      [freq, 0.12],
      [freq * 2, 0.03],
    ].forEach(([f, peak]) => {
      if (!ctx || f === undefined || peak === undefined) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.03);
      gain.gain.setValueAtTime(peak, now + seconds * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + seconds + 0.05);
    });
  } catch {
    // no audio: the lights still show the tune
  }
}
