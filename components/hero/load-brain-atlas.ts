import occupied from "./brain-atlas.json";
import { ATLAS_COLUMNS, TILE_HEIGHT, TILE_WIDTH } from "./brain-layout";
import { BRAIN_ASSET_PATH, type AtlasScale } from "./brain-assets";

type Atlas = { tiles: ImageBitmap[]; occupied: number[] };
const pending = new Map<AtlasScale, Promise<Atlas>>();

export function loadBrainAtlas(scale: AtlasScale) {
  let request = pending.get(scale);
  if (!request) {
    request = (async () => {
      const image = new Image();
      image.decoding = "async";
      image.src = `${BRAIN_ASSET_PATH}/atlas-${scale}x.webp`;
      await image.decode();
      // Decode once, then crop the decoded bitmap. Mobile uses the same digits
      // at a source resolution sufficient for its full canvas backing store.
      const atlas = await createImageBitmap(image);
      const tiles: ImageBitmap[] = [];
      const width = TILE_WIDTH * scale;
      const height = TILE_HEIGHT * scale;
      try {
        await Promise.all(occupied.map(async index => {
          tiles[index] = await createImageBitmap(atlas, index % ATLAS_COLUMNS * width, Math.floor(index / ATLAS_COLUMNS) * height, width, height);
        }));
      } catch (error) {
        tiles.forEach(tile => tile?.close());
        throw error;
      } finally {
        atlas.close();
      }
      return { tiles, occupied };
    })().catch(error => {
      pending.delete(scale);
      throw error;
    });
    pending.set(scale, request);
  }
  return request;
}
