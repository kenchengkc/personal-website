import { expect, test } from "@playwright/test";
import { openProjectAnimation } from "./helpers/gallery";

test("Embers has one animation whose keyboard-selected step stays in place", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".project-walkthrough")).toHaveCount(0);
  const animation = await openProjectAnimation(page, "embers");
  await expect(animation).toHaveCount(1);
  const height = (await animation.boundingBox())!.height;
  const steps = animation.getByRole("group", { name: "Animation steps" }).getByRole("button");
  const count = await steps.count();
  for (const index of [count - 1, 0, 1]) {
    await steps.nth(index).focus();
    await steps.nth(index).press("Enter");
    await expect(steps.nth(index)).toHaveAttribute("aria-pressed", "true");
    await expect(animation).toHaveAttribute("data-stage", String(index));
    await expect(animation).toHaveAttribute("data-running", "false");
    await expect(animation.locator(":scope > .animated-artwork-scene")).toBeVisible();
    await expect(animation.locator(".animated-artwork-footer > p")).not.toHaveText("");
    expect((await animation.boundingBox())!.height).toBeCloseTo(height, 2);
  }
  // Manual inspection must outlast a normal automatic step.
  await page.waitForTimeout(4100);
  await expect(animation).toHaveAttribute("data-stage", "1");
});

test("Embers remains usable without motion or overflow on compact screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    const animation = await openProjectAnimation(page, "embers");
    await expect(animation).toHaveAttribute("data-running", "false");
    await expect(animation.getByRole("button", { name: /^(Pause|Play) animation$/ })).toHaveCount(0);
    const steps = animation.getByRole("group", { name: "Animation steps" }).getByRole("button");
    for (let index = 0; index < await steps.count(); index++) {
      await steps.nth(index).click();
      await expect.poll(() => animation.evaluate(node => ({
        clippedVertically: node.scrollHeight > node.clientHeight + 1,
        clippedHorizontally: node.scrollWidth > node.clientWidth + 1,
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        running: node.getAnimations({ subtree: true }).filter(item => item.playState === "running").length,
      }))).toEqual({ clippedVertically: false, clippedHorizontally: false, pageOverflow: false, running: 0 });
    }
  }
});

test("Embers carries one tracked object into its actual inventory within the same window", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "embers");
  const steps = animation.getByRole("group", { name: "Animation steps" });
  await expect(animation.getByRole("group", { name: "Product views", exact: true })).toHaveCount(0);
  const actor = await animation.locator('[data-flow-id="embers-gallery-track"]').elementHandle();
  const images = await animation.locator("image").elementHandles();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await animation.scrollIntoViewIfNeeded();
    const height = (await animation.boundingBox())!.height;
    await steps.getByRole("button", { name: "Detect", exact: true }).click();
    await expect(animation.locator(".eflow-detection-view")).toHaveCSS("opacity", "1");
    await expect(animation.locator(".eflow-inventory-view")).toHaveCSS("opacity", "0");
    const detected = await actor!.evaluate(node => node.getBoundingClientRect().toJSON());
    await steps.getByRole("button", { name: "Track", exact: true }).click();
    await expect(animation).toHaveAttribute("data-stage", "1");
    await steps.getByRole("button", { name: "Save", exact: true }).click();
    await expect(animation.locator(".eflow-inventory-view")).toHaveCSS("opacity", "1");
    await expect(animation.locator(".eflow-detection-view")).toHaveCSS("opacity", "0");
    const saved = await actor!.evaluate(node => node.getBoundingClientRect().toJSON());
    expect(Math.abs(saved.x - detected.x) + Math.abs(saved.y - detected.y)).toBeGreaterThan(5);
    expect((await animation.boundingBox())!.height).toBeCloseTo(height, 2);
  }
  expect(await actor!.evaluate(node => node.isConnected)).toBe(true);
  for (const image of images) expect(await image.evaluate(node => node.isConnected)).toBe(true);
});
