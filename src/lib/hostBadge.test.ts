import { describe, expect, it } from 'vitest';
import { watchHostBadge } from './hostBadge';

describe('host badge', () => {
  it('lifts the bottom bar only when the hosting badge is on the page', async () => {
    document.documentElement.classList.remove('gs-host-badge');
    watchHostBadge();
    expect(document.documentElement.classList.contains('gs-host-badge')).toBe(false);
    const frame = document.createElement('iframe');
    frame.id = 'nl-badge-frame';
    document.body.appendChild(frame);
    await new Promise((r) => setTimeout(r, 0));
    expect(document.documentElement.classList.contains('gs-host-badge')).toBe(true);
    frame.remove();
  });
});
