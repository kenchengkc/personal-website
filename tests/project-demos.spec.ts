import { expect, test, type Locator } from "@playwright/test";
import { openProjectWalkthrough } from "./helpers/gallery";

const demos = [
  "Amazon configuration infrastructure",
  "Financial Document Retrieval Engine search demonstration",
] as const;
const stageCounts = [3, 3];

async function showDemo(demo: Locator) {
  await demo.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  await demo.evaluate(node => Promise.all((node.closest("[data-reveal]") ?? node).getAnimations().map(animation => animation.finished)));
}

test("project walkthroughs advance in view and stop when scrolled away without changing frame height", async ({ page }) => {
  await page.goto("/");
  const opened: Locator[] = [];

  for (const name of demos) {
    await openProjectWalkthrough(page, name);
    const demo = page.getByRole("region", { name, exact: true });
    await expect(demo).toHaveAttribute("data-running", "false");
    await showDemo(demo);
    await expect(demo).toHaveAttribute("data-running", "true");
    const height = (await demo.boundingBox())!.height;
    // Adjacent gallery walkthroughs can both be visible. Only an off-screen
    // walkthrough must remain stopped while this one advances.
    const stopped: { demo: Locator; stage: string | null }[] = [];
    for (const previous of opened) {
      const visibility = await previous.evaluate(node => {
        const bounds = node.getBoundingClientRect();
        return Math.max(0, Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0)) / bounds.height;
      });
      if (visibility < 0.2) {
        await expect(previous).toHaveAttribute("data-running", "false");
        stopped.push({ demo: previous, stage: await previous.getAttribute("data-stage") });
      }
    }
    const initialStep = await demo.getByRole("group", { name: "Animation steps" }).getByRole("button", { pressed: true }).innerText();
    await expect.poll(() => demo.getByRole("group", { name: "Animation steps" }).getByRole("button", { pressed: true }).innerText(), { timeout: 6000 }).not.toBe(initialStep);
    expect((await demo.boundingBox())!.height).toBeCloseTo(height, 2);

    for (const previous of stopped) {
      await expect(previous.demo).toHaveAttribute("data-stage", previous.stage!);
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(demo).toHaveAttribute("data-running", "false");
    await expect.poll(() => demo.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(0);
    opened.push(demo);
  }
});

test("visitors can inspect any step with a keyboard and it stays selected until playback resumes", async ({ page }) => {
  await page.goto("/");

  for (const [demoIndex, name] of demos.entries()) {
    await openProjectWalkthrough(page, name);
    const demo = page.getByRole("region", { name, exact: true });
    await showDemo(demo);
    const steps = demo.getByRole("group", { name: "Animation steps" }).getByRole("button");
    await expect(steps).toHaveCount(stageCounts[demoIndex]);
    const height = (await demo.boundingBox())!.height;

    const inspectionOrder = [...Array.from({ length: stageCounts[demoIndex] - 2 }, (_, index) => stageCounts[demoIndex] - 1 - index), 0, 1];
    for (const index of inspectionOrder) {
      await steps.nth(index).focus();
      await steps.nth(index).press("Enter");
      await expect(steps.nth(index)).toHaveAttribute("aria-pressed", "true");
      await expect(demo).toHaveAttribute("data-stage", String(index));
      await expect(demo).toHaveAttribute("data-running", "false");
      await expect(demo).toHaveAttribute("data-inspecting", "true");
      await expect(demo.getByRole("button", { name: "Play animation", exact: true })).toBeVisible();
      expect((await demo.boundingBox())!.height).toBeCloseTo(height, 2);

      // A chosen mechanism stays readable rather than leaving an entrance
      // animation paused before the content and explanation appear.
      await expect(demo.locator(".demo-content")).toBeVisible();
      await expect(demo.locator(".demo-caption")).toBeVisible();
      await expect(demo.locator(".demo-caption")).not.toHaveText("");
      await expect.poll(() => demo.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation instanceof CSSAnimation && animation.playState !== "finished").length)).toBe(0);
    }
  }

  // Longer than a normal step duration: manual inspection must not time out.
  await page.waitForTimeout(5200);
  for (const name of demos) {
    await openProjectWalkthrough(page, name);
    const demo = page.getByRole("region", { name, exact: true });
    await expect(demo.getByRole("group", { name: "Animation steps" }).getByRole("button").nth(1)).toHaveAttribute("aria-pressed", "true");
  }

  const lastDemo = page.getByRole("region", { name: demos[1], exact: true });
  await lastDemo.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect(lastDemo).toHaveAttribute("data-running", "true");
  await expect(lastDemo.getByRole("group", { name: "Animation steps" }).getByRole("button").nth(2)).toHaveAttribute("aria-pressed", "true", { timeout: 6000 });
});

test("FDRE applies the chosen availability date to both searches and merges duplicate passages", async ({ page }) => {
  await page.goto("/");
  await openProjectWalkthrough(page, demos[1]);
  const demo = page.getByRole("region", { name: demos[1], exact: true });
  await showDemo(demo);
  await expect(demo).toHaveAttribute("data-running", "true");
  const dates = demo.getByRole("group", { name: "Example as-of date" });
  await expect(dates.getByRole("button", { name: "01 Mar", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(demo.locator('.fdre-filing-event[data-eligible="true"]')).toHaveCount(1);

  // Exploring a mechanism pauses the tour without requiring a separate click.
  await dates.getByRole("button", { name: "01 May", exact: true }).click();
  await expect(demo).toHaveAttribute("data-running", "false");
  await expect(demo.locator('.fdre-filing-event[data-eligible="true"]')).toHaveCount(3);
  const steps = demo.getByRole("group", { name: "Animation steps" });
  await steps.getByRole("button", { name: /^Hybrid Search:/ }).click();
  await expect(dates).toBeVisible();
  const trackedPassage = demo.locator('[data-flow-id="fdre-passage"] strong');
  const remainingPassages = demo.locator('.fdre-remaining-chunks .fdre-chunk-id[data-excluded="false"]');
  await expect(remainingPassages).toHaveCount(3);
  const laterIds = [await trackedPassage.innerText(), ...await remainingPassages.allTextContents()];
  expect(new Set(laterIds).size).toBe(4);
  expect(laterIds.filter(id => id === "12")).toHaveLength(1);
  await expect(demo.getByText("4 unique passages", { exact: true })).toBeVisible();

  await steps.getByRole("button", { name: /^Availability:/ }).click();
  await dates.getByRole("button", { name: "01 Mar", exact: true }).click();
  await steps.getByRole("button", { name: /^Hybrid Search:/ }).click();
  await expect(trackedPassage).toHaveText("12");
  await expect(remainingPassages).toHaveText(["31"]);
  await expect(demo.getByText("2 unique passages", { exact: true })).toBeVisible();
});

test("FDRE shows citation checks for supported questions and abstains from forecasts", async ({ page }) => {
  await page.goto("/");
  await openProjectWalkthrough(page, demos[1]);
  const demo = page.getByRole("region", { name: demos[1], exact: true });
  await showDemo(demo);
  await demo.getByRole("group", { name: "Animation steps" }).getByRole("button", { name: /^Evidence:/ }).click();
  const questions = demo.getByRole("group", { name: "Example question type" });
  await expect(questions.getByRole("button", { name: "Filing risk", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(demo.getByText("Cited ID was retrieved", { exact: true })).toBeVisible();
  await expect(demo.getByText("Quote overlap ≥ 0.60", { exact: true })).toBeVisible();

  await questions.getByRole("button", { name: "Price forecast", exact: true }).click();
  await expect(demo.getByText("Abstain", { exact: true })).toBeVisible();
  await expect(demo.getByText("Generation skipped", { exact: true })).toBeVisible();
  await expect(demo.getByText("No answer or citations returned", { exact: true })).toBeVisible();
  await expect(demo.locator(".fdre-source-checks")).toBeHidden();
  await expect(demo.locator(".fdre-abstention-note")).toBeVisible();
  await expect(demo.getByRole("img", { name: /unsupported.*skips generation.*no answer or citations/ })).toBeVisible();
  await expect(demo.locator('[data-flow-id="fdre-passage"] strong')).toHaveText("12");
  const actor = (await demo.locator('[data-flow-id="fdre-passage"]').boundingBox())!;
  const gate = (await demo.locator(".fdre-gate-mark").boundingBox())!;
  expect(Math.abs(actor.y + actor.height / 2 - gate.y - gate.height / 2)).toBeLessThan(2);

  await questions.getByRole("button", { name: "Filing risk", exact: true }).click();
  await expect(demo.locator(".fdre-source-checks")).toBeVisible();
  await expect(demo.locator(".fdre-abstention-note")).toBeHidden();
  await expect(demo.locator('[data-flow-id="fdre-passage"] strong')).toHaveText("[12]");
});

test("Embers product views switch the accessible screenshot without moving the frame", async ({ page }) => {
  await page.goto("/");
  await openProjectWalkthrough(page, "Embers product walkthrough");
  const demo = page.getByRole("region", { name: "Embers product walkthrough", exact: true });
  const views = demo.getByRole("group", { name: "Product views" }).getByRole("button");
  const screenshots = [
    "Embers identifying chairs, a couch, and a refrigerator in a room walkthrough",
    "Embers inventory dashboard with detected household items and replacement values",
  ];

  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await showDemo(demo);
    await views.nth(0).click();
    const height = (await demo.boundingBox())!.height;

    for (const index of [1, 0]) {
      await views.nth(index).click();
      await expect(views.nth(index)).toHaveAttribute("aria-pressed", "true");
      await expect(demo.getByRole("img")).toHaveCount(1);
      const image = demo.getByRole("img", { name: screenshots[index], exact: true });
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await expect.poll(async () => (await demo.boundingBox())!.height).toBeCloseTo(height, 2);
    }
  }
});

test("reduced-motion walkthroughs show their completed result and fit small screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const [demoIndex, name] of demos.entries()) {
      await openProjectWalkthrough(page, name);
      const demo = page.getByRole("region", { name, exact: true });
      await showDemo(demo);
      await expect(demo).toHaveAttribute("data-running", "false");
      await expect(demo.getByRole("group", { name: "Animation steps" }).getByRole("button").nth(stageCounts[demoIndex] - 1)).toHaveAttribute("aria-pressed", "true");
      await expect(demo.getByRole("button", { name: /^(Pause|Play) animation$/ })).toHaveCount(0);
      await expect.poll(() => demo.evaluate(node => ({
        clippedVertically: node.scrollHeight > node.clientHeight + 1,
        clippedHorizontally: node.scrollWidth > node.clientWidth + 1,
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        runningAnimations: node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length,
      }))).toEqual({ clippedVertically: false, clippedHorizontally: false, pageOverflow: false, runningAnimations: 0 });
    }
  }
});
