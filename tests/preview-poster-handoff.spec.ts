import { expect, test } from "@playwright/test";
import { openProductRecording } from "./helpers/gallery";

test("recorded previews have a real, decoded poster before JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  for (const kind of ["quantiv", "fdre"]) {
    const preview = page.locator(`[data-artwork="${kind}"]`);
    await preview.scrollIntoViewIfNeeded();
    const poster = preview.locator(".product-browser-poster");
    await expect(poster).toBeVisible();
    await expect.poll(() => poster.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  }
  await context.close();
});

for (const kind of ["quantiv", "fdre"] as const) {
  test(`${kind} keeps its preview visible until a video frame is ready`, async ({ page }) => {
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route(`**/media/${kind}-preview.mp4*`, async route => {
      await held;
      await route.continue();
    });
    try {
      await page.goto("/#work", { waitUntil: "domcontentloaded" });
      const preview = await openProductRecording(page, kind);
      const poster = preview.locator(".product-browser-poster");
      const video = preview.locator("video");
      await expect(poster).toBeVisible();
      await expect.poll(() => poster.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
      expect(await video.evaluate((node: HTMLVideoElement) => node.readyState)).toBeLessThan(2);
      const before = await preview.boundingBox();
      release();
      await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState >= 2 && !node.paused && node.currentTime > 0)).toBe(true);
      await expect(poster).toBeHidden();
      expect(await preview.boundingBox()).toEqual(before);
    } finally { release(); }
  });
}

test("offscreen recordings do not download their video files", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 });
  const videos: string[] = [];
  page.on("request", request => {
    if (/\/(?:quantiv|fdre)-preview\.mp4/.test(request.url())) videos.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(videos).toEqual([]);
});

test("the enlarged player keeps its own poster until its first frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#work");
  const preview = await openProductRecording(page, "fdre");
  const inlinePoster = preview.locator(".product-browser-poster");
  await expect(inlinePoster).toBeVisible();
  await preview.getByRole("button", { name: "Expand FDRE preview", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "FDRE enlarged preview", exact: true });
  const modalPoster = dialog.locator(".product-browser-poster");
  await expect(modalPoster).toBeVisible();
  expect(await dialog.locator("video").evaluate((node: HTMLVideoElement) => node.paused && node.currentTime === 0)).toBe(true);
  await dialog.getByRole("button", { name: "Play FDRE demo", exact: true }).click();
  await expect(modalPoster).toBeHidden();
  await expect(inlinePoster).toBeVisible();
});
