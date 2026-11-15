import 'fake-indexeddb/auto';
import { fireEvent, render, screen } from '@testing-library/react';
import { armCrash } from '@/lib/debugCrash';
import { getErrorLog } from '@/lib/logger';
import { initStorage } from '@/lib/db';
import App from './App';

beforeAll(async () => {
  await initStorage();
  // jsdom lacks matchMedia and scrollTo.
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  window.scrollTo = () => undefined;
});

beforeEach(() => {
  window.location.hash = '#/';
});

describe('App shell', () => {
  it('shows the four tabs and switches between them', async () => {
    render(<App />);
    const nav = await screen.findByRole('navigation');
    expect(nav).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /Khel|Play/ }));
    expect(await screen.findByRole('heading', { level: 1, name: /Khel|Play/ })).toBeInTheDocument();
  });

  it('ErrorBoundary catches a simulated error, logs it, and "Try again" recovers', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    window.location.hash = '#/me/debug';
    armCrash();
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/gadbad|went wrong/);
    // Tabs still work while one screen is broken.
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Phir se|Try again/ }));
    expect(await screen.findByRole('heading', { name: /Debug panel/ })).toBeInTheDocument();

    await vi.waitFor(async () => {
      const log = await getErrorLog();
      expect(log.some((r) => r.source === 'boundary' && /Simulated error/.test(r.message))).toBe(
        true,
      );
    });
  });
});
