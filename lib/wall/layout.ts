import type { WallPost } from "../repo";

export type Size = "S" | "M" | "L";
export const CARD_H: Record<Size, number> = { S: 220, M: 290, L: 360 };
export const COLS = 4;
export const GAP = 36;
export const MAX_PER_COL = 7; // x2 copies per column -> ~56 cards in the DOM at most
export const COL_H = 1400; // height of the (tilted) column box
export const VIEW_H = 1300; // a column's content past this (from its loop start) is off screen at the loop boundary
export const SPEEDS = [18, 24, 15, 21]; // px per second
export const DIRS = [-1, 1, -1, 1] as const; // -1 drifts up, 1 drifts down

export function sizeOf(p: WallPost): Size {
  const n = p.reply.length + p.complaint.length * 0.4;
  return n < 90 ? "S" : n < 150 ? "M" : "L";
}

export const colHeight = (posts: WallPost[]) => posts.reduce((h, p) => h + CARD_H[sizeOf(p)] + GAP, 0);

// Index of the column that is currently shortest (counting its queued posts too).
export function shortestColumn(cols: WallPost[][], queues: WallPost[][]): number {
  let best = 0;
  for (let i = 1; i < cols.length; i++) {
    if (colHeight([...cols[i], ...queues[i]]) < colHeight([...cols[best], ...queues[best]])) best = i;
  }
  return best;
}

export function distribute(posts: WallPost[]): WallPost[][] {
  const cols: WallPost[][] = Array.from({ length: COLS }, () => []);
  const empty: WallPost[][] = Array.from({ length: COLS }, () => []);
  for (const p of posts) cols[shortestColumn(cols, empty)].push(p);
  return cols;
}
