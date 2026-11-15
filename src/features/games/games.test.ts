import { getShlokas, type VedicKind } from '@/lib/content';
import { seededRandom, shuffle } from '@/lib/random';
import { makeQuestion } from './bubble/logic';
import { makeFillRound } from './fill/logic';
import { buildDeck, isMatch, memoryLevel } from './memory/logic';
import { linesIn, RANGOLI_PATTERNS } from './rangoli/patterns';
import { conflicts, generateSolution, isSolved, makePuzzle } from './sudoku/logic';
import { checkWord, nextHintTile, scramble } from './word/logic';

const items = ['🦚', '🪈', '🪷', '🪔', '🌝', '🪶', '🏺', '☸️'].map((emoji) => ({
  emoji,
  label: emoji,
}));

describe('random', () => {
  it('is repeatable with a seed', () => {
    expect(shuffle([1, 2, 3, 4, 5], seededRandom(7))).toEqual(
      shuffle([1, 2, 3, 4, 5], seededRandom(7)),
    );
  });
});

describe('memory match', () => {
  it('builds exactly two cards per pair', () => {
    const deck = buildDeck(items, 6, seededRandom(1));
    expect(deck).toHaveLength(12);
    const counts = new Map<string, number>();
    deck.forEach((c) => counts.set(c.pairKey, (counts.get(c.pairKey) ?? 0) + 1));
    expect([...counts.values()].every((n) => n === 2)).toBe(true);
    expect(new Set(deck.map((c) => c.id)).size).toBe(12);
  });

  it('matches pairs but never a card with itself', () => {
    const deck = buildDeck(items, 8, seededRandom(2));
    const a = deck[0];
    const twin = deck.find((c) => c.pairKey === a?.pairKey && c.id !== a?.id);
    const other = deck.find((c) => c.pairKey !== a?.pairKey);
    expect(isMatch(a, twin)).toBe(true);
    expect(isMatch(a, a)).toBe(false);
    expect(isMatch(a, other)).toBe(false);
  });

  it('moves to 4×4 after a couple of games', () => {
    expect(memoryLevel(0).pairs).toBe(6);
    expect(memoryLevel(2).pairs).toBe(8);
  });
});

describe('bubble maths', () => {
  it.each(['squareEnding5', 'times11', 'near100', 'times5', 'add9'] as VedicKind[])(
    '%s questions are correct with 3 unique options',
    (kind) => {
      const rand = seededRandom(3);
      for (let i = 0; i < 30; i++) {
        const q = makeQuestion(kind, rand);
        const [a, op, b] = q.text.split(' ');
        const expected = op === '×' ? Number(a) * Number(b) : Number(a) + Number(b);
        expect(q.answer).toBe(expected);
        expect(new Set(q.options).size).toBe(3);
        expect(q.options).toContain(q.answer);
        expect(q.options.every((o) => o > 0)).toBe(true);
      }
    },
  );
});

describe('sudoku', () => {
  it.each([4, 6] as const)('generates valid %i×%i solutions', (size) => {
    for (let seed = 0; seed < 20; seed++) {
      const sol = generateSolution(size, seededRandom(seed));
      expect(isSolved(sol, size)).toBe(true);
    }
  });

  it('makes puzzles with the requested holes that the solution completes', () => {
    const sol = generateSolution(6, seededRandom(5));
    const puzzle = makePuzzle(sol, 14, seededRandom(5));
    expect(puzzle.flat().filter((v) => v === 0)).toHaveLength(14);
    expect(isSolved(puzzle, 6)).toBe(false);
    puzzle.forEach((row, r) => row.forEach((v, c) => v && expect(v).toBe(sol[r]?.[c])));
  });

  it('flags clashes in a row, column and box', () => {
    const grid = [
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
    ];
    expect([...conflicts(grid, 4)].sort()).toEqual(['0,0', '0,1', '3,0']);
  });

  it('rejects an incomplete or wrong grid', () => {
    expect(
      isSolved(
        [
          [1, 2, 3, 4],
          [3, 4, 1, 2],
          [2, 1, 4, 3],
          [4, 3, 2, 0],
        ],
        4,
      ),
    ).toBe(false);
    expect(
      isSolved(
        [
          [1, 2, 3, 4],
          [3, 4, 1, 2],
          [2, 1, 4, 3],
          [4, 3, 2, 1],
        ],
        4,
      ),
    ).toBe(true);
    expect(
      isSolved(
        [
          [1, 2, 3, 4],
          [2, 1, 4, 3],
          [3, 4, 1, 2],
          [4, 3, 2, 1],
        ],
        4,
      ),
    ).toBe(false); // boxes clash
  });
});

describe('word garden', () => {
  it('scrambles without returning the word itself', () => {
    const rand = seededRandom(9);
    for (let i = 0; i < 20; i++) expect(scramble('DHRUVA', rand).join('')).not.toBe('DHRUVA');
    expect(scramble('DHRUVA', rand).sort()).toEqual('DHRUVA'.split('').sort());
  });

  it('checks words case-insensitively', () => {
    expect(checkWord(['k', 'R', 'I', 'S', 'H', 'N', 'A'], 'KRISHNA')).toBe(true);
    expect(checkWord(['A', 'R', 'J'], 'ARJUNA')).toBe(false);
  });

  it('finds the next hint tile', () => {
    const tiles = 'NAGIT'.split('').map((letter) => ({ letter, used: false }));
    expect(nextHintTile(tiles, 'GITA', 0)).toBe(2);
  });
});

describe('rangoli', () => {
  it('every pattern path uses real dots', () => {
    for (const p of RANGOLI_PATTERNS) {
      expect(p.path.every((i) => i >= 0 && i < p.dots.length)).toBe(true);
      expect(linesIn(p)).toBeGreaterThan(2);
    }
  });
});

describe('shloka fill-in', () => {
  it('blanks a real word and offers it among 3 options', () => {
    const shlokas = getShlokas();
    const [first, ...others] = shlokas;
    if (!first) throw new Error('no shlokas');
    const round = makeFillRound(first, others, seededRandom(4));
    expect(round).not.toBeNull();
    expect(round?.words[round.blankIndex]).toBe(round?.answer);
    expect(round?.options).toContain(round?.answer);
    expect(new Set(round?.options).size).toBe(3);
  });
});
