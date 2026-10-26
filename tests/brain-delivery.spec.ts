import { expect, test } from "@playwright/test";

for (const profile of [
  { name: "mobile Retina", viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, atlas: "atlas-1x.webp" },
  { name: "desktop Retina", viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, atlas: "atlas-2x.webp" },
]) {
  test(`${profile.name} downloads one poster and the right atlas, preserving resolution through assembly`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: profile.viewport, deviceScaleFactor: profile.deviceScaleFactor });
    const page = await context.newPage();
    const requests: string[] = [];
    page.on("request", request => {
      if (new URL(request.url()).pathname.startsWith("/images/brain/")) requests.push(request.url());
    });
    let release!: () => void;
    const ready = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/images/brain/v2/atlas-*.webp*", async route => {
      await ready;
      await route.continue();
    });
    try {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const artwork = page.locator(".hero-binary-art");
      const poster = page.locator(".hero-brain-poster");
      const canvas = page.locator(".hero-brain-canvas");
      await expect.poll(() => poster.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      await expect(poster).toBeVisible();
      await expect(canvas).toHaveCSS("opacity", "0");
      const before = await artwork.boundingBox();
      const posterSource = await poster.evaluate((image: HTMLImageElement) => image.currentSrc);
      release();
      await expect(artwork).toHaveAttribute("data-ready", "true");
      await expect(canvas).toHaveCSS("opacity", "1");
      await expect(poster).toBeHidden();
      expect(await artwork.boundingBox()).toEqual(before);

      const atlasRequests = requests.filter(url => /\/atlas-/.test(url));
      const posterRequests = requests.filter(url => /\/(rain|still)-/.test(url));
      expect(atlasRequests.map(url => new URL(url).pathname)).toEqual([`/images/brain/v2/${profile.atlas}`]);
      expect(posterRequests).toEqual([posterSource]);
      expect(new URL(posterSource).pathname).toMatch(/\/rain-[12]x\.webp$/);

      const initial = await canvas.evaluate((element: HTMLCanvasElement) => ({ width: element.width, height: element.height, displayWidth: element.getBoundingClientRect().width }));
      expect(initial.width).toBe(Math.round(initial.displayWidth * 2));
      const frames = await canvas.evaluate((element: HTMLCanvasElement) => new Promise<{ width: number; height: number; phase: string }[]>(resolve => {
        const samples: { width: number; height: number; phase: string }[] = [];
        window.scrollTo({ top: 1, behavior: "instant" });
        function sample() {
          const phase = element.closest<HTMLElement>(".hero-binary-art")!.dataset.phase!;
          samples.push({ width: element.width, height: element.height, phase });
          if (phase === "complete") resolve(samples);
          else requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      }));
      expect(frames.some(frame => frame.phase === "assembling")).toBe(true);
      expect([...new Set(frames.map(frame => `${frame.width}x${frame.height}`))]).toEqual([`${initial.width}x${initial.height}`]);
      expect(requests.filter(url => /\/atlas-/.test(url))).toHaveLength(1);
    } finally {
      release();
      await context.close();
    }
  });
}

test("a failed mobile atlas does not discard a newer desktop atlas request", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  let failSmall!: () => void;
  let releaseLarge!: () => void;
  const smallGate = new Promise<void>(resolve => { failSmall = resolve; });
  const largeGate = new Promise<void>(resolve => { releaseLarge = resolve; });
  await page.route("**/images/brain/v2/atlas-1x.webp*", async route => {
    await smallGate;
    await route.abort("failed");
  });
  await page.route("**/images/brain/v2/atlas-2x.webp*", async route => {
    await largeGate;
    await route.continue();
  });

  try {
    const smallRequested = page.waitForRequest("**/images/brain/v2/atlas-1x.webp*");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await smallRequested;
    const largeRequested = page.waitForRequest("**/images/brain/v2/atlas-2x.webp*");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await largeRequested;

    const smallFailed = page.waitForEvent("requestfailed", request => /\/atlas-1x\.webp/.test(request.url()));
    failSmall();
    await smallFailed;
    // Let the old image's decode rejection settle before the newer image loads.
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await expect(page.locator(".hero-brain-poster")).toBeVisible();
    releaseLarge();

    const artwork = page.locator(".hero-binary-art");
    await expect(artwork).toHaveAttribute("data-ready", "true");
    await expect(artwork).toHaveAttribute("data-atlas-scale", "2");
    await expect(page.locator(".hero-brain-canvas")).toHaveCSS("opacity", "1");
  } finally {
    failSmall();
    releaseLarge();
    await context.close();
  }
});
