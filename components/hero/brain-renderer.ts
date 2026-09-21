import { ASSEMBLY_DURATION, BRAIN_HEIGHT, BRAIN_WIDTH, createBrainParticles } from "./brain-particles";

const STRANDS = 128;
const LEFT = 100;
const RIGHT = 900;
const STRAND_WIDTH = (RIGHT - LEFT) / STRANDS;
const PADDING = 12;
const TILE_WIDTH = Math.ceil(STRAND_WIDTH + PADDING * 2);
const LOOP_HEIGHT = BRAIN_HEIGHT + 24;
const ATLAS_COLUMNS = 32;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const hash = (value: number) => { const x = Math.sin(value * 12.9898) * 43758.5453; return x - Math.floor(x); };

// Every strand carries its final glyphs throughout the animation. A whole strand
// shares a trajectory, so thousands of digits need only a few hundred image draws.
const strands = Array.from({ length: STRANDS }, (_, index) => {
  const speed = 0.17 + hash(index + 17) * 0.13;
  const catchAt = 340 + hash(index + 31) * 430;
  const phase = hash(index + 71) * LOOP_HEIGHT;
  const caughtOffset = (phase + catchAt * speed) % LOOP_HEIGHT;
  const distance = LOOP_HEIGHT - caughtOffset;
  const duration = ASSEMBLY_DURATION - catchAt - 100 - hash(index + 53) * 170;
  return {
    x: LEFT + index * STRAND_WIDTH,
    rainX: 20 + index / (STRANDS - 1) * (BRAIN_WIDTH - 40),
    speed,
    catchAt,
    phase,
    caughtOffset,
    // Avoid a last-second abrupt stop if a strand is almost home when caught.
    distance: distance < Math.max(100, speed * duration / 2) ? distance + LOOP_HEIGHT : distance,
    duration,
  };
});

/** The falling material and the finished brain are the same cached glyphs. */
export function createBrainRenderer(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  const atlas = document.createElement("canvas");
  const target = atlas.getContext("2d");
  if (!target) return null;
  const particles = createBrainParticles(target);
  const assignments = particles.map(particle => Math.min(STRANDS - 1, Math.max(0, Math.floor((particle.x - LEFT) / STRAND_WIDTH))));
  let tileWidth = TILE_WIDTH;
  let tileHeight = LOOP_HEIGHT;
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
    tileHeight = Math.ceil(LOOP_HEIGHT * scale);
    atlas.width = ATLAS_COLUMNS * tileWidth;
    atlas.height = Math.ceil(STRANDS / ATLAS_COLUMNS) * tileHeight;
    target!.textAlign = "center";
    target!.textBaseline = "middle";

    // Place whole glyphs inside padded strips; cutting up a flattened image would
    // split larger digits across strands while they move at different speeds.
    particles.forEach((particle, index) => {
      const strand = assignments[index];
      const sourceX = (strand % ATLAS_COLUMNS) * tileWidth;
      const sourceY = Math.floor(strand / ATLAS_COLUMNS) * tileHeight;
      target!.font = `${particle.weight} ${particle.size * scale}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      target!.fillStyle = particle.color;
      target!.globalAlpha = particle.alpha;
      target!.fillText(
        particle.char,
        sourceX + (particle.x - strands[strand].x + PADDING) / TILE_WIDTH * tileWidth,
        sourceY + particle.y / LOOP_HEIGHT * tileHeight,
      );
    });
    target!.globalAlpha = 1;
    painted = true;
  }

  function draw(elapsed: number) {
    context.clearRect(0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
    // Only the initial entrance fades. No glyph disappears to reveal a new image.
    context.globalAlpha = smooth(elapsed / 160);
    strands.forEach((strand, index) => {
      const t = clamp((elapsed - strand.catchAt) / strand.duration);
      const gather = smooth(t);
      let offset: number;
      if (t === 1) {
        offset = 0;
      } else if (elapsed < strand.catchAt) {
        offset = (strand.phase + elapsed * strand.speed) % LOOP_HEIGHT;
      } else {
        // Cubic Hermite motion keeps the original downward velocity when caught
        // and reaches the final position with zero velocity, without reversing.
        const t2 = t * t;
        const t3 = t2 * t;
        const travel = (-2 * t3 + 3 * t2) * strand.distance
          + (t3 - 2 * t2 + t) * strand.speed * strand.duration;
        offset = (strand.caughtOffset + travel) % LOOP_HEIGHT;
      }
      const x = strand.rainX + (strand.x - strand.rainX) * gather - PADDING;
      const sourceX = (index % ATLAS_COLUMNS) * tileWidth;
      const sourceY = Math.floor(index / ATLAS_COLUMNS) * tileHeight;
      context.drawImage(atlas, sourceX, sourceY, tileWidth, tileHeight, x, offset, TILE_WIDTH, LOOP_HEIGHT);
      if (offset > 0) {
        context.drawImage(atlas, sourceX, sourceY, tileWidth, tileHeight, x, offset - LOOP_HEIGHT, TILE_WIDTH, LOOP_HEIGHT);
      }
    });
    context.globalAlpha = 1;
  }

  return { resize, draw };
}
