import { useState } from 'react';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useProfile } from '@/app/profile';
import { useSettings } from '@/app/settings';
import { useT } from '@/app/useT';
import { BottomSheet, Button, Card, ChipGroup, Toggle, useToast } from '@/components/ui';
import { inputClass } from '@/components/ui/styles';
import { getTodayISO } from '@/lib/clock';
import { db } from '@/lib/db';
import { buildIcs, scheduleToIcsEvents } from '@/lib/ics';
import { logError } from '@/lib/logger';
import {
  isIos,
  isStandalone,
  notificationState,
  requestNotificationPermission,
  showNotification,
  type NotifyState,
} from '@/lib/notify';
import { downloadBlob } from '@/lib/photos';
import { dateForWeek } from '@/lib/pregnancy';
import { KICKS_FROM_WEEK, scheduleEndDate, type ScheduleSettings } from '@/lib/schedule';

export default function ScheduleScreen() {
  const t = useT();
  const toast = useToast();
  const { settings, update } = useSettings();
  const { profile } = useProfile();
  const schedule = settings.schedule;
  const [perm, setPerm] = useState<NotifyState>(notificationState);
  const [asking, setAsking] = useState(false);
  const setSchedule = (patch: Partial<ScheduleSettings>) =>
    update({ schedule: { ...schedule, ...patch } });

  async function exportIcs() {
    try {
      const today = getTodayISO();
      const events = await db.events.where('date').aboveOrEqual(today).toArray();
      const kicksStart = profile ? dateForWeek(profile.lmp, KICKS_FROM_WEEK) : today;
      const ics = buildIcs(
        scheduleToIcsEvents({
          schedule,
          labels: {
            shloka: t('remind.shloka'),
            tablet: t('remind.tablet'),
            story: t('remind.story'),
            game: t('remind.game'),
            night: t('remind.night'),
            water: t('remind.water'),
            kicks: t('remind.kicks'),
          },
          startDate: today,
          endDate: profile ? scheduleEndDate(profile.edd) : today,
          kicksStartDate: kicksStart > today ? kicksStart : today,
          events,
        }),
      );
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const file = new File([blob], 'garbh-saathi-reminders.ics', { type: 'text/calendar' });
      // On phones, sharing straight to the calendar app is smoother than a download.
      if (navigator.canShare?.({ files: [file] })) {
        await navigator
          .share({ files: [file], title: 'Garbh Saathi' })
          .catch(() => downloadBlob(blob, file.name));
      } else {
        downloadBlob(blob, file.name);
      }
      toast({ message: t('sched.icsDone') });
    } catch (err) {
      void logError(err);
    }
  }

  async function allow() {
    setAsking(false);
    const result = await requestNotificationPermission();
    setPerm(result);
    if (result === 'granted') setSchedule({ notifications: true });
  }

  function toggleNotifications(on: boolean) {
    if (!on) {
      setSchedule({ notifications: false });
      return;
    }
    if (perm === 'granted') setSchedule({ notifications: true });
    else if (perm === 'default') setAsking(true); // explain first, then ask
  }

  return (
    <>
      <ScreenHeader title={t('sched.title')} fallback="/me" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card tone="calm">
          <h2 className="text-lg font-bold">{t('sched.icsTitle')}</h2>
          <p className="mt-1 text-sm">{t('sched.icsText')}</p>
          <Button className="mt-3" onClick={() => void exportIcs()}>
            {t('sched.icsButton')}
          </Button>
        </Card>

        <Card index={1}>
          <h2 className="mb-2 font-bold">{t('sched.daily')}</h2>
          <ul className="flex flex-col gap-2">
            {schedule.items.map((item) => {
              const name = t(`sched.item.${item.id}`);
              return (
                <li key={item.id}>
                  <Toggle
                    label={name}
                    checked={item.enabled}
                    onChange={(enabled) =>
                      setSchedule({
                        items: schedule.items.map((i) =>
                          i.id === item.id ? { ...i, enabled } : i,
                        ),
                      })
                    }
                  />
                  {item.enabled && (
                    <label className="text-text-muted mb-2 flex items-center justify-end gap-2 text-sm">
                      ⏰
                      <input
                        type="time"
                        aria-label={t('sched.time', { name })}
                        className={`${inputClass} w-36`}
                        value={item.time}
                        onChange={(e) =>
                          e.target.value &&
                          setSchedule({
                            items: schedule.items.map((i) =>
                              i.id === item.id ? { ...i, time: e.target.value } : i,
                            ),
                          })
                        }
                      />
                    </label>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card index={2}>
          <Toggle
            label={t('sched.water')}
            hint={t('sched.waterEvery', {
              h: schedule.water.everyHours,
              from: schedule.water.from,
              to: schedule.water.to,
            })}
            checked={schedule.water.enabled}
            onChange={(enabled) => setSchedule({ water: { ...schedule.water, enabled } })}
          />
          {schedule.water.enabled && (
            <div className="mt-2">
              <ChipGroup<'2' | '3'>
                label={t('sched.water')}
                value={String(schedule.water.everyHours) as '2' | '3'}
                onChange={(v) =>
                  setSchedule({ water: { ...schedule.water, everyHours: v === '3' ? 3 : 2 } })
                }
                options={[
                  { value: '2', label: t('sched.hours', { h: 2 }) },
                  { value: '3', label: t('sched.hours', { h: 3 }) },
                ]}
              />
              <p className="text-text-muted mt-1 text-sm">{t('sched.waterSummer')}</p>
            </div>
          )}
          <div className="mt-3">
            <Toggle
              label={t('sched.kicks')}
              hint={t('sched.kicksHint')}
              checked={schedule.kicks.enabled}
              onChange={(enabled) => setSchedule({ kicks: { ...schedule.kicks, enabled } })}
            />
            {schedule.kicks.enabled && (
              <label className="text-text-muted flex items-center justify-end gap-2 text-sm">
                ⏰
                <input
                  type="time"
                  aria-label={t('sched.time', { name: t('sched.kicks') })}
                  className={`${inputClass} w-36`}
                  value={schedule.kicks.time}
                  onChange={(e) =>
                    e.target.value &&
                    setSchedule({ kicks: { ...schedule.kicks, time: e.target.value } })
                  }
                />
              </label>
            )}
          </div>
        </Card>

        <Card index={3}>
          <h2 className="font-bold">{t('sched.notifTitle')}</h2>
          <p className="text-text-muted mt-1 text-sm">{t('sched.notifText')}</p>
          {perm === 'unsupported' ? (
            <p className="mt-2 text-sm">{t('sched.unsupported')}</p>
          ) : (
            <>
              <Toggle
                label={t('sched.notifOn')}
                checked={schedule.notifications && perm === 'granted'}
                onChange={toggleNotifications}
              />
              {perm === 'denied' && (
                <p className="rounded-soft bg-accent/60 text-on-fill mt-2 p-3 text-sm">
                  {t('sched.denied')}
                </p>
              )}
              {perm === 'granted' && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    void showNotification('Garbh Saathi', t('sched.testBody'), 'gs-test')
                  }
                >
                  🔔 {t('sched.test')}
                </Button>
              )}
            </>
          )}
          {isIos() && !isStandalone() && (
            <p className="text-text-muted mt-2 text-sm">{t('sched.iosNote')}</p>
          )}
        </Card>
      </div>
      <BottomSheet
        open={asking}
        onClose={() => setAsking(false)}
        title={t('sched.askTitle')}
        closeLabel={t('ui.close')}
      >
        <p className="mb-4">{t('sched.askText')}</p>
        <div className="flex gap-2">
          <Button onClick={() => void allow()}>{t('sched.allow')}</Button>
          <Button variant="ghost" onClick={() => setAsking(false)}>
            {t('sched.notNow')}
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
