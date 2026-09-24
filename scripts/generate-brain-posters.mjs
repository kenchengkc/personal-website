import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import ts from "typescript";

// Render the exact first and reduced-motion frames without depending on a server.
// Regenerate whenever the initial arrangement or the brain artwork changes.
const compile = async name => ts.transpileModule(
  await readFile(new URL(`../components/hero/${name}.ts`, import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } },
).outputText;
const modules = Object.fromEntries(await Promise.all(
  ["brain-particles", "brain-layout", "brain-atlas-source", "brain-renderer"].map(async name => [name, await compile(name)]),
));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const images = await page.evaluate(async modules => {
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
    const { ASSEMBLY_DURATION } = require("brain-particles");
    const { createBrainRenderer } = require("brain-renderer");
    const atlas = require("brain-atlas-source").createBrainAtlas();
    const atlasData = atlas.image.toDataURL("image/webp", 0.85);
    const atlasImage = new Image();
    atlasImage.src = atlasData;
    await atlasImage.decode();
    const { ATLAS_COLUMNS, ATLAS_SCALE, TILE_WIDTH, TILE_HEIGHT } = require("brain-layout");
    const bitmap = await createImageBitmap(atlasImage);
    const tiles = [];
    await Promise.all(atlas.occupied.map(async index => {
      tiles[index] = await createImageBitmap(bitmap, index % ATLAS_COLUMNS * TILE_WIDTH * ATLAS_SCALE, Math.floor(index / ATLAS_COLUMNS) * TILE_HEIGHT * ATLAS_SCALE, TILE_WIDTH * ATLAS_SCALE, TILE_HEIGHT * ATLAS_SCALE);
    }));
    bitmap.close();
    const canvas = document.createElement("canvas");
    canvas.style.width = "1000px";
    canvas.style.height = "600px";
    document.body.append(canvas);
    const renderer = createBrainRenderer(canvas, canvas.getContext("2d"), { tiles, occupied: atlas.occupied });
    renderer.resize();
    renderer.draw(0);
    const rain = canvas.toDataURL("image/webp", 0.98);
    renderer.draw(ASSEMBLY_DURATION);
    return { rain, still: canvas.toDataURL("image/webp", 0.98), atlas: atlasData, occupied: atlas.occupied };
  }, modules);
  await writeFile(new URL("../components/hero/brain-atlas.json", import.meta.url), JSON.stringify(images.occupied) + "\n");
  for (const name of ["rain", "still", "atlas"]) {
    const data = images[name];
    await writeFile(new URL(`../public/images/brain-${name}.webp`, import.meta.url), Buffer.from(data.split(",")[1], "base64"));
  }
} finally {
  await browser.close();
}
