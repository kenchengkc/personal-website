import { expect, test } from "@playwright/test";
import { openProjectAnimation, type FeaturedAnimation } from "./helpers/gallery";

const projects: FeaturedAnimation[] = ["amazon", "quantiv", "fdre", "embers"];

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

test("FDRE playground filters both searches and deduplicates eligible passage IDs in the same scene", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "fdre");
  const dates = animation.getByRole("group", { name: "Example as-of date", exact: true });
  const actor = await animation.locator('[data-flow-id="fdre-gallery-passage"]').elementHandle();
  if (!actor) throw new Error("Missing passage 12");
  await expect(animation.locator('[data-filing][data-eligible="true"]')).toHaveCount(1);
  await dates.getByRole("button", { name: "01 May", exact: true }).click();
  await expect(animation).toHaveAttribute("data-running", "false");
  await expect(animation.locator('[data-filing][data-eligible="true"]')).toHaveCount(3);
  await animation.getByRole("group", { name: "Animation steps" }).getByRole("button", { name: "Retrieve", exact: true }).click();
  await expect(animation.getByRole("img")).toHaveAccessibleName(/four unique passages/);
  const keyword = animation.locator('[data-search="keyword"] .fflow-hit[data-excluded="false"]');
  const vector = animation.locator('[data-search="vector"] .fflow-hit[data-excluded="false"]');
  expect(await keyword.allTextContents()).toEqual(["12", "31", "57"]);
  expect(await vector.allTextContents()).toEqual(["12", "57", "84"]);
  expect(new Set([...await keyword.allTextContents(), ...await vector.allTextContents()]).size).toBe(4);
  await dates.getByRole("button", { name: "01 Mar", exact: true }).click();
  expect(await keyword.allTextContents()).toEqual(["12", "31"]);
  expect(await vector.allTextContents()).toEqual(["12"]);
  await expect(animation.getByRole("img")).toHaveAccessibleName(/two unique passages/);
  expect(await actor.evaluate(node => node.isConnected)).toBe(true);
});

test("FDRE playground changes the answer to abstention without replacing the passage", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "fdre");
  await animation.getByRole("group", { name: "Animation steps" }).getByRole("button", { name: "Cite", exact: true }).click();
  const questions = animation.getByRole("group", { name: "Example question type", exact: true });
  const passage = await animation.locator('[data-flow-id="fdre-gallery-passage"]').elementHandle();
  await questions.getByRole("button", { name: "Price forecast", exact: true }).click();
  await expect(animation.getByRole("img")).toHaveAccessibleName(/generation skipped, no answer or citations/);
  await expect(animation.locator(".fflow-answer")).toHaveText("Generation skipped");
  await expect(animation.locator(".fflow-abstention")).toHaveCSS("opacity", "1");
  await expect(animation.locator(".fflow-source-check")).toHaveCSS("opacity", "0");
  await questions.getByRole("button", { name: "Filing risk", exact: true }).click();
  await expect(animation.locator(".fflow-source-check")).toHaveCSS("opacity", "1");
  await expect(animation.locator(".fflow-abstention")).toHaveCSS("opacity", "0");
  await expect(animation.locator(".fflow-answer")).toHaveText("Changes need time and resources.");
  expect(await passage!.evaluate(node => node.isConnected)).toBe(true);
});

test("Quantiv's combined playground calculates tail estimates, selects validation folds, and rejects corrupt bundles", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "quantiv");
  const steps = animation.getByRole("group", { name: "Animation steps" });
  const height = (await animation.boundingBox())!.height;
  await steps.getByRole("button", { name: "Estimate", exact: true }).click();
  const market = await animation.locator(".qflow-market-line").getAttribute("d");
  for (const [threshold, label] of [[3, "77.5% above 3%"], [6, "31.3% above 6%"], [10, "≤ 10% above 10%"]] as const) {
    await animation.getByRole("button", { name: `Compare a ${threshold}% market move`, exact: true }).click();
    await expect(animation.locator(".qflow-probability")).toHaveText(label);
    await expect(animation.locator(".qflow-market-line")).toHaveAttribute("d", market!);
    await expect(animation).toHaveAttribute("data-running", "false");
  }
  await expect(animation).toContainText("Tail bound beyond the model’s P90 quantile.");
  await steps.getByRole("button", { name: "Validate", exact: true }).click();
  let previousWidth = 0;
  for (const fold of [1, 2, 3, 4]) {
    await animation.getByRole("button", { name: `Inspect fold ${fold}`, exact: true }).click();
    const selected = animation.locator('.qflow-fold[data-active="true"]');
    await expect(selected).toHaveCount(1);
    const bounds = await selected.evaluate(node => {
      const train = node.querySelector(".qflow-train")!.getBoundingClientRect();
      const test = node.querySelector(".qflow-test")!.getBoundingClientRect();
      return { width: train.width, gap: test.left - train.right, testWidth: test.width };
    });
    expect(bounds.width).toBeGreaterThan(previousWidth);
    expect(bounds.gap / bounds.testWidth).toBeCloseTo(5 / 60, 3);
    previousWidth = bounds.width;
  }
  await steps.getByRole("button", { name: "Serve", exact: true }).click();
  await animation.getByRole("button", { name: "Corrupt", exact: true }).click();
  await expect(animation.locator(".qflow-serve-result")).toHaveText("SHA-256 mismatch · Previous model v1 retained");
  await expect(animation.locator(".qflow-active-model")).toHaveCount(0);
  await animation.getByRole("button", { name: "Verified", exact: true }).click();
  await expect(animation.locator(".qflow-serve-result")).toHaveText("Signature + digest + load passed · Model v2 active");
  await expect(animation.locator(".qflow-active-model")).toHaveCount(1);
  expect((await animation.boundingBox())!.height).toBeCloseTo(height, 2);
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
