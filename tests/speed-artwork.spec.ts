import { expect, test, type Page } from "@playwright/test";

async function openSpeed(page: Page) {
  await page.goto("/#awards");
  await page.getByRole("tab", { name: "Awards", exact: true }).click();
  const artwork = page.locator('.artwork-speed .animated-artwork');
  await artwork.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  return artwork;
}

test("Need for Speed uses original CFD fields in one persistent viewport", async ({ page }) => {
  const artwork = await openSpeed(page);
  await expect(artwork).toHaveAccessibleName("Need for Speed published CFD with animated flow tracers");
  await expect(artwork).toContainText(/illustrative flow tracers/i);
  const comparison = artwork.getByRole("link", { name: "Original CFD comparison", exact: true });
  await expect(comparison).toHaveAttribute("href", "/media/research/f1-cfd-source-comparison.png");
  expect((await page.request.get((await comparison.getAttribute("href"))!)).ok()).toBe(true);

  const scene = artwork.locator(".speed-scene");
  await expect(scene).toHaveAttribute("data-field", "pressure");
  const pressure = artwork.locator('img[data-cfd-field="pressure"]');
  const velocity = artwork.locator('img[data-cfd-field="velocity"]');
  await expect(pressure).toHaveAttribute("src", "/media/research/f1-optimized-pressure.png");
  await expect(velocity).toHaveAttribute("src", "/media/research/f1-optimized-velocity.png");
  for (const image of [pressure, velocity]) {
    await expect(image).toHaveAttribute("alt", /\S/);
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  }
  await expect(artwork.getByRole("img")).toHaveCount(1);
  await expect(artwork.getByRole("img")).toHaveAccessibleName(/Original ANSYS pressure contours/);
  const pressureNode = (await pressure.elementHandle())!;
  const velocityNode = (await velocity.elementHandle())!;
  const height = (await artwork.boundingBox())!.height;
  const views = artwork.getByRole("group", { name: "Animation steps", exact: true });
  await views.getByRole("button", { name: "Velocity", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(scene).toHaveAttribute("data-field", "velocity");
  await expect(artwork.getByRole("img")).toHaveCount(1);
  await expect(artwork.getByRole("img")).toHaveAccessibleName(/Original ANSYS velocity contours/);
  await expect(artwork).toHaveAttribute("data-running", "false");
  await views.getByRole("button", { name: "Pressure", exact: true }).click();
  await expect(scene).toHaveAttribute("data-field", "pressure");
  await expect(artwork.getByRole("img")).toHaveCount(1);
  await expect(artwork.getByRole("img")).toHaveAccessibleName(/Original ANSYS pressure contours/);
  expect(await pressureNode.evaluate(node => node.isConnected)).toBe(true);
  expect(await velocityNode.evaluate(node => node.isConnected)).toBe(true);
  expect((await artwork.boundingBox())!.height).toBeCloseTo(height, 2);

  // Playing the flow should keep the selected result on screen, not cycle slides.
  await artwork.getByRole("button", { name: "Play animation", exact: true }).click();
  await page.waitForTimeout(7000);
  await expect(scene).toHaveAttribute("data-field", "pressure");
});

test("CFD tracers move, pause, and suspend when the gallery is hidden", async ({ page }) => {
  const artwork = await openSpeed(page);
  await expect(artwork).toHaveAttribute("data-running", "true");
  const times = () => artwork.locator(".speed-tracer").evaluateAll(paths => paths.flatMap(path => path.getAnimations().map(animation => Number(animation.currentTime))));
  await expect.poll(async () => (await times()).length).toBeGreaterThan(0);
  const initial = await times();
  await expect.poll(times).not.toEqual(initial);
  await artwork.getByRole("button", { name: "Pause animation", exact: true }).click();
  await expect.poll(() => artwork.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(0);
  const paused = await times();
  await page.waitForTimeout(200);
  expect(await times()).toEqual(paused);
  await artwork.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect.poll(times).not.toEqual(paused);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(artwork).toHaveAttribute("data-running", "false");
  await artwork.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  await expect(artwork).toHaveAttribute("data-running", "true");
  await page.getByRole("tab", { name: "Work", exact: true }).click();
  await expect(artwork).toHaveAttribute("data-running", "false");
});

test("CFD fields fit narrow screens and remain inspectable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const artwork = await openSpeed(page);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await artwork.scrollIntoViewIfNeeded();
    for (const name of ["Pressure", "Velocity"]) {
      await artwork.getByRole("button", { name, exact: true }).click();
      await expect(artwork.locator(".speed-scene")).toHaveAttribute("data-field", name.toLowerCase());
      await expect(artwork).toHaveAttribute("data-running", "false");
      await expect(artwork.getByRole("button", { name: /^(Play|Pause) animation$/ })).toHaveCount(0);
      expect(await artwork.evaluate(node => {
        const bounds = node.getBoundingClientRect();
        return {
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
          artworkOverflow: node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1,
          controlsFit: [...node.querySelectorAll("button, a")].every(control => {
            const box = control.getBoundingClientRect();
            return box.left >= bounds.left - 1 && box.right <= bounds.right + 1 && box.top >= bounds.top - 1 && box.bottom <= bounds.bottom + 1;
          }),
          running: node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length,
        };
      })).toEqual({ pageOverflow: false, artworkOverflow: false, controlsFit: true, running: 0 });
    }
  }
});
