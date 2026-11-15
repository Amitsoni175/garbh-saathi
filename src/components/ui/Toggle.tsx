import { m } from 'motion/react';
import { useId } from 'react';

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}

/** A large, one-thumb on/off switch with its label. The whole row is tappable. */
export function Toggle({ label, checked, onChange, hint }: ToggleProps) {
  const hintId = useId();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={hint ? hintId : undefined}
      onClick={() => onChange(!checked)}
      className="flex min-h-12 w-full items-center justify-between gap-4 py-2 text-left"
    >
      <span>
        <span className="block font-semibold">{label}</span>
        {hint && (
          <span id={hintId} className="text-text-muted block text-sm">
            {hint}
          </span>
        )}
      </span>
      <span
        className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full px-1 transition-colors duration-300 ${checked ? 'bg-calm justify-end' : 'bg-secondary/60 justify-start'}`}
        aria-hidden="true"
      >
        <m.span
          layout
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-surface shadow-soft h-6 w-6 rounded-full"
        />
      </span>
    </button>
  );
}
