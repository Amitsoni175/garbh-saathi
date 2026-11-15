import { useState } from 'react';
import { useT } from '@/app/useT';
import { BottomSheet, Button, ChipGroup, Toggle, useToast } from '@/components/ui';
import { inputClass, textareaClass } from '@/components/ui/styles';
import { db, type EventKind } from '@/lib/db';
import { logError } from '@/lib/logger';

export function EventSheet({
  open,
  onClose,
  date,
}: {
  open: boolean;
  onClose: () => void;
  date: string;
}) {
  const t = useT();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<EventKind>('doctor');
  const [day, setDay] = useState(date);
  const [time, setTime] = useState('');
  const [reminder, setReminder] = useState(true);
  const [notes, setNotes] = useState('');
  const [lastDate, setLastDate] = useState(date);
  if (date !== lastDate) {
    setLastDate(date);
    setDay(date);
  }

  async function save() {
    const name = title.trim() || t(`event.kind.${kind}`);
    try {
      await db.events.add({
        date: day,
        time: time || undefined,
        title: name,
        kind,
        reminder,
        notes: notes.trim() || undefined,
        createdAt: Date.now(),
      });
      toast({ message: t('event.saved') });
      setTitle('');
      setNotes('');
      setTime('');
      onClose();
    } catch (err) {
      void logError(err);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={t('event.title')} closeLabel={t('ui.close')}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{t('event.name')}</span>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('event.namePlaceholder')}
          />
        </label>
        <div>
          <p className="mb-1 text-sm font-semibold">{t('event.kind')}</p>
          <ChipGroup<EventKind>
            label={t('event.kind')}
            value={kind}
            onChange={setKind}
            options={(['doctor', 'scan', 'godhBharai', 'other'] as const).map((k) => ({
              value: k,
              label: t(`event.kind.${k}`),
            }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{t('event.date')}</span>
            <input
              type="date"
              className={inputClass}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{t('event.time')}</span>
            <input
              type="time"
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>
        <Toggle
          label={t('event.reminder')}
          hint={t('event.reminderHint')}
          checked={reminder}
          onChange={setReminder}
        />
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{t('event.notes')}</span>
          <textarea
            className={textareaClass}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <Button onClick={() => void save()} disabled={!day}>
          {t('event.save')}
        </Button>
      </div>
    </BottomSheet>
  );
}
