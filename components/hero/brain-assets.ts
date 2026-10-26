// Versioned assets may be cached indefinitely. Bump this path when regenerating.
export const BRAIN_ASSET_PATH = "/images/brain/v2";
export type AtlasScale = 1 | 2;

// The canvas caps device density at 2x; a 1000px poster covers small phones.
export const SMALL_POSTER_MEDIA = "(max-width: 540px), (max-resolution: 1dppx)";
export const brainPosterMedia = (motion: "reduce" | "no-preference", scale: AtlasScale) => scale === 1
  ? `(prefers-reduced-motion: ${motion}) and (max-width: 540px), (prefers-reduced-motion: ${motion}) and (max-resolution: 1dppx)`
  : `(prefers-reduced-motion: ${motion}) and (min-width: 541px) and (min-resolution: 1.001dppx)`;
