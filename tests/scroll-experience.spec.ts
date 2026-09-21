import { expect, test } from "@playwright/test";

test.use({ contextOptions: { reducedMotion: "reduce" } });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".ruler-milestone")).toHaveCount(11);
});

test("sidebar labels remain separated when hovered, including on short screens", async ({ page }) => {
  for (const height of [1000, 650]) {
    await page.setViewportSize({ width: 1440, height });
    await page.locator(".scroll-ruler").hover();
    const boxes = await page.locator(".ruler-milestone").evaluateAll(elements =>
      elements.map(element => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, left: rect.left };
      }),
    );
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom);
    }
    expect(boxes[4].left).toBeGreaterThan(boxes[3].left);
    expect(boxes.at(-1)!.bottom).toBeLessThan(height);
  }
});

test("nested projects become active and navigation targets the correct project", async ({ page }) => {
  const quantiv = page.locator('[data-scroll-label="QUANTIV"]');
  await quantiv.evaluate(element => element.scrollIntoView({ behavior: "instant" }));
  await expect(page.locator(".ruler-milestone.is-active")).toContainText(/Quantiv/i);
  await page.locator(".ruler-milestone").filter({ hasText: /Embers/i }).click();
  await expect(page.locator(".ruler-milestone.is-active")).toContainText(/Embers/i);
  await expect.poll(() => page.locator('[data-scroll-label="EMBERS"]').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(2);
});

test("scroll marker follows the scrollable page, including after layout growth", async ({ page }) => {
  for (const fraction of [0, 0.25, 0.5, 1]) {
    await page.evaluate(fraction => {
      window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * fraction, behavior: "instant" });
    }, fraction);
    await expect.poll(() => page.locator(".ruler-marker").evaluate(element => {
      const marker = element.getBoundingClientRect();
      const rail = document.querySelector(".ruler-track")!.getBoundingClientRect();
      return (marker.top + marker.height / 2 - rail.top) / rail.height;
    })).toBeCloseTo(fraction, 2);
  }
  await page.evaluate(() => {
    const space = document.createElement("div");
    space.style.height = "2000px";
    document.body.append(space);
  });
  await expect.poll(() => page.locator(".ruler-marker").evaluate(element => {
    const marker = element.getBoundingClientRect();
    const rail = document.querySelector(".ruler-track")!.getBoundingClientRect();
    return Math.abs((marker.top + marker.height / 2 - rail.top) / rail.height - scrollY / (document.documentElement.scrollHeight - innerHeight));
  })).toBeLessThan(0.005);
});


test("sidebar stays outside project content on narrow desktops", async ({ page }) => {
  for (const width of [1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    // Media-query styles settle on the next rendering frame after a resize.
    await expect.poll(() => page.evaluate(() => {
      const right = document.querySelector(".scroll-ruler")!.getBoundingClientRect().right;
      return {
        projectClear: document.querySelector(".project-result")!.getBoundingClientRect().left > right,
        footerClear: document.querySelector(".site-footer")!.getBoundingClientRect().left > right,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    })).toEqual({ projectClear: true, footerClear: true, overflow: false });
  }
});
