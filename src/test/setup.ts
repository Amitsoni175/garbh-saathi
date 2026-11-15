import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { initStorage } from '@/lib/db';

await initStorage();

// jsdom lacks these browser APIs.
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
})) as unknown as typeof window.matchMedia;
window.scrollTo = () => undefined;
