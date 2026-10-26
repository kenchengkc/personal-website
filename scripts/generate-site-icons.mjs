import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");
const source = fileURLToPath(new URL("../public/images/kclogo.png", import.meta.url));
// Bump this directory's version and metadata URLs when changing the source.
const output = new URL("../public/images/icons/v1/", import.meta.url);
await mkdir(output, { recursive: true });

for (const [name, size] of [["favicon-32.png", 32], ["favicon-48.png", 48], ["apple-touch-icon.png", 180]]) {
  const result = await sharp(source)
    .resize(size, size, { fit: "contain", kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL(name, output)));
  console.log(`${name}: ${size}×${size}, ${result.size} bytes`);
}
