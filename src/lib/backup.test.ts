import {
  backupFileName,
  createBackup,
  dataUrlToBlob,
  blobToDataUrl,
  parseBackup,
  restoreBackup,
} from './backup';
import { db } from './db';

async function blobText(b: Blob): Promise<string> {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsText(b);
  });
}

describe('backup', () => {
  beforeEach(async () => {
    for (const t of db.tables) await t.clear();
  });

  it('names the file by date', () => {
    expect(backupFileName('2026-11-15')).toBe('wombtales-backup-2026-11-15.json');
  });

  it.each(['audio/webm', 'audio/webm;codecs=opus', 'image/jpeg', ''])(
    'round-trips a "%s" blob through a data URL',
    async (type) => {
      const blob = new Blob(['namaste 🌸'], { type });
      const back = dataUrlToBlob(await blobToDataUrl(blob), type || undefined);
      expect(back.type).toBe(type || 'application/octet-stream');
      expect(await blobText(back)).toBe('namaste 🌸');
    },
  );

  it('parses a data URL whose type has parameters', () => {
    const b = dataUrlToBlob('data:audio/webm;codecs=opus;base64,aGk=');
    expect(b.type).toBe('audio/webm;codecs=opus');
    expect(b.size).toBe(2);
  });

  it('exports, then restores everything after a wipe', async () => {
    await db.kv.put({
      key: 'profile',
      value: { motherName: 'Asha', lmp: '2026-06-01', edd: '2027-03-08' },
    });
    await db.completions.bulkAdd([
      { date: '2026-11-15', kind: 'story', refId: 'abhimanyu', createdAt: 1 },
      { date: '2026-11-15', kind: 'game', refId: 'memory', createdAt: 2 },
    ]);
    await db.journal.add({ date: '2026-11-15', kind: 'letter', text: 'Pyaare baby', createdAt: 3 });
    await db.events.add({
      date: '2026-12-01',
      title: 'Scan',
      kind: 'scan',
      reminder: true,
      createdAt: 4,
    });
    await db.errors.add({
      ts: 'x',
      version: '1',
      route: '#/',
      message: 'not backed up',
      source: 'caught',
    });

    const file = await createBackup('9.9.9', new Date('2026-11-15T10:00:00Z'));
    const text = JSON.stringify(file);
    expect(file.tables.errors).toBeUndefined();

    for (const t of db.tables) await t.clear();
    expect(await db.completions.count()).toBe(0);

    const parsed = parseBackup(text);
    if (!parsed.ok) throw new Error(parsed.reason);
    expect(parsed.summary).toMatchObject({ completions: 2, journal: 1, events: 1, photos: 0 });
    expect(await restoreBackup(parsed.file)).toBe(true);

    expect(await db.completions.count()).toBe(2);
    expect((await db.journal.toArray())[0]?.text).toBe('Pyaare baby');
    expect((await db.kv.get('profile'))?.value).toMatchObject({ motherName: 'Asha' });
  });

  it('rejects files that are not Wombtales backups, without touching data', async () => {
    await db.completions.add({ date: '2026-11-15', kind: 'story', createdAt: 1 });
    expect(parseBackup('not json').ok).toBe(false);
    expect(parseBackup(JSON.stringify({ app: 'other', format: 1, tables: {} })).ok).toBe(false);
    expect(parseBackup(JSON.stringify({ app: 'garbh-saathi', format: 99, tables: {} })).ok).toBe(
      false,
    );
    expect(
      parseBackup(JSON.stringify({ app: 'garbh-saathi', format: 1, tables: { hacker: [] } })).ok,
    ).toBe(false);
    expect(
      parseBackup(JSON.stringify({ app: 'garbh-saathi', format: 1, tables: { journal: [1, 2] } }))
        .ok,
    ).toBe(false);
    expect(await db.completions.count()).toBe(1);
  });
});

describe('backups across the rename', () => {
  it('accepts backups made before the rename (app: garbh-saathi) and new ones (app: wombtales)', () => {
    for (const app of ['garbh-saathi', 'wombtales'])
      expect(parseBackup(JSON.stringify({ app, format: 1, tables: { journal: [] } })).ok).toBe(
        true,
      );
  });
});
