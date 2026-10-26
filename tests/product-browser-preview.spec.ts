import { expect, test } from "@playwright/test";
import { openProductRecording } from "./helpers/gallery";

const products = [
  { kind: "quantiv", name: "Quantiv", href: "https://usequantiv.com" },
  { kind: "fdre", name: "FDRE", href: "https://thefdre.com" },
] as const;

for (const product of products) {
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
