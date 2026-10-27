import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`category artwork is present on its first visible frame at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(page.locator(".hero-binary-art")).toHaveAttribute("data-ready", "true");
    await page.locator(".portfolio-tabs").evaluate(element => element.scrollIntoView({ block: "start", behavior: "instant" }));

    for (const [category, kind] of [["research", "cml"], ["awards", "cvrp"], ["work", "amazon"]]) {
      const frames = await page.evaluate(({ category, kind }) => new Promise<boolean[]>(resolve => {
        const tab = document.getElementById(`gallery-tab-${category}`)!;
        const panel = document.getElementById(tab.getAttribute("aria-controls")!)!;
        const samples: boolean[] = [];
        const start = performance.now();
        tab.click();
        function sample() {
          if (!panel.hidden) samples.push(!!panel.querySelector(`[data-artwork="${kind}"] svg`));
          if (samples.at(-1) || performance.now() - start > 1500) resolve(samples);
          else requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      }), { category, kind });
      expect(frames.length).toBeGreaterThan(0);
      expect(frames, `${category} exposed an empty visual before its artwork was ready`).not.toContain(false);
    }
  });
}

test("illustrated previews are already present before JavaScript or scrolling", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  for (const kind of ["amazon", "cml", "speed", "cvrp", "embers"]) {
    await expect(page.locator(`[data-artwork="${kind}"] svg`).first()).toBeAttached();
  }
  await context.close();
});

test("hidden research and award figures are decoded before selecting their category", async ({ page }) => {
  await page.goto("/");
  const pictures = page.locator('#research img, #awards img');
  await expect.poll(() => pictures.evaluateAll(images => images.every(image => {
    const picture = image as HTMLImageElement;
    return picture.complete && picture.naturalWidth > 0;
  }))).toBe(true);
  await page.locator(".portfolio-tabs").scrollIntoViewIfNeeded();
  for (const category of ["research", "awards"]) {
    const readyOnReveal = await page.evaluate(category => new Promise<boolean>(resolve => {
      document.getElementById(`gallery-tab-${category}`)!.click();
      requestAnimationFrame(() => resolve([...document.querySelectorAll<HTMLImageElement>(`#${category} img`)].every(image => image.complete && image.naturalWidth > 0)));
    }), category);
    expect(readyOnReveal).toBe(true);
  }
});

test("background figures wait for brain decoding even when the document has loaded", async ({ page }) => {
  await page.addInitScript(() => {
    const original = window.createImageBitmap;
    const pending = new Promise<void>(resolve => {
      (window as unknown as { releaseBrainDecode: () => void }).releaseBrainDecode = resolve;
    });
    window.createImageBitmap = function (image: ImageBitmapSource, ...options: unknown[]) {
      const decode = () => Reflect.apply(original, window, [image, ...options]);
      if (image instanceof HTMLImageElement && image.src.includes("/brain/v2/atlas-")) return pending.then(decode);
      return decode();
    };
  });
  const figures: string[] = [];
  page.on("request", request => {
    if (request.url().includes("wasserstein-cross-asset-comparison")) figures.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".hero-binary-art")).not.toHaveAttribute("data-ready", "true");
  expect(figures).toEqual([]);
  await page.evaluate(() => (window as unknown as { releaseBrainDecode: () => void }).releaseBrainDecode());
  await expect(page.locator(".hero-binary-art")).toHaveAttribute("data-ready", "true");
  await expect.poll(() => figures.length).toBe(1);
});
