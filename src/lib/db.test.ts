import { db, initStorage, kvGet, kvSet } from './db';
import { clearErrorLog, getErrorLog, logError, MAX_LOG_ENTRIES } from './logger';

describe('db + logger', () => {
  beforeAll(async () => {
    expect(await initStorage()).toBe(true);
  });

  beforeEach(async () => {
    await db.kv.clear();
    await clearErrorLog();
  });

  it('stores and reads key-value settings', async () => {
    expect(await kvGet('missing', 'fallback')).toBe('fallback');
    await kvSet('profile', { name: 'Asha' });
    expect(await kvGet('profile', null)).toEqual({ name: 'Asha' });
  });

  it('logs errors newest first with version and route', async () => {
    await logError(new Error('first'));
    await logError('second', 'promise');
    const log = await getErrorLog();
    expect(log.map((r) => r.message)).toEqual(['second', 'first']);
    expect(log[0]?.source).toBe('promise');
    expect(log[0]?.version).toBe(__APP_VERSION__);
  });

  it(`keeps only the last ${MAX_LOG_ENTRIES} entries`, async () => {
    for (let i = 0; i < MAX_LOG_ENTRIES + 5; i++) await logError(`e${i}`);
    const log = await getErrorLog();
    expect(log).toHaveLength(MAX_LOG_ENTRIES);
    expect(log[0]?.message).toBe(`e${MAX_LOG_ENTRIES + 4}`);
    expect(log.at(-1)?.message).toBe('e5');
  });
});
