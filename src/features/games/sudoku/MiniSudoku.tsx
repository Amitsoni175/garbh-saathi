import { useState } from 'react';
import { useT } from '@/app/useT';
import { Button, ChipGroup, Toggle } from '@/components/ui';
import { useAllCompletions } from '@/lib/activity';
import { getSudokuLevels } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { randomSeed, seededRandom } from '@/lib/random';
import { GameShell } from '../GameShell';
import { boxDims, conflicts, generateSolution, isSolved, makePuzzle, type Grid } from './logic';

function SudokuRound({
  size,
  onAgain,
  onSize,
}: {
  size: 4 | 6;
  onAgain: () => void;
  onSize: (s: 4 | 6) => void;
}) {
  const t = useT();
  const level = getSudokuLevels().find((l) => l.size === size) ?? { holes: size === 4 ? 6 : 14 };
  const [{ solution, givens }] = useState(() => {
    const rand = seededRandom(randomSeed());
    const sol = generateSolution(size, rand);
    return { solution: sol, givens: makePuzzle(sol, level.holes, rand) };
  });
  const [grid, setGrid] = useState<Grid>(() => givens.map((r) => [...r]));
  const [pencil, setPencil] = useState<Record<string, number[]>>({});
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [pencilMode, setPencilMode] = useState(false);
  const clashes = conflicts(grid, size);
  const solved = isSolved(grid, size);
  const { rows: br, cols: bc } = boxDims(size);

  function place(value: number) {
    if (!selected) return;
    const [r, c] = selected;
    if (givens[r]?.[c]) return;
    const key = `${r},${c}`;
    if (pencilMode && value) {
      setPencil((p) => {
        const marks = new Set(p[key] ?? []);
        if (marks.has(value)) marks.delete(value);
        else marks.add(value);
        return { ...p, [key]: [...marks].sort() };
      });
      return;
    }
    const next = grid.map((row) => [...row]);
    const row = next[r];
    if (row) row[c] = value;
    setGrid(next);
    if (value && isSolved(next, size)) chime();
  }

  function hint() {
    const cells: [number, number][] = [];
    grid.forEach((row, r) =>
      row.forEach((v, c) => (v !== solution[r]?.[c] ? cells.push([r, c]) : undefined)),
    );
    const target =
      selected && cells.some(([r, c]) => r === selected[0] && c === selected[1])
        ? selected
        : cells[0];
    if (!target) return;
    const next = grid.map((row) => [...row]);
    const row = next[target[0]];
    if (row) row[target[1]] = solution[target[0]]?.[target[1]] ?? 0;
    setGrid(next);
    setSelected(target);
  }

  return (
    <GameShell
      gameId="sudoku"
      howTo="sudoku.how"
      hintText={t('sudoku.hintText')}
      onHint={hint}
      finished={solved}
      onPlayAgain={onAgain}
    >
      <ChipGroup<'4' | '6'>
        label={t('game.sudoku.name')}
        value={String(size) as '4' | '6'}
        onChange={(v) => onSize(v === '6' ? 6 : 4)}
        options={[
          { value: '4', label: t('sudoku.size4') },
          { value: '6', label: t('sudoku.size6') },
        ]}
      />
      <div
        role="grid"
        className="rounded-soft bg-secondary mx-auto grid w-full max-w-sm overflow-hidden p-1"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gap: 2 }}
      >
        {grid.map((row, r) =>
          row.map((v, c) => {
            const fixed = !!givens[r]?.[c];
            const isSel = selected?.[0] === r && selected?.[1] === c;
            const clash = clashes.has(`${r},${c}`);
            const marks = pencil[`${r},${c}`] ?? [];
            const boxEdgeR = (r + 1) % br === 0 && r < size - 1;
            const boxEdgeC = (c + 1) % bc === 0 && c < size - 1;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                role="gridcell"
                aria-selected={isSel}
                aria-label={`${t('sudoku.cell', { r: r + 1, c: c + 1 })}${v ? `: ${v}` : ''}`}
                onClick={() => setSelected([r, c])}
                className={`relative flex aspect-square items-center justify-center text-xl ${fixed ? 'font-extrabold' : 'text-text-muted font-semibold'} ${isSel ? 'bg-primary text-on-fill' : clash ? 'bg-accent' : 'bg-surface'} ${boxEdgeR ? 'mb-0.5' : ''} ${boxEdgeC ? 'mr-0.5' : ''}`}
              >
                {v
                  ? v
                  : marks.length > 0 && (
                      <span className="text-text-muted text-[0.6rem] leading-tight">
                        {marks.join(' ')}
                      </span>
                    )}
              </button>
            );
          }),
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: size }, (_, i) => i + 1).map((n) => (
          <Button
            key={n}
            variant="secondary"
            className="min-w-12"
            onClick={() => place(n)}
            disabled={!selected}
          >
            {n}
          </Button>
        ))}
        <Button variant="ghost" onClick={() => place(0)} disabled={!selected}>
          {t('sudoku.erase')}
        </Button>
      </div>
      <Toggle label={t('sudoku.pencil')} checked={pencilMode} onChange={setPencilMode} />
    </GameShell>
  );
}

export default function MiniSudoku() {
  const completions = useAllCompletions();
  const [round, setRound] = useState(0);
  const [size, setSize] = useState<4 | 6 | null>(null);
  if (!completions) return null;
  const played = completions.filter((c) => c.kind === 'game' && c.refId === 'sudoku').length;
  const current = size ?? (played >= 3 ? 6 : 4);
  return (
    <SudokuRound
      key={`${current}-${round}`}
      size={current}
      onSize={setSize}
      onAgain={() => setRound((r) => r + 1)}
    />
  );
}
