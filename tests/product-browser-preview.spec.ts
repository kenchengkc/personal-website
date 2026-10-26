import { expect, test } from "@playwright/test";
import { openProductRecording } from "./helpers/gallery";

const products = [
  { kind: "quantiv", name: "Quantiv", href: "https://usequantiv.com" },
  { kind: "fdre", name: "FDRE", href: "https://thefdre.com" },
] as const;

for (const product of products) {
  test(`${product.name} expands from the green button with playback continuity and keyboard dismissal`, async ({ page }) => {
    await page.goto("/#work");
    const preview = await openProductRecording(page, product.kind);
    const inlineVideo = preview.locator("video");
    await expect.poll(() => inlineVideo.evaluate((node: HTMLVideoElement) => node.readyState >= 2 && !node.paused)).toBe(true);
    await preview.getByRole("button", { name: `Pause ${product.name} demo`, exact: true }).click();
    await inlineVideo.evaluate((node: HTMLVideoElement) => { node.currentTime = 4; });
    const scrollY = await page.evaluate(() => window.scrollY);
    const expand = preview.getByRole("button", { name: `Expand ${product.name} preview`, exact: true });
    await expect(expand).toBeVisible();
    await expand.click();
    const dialog = page.getByRole("dialog", { name: `${product.name} enlarged preview`, exact: true });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(node => node.matches(":modal"))).toBe(true);
    const modalVideo = dialog.locator("video");
    await expect.poll(() => modalVideo.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeCloseTo(4, 1);
    expect(await modalVideo.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
    expect(await inlineVideo.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.width).toBeGreaterThan((await preview.boundingBox())!.width);
    expect(bounds.x + bounds.width / 2).toBeCloseTo(720, 0);
    expect(bounds.y + bounds.height / 2).toBeCloseTo(500, 0);
    await page.mouse.wheel(0, 400);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    for (let index = 0; index < 7; index++) {
      await page.keyboard.press("Tab");
      // Native dialogs allow Tab into browser chrome, but never into the background page.
      expect(await dialog.evaluate(node => !document.hasFocus() || node.contains(document.activeElement))).toBe(true);
    }
    await dialog.getByRole("button", { name: `Play ${product.name} demo`, exact: true }).click();
    await expect.poll(() => modalVideo.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(4.2);
    expect(await inlineVideo.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
    await dialog.getByRole("button", { name: `Pause ${product.name} demo`, exact: true }).click();
    const closedAt = await modalVideo.evaluate((node: HTMLVideoElement) => node.currentTime);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(expand).toBeFocused();
    await expect.poll(() => inlineVideo.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeCloseTo(closedAt, 1);
    expect(await inlineVideo.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await expand.click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(2, 2);
    await expect(dialog).toHaveCount(0);
    await expect(expand).toBeFocused();

    await preview.getByRole("button", { name: `Play ${product.name} demo`, exact: true }).click();
    await expect.poll(() => inlineVideo.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
    await expand.click();
    await expect.poll(() => modalVideo.evaluate((node: HTMLVideoElement, time) => node.currentTime > time && !node.paused, closedAt)).toBe(true);
    const restoredAt = await modalVideo.evaluate((node: HTMLVideoElement) => node.currentTime);
    await dialog.getByRole("button", { name: `Restore ${product.name} preview`, exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect.poll(() => inlineVideo.evaluate((node: HTMLVideoElement, time) => node.currentTime > time && !node.paused, restoredAt)).toBe(true);
  });

  test(`${product.name} plays its real recording only while visible and respects playback controls`, async ({ page }) => {
    await page.goto("/#work");
    const preview = await openProductRecording(page, product.kind);
    const video = preview.locator("video");
    await expect(preview).toHaveAccessibleName(`${product.name} recorded product demo`);
    await expect(preview.getByRole("link", { name: `Open ${product.name}`, exact: true })).toHaveAttribute("href", product.href);
    await expect(video).toHaveAttribute("poster", `/media/${product.kind}-preview-poster.jpg`);
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState >= 2 && !node.paused)).toBe(true);
    const media = await video.evaluate((node: HTMLVideoElement) => ({
      source: new URL(node.currentSrc).pathname,
      duration: node.duration,
      width: node.videoWidth,
      muted: node.muted,
      loop: node.loop,
      inline: node.playsInline,
    }));
    expect(media.source).toBe(`/media/${product.kind}-preview.mp4`);
    expect(media.duration).toBeGreaterThan(5);
    expect(media.width).toBeGreaterThanOrEqual(700);
    expect(media).toMatchObject({ muted: true, loop: true, inline: true });
    const start = await video.evaluate((node: HTMLVideoElement) => node.currentTime);
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(start + .1);

    await preview.getByRole("button", { name: `Pause ${product.name} demo`, exact: true }).click();
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
    const pausedAt = await video.evaluate((node: HTMLVideoElement) => node.currentTime);
    await page.waitForTimeout(200);
    expect(await video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeCloseTo(pausedAt, 2);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await openProductRecording(page, product.kind);
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);

    await preview.getByRole("button", { name: `Play ${product.name} demo`, exact: true }).click();
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
    await openProductRecording(page, product.kind);
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
    await page.getByRole("tab", { name: "Research", exact: true }).click();
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);

    await openProductRecording(page, product.kind);
    await video.evaluate((node: HTMLVideoElement) => { node.currentTime = 5; });
    await preview.getByRole("button", { name: `Replay ${product.name} demo`, exact: true }).click();
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeLessThan(2);
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
  });

  test(`${product.name} shows its poster with reduced motion until playback is requested`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#work");
    const preview = await openProductRecording(page, product.kind);
    const video = preview.locator("video");
    await expect(preview.getByRole("button", { name: `Play ${product.name} demo`, exact: true })).toBeVisible();
    expect(await video.evaluate((node: HTMLVideoElement) => ({ paused: node.paused, time: node.currentTime }))).toEqual({ paused: true, time: 0 });
    expect(await video.evaluate(async (node: HTMLVideoElement) => {
      const poster = new Image();
      poster.src = node.poster;
      await poster.decode();
      return poster.naturalWidth > 0 && poster.naturalHeight > 0;
    })).toBe(true);

    await preview.getByRole("button", { name: `Play ${product.name} demo`, exact: true }).click();
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState >= 2 && !node.paused && node.currentTime > .1)).toBe(true);
    await preview.getByRole("button", { name: `Pause ${product.name} demo`, exact: true }).click();
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  });
}

test("recorded previews and controls fit narrow screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#work");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const product of products) {
      const preview = await openProductRecording(page, product.kind);
      expect(await preview.evaluate(node => {
        const bounds = node.getBoundingClientRect();
        const video = node.querySelector("video")!.getBoundingClientRect();
        const controls = [...node.querySelectorAll("button, a")].map(item => item.getBoundingClientRect());
        return {
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
          previewOverflow: node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1,
          videoFits: video.width > 0 && video.height > 0 && video.left >= bounds.left - 1 && video.right <= bounds.right + 1 && video.bottom <= bounds.bottom + 1,
          controlsFit: controls.every(item => item.left >= bounds.left - 1 && item.right <= bounds.right + 1 && item.bottom <= bounds.bottom + 1),
        };
      })).toEqual({ pageOverflow: false, previewOverflow: false, videoFits: true, controlsFit: true });
    }
  }
});

test("enlarged previews fit mobile and landscape without starting reduced-motion playback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#work");
  for (const viewport of [{ width: 320, height: 640 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    const preview = await openProductRecording(page, "fdre");
    await preview.getByRole("button", { name: "Expand FDRE preview", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "FDRE enlarged preview", exact: true });
    await expect(dialog).toBeVisible();
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(8);
    expect(bounds.y).toBeGreaterThanOrEqual(8);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width - 8);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height - 8);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 1 && node.scrollHeight <= node.clientHeight + 1)).toBe(true);
    expect(await dialog.locator("video").evaluate((node: HTMLVideoElement) => node.paused && node.currentTime === 0)).toBe(true);
    await dialog.getByRole("button", { name: "Close FDRE preview", exact: true }).click();
    await expect(dialog).toHaveCount(0);
  }
});
