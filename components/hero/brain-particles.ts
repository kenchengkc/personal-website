type Point = { x: number; y: number };
type Curve = readonly [number, number, number, number, number, number, number, number];

export type BrainParticle = Point & {
  char: string;
  size: number;
  weight: number;
  color: string;
  alpha: number;
  startX: number;
  startY: number;
  rainY: number;
  delay: number;
};

export const BRAIN_WIDTH = 1000;
export const BRAIN_HEIGHT = 600;
export const ASSEMBLY_DURATION = 4100;

// These paths are sampling masks only. No paths, outlines, or surfaces are painted.
const CORTEX =
  "M140 320 C105 300 102 249 128 221 C126 179 162 141 205 134 C228 93 297 67 343 82 C379 55 427 62 454 76 C493 54 546 67 576 88 C617 68 650 86 664 109 C725 104 778 144 791 185 C835 194 867 237 858 276 C889 311 875 355 858 375 C883 420 848 464 802 463 C765 485 703 471 673 456 C620 468 574 447 551 425 C498 444 424 438 384 431 C323 449 257 426 244 396 C197 399 151 378 147 350 C137 341 136 330 140 320 Z";
const CEREBELLUM =
  "M589 447 C631 462 683 488 758 477 C760 517 720 544 676 546 C627 549 583 522 570 492 Z";
const STEM =
  "M510 442 C529 446 548 442 560 439 C570 479 594 519 625 537 C603 548 594 560 588 578 C555 579 531 551 528 522 Z";

// Cortical grooves follow the side-view anatomy, with shorter branching folds.
const FOLDS: Curve[] = [
  [343, 82, 335, 135, 239, 137, 236, 207],
  [454, 76, 406, 99, 404, 130, 421, 155],
  [441, 142, 385, 159, 374, 204, 398, 235],
  [576, 88, 531, 116, 533, 150, 540, 169],
  [553, 155, 509, 165, 514, 220, 492, 263],
  [664, 109, 665, 118, 671, 126, 667, 135],
  [720, 184, 668, 150, 615, 170, 626, 213],
  [597, 224, 649, 196, 714, 208, 702, 249],
  [702, 219, 776, 191, 820, 252, 799, 319],
  [799, 319, 791, 348, 773, 367, 748, 380],
  [723, 366, 752, 375, 761, 395, 744, 413],
  [846, 401, 859, 412, 857, 432, 851, 442],
  [177, 357, 206, 310, 170, 284, 145, 314],
  [271, 255, 307, 255, 287, 190, 336, 190],
  [330, 166, 332, 184, 318, 192, 315, 199],
  [334, 192, 354, 189, 371, 198, 382, 207],
  [343, 267, 343, 287, 348, 304, 358, 314],
  [247, 396, 231, 337, 291, 309, 409, 318],
  [393, 339, 407, 292, 493, 281, 558, 305],
  [551, 303, 580, 308, 598, 291, 601, 270],
  [331, 379, 377, 402, 440, 381, 477, 359],
  [332, 367, 345, 381, 337, 391, 325, 396],
  [463, 369, 554, 397, 678, 384, 693, 294],
  [548, 425, 565, 419, 570, 410, 561, 401],
];

const hash = (n: number) => {
  const value = Math.sin(n * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};
const clamp = (n: number) => Math.max(0, Math.min(1, n));

function sampleFolds() {
  return FOLDS.flatMap(([x0, y0, x1, y1, x2, y2, x3, y3]) =>
    Array.from({ length: 33 }, (_, i) => {
      const t = i / 32;
      const u = 1 - t;
      return {
        x: u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3,
        y: u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3,
      };
    }),
  );
}

function foldDistance(x: number, y: number, folds: Point[]) {
  let distance = Infinity;
  for (const point of folds) {
    distance = Math.min(distance, (x - point.x) ** 2 + (y - point.y) ** 2);
  }
  return Math.sqrt(distance);
}

function colorAt(light: number, warmth: number) {
  // Deep blue-green recesses, silver/sea-glass midtones, ivory highlights.
  const low = [32, 88, 91];
  const middle = [103, 180, 179];
  const high = [230 + warmth * 19, 242 - warmth * 10, 239 - warmth * 37];
  const from = light < 0.55 ? low : middle;
  const to = light < 0.55 ? middle : high;
  const blend = light < 0.55 ? light / 0.55 : (light - 0.55) / 0.45;
  return `rgb(${from.map((channel, i) => Math.round(channel + (to[i] - channel) * blend)).join(",")})`;
}

export function createBrainParticles(context: CanvasRenderingContext2D): BrainParticle[] {
  const cortex = new Path2D(CORTEX);
  const cerebellum = new Path2D(CEREBELLUM);
  const stem = new Path2D(STEM);
  const folds = sampleFolds();
  const particles: BrainParticle[] = [];
  const occupied = new Set<string>();

  // Staggered, tightly packed type gives the surface continuity while preserving
  // individual digits. Every glyph shares the same coordinate system on mobile.
  for (let row = 0, y = 65; y < 580; y += 7.2, row++) {
    for (let column = 0, x = 108 + (row % 2) * 2.3; x < 890; x += 4.6, column++) {
      if (occupied.has(`${row}:${column}`)) continue;
      const seed = row * 211 + Math.round(x);
      let px = x + (hash(seed + 2) - 0.5) * 1.2;
      let py = y + (hash(seed + 3) - 0.5) * 1.3;
      const isCortex = context.isPointInPath(cortex, px, py);
      const isCerebellum = !isCortex && context.isPointInPath(cerebellum, px, py);
      const isStem = !isCortex && !isCerebellum && context.isPointInPath(stem, px, py);
      if (!isCortex && !isCerebellum && !isStem) continue;

      const noise = hash(seed + 9);
      let light: number;
      let groove = 0;
      if (isCortex) {
        const distance = foldDistance(px, py, folds);
        groove = Math.exp(-((distance / 7.5) ** 2));
        const ridge = Math.exp(-(((distance - 17) / 13) ** 2));
        const dome = Math.sqrt(Math.max(0, 1 - ((px - 494) / 415) ** 2 - ((py - 267) / 230) ** 2));
        // Broad, quiet triangular tonal planes nod to the faceted reference.
        const cellX = Math.floor((px + py * 0.35) / 86);
        const cellY = Math.floor(py / 78);
        const facet = hash(cellX * 17 + cellY * 31) * 0.13;
        light = clamp(0.27 + dome * 0.3 + ridge * 0.25 + facet - groove * 0.7 + (noise - 0.5) * 0.2);
      } else if (isCerebellum) {
        const bands = Math.sin((py + 0.0018 * (px - 665) ** 2) * 0.39);
        groove = Math.max(0, -bands) * 0.65;
        light = clamp(0.36 + bands * 0.2 + noise * 0.15);
      } else {
        light = clamp(0.3 + 0.32 * Math.sin(((px - 510) / 118) * Math.PI) + noise * 0.12);
      }

      const warmth = clamp((px - 640) / 220) * 0.7;
      let size = groove > 0.5 ? 5.2 + noise * 1.4 : 6.4 + light * 2.4 + noise * 1.5;
      const large = isCortex && groove < 0.12 && noise > 0.84
        && !occupied.has(`${row}:${column + 1}`)
        && context.isPointInPath(cortex, px + 7, py + 11);
      if (large) {
        // Reserve a 2 × 2 patch so larger, bolder characters never pile up.
        occupied.add(`${row}:${column + 1}`);
        occupied.add(`${row + 1}:${column}`);
        occupied.add(`${row + 1}:${column + 1}`);
        px += 2.3;
        py += 3.6;
        size = 12.5 + light * 3;
      }
      particles.push({
        x: px,
        y: py,
        char: hash(seed + 17) > 0.49 ? "1" : "0",
        size,
        weight: large || light > 0.72 ? 700 : light > 0.46 ? 500 : 400,
        color: colorAt(light, warmth),
        alpha: groove > 0.65 ? 0.18 + noise * 0.12 : 0.66 + light * 0.32,
        startX: 35 + (seed % 43) * 22 + (hash(seed + 19) - 0.5) * 4,
        startY: -70 - hash(seed + 23) * 290,
        rainY: 105 + hash(seed + 29) * 360,
        delay: hash(seed + 31) * 420,
      });
    }
  }
  return particles;
}
