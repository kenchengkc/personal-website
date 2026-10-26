import { expect, test } from "@playwright/test";
import { openProjectAnimation } from "./helpers/gallery";

test("offscreen product media and hidden-category animations stay out of the initial load", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 });
  const mediaRequests: string[] = [];
  page.on("request", request => {
    if (/\/(?:quantiv|fdre)-preview|\/embers-(?:yolo|inventory)/.test(request.url())) mediaRequests.push(request.url());
  });
  await page.goto("/");
  // Waiting for idle includes hydration and the first observer delivery.
  await page.waitForLoadState("networkidle");
  for (const kind of ["quantiv", "fdre", "embers", "cml", "speed", "cvrp"]) {
    const slot = page.locator(`[data-artwork="${kind}"]`);
    await expect(slot.locator(".artwork-placeholder")).toHaveCount(1);
    await expect(slot.locator(".animated-artwork, .product-browser-preview")).toHaveCount(0);
  }
  expect(mediaRequests).toEqual([]);

  const embers = page.locator('[data-artwork="embers"]');
  await embers.scrollIntoViewIfNeeded();
  await expect(embers.locator(".animated-artwork")).toBeVisible();
  await expect.poll(() => mediaRequests.some(url => url.includes("embers-yolo-live-detection"))).toBe(true);
  await expect(page.locator('[data-artwork="cml"] .animated-artwork')).toHaveCount(0);
  await expect(page.locator('[data-artwork="cvrp"] .animated-artwork')).toHaveCount(0);

  await page.getByRole("tab", { name: "Research", exact: true }).click();
  const cml = page.locator('[data-artwork="cml"]');
  await cml.scrollIntoViewIfNeeded();
  await expect(cml.locator(".animated-artwork")).toBeVisible();
});

for (const width of [320, 390, 1440]) {
  test(`deferred artwork keeps its reserved dimensions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 640 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    for (const kind of ["amazon", "quantiv", "fdre", "embers"]) {
      const slot = page.locator(`[data-artwork="${kind}"]`);
      const before = (await slot.boundingBox())!;
      await slot.scrollIntoViewIfNeeded();
      await expect(slot.locator(".artwork-placeholder")).toHaveCount(0);
      const after = (await slot.boundingBox())!;
      expect(Math.abs(after.height - before.height)).toBeLessThan(1);
      expect(Math.abs(after.width - before.width)).toBeLessThan(1);
    }
    await page.getByRole("tab", { name: "Awards", exact: true }).click();
    for (const kind of ["speed", "cvrp"]) {
      const slot = page.locator(`[data-artwork="${kind}"]`);
      const before = (await slot.boundingBox())!;
      await slot.scrollIntoViewIfNeeded();
      await expect(slot.locator(".artwork-placeholder")).toHaveCount(0);
      const after = (await slot.boundingBox())!;
      expect(Math.abs(after.height - before.height)).toBeLessThan(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("a reached animation retains its node and manual choices when switching categories", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "amazon");
  await animation.getByRole("button", { name: "Output B", exact: true }).click();
  await animation.getByRole("button", { name: "Publish", exact: true }).click();
  const original = (await animation.elementHandle())!;
  await page.getByRole("tab", { name: "Research", exact: true }).click();
  await expect(animation).toBeHidden();
  await expect(animation).toHaveAttribute("data-running", "false");
  await page.getByRole("tab", { name: "Work", exact: true }).click();
  await expect(animation).toHaveAttribute("data-stage", "2");
  await expect(animation.getByRole("button", { name: "Output B", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await original.evaluate(node => node.isConnected)).toBe(true);
});
