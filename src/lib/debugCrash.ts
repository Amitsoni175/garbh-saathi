/**
 * Debug-only: lets the debug panel trigger a render error, so the ErrorBoundary
 * can be tested. It keeps throwing until a boundary has caught it (React retries
 * a failed render once before giving up, so throwing only once is not enough).
 * The boundary then calls disarmCrash(), so "Try again" renders cleanly.
 */
let armed = false;

export function armCrash(): void {
  armed = true;
}

export function disarmCrash(): void {
  armed = false;
}

/** Throws while armed. Call during render of the component to break. */
export function crashIfArmed(): void {
  if (armed) throw new Error('Simulated error from the debug panel');
}
