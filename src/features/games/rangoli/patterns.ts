/** Rangoli patterns: dots (0–100 coordinates) and the order to connect them. */
export interface RangoliPattern {
  id: string;
  dots: { x: number; y: number }[];
  /** Indices into dots; each consecutive pair is one line. */
  path: number[];
}

const circle = (n: number, r: number, offset = -90) =>
  [...Array(n).keys()].map((i) => {
    const a = ((offset + (360 / n) * i) * Math.PI) / 180;
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
  });

export const RANGOLI_PATTERNS: RangoliPattern[] = [
  { id: 'star', dots: circle(5, 40), path: [0, 2, 4, 1, 3, 0] },
  {
    id: 'diamond',
    dots: [...circle(4, 40), ...circle(4, 20, -45)],
    path: [0, 1, 2, 3, 0, 4, 5, 6, 7, 4],
  },
  {
    id: 'lotus',
    dots: [{ x: 50, y: 50 }, ...circle(8, 40)],
    path: [1, 0, 2, 3, 0, 4, 5, 0, 6, 7, 0, 8, 1],
  },
  { id: 'hexagram', dots: circle(6, 40), path: [0, 2, 4, 0, 1, 3, 5, 1] },
];

export function linesIn(p: RangoliPattern): number {
  return Math.max(0, p.path.length - 1);
}
