/**
 * Netlify's free plan adds a small "Powered by Netlify" badge in the bottom-right
 * corner of every published page. When it is present, lift the tab bar and
 * bottom buttons above it (see `.gs-host-badge` in index.css) so nothing is covered.
 */
const BADGE_SELECTOR = '#nl-badge-frame, script[data-nf-variant]';

export function watchHostBadge(doc: Document = document): void {
  const root = doc.documentElement;
  const mark = () => {
    const present = Boolean(doc.querySelector(BADGE_SELECTOR));
    root.classList.toggle('gs-host-badge', present);
    return present;
  };
  if (mark()) return;
  try {
    const observer = new MutationObserver(() => {
      if (mark()) observer.disconnect();
    });
    observer.observe(doc.documentElement, { childList: true, subtree: true });
    // The badge arrives with the page; stop watching after a minute either way.
    window.setTimeout(() => observer.disconnect(), 60_000);
  } catch {
    // MutationObserver missing: fall back to the hostname.
    if (window.location.hostname.endsWith('.netlify.app')) root.classList.add('gs-host-badge');
  }
}
