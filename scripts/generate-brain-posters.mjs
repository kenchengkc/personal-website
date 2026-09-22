import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import ts from "typescript";

// Render the exact first and reduced-motion frames without depending on a server.
// Regenerate whenever the initial arrangement or the brain artwork changes.
const compile = async name => ts.transpileModule(
  await readFile(new URL(`../components/hero/${name}.ts`, import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } },
).outputText;
const particleCode = await compile("brain-particles");
const rendererCode = await compile("brain-renderer");
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const images = await page.evaluate(({ particleCode, rendererCode }) => {
    const particleModule = { exports: {} };
    new Function("exports", "module", particleCode)(particleModule.exports, particleModule);
    const rendererModule = { exports: {} };
    new Function("exports", "module", "require", rendererCode)(rendererModule.exports, rendererModule, () => particleModule.exports);
    const canvas = document.createElement("canvas");
    canvas.style.width = "1000px";
    canvas.style.height = "600px";
    document.body.append(canvas);
    const renderer = rendererModule.exports.createBrainRenderer(canvas, canvas.getContext("2d"));
    renderer.resize();
    renderer.draw(0);
    const rain = canvas.toDataURL("image/webp", 0.98);
    renderer.draw(particleModule.exports.ASSEMBLY_DURATION);
    return { rain, still: canvas.toDataURL("image/webp", 0.98) };
  }, { particleCode, rendererCode });
  for (const [name, data] of Object.entries(images)) {
    await writeFile(new URL(`../public/images/brain-${name}.webp`, import.meta.url), Buffer.from(data.split(",")[1], "base64"));
  }
} finally {
  await browser.close();
}
