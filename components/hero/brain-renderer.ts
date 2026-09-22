import { ASSEMBLY_DURATION, BRAIN_HEIGHT, BRAIN_WIDTH, createBrainParticles } from "./brain-particles";

const COLUMNS = 96;
const ROWS = 6;
const LEFT = 100;
const RIGHT = 900;
const STRAND_WIDTH = (RIGHT - LEFT) / COLUMNS;
const SEGMENT_HEIGHT = BRAIN_HEIGHT / ROWS;
const PADDING = 12;
const TILE_WIDTH = Math.ceil(STRAND_WIDTH + PADDING * 2);
const TILE_HEIGHT = SEGMENT_HEIGHT + PADDING * 2;
const LOOP_HEIGHT = BRAIN_HEIGHT + 24;
const ATLAS_COLUMNS = 32;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const hash = (value: number) => { const x = Math.sin(value * 12.9898) * 43758.5453; return x - Math.floor(x); };
const wrap = (y: number) => (y % LOOP_HEIGHT) - SEGMENT_HEIGHT;

// Short pieces of a rain strand gather independently, throughout the silhouette.
// Each piece keeps the same whole digits, color, and opacity from start to finish.
const segments = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
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

/** The falling material and finished brain are the same cached glyphs. */
export function createBrainRenderer(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  const atlas = document.createElement("canvas");
  const target = atlas.getContext("2d");
  if (!target) return null;
  const particles = createBrainParticles(target);
  const assignments = particles.map(particle => {
    const column = Math.min(COLUMNS - 1, Math.max(0, Math.floor((particle.x - LEFT) / STRAND_WIDTH)));
    const row = Math.min(ROWS - 1, Math.max(0, Math.floor(particle.y / SEGMENT_HEIGHT)));
    return row * COLUMNS + column;
  });
  const occupied = new Set(assignments);
  let tileWidth = TILE_WIDTH;
  let tileHeight = TILE_HEIGHT;
  let painted = false;

  function resize() {
    const width = canvas.getBoundingClientRect().width;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(1, Math.round(width * ratio));
    const pixelHeight = Math.max(1, Math.round(width / BRAIN_WIDTH * BRAIN_HEIGHT * ratio));
    if (painted && canvas.width === pixelWidth && canvas.height === pixelHeight) return;
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    const scale = pixelWidth / BRAIN_WIDTH;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    tileWidth = Math.ceil(TILE_WIDTH * scale);
    tileHeight = Math.ceil(TILE_HEIGHT * scale);
    atlas.width = ATLAS_COLUMNS * tileWidth;
    atlas.height = Math.ceil(segments.length / ATLAS_COLUMNS) * tileHeight;
    target!.textAlign = "center";
    target!.textBaseline = "middle";

    // Padded tiles preserve whole characters, including the large bold digits.
    particles.forEach((particle, index) => {
      const segment = assignments[index];
      const sourceX = (segment % ATLAS_COLUMNS) * tileWidth;
      const sourceY = Math.floor(segment / ATLAS_COLUMNS) * tileHeight;
      target!.font = `${particle.weight} ${particle.size * scale}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      target!.fillStyle = particle.color;
      target!.globalAlpha = particle.alpha;
      target!.fillText(
        particle.char,
        sourceX + (particle.x - segments[segment].x + PADDING) / TILE_WIDTH * tileWidth,
        sourceY + (particle.y - segments[segment].y + PADDING) / TILE_HEIGHT * tileHeight,
      );
    });
    target!.globalAlpha = 1;
    painted = true;
  }

  // The lead-in advances while rain loops, then stays fixed during assembly so
  // every strand continues from its current position when the threshold is met.
  function draw(elapsed: number, rainLeadIn = 0) {
    context.clearRect(0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
    context.globalAlpha = 1;
    segments.forEach((segment, index) => {
      if (!occupied.has(index)) return;
      const t = clamp((elapsed - segment.catchAt) / segment.duration);
      const gather = smooth(t);
      let y: number;
      if (elapsed < segment.catchAt) {
        y = wrap(segment.phase + (rainLeadIn + elapsed) * segment.speed);
      } else {
        // Match the falling speed when captured, then ease to a zero-speed landing.
        // No wrapping or image replacement occurs once a piece begins gathering.
        const t2 = t * t;
        const t3 = t2 * t;
        const caughtY = wrap(segment.phase + (rainLeadIn + segment.catchAt) * segment.speed);
        y = (2 * t3 - 3 * t2 + 1) * caughtY
          + (-2 * t3 + 3 * t2) * segment.y
          + (t3 - 2 * t2 + t) * segment.speed * segment.duration;
      }
      const x = segment.rainX + (segment.x - segment.rainX) * gather
        + Math.sin(Math.PI * gather) * segment.drift - PADDING;
      const sourceX = (index % ATLAS_COLUMNS) * tileWidth;
      const sourceY = Math.floor(index / ATLAS_COLUMNS) * tileHeight;
      context.drawImage(atlas, sourceX, sourceY, tileWidth, tileHeight, x, y - PADDING, TILE_WIDTH, TILE_HEIGHT);
    });
  }

  return { resize, draw };
}
