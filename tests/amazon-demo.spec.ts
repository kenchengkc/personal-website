import { expect, test } from "@playwright/test";

test("Amazon walkthrough waits for visibility, pauses, and supports replay", async ({ page }) => {
  await page.goto("/");
  const demo = page.getByRole("region", { name: "Amazon configuration walkthrough" });
  await expect(demo).toHaveAttribute("data-stage", "configure");
  await expect(demo).toHaveAttribute("data-running", "false");
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute("data-running", "true");
  await expect(demo).toHaveAttribute("data-stage", "validate", { timeout: 6000 });
  await demo.getByRole("button", { name: "Pause walkthrough" }).click();
  await expect(demo).toHaveAttribute("data-running", "false");
  await page.waitForTimeout(3400);
  await expect(demo).toHaveAttribute("data-stage", "validate");
  await demo.getByRole("button", { name: /Distribute/ }).click();
  await expect(demo).toHaveAttribute("data-stage", "distribute");
  await demo.getByRole("button", { name: "Play walkthrough", exact: true }).click();
  await expect(demo).toHaveAttribute("data-stage", "forecast", { timeout: 6000 });
  await expect(demo).toHaveAttribute("data-complete", "true", { timeout: 6000 });
  await demo.getByRole("button", { name: "Replay walkthrough" }).click();
  await expect(demo).toHaveAttribute("data-stage", "configure");
  await expect(demo).toHaveAttribute("data-running", "true");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(demo).toHaveAttribute("data-running", "false");
});

test("Amazon walkthrough stays readable on mobile with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const demo = page.getByRole("region", { name: "Amazon configuration walkthrough" });
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute("data-stage", "forecast");
  await expect(demo).toHaveAttribute("data-running", "false");
  await expect(demo.getByRole("button", { name: "Pause walkthrough" })).toHaveCount(0);
  await demo.getByRole("button", { name: /Configure/ }).click();
  await expect(demo).toHaveAttribute("data-stage", "configure");
  await page.waitForTimeout(3400);
  await expect(demo).toHaveAttribute("data-stage", "configure");
  const heights = [];
  for (const label of ["Configure", "Validate", "Distribute", "Forecast"]) {
    await demo.getByRole("button", { name: new RegExp(label) }).click();
    heights.push((await demo.boundingBox())!.height);
  }
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
  const layout = await demo.evaluate((node) => ({
    clipped: node.scrollHeight > node.clientHeight + 1,
    overflow: document.documentElement.scrollWidth > innerWidth,
    running: node.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length,
  }));
  expect(layout).toEqual({ clipped: false, overflow: false, running: 0 });
});
