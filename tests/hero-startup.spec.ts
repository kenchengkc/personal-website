import { expect, test } from "@playwright/test";

test("rain is present before JavaScript loads", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1400 } });
  const page = await context.newPage();
  await page.goto("/");
  const poster = page.locator(".hero-brain-poster");
  await expect(poster).toBeVisible();
  expect(await poster.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await context.close();
});

test("hero does not hide or move when JavaScript hydrates", async ({ page }) => {
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/_next/static/**/*.js", async route => {
    await ready;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator(".hero-copy")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    const samples: { y: number; opacity: number }[] = [];
    (window as unknown as { heroSamples: typeof samples }).heroSamples = samples;
    const start = performance.now();
    function sample() {
      const element = document.querySelector(".hero-copy")!;
      samples.push({ y: element.getBoundingClientRect().top, opacity: Number(getComputedStyle(element).opacity) });
      if (performance.now() - start < 2200) requestAnimationFrame(sample);
    }
    sample();
  });
  release();
  await expect(page.locator(".ruler-milestone")).toHaveCount(11);
  await page.waitForTimeout(650);
  const samples = await page.evaluate(() => (window as unknown as { heroSamples: { y: number; opacity: number }[] }).heroSamples);
  expect(Math.min(...samples.map(sample => sample.opacity))).toBe(1);
  expect(Math.max(...samples.map(sample => sample.y)) - Math.min(...samples.map(sample => sample.y))).toBeLessThan(1);
});
