import { expect, test, type Locator } from "@playwright/test";

const demos = [
  "Amazon configuration infrastructure",
  "Quantiv earnings research demonstration",
  "Financial Document Retrieval Engine search demonstration",
] as const;

async function showDemo(demo: Locator) {
  await demo.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  await demo.evaluate(node => Promise.all(node.closest("[data-reveal]")!.getAnimations().map(animation => animation.finished)));
}

test("project walkthroughs advance in view and stop when scrolled away without changing frame height", async ({ page }) => {
  await page.goto("/");
  const stopped: { demo: Locator; stage: string | null }[] = [];

  for (const name of demos) {
    const demo = page.getByRole("region", { name, exact: true });
    await expect(demo).toHaveAttribute("data-running", "false");
    await showDemo(demo);
    await expect(demo).toHaveAttribute("data-running", "true");
    const height = (await demo.boundingBox())!.height;
    const initialStep = await demo.getByRole("group", { name: "Animation steps" }).getByRole("button", { pressed: true }).innerText();
    await expect.poll(() => demo.getByRole("group", { name: "Animation steps" }).getByRole("button", { pressed: true }).innerText(), { timeout: 6000 }).not.toBe(initialStep);
    expect((await demo.boundingBox())!.height).toBeCloseTo(height, 2);

    // A previous demo must not keep cycling while another is on screen.
    for (const previous of stopped) {
      await expect(previous.demo).toHaveAttribute("data-stage", previous.stage!);
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(demo).toHaveAttribute("data-running", "false");
    await expect.poll(() => demo.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(0);
    stopped.push({ demo, stage: await demo.getAttribute("data-stage") });
  }
});

test("visitors can inspect any step with a keyboard and it stays selected until playback resumes", async ({ page }) => {
  await page.goto("/");

  for (const name of demos) {
    const demo = page.getByRole("region", { name, exact: true });
    await showDemo(demo);
    const steps = demo.getByRole("group", { name: "Animation steps" }).getByRole("button");
    await expect(steps).toHaveCount(3);
    const height = (await demo.boundingBox())!.height;

    for (const index of [2, 0, 1]) {
      await steps.nth(index).focus();
      await steps.nth(index).press("Enter");
      await expect(steps.nth(index)).toHaveAttribute("aria-pressed", "true");
      await expect(demo).toHaveAttribute("data-running", "false");
      await expect(demo.getByRole("button", { name: "Play animation", exact: true })).toBeVisible();
      expect((await demo.boundingBox())!.height).toBeCloseTo(height, 2);

      // Inspection shows the finished step, rather than freezing an entrance
      // animation before the traced paths or historical observations appear.
      if (index === 1 && name === demos[0]) {
        await expect(demo.locator(".amz-route-progress")).toHaveCount(3);
        await expect.poll(() => demo.locator(".amz-route-progress").evaluateAll(paths => paths.map(path => getComputedStyle(path).clipPath))).toEqual(["inset(0px)", "inset(0px)", "inset(0px)"]);
      }
      if (index === 1 && name === demos[1]) {
        await expect(demo.locator(".qv-observation")).toHaveCount(8);
        await expect.poll(() => demo.locator(".qv-history-layer, .qv-observation").evaluateAll(nodes => nodes.every(node => getComputedStyle(node).opacity === "1"))).toBe(true);
      }
    }
  }

  // Longer than a normal step duration: manual inspection must not time out.
  await page.waitForTimeout(5200);
  for (const name of demos) {
    const demo = page.getByRole("region", { name, exact: true });
    await expect(demo.getByRole("group", { name: "Animation steps" }).getByRole("button").nth(1)).toHaveAttribute("aria-pressed", "true");
  }

  const lastDemo = page.getByRole("region", { name: demos[2], exact: true });
  await lastDemo.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect(lastDemo).toHaveAttribute("data-running", "true");
  await expect(lastDemo.getByRole("group", { name: "Animation steps" }).getByRole("button").nth(2)).toHaveAttribute("aria-pressed", "true", { timeout: 6000 });
});

test("Embers product views switch the accessible screenshot without moving the frame", async ({ page }) => {
  await page.goto("/");
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
    for (const name of demos) {
      const demo = page.getByRole("region", { name, exact: true });
      await showDemo(demo);
      await expect(demo).toHaveAttribute("data-running", "false");
      await expect(demo.getByRole("group", { name: "Animation steps" }).getByRole("button").nth(2)).toHaveAttribute("aria-pressed", "true");
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
