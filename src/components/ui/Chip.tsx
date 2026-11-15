import { m } from 'motion/react';
import type { ReactNode } from 'react';

export interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

/** A pill-shaped choice. Use in a group for "pick one" settings. */
export function Chip({ selected = false, onClick, children }: ChipProps) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileTap={{ scale: 0.95 }}
      className={`min-h-12 rounded-full px-4 py-2 font-semibold transition-colors duration-300 ${
        selected ? 'bg-primary text-on-fill shadow-soft' : 'bg-background text-text'
      }`}
    >
      {children}
    </m.button>
  );
}

export interface ChipGroupProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: ChipGroupProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o.value} selected={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </Chip>
      ))}
    </div>
  );
}
