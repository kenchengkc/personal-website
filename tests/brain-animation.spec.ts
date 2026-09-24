import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    brainDraws: { total: number; peak: number };
  }
}

test("rain keeps moving while assembly waits for scrolling past 35%", async ({ page }) => {
  // Keep the initial artwork below the trigger so both sides can be reached by scrolling.
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");
  const artwork = page.locator(".hero-binary-art");
  const canvas = page.locator(".hero-brain-canvas");
  await expect(artwork).toHaveAttribute("data-ready", "true");
  await canvas.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const container = element.closest(".hero-binary-art")!.getBoundingClientRect();
    const top = Math.max(bounds.top, container.top);
    const height = Math.min(bounds.bottom, container.bottom) - top;
    window.scrollTo({ top: window.scrollY + top - window.innerHeight + height * 0.34, behavior: "instant" });
  });
  const firstFrame = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
  await expect.poll(async () => (await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())) !== firstFrame).toBe(true);
  // Rain must keep looping beyond the entire assembly duration without forming a brain.
  await page.waitForTimeout(2800);
  await expect(artwork).toHaveAttribute("data-phase", "raining");
  await canvas.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const container = element.closest(".hero-binary-art")!.getBoundingClientRect();
    const top = Math.max(bounds.top, container.top);
    const height = Math.min(bounds.bottom, container.bottom) - top;
    window.scrollTo({ top: window.scrollY + top - window.innerHeight + height * 0.36, behavior: "instant" });
  });
  await expect(artwork).toHaveAttribute("data-phase", "assembling");
  // The threshold starts the transition once; it does not interrupt it afterward.
  await page.evaluate(() => window.scrollBy({ top: -30, behavior: "instant" }));
  await expect(artwork).toHaveAttribute("data-phase", "complete", { timeout: 5000 });
});

test("a tall viewport still waits for the first scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1800 });
  await page.goto("/");
  const artwork = page.locator(".hero-binary-art");
  await expect(artwork).toHaveAttribute("data-ready", "true");
  await page.waitForTimeout(400);
  await expect(artwork).toHaveAttribute("data-phase", "raining");
  await page.evaluate(() => window.scrollTo({ top: 10, behavior: "instant" }));
  await expect(artwork).toHaveAttribute("data-phase", "assembling");
});

test("brain assembly bounds repaint work and stops drawing after completion", async ({ page }) => {
  await page.addInitScript(() => {
    window.brainDraws = { total: 0, peak: 0 };
    let frameDraws = 0;
    const original = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (image: CanvasImageSource, ...coordinates: number[]) {
      if (this.canvas.classList.contains("hero-brain-canvas")) {
        frameDraws++;
        window.brainDraws.total++;
        window.brainDraws.peak = Math.max(window.brainDraws.peak, frameDraws);
      }
      return Reflect.apply(original, this, [image, ...coordinates]);
    };
    function sample() { frameDraws = 0; requestAnimationFrame(sample); }
    requestAnimationFrame(sample);
  });
  await page.goto("/");
  await page.locator(".hero-binary-art").evaluate(element => element.scrollIntoView({ behavior: "instant", block: "center" }));
  await expect(page.locator(".hero-binary-art")).toHaveAttribute("data-phase", "complete", { timeout: 10000 });
  const draws = await page.evaluate(() => window.brainDraws);
  // A regression to repainting all ~6,000 glyphs would exceed this budget.
  expect(draws.peak).toBeLessThan(900);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.brainDraws.total)).toBe(draws.total);
});

test("Retina artwork keeps the same sharp resolution through the final assembly frame", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.locator(".hero-binary-art")).toHaveAttribute("data-ready", "true");
    const canvas = page.locator(".hero-brain-canvas");
    const initial = await canvas.evaluate((element: HTMLCanvasElement) => ({
      width: element.width,
      height: element.height,
      displayWidth: element.getBoundingClientRect().width,
    }));
    expect(initial.width).toBe(Math.round(initial.displayWidth * 2));
    const frames = await canvas.evaluate((element: HTMLCanvasElement) => new Promise<{ width: number; height: number; phase: string }[]>(resolve => {
      const samples: { width: number; height: number; phase: string }[] = [];
      element.scrollIntoView({ behavior: "instant", block: "center" });
      function sample() {
        const phase = element.closest<HTMLElement>(".hero-binary-art")!.dataset.phase!;
        samples.push({ width: element.width, height: element.height, phase });
        if (phase === "complete") resolve(samples);
        else requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    }));
    expect(frames.some(frame => frame.phase === "assembling")).toBe(true);
    expect(frames.at(-1)!.phase).toBe("complete");
    expect([...new Set(frames.map(frame => `${frame.width}x${frame.height}`))]).toEqual([`${initial.width}x${initial.height}`]);
  } finally {
    await context.close();
  }
});

test("reduced motion paints a stable brain and preserves it after mobile resize", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-binary-art")).toHaveAttribute("data-phase", "complete");
  await expect.poll(() => page.locator(".hero-brain-canvas").evaluate((element: HTMLCanvasElement) => {
    const pixels = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data;
    let visible = 0;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) visible++;
    return visible;
  })).toBeGreaterThan(5000);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.locator(".hero-brain-canvas").evaluate((element: HTMLCanvasElement) => {
    const pixels = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data;
    let visible = 0;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) visible++;
    return visible;
  })).toBeGreaterThan(5000);
  const before = await page.locator(".hero-brain-canvas").evaluate((element: HTMLCanvasElement) => element.toDataURL());
  await page.waitForTimeout(150);
  expect(await page.locator(".hero-brain-canvas").evaluate((element: HTMLCanvasElement) => element.toDataURL())).toBe(before);
});

test("rain wraps outside the image and does not jump after a delayed frame", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1400 });
  await page.addInitScript(() => {
    const motion = { pops: 0, maxStep: 0, paintedGlyphs: 0 };
    (window as unknown as { rainMotion: typeof motion }).rainMotion = motion;
    const positions = new Map<CanvasImageSource, number>();
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    const text = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (...args: Parameters<typeof text>) {
      motion.paintedGlyphs++;
      return Reflect.apply(text, this, args);
    };
    CanvasRenderingContext2D.prototype.drawImage = function (image: CanvasImageSource, ...coordinates: number[]) {
      if (this.canvas.classList.contains("hero-brain-canvas")) {
        const key = image;
        const y = coordinates[1];
        const previous = positions.get(key);
        if (previous !== undefined) {
          const step = Math.abs(y - previous);
          if (step < 40) motion.maxStep = Math.max(motion.maxStep, step);
          else if (previous < 588 && previous + 124 > 12) motion.pops++;
        }
        positions.set(key, y);
      }
      return Reflect.apply(draw, this, [image, ...coordinates]);
    };
  });
  await page.goto("/");
  await expect(page.locator(".hero-binary-art")).toHaveAttribute("data-ready", "true");
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const until = performance.now() + 160;
    while (performance.now() < until) { /* simulate an unrelated long task */ }
  });
  await page.waitForTimeout(1500);
  const motion = await page.evaluate(() => (window as unknown as { rainMotion: { pops: number; maxStep: number; paintedGlyphs: number } }).rainMotion);
  expect(motion.paintedGlyphs).toBe(0);
  expect(motion.pops).toBe(0);
  expect(motion.maxStep).toBeGreaterThan(0);
  expect(motion.maxStep).toBeLessThan(10);
});
