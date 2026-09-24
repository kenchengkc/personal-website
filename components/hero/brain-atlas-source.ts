// Build-time artwork generation. The browser only loads the resulting atlas.
import { createBrainParticles } from "./brain-particles";
import { ATLAS_COLUMNS, ATLAS_SCALE, COLUMNS, LEFT, PADDING, ROWS, SEGMENT_HEIGHT, STRAND_WIDTH, TILE_HEIGHT, TILE_WIDTH, segments } from "./brain-layout";

export function createBrainAtlas() {
  const image = document.createElement("canvas");
  const context = image.getContext("2d")!;
  const particles = createBrainParticles(context);
  const tileWidth = TILE_WIDTH * ATLAS_SCALE;
  const tileHeight = TILE_HEIGHT * ATLAS_SCALE;
  image.width = ATLAS_COLUMNS * tileWidth;
  image.height = Math.ceil(segments.length / ATLAS_COLUMNS) * tileHeight;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const occupied = new Set<number>();
  for (const particle of particles) {
    const column = Math.min(COLUMNS - 1, Math.max(0, Math.floor((particle.x - LEFT) / STRAND_WIDTH)));
    const row = Math.min(ROWS - 1, Math.max(0, Math.floor(particle.y / SEGMENT_HEIGHT)));
    const segment = row * COLUMNS + column;
    occupied.add(segment);
    context.font = `${particle.weight} ${particle.size * ATLAS_SCALE}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    context.fillStyle = particle.color;
    context.globalAlpha = particle.alpha;
    context.fillText(
      particle.char,
      (segment % ATLAS_COLUMNS) * tileWidth + (particle.x - segments[segment].x + PADDING) * ATLAS_SCALE,
      Math.floor(segment / ATLAS_COLUMNS) * tileHeight + (particle.y - segments[segment].y + PADDING) * ATLAS_SCALE,
    );
  }
  return { image, occupied: [...occupied] };
}
