import { expect, test } from "@playwright/test";
import { openProjectAnimation, type FeaturedAnimation } from "./helpers/gallery";

const projects: FeaturedAnimation[] = ["amazon", "embers"];

test("each project has one combined animation whose keyboard-selected step stays in place", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".project-walkthrough")).toHaveCount(0);
  for (const project of projects) {
    const animation = await openProjectAnimation(page, project);
    await expect(page.locator(`[data-project="${project}"] .animated-artwork`)).toHaveCount(1);
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
  }
  // Manual inspection must outlast a normal automatic step.
  await page.waitForTimeout(4100);
  for (const project of projects) {
    const animation = await openProjectAnimation(page, project);
    await expect(animation).toHaveAttribute("data-stage", "1");
  }
});

test("combined animations remain usable without motion or overflow on compact screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const project of projects) {
      const animation = await openProjectAnimation(page, project);
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
  }
});

test("Embers switches between tracking and its actual saved inventory inside one fixed box", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "embers");
  const views = animation.getByRole("group", { name: "Product views", exact: true });
  const actor = await animation.locator('[data-flow-id="embers-gallery-track"]').elementHandle();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await animation.scrollIntoViewIfNeeded();
    const height = (await animation.boundingBox())!.height;
    await views.getByRole("button", { name: "Inventory", exact: true }).click();
    await expect(animation.getByRole("img")).toHaveAccessibleName(/Actual Embers saved inventory dashboard/);
    await expect(animation.locator(".eflow-inventory-view")).toHaveCSS("opacity", "1");
    await expect(animation.locator(".eflow-detection-view")).toHaveCSS("opacity", "0");
    await views.getByRole("button", { name: "Detection", exact: true }).click();
    await expect(animation.getByRole("img")).toHaveAccessibleName(/Refrigerator track 4 persists/);
    await expect(animation.locator(".eflow-detection-view")).toHaveCSS("opacity", "1");
    expect((await animation.boundingBox())!.height).toBeCloseTo(height, 2);
  }
  expect(await actor!.evaluate(node => node.isConnected)).toBe(true);
});
