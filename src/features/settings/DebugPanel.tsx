import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useProfile } from '@/app/profile';
import { useSettings } from '@/app/settings';
import { useRagaNow, useTodayPlan } from '@/app/useTodayPlan';
import { useNavigate } from 'react-router';
import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { BottomSheet, Button, Card, PageHeader, useToast } from '@/components/ui';
import { getVoices, speakOnce } from '@/lib/audio';
import { wipeAllData } from '@/lib/backup';
import { validateAllContent, type ContentIssue } from '@/lib/content';
import { showNotification, requestNotificationPermission } from '@/lib/notify';
import { seasonForMonth } from '@/lib/season';
import { getClockOverride, getToday, setDateOverride, setTimeOverride } from '@/lib/clock';
import type { ErrorLogRow } from '@/lib/db';
import { armCrash, crashIfArmed } from '@/lib/debugCrash';
import { clearErrorLog, formatErrorLog, getErrorLog } from '@/lib/logger';
import { computePregnancy, dateForWeek, parseLocalDate, toLocalISO } from '@/lib/pregnancy';

const TEST_LMP_KEY = 'gs.debug.testLmp';

function readTestLmp(): string {
  try {
    return localStorage.getItem(TEST_LMP_KEY) ?? '2026-06-01';
  } catch {
    return '2026-06-01';
  }
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="mb-3 font-bold">{title}</h2>
      {children}
    </Card>
  );
}

const inputClass = 'min-h-12 w-full rounded-soft bg-background px-4 text-text';

/** Renders nothing, unless "Simulate an error" was pressed: then it throws once. */
function CrashTrigger() {
  crashIfArmed();
  return null;
}

/**
 * Hidden developer panel (tap the version number 7 times in Me → About).
 * Phase 1 version: clock override, computed state, error log, error simulation.
 * More tools are added in later phases.
 */
export default function DebugPanel() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();
  const now = useNow(); // re-renders when the clock override changes
  const override = getClockOverride();
  const [testLmp, setTestLmp] = useState(readTestLmp);
  const [log, setLog] = useState<ErrorLogRow[]>([]);
  const [storage, setStorage] = useState<string>('…');
  const [, forceRender] = useState(0);
  const { profile, clear } = useProfile();
  const { settings } = useSettings();
  const { plan, offset, dayNumber } = useTodayPlan();
  const raga = useRagaNow(dayNumber, plan?.ragaSlot ?? null);
  const [issues, setIssues] = useState<ContentIssue[] | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [wipeStep, setWipeStep] = useState<0 | 1 | 2>(0);
  const [wipeText, setWipeText] = useState('');

  const refreshLog = useCallback(() => {
    void getErrorLog().then(setLog);
  }, []);

  useEffect(() => {
    void validateAllContent().then(setIssues);
    void getVoices().then(setVoices);
  }, []);

  useEffect(() => {
    refreshLog();
    navigator.storage
      ?.estimate?.()
      .then(({ usage = 0, quota = 0 }) =>
        setStorage(
          `${(usage / 1024 / 1024).toFixed(2)} MB used of ${(quota / 1024 / 1024).toFixed(0)} MB`,
        ),
      )
      .catch(() => setStorage('Not available'));
  }, [refreshLog]);

  const lmp = profile?.lmp ?? testLmp;
  const lmpValid = parseLocalDate(lmp) !== null;
  const state = lmpValid ? computePregnancy(lmp, getToday()) : null;

  function saveTestLmp(value: string) {
    setTestLmp(value);
    try {
      localStorage.setItem(TEST_LMP_KEY, value);
    } catch {
      // ignore
    }
  }

  async function copyLog() {
    try {
      await navigator.clipboard.writeText(formatErrorLog(log) || 'No errors');
      toast({ message: t('debug.copied') });
    } catch {
      toast({ message: t('debug.copyFailed') });
    }
  }

  function exportLog() {
    const blob = new Blob([formatErrorLog(log)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garbh-saathi-errors-${toLocalISO(new Date())}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <CrashTrigger />
      <PageHeader
        title={t('debug.title')}
        right={
          <Button variant="ghost" onClick={() => void navigate('/me')}>
            ← {t('ui.back')}
          </Button>
        }
      />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Section title={t('debug.clock')}>
          <p className="text-text-muted mb-3 text-sm">
            Now: {toLocalISO(now)} {now.toTimeString().slice(0, 5)}
          </p>
          <label className="mb-1 block text-sm font-semibold" htmlFor="dbg-date">
            {t('debug.dateOverride')}
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="dbg-date"
              type="date"
              className={inputClass}
              value={override.date ?? ''}
              onChange={(e) => setDateOverride(e.target.value || null)}
            />
            <Button variant="secondary" onClick={() => setDateOverride(null)}>
              {t('debug.clear')}
            </Button>
          </div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="dbg-time">
            {t('debug.timeOverride')}
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="dbg-time"
              type="time"
              className={inputClass}
              value={override.time ?? ''}
              onChange={(e) => setTimeOverride(e.target.value || null)}
            />
            <Button variant="secondary" onClick={() => setTimeOverride(null)}>
              {t('debug.clear')}
            </Button>
          </div>
          {!profile && (
            <>
              <label className="mb-1 block text-sm font-semibold" htmlFor="dbg-lmp">
                {t('debug.testLmp')}
              </label>
              <input
                id="dbg-lmp"
                type="date"
                className={`${inputClass} mb-3`}
                value={testLmp}
                onChange={(e) => saveTestLmp(e.target.value)}
              />
            </>
          )}
          {state && (
            <>
              <label className="mb-1 block text-sm font-semibold" htmlFor="dbg-week">
                {t('debug.jumpToWeek', { week: state.weeks })}
              </label>
              <input
                id="dbg-week"
                type="range"
                min={0}
                max={43}
                value={Math.min(43, state.weeks)}
                onChange={(e) => setDateOverride(dateForWeek(lmp, Number(e.target.value)))}
                className="w-full accent-[var(--color-primary)]"
              />
            </>
          )}
        </Section>

        <Section title={t('debug.state')}>
          {state ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {[
                ['LMP', state.lmp],
                ['EDD', state.edd],
                ['Week · Day', `Week ${state.weeks} · Day ${state.days}`],
                ['Content week', state.contentWeek],
                ['Trimester', state.trimester],
                ['Day number', `${state.dayNumber} / 280`],
                ['Days to go', state.daysToGo],
                ['Complete', `${state.percent}%`],
                ['Stage', state.stage],
                [t('debug.season'), seasonForMonth(now.getMonth() + 1)],
                ['Journey offset', offset],
                ['Text / audio', `${settings.textLang} / ${settings.audioLang}`],
              ].map(([k, v]) => (
                <div key={String(k)} className="contents">
                  <dt className="text-text-muted">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-text-muted text-sm">Enter a valid test LMP.</p>
          )}
        </Section>

        <Section title={t('debug.plan')}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {[
              ['Day number', dayNumber],
              ['Story', plan?.storyId ?? '—'],
              ['Shloka', plan?.shlokaId ?? '—'],
              ['Game', plan?.gameType ?? '—'],
              ['Raga', `${raga?.id ?? '—'} (${plan?.ragaSlot ?? 'by clock'})`],
              ['Talk prompt', plan?.promptId ?? '—'],
              ['Papa prompt', plan?.papaPromptId ?? '—'],
              ['Journal prompt', plan?.journalPromptId ?? '—'],
            ].map(([k, v]) => (
              <div key={String(k)} className="contents">
                <dt className="text-text-muted">{k}</dt>
                <dd className="font-semibold break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={t('debug.validation')}>
          {issues === null ? (
            <p className="text-sm">…</p>
          ) : issues.length === 0 ? (
            <p className="text-sm">{t('debug.validationOk')}</p>
          ) : (
            <ul className="flex flex-col gap-1 text-sm">
              {issues.map((i, n) => (
                <li key={n} className="rounded-soft bg-accent/50 p-2">
                  <strong>{i.file}</strong> [{String(i.index)}]{i.id ? ` "${i.id}"` : ''}:{' '}
                  {i.reason}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title={t('debug.errorLog', { count: log.length })}>
          <div className="mb-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void copyLog()}>
              {t('debug.copy')}
            </Button>
            <Button variant="secondary" onClick={exportLog}>
              {t('debug.export')}
            </Button>
            <Button variant="secondary" onClick={() => void clearErrorLog().then(refreshLog)}>
              {t('debug.clearLog')}
            </Button>
          </div>
          {log.length === 0 ? (
            <p className="text-text-muted text-sm">{t('debug.emptyLog')}</p>
          ) : (
            <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto text-xs">
              {log.map((row) => (
                <li
                  key={`${row.id ?? 'm'}-${row.ts}`}
                  className="rounded-soft bg-background p-3 break-words select-text"
                >
                  <span className="text-text-muted">
                    {row.ts.replace('T', ' ').slice(0, 19)} · {row.source} · {row.route}
                  </span>
                  <br />
                  {row.message}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title={t('debug.tools')}>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="accent"
              onClick={() => {
                armCrash();
                forceRender((n) => n + 1);
              }}
            >
              {t('debug.simulateError')}
            </Button>
            <Button
              variant="accent"
              onClick={() => {
                void Promise.reject(new Error('Simulated async error from the debug panel'));
                window.setTimeout(refreshLog, 300);
              }}
            >
              {t('debug.simulateAsyncError')}
            </Button>
            <Button
              variant="calm"
              onClick={() => toast({ message: 'Hello from the debug panel', emoji: '🌼' })}
            >
              {t('debug.testToast')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void speakOnce('नमस्ते, मैं आपकी गर्भ साथी हूँ।', 'hi', 'Hindi test')}
            >
              {t('debug.testHindi')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void speakOnce('Hello, I am your Garbh Saathi.', 'en', 'English test')}
            >
              {t('debug.testEnglish')}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                void requestNotificationPermission().then(async (perm) => {
                  const ok =
                    perm === 'granted' &&
                    (await showNotification('Garbh Saathi', 'Test notification 🌸', 'gs-debug'));
                  if (!ok) toast({ message: `Notification permission: ${perm}` });
                })
              }
            >
              {t('debug.testNotification')}
            </Button>
            <Button variant="ghost" onClick={() => void clear()}>
              {t('debug.resetOnboarding')}
            </Button>
            <Button variant="accent" onClick={() => setWipeStep(1)}>
              ⚠️ {t('debug.wipe')}
            </Button>
          </div>
          <p className="mt-4 text-sm">
            <span className="font-semibold">{t('debug.storage')}:</span> {storage}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Version:</span> {__APP_VERSION__}
          </p>
        </Section>
        <Section title={t('debug.voices', { count: voices.length })}>
          <ul className="max-h-48 overflow-y-auto text-xs">
            {voices.map((v) => (
              <li key={`${v.name}-${v.lang}`}>
                {v.lang} · {v.name}
                {v.localService ? '' : ' (online)'}
              </li>
            ))}
          </ul>
        </Section>
      </div>
      <BottomSheet
        open={wipeStep > 0}
        onClose={() => setWipeStep(0)}
        title={t('debug.wipe')}
        closeLabel={t('ui.close')}
      >
        {wipeStep === 1 ? (
          <div className="flex flex-col gap-3">
            <p>{t('debug.wipeConfirm1')}</p>
            <div className="flex gap-2">
              <Button variant="accent" onClick={() => setWipeStep(2)}>
                {t('rec.deleteYes')}
              </Button>
              <Button variant="ghost" onClick={() => setWipeStep(0)}>
                {t('rec.keep')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p>{t('debug.wipeConfirm2')}</p>
            <input
              className={inputClass}
              value={wipeText}
              onChange={(e) => setWipeText(e.target.value)}
              aria-label="DELETE"
            />
            <Button
              variant="accent"
              disabled={wipeText !== 'DELETE'}
              onClick={() =>
                void wipeAllData().then(() => {
                  toast({ message: t('debug.wipeDone') });
                  window.setTimeout(() => window.location.reload(), 800);
                })
              }
            >
              ⚠️ {t('debug.wipe')}
            </Button>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
