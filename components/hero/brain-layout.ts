import { ASSEMBLY_DURATION, BRAIN_HEIGHT, BRAIN_WIDTH } from "./brain-particles";

export const ATLAS_SCALE = 2;
export const COLUMNS = 96;
export const ROWS = 6;
export const LEFT = 100;
export const RIGHT = 900;
export const STRAND_WIDTH = (RIGHT - LEFT) / COLUMNS;
export const SEGMENT_HEIGHT = BRAIN_HEIGHT / ROWS;
export const PADDING = 12;
export const TILE_WIDTH = Math.ceil(STRAND_WIDTH + PADDING * 2);
export const TILE_HEIGHT = SEGMENT_HEIGHT + PADDING * 2;
const LOOP_HEIGHT = BRAIN_HEIGHT + TILE_HEIGHT;
export const ATLAS_COLUMNS = 32;
const hash = (value: number) => { const x = Math.sin(value * 12.9898) * 43758.5453; return x - Math.floor(x); };
export const wrap = (y: number) => (y % LOOP_HEIGHT) - SEGMENT_HEIGHT - PADDING;

// Short pieces of a rain strand gather independently, throughout the silhouette.
// Each piece keeps the same whole digits, color, and opacity from start to finish.
export const segments = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
  const column = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  const speed = 0.17 + hash(column + 17) * 0.1;
  const catchAt = 320 + hash(index + 31) * 260;
  const phase = hash(column + 71) * LOOP_HEIGHT + row * SEGMENT_HEIGHT;
  return {
    x: LEFT + column * STRAND_WIDTH,
    y: row * SEGMENT_HEIGHT,
    rainX: 24 + column / (COLUMNS - 1) * (BRAIN_WIDTH - 48),
    speed,
    catchAt,
    phase,
    drift: (hash(index + 97) - 0.5) * 36,
    duration: ASSEMBLY_DURATION - catchAt - 120 - hash(index + 53) * 300,
  };
});

