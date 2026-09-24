import { BRAIN_HEIGHT, BRAIN_WIDTH } from "./brain-particles";
import { PADDING, TILE_HEIGHT, TILE_WIDTH, segments, wrap } from "./brain-layout";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/** The falling material and finished brain use the same pre-rendered digits. */
export function createBrainRenderer(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  atlas: { tiles: CanvasImageSource[]; occupied: number[] },
) {
  function resize(settled = false) {
    const width = canvas.getBoundingClientRect().width;
    // Moving strips need a display-sized buffer. Repainting a Retina buffer
    // quadruples raster work; restore that detail for the settled artwork.
    const ratio = settled ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const pixelWidth = Math.max(1, Math.round(width * ratio));
    const pixelHeight = Math.max(1, Math.round(width / BRAIN_WIDTH * BRAIN_HEIGHT * ratio));
    if (canvas.width === pixelWidth && canvas.height === pixelHeight) return;
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    const scale = pixelWidth / BRAIN_WIDTH;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  // The lead-in advances while rain loops, then stays fixed during assembly so
  // every strand continues from its current position when the threshold is met.
  function draw(elapsed: number, rainLeadIn = 0) {
    context.clearRect(0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
    context.globalAlpha = 1;
    for (const index of atlas.occupied) {
      const segment = segments[index];
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
      context.drawImage(atlas.tiles[index], x, y - PADDING, TILE_WIDTH, TILE_HEIGHT);
    }
  }

  return { resize, draw };
}
