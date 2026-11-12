import { expect, test, type Locator, type Page } from "@playwright/test";

// Sample the rendered box so this catches a gap caused by either the layout
// or the artwork itself. Inset horizontally to exclude the rounded corners.
async function countRainAtBottom(page: Page, frame: Locator) {
  const box = (await frame.boundingBox())!;
  const strip = await page.screenshot({
    scale: "css",
    clip: {
      x: Math.ceil(box.x + box.width * 0.1),
      y: Math.floor(box.y + box.height) - 6,
      width: Math.floor(box.width * 0.8),
      height: 5,
    },
  });
  return page.evaluate(async encoded => {
    const image = new Image();
    image.src = "data:image/png;base64," + encoded;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    // Even the muted teal digits are lighter than the navy background (G = 32).
    let count = 0;
    for (let g = 1; g < data.length; g += 4) {
      if (data[g] > 65) count++;
    }
    return count;
  }, strip.toString("base64"));
}

for (const width of [1440, 390]) {
  test(`the poster and moving rain reach the bottom of the frame at ${width}px`, async ({ page }) => {
    // Keep the whole frame visible without triggering scroll-driven assembly.
    await page.setViewportSize({ width, height: 1600 });
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/atlas-*x.webp*", async route => {
      await gate;
      await route.continue();
    });
    try {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const frame = page.locator(".hero-binary-art");
      const poster = frame.locator(".hero-brain-poster");
      await poster.evaluate((img: HTMLImageElement) => img.decode());
      await expect(poster).toBeVisible();
      expect(await countRainAtBottom(page, frame), "static rain poster").toBeGreaterThan(5);
      release();
      await expect(frame).toHaveAttribute("data-ready", "true");
      await expect(poster).toBeHidden();
      await expect.poll(() => countRainAtBottom(page, frame), { message: "moving rain" }).toBeGreaterThan(5);
      await expect(frame).toHaveAttribute("data-phase", "raining");
    } finally {
      release();
    }
  });
}
