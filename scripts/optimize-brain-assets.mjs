import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { chromium } from "@playwright/test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));
// Keep the approved digit artwork. Only its delivery size and poster encoding change.
// Bump the version directory and brain-assets.ts together if these assets change.
const output = new URL("../public/images/brain/v2/", import.meta.url);
await mkdir(output, { recursive: true });
const source = new URL("../public/images/brain-atlas.webp", import.meta.url);
await copyFile(source, new URL("atlas-2x.webp", output));
await sharp(await readFile(source)).resize(1056, 2232).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(new URL("atlas-1x.webp", output).pathname);
const occupied = JSON.parse(await readFile(new URL("../components/hero/brain-atlas.json", import.meta.url), "utf8"));
const modules = Object.fromEntries(await Promise.all(["brain-particles", "brain-layout", "brain-renderer"].map(async name => [name, ts.transpileModule(
  await readFile(new URL(`../components/hero/${name}.ts`, import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } },
).outputText])));
const browser = await chromium.launch();
try {
  for (const scale of [1, 2]) {
    const context = await browser.newContext({ deviceScaleFactor: scale });
    const page = await context.newPage();
    const atlasUrl = `data:image/webp;base64,${(await readFile(new URL(`atlas-${scale}x.webp`, output))).toString("base64")}`;
    const frames = await page.evaluate(async ({ modules, occupied, atlasUrl, scale }) => {
      const cache = {};
      function require(name) {
        name = name.replace("./", "");
        if (!cache[name]) {
          const compiled = { exports: {} };
          cache[name] = compiled;
          new Function("exports", "module", "require", modules[name])(compiled.exports, compiled, require);
        }
        return cache[name].exports;
      }
      const { BRAIN_WIDTH, BRAIN_HEIGHT, ASSEMBLY_DURATION } = require("brain-particles");
      const { ATLAS_COLUMNS, TILE_WIDTH, TILE_HEIGHT } = require("brain-layout");
      const image = new Image(); image.src = atlasUrl; await image.decode();
      const bitmap = await createImageBitmap(image);
      const tiles = [];
      await Promise.all(occupied.map(async index => {
        const width = TILE_WIDTH * scale, height = TILE_HEIGHT * scale;
        tiles[index] = await createImageBitmap(bitmap, index % ATLAS_COLUMNS * width, Math.floor(index / ATLAS_COLUMNS) * height, width, height);
      }));
      bitmap.close();
      const canvas = document.createElement("canvas");
      canvas.style.width = `${BRAIN_WIDTH}px`; canvas.style.height = `${BRAIN_HEIGHT}px`;
      document.body.append(canvas);
      const renderer = require("brain-renderer").createBrainRenderer(canvas, canvas.getContext("2d"), { tiles, occupied });
      renderer.resize();
      const flattened = document.createElement("canvas");
      flattened.width = canvas.width; flattened.height = canvas.height;
      const flatContext = flattened.getContext("2d");
      const frames = {};
      for (const [name, time] of [["rain", 0], ["still", ASSEMBLY_DURATION]]) {
        renderer.draw(time);
        flatContext.fillStyle = "#14202c";
        flatContext.fillRect(0, 0, flattened.width, flattened.height);
        flatContext.drawImage(canvas, 0, 0);
        frames[name] = flattened.toDataURL("image/webp", .9);
      }
      return frames;
    }, { modules, occupied, atlasUrl, scale });
    for (const [name, data] of Object.entries(frames)) {
      const buffer = Buffer.from(data.split(",")[1], "base64");
      await writeFile(new URL(`${name}-${scale}x.webp`, output), buffer);
      process.stdout.write(`${name}-${scale}x.webp: ${buffer.length} bytes\n`);
    }
    await context.close();
  }
} finally { await browser.close(); }
