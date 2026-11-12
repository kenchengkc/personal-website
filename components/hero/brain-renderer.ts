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
  let brainScale = 1;
  let brainLeft = 0;
  let brainTop = 0;

  function resize(settledWidth?: number) {
    const { width, height } = canvas.getBoundingClientRect();
    // Keep the same pixel density during motion and after settling, avoiding
    // a sharpness jump on the final frame. The pre-rendered atlas supports 2x.
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(1, Math.round(width * ratio));
    const pixelHeight = Math.max(1, Math.round(height * ratio));
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    // Match the rain poster's object-fit: cover, including on tall phone frames.
    const rainScale = Math.max(pixelWidth / BRAIN_WIDTH, pixelHeight / BRAIN_HEIGHT);
    const left = (pixelWidth - BRAIN_WIDTH * rainScale) / 2;
    const top = (pixelHeight - BRAIN_HEIGHT * rainScale) / 2;
    context.setTransform(rainScale, 0, 0, rainScale, left, top);

    // The silhouette is centered on y=320. Poster generation uses the original
    // coordinate system; the page fits that artwork to its smaller landing area.
    brainScale = settledWidth === undefined ? 1 : settledWidth * ratio / (BRAIN_WIDTH * rainScale);
    brainLeft = (1 - brainScale) * BRAIN_WIDTH / 2;
    brainTop = settledWidth === undefined ? 0 : BRAIN_HEIGHT / 2 - 320 * brainScale;
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
      const tileScale = 1 + (brainScale - 1) * gather;
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
          + (-2 * t3 + 3 * t2) * (brainTop + segment.y * brainScale)
          + (t3 - 2 * t2 + t) * segment.speed * segment.duration;
      }
      const x = segment.rainX + (brainLeft + segment.x * brainScale - segment.rainX) * gather
        + Math.sin(Math.PI * gather) * segment.drift;
      context.drawImage(atlas.tiles[index], x - PADDING * tileScale, y - PADDING * tileScale,
        TILE_WIDTH * tileScale, TILE_HEIGHT * tileScale);
    }
  }

  return { resize, draw };
}
