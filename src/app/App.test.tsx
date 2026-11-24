import { fireEvent, render, screen } from '@testing-library/react';
import { db, kvSet } from '@/lib/db';
import { armCrash } from '@/lib/debugCrash';
import { getErrorLog } from '@/lib/logger';
import { setDateOverride } from '@/lib/clock';
import App from './App';

async function seedProfile() {
  await kvSet('profile', {
    motherName: 'Asha',
    babyNickname: '',
    lmp: '2026-06-01',
    edd: '2027-03-08',
    dateKind: 'lmp',
    startDate: '2026-11-15',
    createdAt: '2026-11-15T10:00:00.000Z',
  });
}

beforeEach(async () => {
  await db.kv.clear();
  await db.completions.clear();
  setDateOverride('2026-11-15');
  window.location.hash = '#/';
});

afterAll(() => setDateOverride(null));

describe('App shell', () => {
  it('sends a new user to onboarding', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: /Ram Ram ji/ })).toBeInTheDocument();
  });

  it('shows Today with the right week for a saved profile, and tabs work', async () => {
    await seedProfile();
    render(<App />);
    expect(await screen.findByText(/Week 23 · (Day|Din) 6/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /Khel|Play/ }));
    expect(await screen.findByRole('heading', { level: 1, name: /Khel|Play/ })).toBeInTheDocument();
  });

  it('ErrorBoundary catches a simulated error, logs it, and "Try again" recovers', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await seedProfile();
    window.location.hash = '#/me/debug';
    armCrash();
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/gadbad|went wrong/);
    expect(
      screen.getByRole('navigation', { name: /Main sections|Mukhya hisse/ }),
    ).toBeInTheDocument();

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
