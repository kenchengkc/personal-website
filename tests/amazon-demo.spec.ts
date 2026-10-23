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

test("Amazon output selection traces shared dependencies and updates affected planning lanes", async ({ page }) => {
  await page.goto("/");
  const demo = page.getByRole("region", { name: "Amazon configuration infrastructure", exact: true });
  await demo.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  await expect(demo).toHaveAttribute("data-running", "true");
  await demo.evaluate(node => Promise.all(node.closest("[data-reveal]")!.getAnimations().map(animation => animation.finished)));
  const outputs = demo.getByRole("group", { name: "Research output to trace" });
  await expect(outputs.getByRole("button", { name: "Output A", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(demo.getByText("Output A → 2 affected configurations", { exact: true })).toBeVisible();
  await expect(demo.locator('[data-flow-id="amazon-config"]')).toHaveCount(1);
  await expect(demo.locator(".amz-secondary-config.is-linked")).toHaveCount(1);

  await outputs.getByRole("button", { name: "Output B", exact: true }).click();
  await expect(demo).toHaveAttribute("data-running", "false");
  await expect(outputs.getByRole("button", { name: "Output B", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(demo.getByText("Output B → 3 affected configurations", { exact: true })).toBeVisible();
  await expect(demo.locator(".amz-secondary-config.is-linked")).toHaveCount(2);

  await demo.getByRole("group", { name: "Animation steps" }).getByRole("button", { name: /^Distribute:/ }).click();
  await expect(demo.locator(".amz-lane.is-linked")).toHaveCount(3);
  await expect(demo.locator(".amz-lane.is-linked .amz-lane-version")).toHaveText(["v042", "v042", "v042"]);
  await outputs.getByRole("button", { name: "Output A", exact: true }).click();
  await expect(demo.locator(".amz-lane.is-linked")).toHaveCount(2);
  await expect(demo.locator(".amz-lane:not(.is-linked) .amz-lane-version")).toHaveText("—");
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
    await expect.poll(() => demo.evaluate(node => ({
      clipped: node.scrollHeight > node.clientHeight + 1,
      overflow: document.documentElement.scrollWidth > innerWidth,
      running: node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length,
    }))).toEqual({ clipped: false, overflow: false, running: 0 });
    const height = (await demo.boundingBox())!.height;
    await page.waitForTimeout(150);
    expect((await demo.boundingBox())!.height).toBeCloseTo(height, 2);
  }
});
