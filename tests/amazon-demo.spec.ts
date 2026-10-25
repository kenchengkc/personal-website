import { expect, test } from "@playwright/test";
import { openProjectAnimation } from "./helpers/gallery";

test("Amazon's single animation keeps the AWS icons and changes the traced dependencies", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "amazon");
  await expect(animation).toHaveAttribute("data-running", "true");
  await expect(page.locator('[data-project="amazon"] .animated-artwork')).toHaveCount(1);
  await expect(page.locator('[data-project="amazon"] .project-walkthrough')).toHaveCount(0);
  for (const service of ["Lambda", "S3", "Internal APIs"]) {
    await expect(animation.locator(`[data-service="${service}"]`)).toBeVisible();
  }
  const outputs = animation.getByRole("group", { name: "Research output", exact: true });
  await expect(outputs.getByRole("button", { name: "Output A", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(animation.locator('[data-affected="true"]')).toHaveCount(9);
  await expect(animation.getByText("config-a.json", { exact: true })).toBeVisible();
  const packet = await animation.locator('[data-flow-id="amazon-gallery-config"]').elementHandle();
  if (!packet) throw new Error("Configuration packet is missing");
  const height = (await animation.boundingBox())!.height;

  await outputs.getByRole("button", { name: "Output B", exact: true }).click();
  await expect(animation).toHaveAttribute("data-running", "false");
  await expect(outputs.getByRole("button", { name: "Output B", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(animation.locator('[data-affected="true"]')).toHaveCount(11);
  await expect(animation.getByText("config-b.json", { exact: true })).toBeVisible();
  await expect(animation.getByRole("img")).toHaveAccessibleName(/output B affects 11 of 17/);
  await animation.getByRole("group", { name: "Animation steps" }).getByRole("button", { name: "Publish", exact: true }).click();
  await outputs.getByRole("button", { name: "Output A", exact: true }).click();
  await expect(animation.locator('[data-affected="true"]')).toHaveCount(9);
  expect(await packet.evaluate(node => node.isConnected)).toBe(true);
  expect((await animation.boundingBox())!.height).toBeCloseTo(height, 2);
});

test("Amazon's in-box playback pauses the actual animations and resumes them", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "amazon");
  await animation.getByRole("group", { name: "Animation steps" }).getByRole("button", { name: "Publish", exact: true }).click();
  await animation.getByRole("button", { name: "Play animation", exact: true }).click();
  const times = () => animation.evaluate(node => node.getAnimations({ subtree: true }).map(item => Number(item.currentTime)));
  const initial = await times();
  expect(initial.length).toBeGreaterThan(0);
  await expect.poll(times).not.toEqual(initial);
  await animation.getByRole("button", { name: "Pause animation", exact: true }).click();
  await expect(animation).toHaveAttribute("data-running", "false");
  await expect.poll(() => animation.evaluate(node => node.getAnimations({ subtree: true }).filter(item => item.playState === "running").length)).toBe(0);
  await page.waitForTimeout(80);
  const paused = await times();
  await page.waitForTimeout(250);
  expect(await times()).toEqual(paused);
  await animation.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect.poll(times).not.toEqual(paused);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(animation).toHaveAttribute("data-running", "false");
});
