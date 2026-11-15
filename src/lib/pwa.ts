/**
 * App care: update checks, "Fix app" (clear caches + service worker but keep her
 * data), and the install prompt.
 */
import { logError } from './logger';

/** Ask the service worker to look for a new version. Resolves true if one is waiting. */
export async function checkForUpdate(): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (!reg) return false;
    await reg.update();
    return Boolean(reg.waiting);
  } catch (err) {
    void logError(err);
    return false;
  }
}

/**
 * "Fix app": unregister service workers and delete Cache Storage, then reload.
 * IndexedDB (letters, photos, recordings, progress) and settings are NOT touched.
 */
export async function fixApp(): Promise<void> {
  try {
    const regs = (await navigator.serviceWorker?.getRegistrations()) ?? [];
    await Promise.all(regs.map((r) => r.unregister()));
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (err) {
    void logError(err);
  }
  window.location.reload();
}

// ---------- Install prompt ----------

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

export function initInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    listeners.forEach((l) => l());
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
}

export function canPromptInstall(): boolean {
  return deferred !== null;
}

export function subscribeInstall(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  try {
    await deferred.prompt();
    const choice = await deferred.userChoice;
    deferred = null;
    listeners.forEach((l) => l());
    return choice.outcome === 'accepted';
  } catch (err) {
    void logError(err);
    return false;
  }
}

/** Ask the browser not to evict her data under storage pressure. Silent if unsupported. */
export async function requestPersistentStorage(): Promise<void> {
  try {
    if (navigator.storage?.persisted && !(await navigator.storage.persisted()))
      await navigator.storage.persist?.();
  } catch {
    // not supported
  }
}
