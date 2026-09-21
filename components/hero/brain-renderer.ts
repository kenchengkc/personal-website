import { ASSEMBLY_DURATION, BRAIN_HEIGHT, BRAIN_WIDTH, createBrainParticles } from "./brain-particles";

const LANES = 44;
const LANE_WIDTH = BRAIN_WIDTH / LANES;
const RAIN_HEIGHT = 720;
const MOVING_DIGITS = 384;
const SPRITE_SIZE = 40;
const SPRITE_COLUMNS = 24;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

function surface(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.textAlign = "center";
  context.textBaseline = "middle";
  return { canvas, context };
}

/** Cache the dense surface; only rain strips and a bounded set of digits move. */
export function createBrainRenderer(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  const finished = surface(BRAIN_WIDTH, BRAIN_HEIGHT);
  const rain = surface(BRAIN_WIDTH, RAIN_HEIGHT);
  const sprites = surface(SPRITE_COLUMNS * SPRITE_SIZE, Math.ceil(MOVING_DIGITS / SPRITE_COLUMNS) * SPRITE_SIZE);
  if (!finished || !rain || !sprites) return null;
  const particles = createBrainParticles(finished.context);
  const moving = Array.from({ length: MOVING_DIGITS }, (_, i) => particles[Math.floor(i * particles.length / MOVING_DIGITS)]);
  let scale = 1;
  let painted = false;

  for (let lane = 0; lane < LANES; lane++) {
    for (let row = 0; row < RAIN_HEIGHT / 14; row++) {
      const seed = (lane * 73 + row * 31) % 101;
      rain.context.font = `${seed % 3 === 0 ? 600 : 400} ${8 + seed % 4}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      rain.context.fillStyle = seed % 9 === 0 ? "#d7efea" : seed % 3 === 0 ? "#86c5c2" : "#487e83";
      rain.context.globalAlpha = 0.25 + (seed % 7) * 0.1;
      rain.context.fillText(seed % 2 ? "1" : "0", (lane + 0.5) * LANE_WIDTH, row * 14 + 7);
    }
  }
  moving.forEach((particle, i) => {
    sprites.context.font = `${particle.weight} ${particle.size * 2}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    sprites.context.fillStyle = particle.color;
    sprites.context.fillText(particle.char, (i % SPRITE_COLUMNS + 0.5) * SPRITE_SIZE, (Math.floor(i / SPRITE_COLUMNS) + 0.5) * SPRITE_SIZE);
  });

  function resize() {
    const width = canvas.getBoundingClientRect().width;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(1, Math.round(width * ratio));
    const pixelHeight = Math.max(1, Math.round(width / BRAIN_WIDTH * BRAIN_HEIGHT * ratio));
    if (painted && canvas.width === pixelWidth && canvas.height === pixelHeight) return;
    canvas.width = finished!.canvas.width = pixelWidth;
    canvas.height = finished!.canvas.height = pixelHeight;
    scale = pixelWidth / BRAIN_WIDTH;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const target = finished!.context;
    target.setTransform(scale, 0, 0, scale, 0, 0);
    target.textAlign = "center";
    target.textBaseline = "middle";
    // All ~6,000 digits are rendered once per size, never once per frame.
    for (const particle of particles) {
      target.font = `${particle.weight} ${particle.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      target.fillStyle = particle.color;
      target.globalAlpha = particle.alpha;
      target.fillText(particle.char, particle.x, particle.y);
    }
    target.globalAlpha = 1;
    painted = true;
  }

  function draw(elapsed: number) {
    context.clearRect(0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
    if (elapsed >= ASSEMBLY_DURATION) {
      context.drawImage(finished!.canvas, 0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
      return;
    }
    const fadeIn = smooth(elapsed / 140);
    const rainAlpha = fadeIn * (1 - smooth((elapsed - 400) / 1700));
    if (rainAlpha > 0) {
      context.globalAlpha = rainAlpha * 0.75;
      for (let lane = 0; lane < LANES; lane++) {
        const offset = (elapsed * (0.15 + (lane % 7) * 0.017) + lane * 83) % RAIN_HEIGHT;
        const x = lane * LANE_WIDTH;
        context.drawImage(rain!.canvas, x, 0, LANE_WIDTH, RAIN_HEIGHT, x, offset - RAIN_HEIGHT, LANE_WIDTH, RAIN_HEIGHT);
        context.drawImage(rain!.canvas, x, 0, LANE_WIDTH, RAIN_HEIGHT, x, offset, LANE_WIDTH, RAIN_HEIGHT);
      }
    }

    // A staggered front settles from the crown down while rain is still flowing.
    // Each strip is a copy of the finished digits, including their final shading.
    for (let lane = 0; lane < LANES; lane++) {
      const head = clamp((elapsed - 240 - (lane % 7) * 26) / 1700) * (BRAIN_HEIGHT + 48);
      const solid = Math.max(0, Math.min(BRAIN_HEIGHT, head - 48));
      const x = lane * LANE_WIDTH;
      context.globalAlpha = 1;
      if (solid > 0) context.drawImage(finished!.canvas, x * scale, 0, LANE_WIDTH * scale, solid * scale, x, 0, LANE_WIDTH, solid);
      // Feather the advancing edge without drawing any geometry onto the brain.
      for (let band = 0; band < 3; band++) {
        const y = solid + band * 16;
        const height = Math.min(16, BRAIN_HEIGHT - y, head - y);
        if (height <= 0) continue;
        context.globalAlpha = (1 - band / 3) * smooth((head - y) / 48);
        context.drawImage(finished!.canvas, x * scale, y * scale, LANE_WIDTH * scale, height * scale, x, y, LANE_WIDTH, height);
      }
    }

    moving.forEach((particle, i) => {
      const t = clamp((elapsed - particle.y * 0.65 - (i % 9) * 17) / 1450);
      if (t >= 1) return;
      const gather = smooth((t - 0.15) / 0.85);
      const laneX = (Math.floor(particle.x / LANE_WIDTH) + 0.5) * LANE_WIDTH;
      const x = laneX + (particle.x - laneX) * gather + Math.sin(t * Math.PI) * Math.sin(i * 2.4) * 28;
      const y = particle.y - (1 - t) ** 2 * (260 + (i % 5) * 38);
      if (y < -15) return;
      context.globalAlpha = particle.alpha * fadeIn * (1 - smooth((t - 0.8) / 0.2));
      context.drawImage(sprites!.canvas, (i % SPRITE_COLUMNS) * SPRITE_SIZE, Math.floor(i / SPRITE_COLUMNS) * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, x - 10, y - 10, 20, 20);
    });
    context.globalAlpha = 1;
  }

  return { resize, draw };
}
