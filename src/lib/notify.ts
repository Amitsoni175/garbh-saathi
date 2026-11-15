/**
 * Notifications, honestly: web apps can only show reminders while the app is open
 * or recently in the background. On iPhone they also need iOS 16.4+ and the app
 * added to the Home Screen. The .ics calendar export is the reliable backup.
 */
import { logError } from './logger';

export type NotifyState = 'unsupported' | 'default' | 'granted' | 'denied';

export function notificationState(): NotifyState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission as NotifyState;
}

export async function requestNotificationPermission(): Promise<NotifyState> {
  if (notificationState() === 'unsupported') return 'unsupported';
  try {
    return (await Notification.requestPermission()) as NotifyState;
  } catch (err) {
    void logError(err);
    return notificationState();
  }
}

export function isIos(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
}

export function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Show a notification via the service worker if there is one (works in the background), else directly. */
export async function showNotification(
  title: string,
  body: string,
  tag?: string,
): Promise<boolean> {
  if (notificationState() !== 'granted') return false;
  const options: NotificationOptions = {
    body,
    tag,
    icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
    badge: `${import.meta.env.BASE_URL}icons/icon-192.png`,
  };
  try {
    const reg =
      'serviceWorker' in navigator
        ? await Promise.race([
            navigator.serviceWorker.getRegistration(),
            new Promise<undefined>((r) => setTimeout(() => r(undefined), 1500)),
          ])
        : undefined;
    if (reg) {
      await reg.showNotification(title, options);
      return true;
    }
    new Notification(title, options);
    return true;
  } catch (err) {
    void logError(err);
    return false;
  }
}
