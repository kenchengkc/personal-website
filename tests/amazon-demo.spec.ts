import { expect, test } from "@playwright/test";

test("Amazon diagrams animate only while visible and respect the pause control", async ({ page }) => {
  await page.goto("/");
  const demo = page.getByRole("region", { name: "Amazon configuration infrastructure" });
  await expect(demo).toHaveAttribute("data-running", "false");
  await demo.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  await expect(demo).toHaveAttribute("data-running", "true");
  // Let the section's entrance finish before Playwright scrolls to its control.
  await demo.evaluate(node => Promise.all(node.closest("[data-reveal]")!.getAnimations().map(animation => animation.finished)));
  const animationTimes = () => demo.evaluate(node => node.getAnimations({ subtree: true }).map(animation => Number(animation.currentTime)));
  const initial = await animationTimes();
  expect(initial.length).toBeGreaterThan(0);
  await expect.poll(animationTimes).not.toEqual(initial);
  await demo.getByRole("button", { name: "Pause animation" }).click();
  await expect(demo).toHaveAttribute("data-running", "false");
  await page.waitForTimeout(100);
  const paused = await animationTimes();
  await page.waitForTimeout(500);
  expect(await animationTimes()).toEqual(paused);
  await demo.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect.poll(animationTimes).not.toEqual(paused);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(demo).toHaveAttribute("data-running", "false");
});

test("Amazon diagrams remain readable and still with reduced motion on small screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const demo = page.getByRole("region", { name: "Amazon configuration infrastructure" });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await demo.scrollIntoViewIfNeeded();
    await expect(demo).toHaveAttribute("data-running", "false");
    await expect(demo.getByRole("button", { name: "Pause animation" })).toHaveCount(0);
    const layout = await demo.evaluate(node => ({
      clipped: node.scrollHeight > node.clientHeight + 1,
      overflow: document.documentElement.scrollWidth > innerWidth,
      running: node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length,
    }));
    expect(layout).toEqual({ clipped: false, overflow: false, running: 0 });
    const height = (await demo.boundingBox())!.height;
    await page.waitForTimeout(150);
    expect((await demo.boundingBox())!.height).toBe(height);
  }
});
