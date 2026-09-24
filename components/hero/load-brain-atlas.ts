import occupied from "./brain-atlas.json";
import { ATLAS_COLUMNS, ATLAS_SCALE, TILE_HEIGHT, TILE_WIDTH } from "./brain-layout";

let pending: Promise<{ tiles: ImageBitmap[]; occupied: number[] }> | undefined;

export function loadBrainAtlas() {
  if (!pending) {
    pending = (async () => {
      const image = new Image();
      image.src = "/images/brain-atlas.webp";
      await image.decode();
      // Decode once, then crop the decoded bitmap. Cropping the encoded image
      // repeatedly would decode the entire atlas for every strip.
      const atlas = await createImageBitmap(image);
      const tiles: ImageBitmap[] = [];
      const width = TILE_WIDTH * ATLAS_SCALE;
      const height = TILE_HEIGHT * ATLAS_SCALE;
      try {
        await Promise.all(occupied.map(async index => {
          tiles[index] = await createImageBitmap(atlas, index % ATLAS_COLUMNS * width, Math.floor(index / ATLAS_COLUMNS) * height, width, height);
        }));
      } finally {
        atlas.close();
      }
      return { tiles, occupied };
    })();
  }
  return pending;
}
