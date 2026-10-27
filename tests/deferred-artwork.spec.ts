import { expect, test } from "@playwright/test";
import { openProjectAnimation } from "./helpers/gallery";

test("offscreen videos stay out of the initial load and hidden animations stay paused", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 });
  const mediaRequests: string[] = [];
  page.on("request", request => {
    if (/\/(?:quantiv|fdre)-preview\.mp4/.test(request.url())) mediaRequests.push(request.url());
  });
  await page.goto("/");
  // Waiting for idle includes hydration and the first observer delivery.
  await page.waitForLoadState("networkidle");
  for (const kind of ["embers", "cml", "speed", "cvrp"]) {
    await expect(page.locator(`[data-artwork="${kind}"] .animated-artwork`)).toHaveAttribute("data-running", "false");
  }
  expect(mediaRequests).toEqual([]);

  const quantiv = page.locator('[data-artwork="quantiv"]');
  await quantiv.scrollIntoViewIfNeeded();
  await expect.poll(() => mediaRequests.some(url => url.includes("quantiv-preview.mp4"))).toBe(true);
  await expect(page.locator('[data-artwork="cml"] .animated-artwork')).toHaveAttribute("data-running", "false");
  await expect(page.locator('[data-artwork="cvrp"] .animated-artwork')).toHaveAttribute("data-running", "false");

  await page.getByRole("tab", { name: "Research", exact: true }).click();
  const cml = page.locator('[data-artwork="cml"]');
  await cml.scrollIntoViewIfNeeded();
  await expect(cml.locator(".animated-artwork")).toBeVisible();
});

for (const width of [320, 390, 1440]) {
  test(`artwork dimensions stay stable when scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 640 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    for (const kind of ["amazon", "quantiv", "fdre", "embers"]) {
      const slot = page.locator(`[data-artwork="${kind}"]`);
      const before = (await slot.boundingBox())!;
      await slot.scrollIntoViewIfNeeded();
      await expect(slot.locator(".animated-artwork, .product-browser-preview")).toBeVisible();
      const after = (await slot.boundingBox())!;
      expect(Math.abs(after.height - before.height)).toBeLessThan(1);
      expect(Math.abs(after.width - before.width)).toBeLessThan(1);
    }
    await page.getByRole("tab", { name: "Awards", exact: true }).click();
    for (const kind of ["speed", "cvrp"]) {
      const slot = page.locator(`[data-artwork="${kind}"]`);
      const before = (await slot.boundingBox())!;
      await slot.scrollIntoViewIfNeeded();
      await expect(slot.locator(".animated-artwork")).toBeVisible();
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
