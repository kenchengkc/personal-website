import { expect, test, type Page } from "@playwright/test";
import { featuredProjects, otherWork } from "../data/portfolio";

const categories = [
  { name: "Work", id: "portfolio-work", hash: "work" },
  { name: "Research", id: "research", hash: "research" },
  { name: "Awards", id: "awards", hash: "awards" },
] as const;

async function openReadyGallery(page: Page) {
  await page.goto("/#work");
  await page.evaluate(() => document.fonts.ready);
  // A changed category proves hydration has completed; fonts alone do not.
  const research = page.getByRole("tab", { name: "Research", exact: true });
  await research.click();
  await expect(research).toHaveAttribute("aria-selected", "true");
  const work = page.getByRole("tab", { name: "Work", exact: true });
  await work.click();
  await expect(work).toHaveAttribute("aria-selected", "true");
  // Let the hash and category navigation frames finish before test-driven scrolling.
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

test("gallery categories support keyboard activation, deep links, reload, and browser history", async ({ page }) => {
  await page.goto("/#research");
  await expect(page.getByRole("tab", { name: "Research", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#research")).toBeVisible();
  await expect(page.locator("#portfolio-work")).toBeHidden();
  await page.reload();
  await expect(page.getByRole("tab", { name: "Research", exact: true })).toHaveAttribute("aria-selected", "true");

  const awards = page.getByRole("tab", { name: "Awards", exact: true });
  await awards.focus();
  await awards.press("Enter");
  await expect(page).toHaveURL(/#awards$/);
  await expect(awards).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#research")).toBeHidden();
  await expect(page.locator("#awards")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/#research$/);
  await expect(page.locator("#research")).toBeVisible();
  await expect(page.locator("#awards")).toBeHidden();
  await page.goForward();
  await expect(page.locator("#awards")).toBeVisible();
  await page.getByRole("tab", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#portfolio-work")).toBeVisible();

  await page.goto("/");
  await page.getByRole("tab", { name: "Research", exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("tab", { name: "Work", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#portfolio-work")).toBeVisible();
});

test("category switcher stays within the gallery and exposes readable counts at every screen size", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await openReadyGallery(page);
    const navigation = page.locator(".portfolio-navigation");
    for (const category of categories) {
      const tab = page.getByRole("tab", { name: category.name, exact: true });
      await expect(tab.locator(".portfolio-tab-count")).toHaveText(category.name === "Awards" ? "3" : "4");
      await expect(tab.locator(".portfolio-tab-count")).toBeVisible();
      const box = (await tab.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }

    await page.locator("#work").evaluate(gallery => window.scrollTo({
      top: gallery.getBoundingClientRect().top + window.scrollY + 240,
      behavior: "instant",
    }));
    await expect.poll(() => navigation.evaluate(node => Math.abs(node.getBoundingClientRect().top))).toBeLessThanOrEqual(1);
    await page.evaluate(() => window.scrollBy({ top: 180, behavior: "instant" }));
    await expect.poll(() => navigation.evaluate(node => Math.abs(node.getBoundingClientRect().top))).toBeLessThanOrEqual(1);

    await page.locator("#work").evaluate(gallery => window.scrollTo({
      top: gallery.getBoundingClientRect().bottom + window.scrollY + 32,
      behavior: "instant",
    }));
    await expect.poll(() => navigation.evaluate(node => node.getBoundingClientRect().bottom)).toBeLessThanOrEqual(0);
  }
});

test("switching a pinned category returns to its first entry without covering it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await openReadyGallery(page);
    for (const category of [categories[1], categories[2], categories[0]]) {
      await page.locator("#work").evaluate(gallery => window.scrollTo({
        top: gallery.getBoundingClientRect().top + window.scrollY + 420,
        behavior: "instant",
      }));
      await expect.poll(() => page.locator("#work").evaluate(node => node.getBoundingClientRect().top)).toBeLessThan(-200);
      await page.getByRole("tab", { name: category.name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#${category.hash}$`));
      await expect.poll(() => page.locator(`#${category.id}`).evaluate(panel => {
        const gallery = document.getElementById("work")!.getBoundingClientRect();
        const navigation = document.querySelector(".portfolio-navigation")!.getBoundingClientRect();
        const entry = panel.querySelector(".portfolio-entry")!.getBoundingClientRect();
        return Math.abs(gallery.top) <= 1 && entry.top >= navigation.bottom - 1 && entry.top < innerHeight;
      })).toBe(true);
    }
  }
});

test("category continuation links reveal the next category and focus its active tab", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#work");
    for (const [index, category] of categories.entries()) {
      const next = categories[(index + 1) % categories.length];
      const continuation = page.locator(".portfolio-continuation .portfolio-next");
      await expect(continuation).toContainText(`View ${next.name}`);
      await continuation.click();
      const activeTab = page.getByRole("tab", { name: next.name, exact: true });
      await expect(page).toHaveURL(new RegExp(`#${next.hash}$`));
      await expect(activeTab).toHaveAttribute("aria-selected", "true");
      await expect(activeTab).toBeFocused();
      await expect(page.locator(`#${category.id}`)).toBeHidden();
      await expect.poll(() => page.locator(`#${next.id} .portfolio-entry`).first().evaluate(entry => {
        const navigation = document.querySelector(".portfolio-navigation")!.getBoundingClientRect();
        const box = entry.getBoundingClientRect();
        return box.top >= navigation.bottom - 1 && box.top < innerHeight;
      })).toBe(true);
    }
  }
});

test("every experience, research project, and award has accessible, loaded artwork", async ({ page }) => {
  await page.goto("/");
  for (const category of categories) {
    await page.getByRole("tab", { name: category.name, exact: true }).click();
    const entries = page.locator(`#${category.id} .portfolio-entry`);
    await expect(entries).toHaveCount(category.name === "Awards" ? 3 : 4);
    for (const entry of await entries.all()) {
      await entry.scrollIntoViewIfNeeded();
      const artwork = entry.locator(".project-artwork");
      await expect(artwork).toBeVisible();
      await expect(artwork.getByRole("img").or(artwork.getByRole("figure")).first()).toHaveAccessibleName(/\S/);
      await expect.poll(() => artwork.locator("img").evaluateAll(images => images.every(image => {
        const img = image as HTMLImageElement;
        return img.complete && img.naturalWidth > 0;
      }))).toBe(true);
    }
  }
});

test("expanded gallery entries retain the full project evidence and original links", async ({ page }) => {
  await page.goto("/#work");
  for (const project of featuredProjects) {
    const entry = page.locator(`.portfolio-entry[data-project="${project.demo}"]`);
    const details = entry.locator(".portfolio-details");
    await details.locator(":scope > summary").click();
    await expect(details).toContainText(project.summary);
    await expect(details).toContainText(project.stack);
    for (const paragraph of project.details ?? []) await expect(details).toContainText(paragraph);
    for (const href of [project.href, project.secondaryHref].filter(Boolean)) {
      await expect(details.locator(`a[href="${href}"]`)).toBeVisible();
    }
    await details.locator(":scope > summary").click();
  }

  for (const category of ["Research", "Awards"]) {
    await page.getByRole("tab", { name: category, exact: true }).click();
    const panel = page.locator(category === "Research" ? "#research" : "#awards");
    const items = category === "Research" ? otherWork.slice(0, 4) : otherWork.slice(4);
    for (const item of items) {
      const details = panel.locator(".portfolio-entry").filter({ has: page.getByRole("heading", { name: item.title, exact: true }) }).locator(".portfolio-details");
      await details.locator(":scope > summary").click();
      await expect(details).toContainText(item.detail);
      if (item.href) await expect(details.locator(`a[href="${item.href}"]`)).toBeVisible();
      await details.locator(":scope > summary").click();
    }
  }
  await expect(page.locator('#writing a[href="https://ieeexplore.ieee.org/abstract/document/10422188"]')).toBeAttached();
  await expect(page.locator('#writing a[href*="researchgate.net/publication/371141171"]')).toBeAttached();
});

test("expanding Need for Speed keeps Best Paper anchored in the other award column", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 1024, 768, 721]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#awards");
    await expect(page.locator("#awards")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const speed = page.locator('.award-entry[data-project="speed"]');
    const bestPaper = page.locator('.award-entry[data-project="cvrp"]');
    const top = () => bestPaper.evaluate(node => node.getBoundingClientRect().top + window.scrollY);
    const before = await top();
    expect(await page.locator("#awards").evaluate(panel => {
      const speed = panel.querySelector('[data-project="speed"]')!.getBoundingClientRect();
      const bestPaper = panel.querySelector('[data-project="cvrp"]')!.getBoundingClientRect();
      return speed.top - bestPaper.top;
    })).toBeCloseTo(0, 1);

    await speed.locator("summary").click();
    await expect(speed.getByRole("link", { name: "Read the paper" })).toBeVisible();
    expect(await top(), `Best Paper moved when Need for Speed opened at ${width}px`).toBeCloseTo(before, 1);
    await speed.locator("summary").click();
    expect(await top()).toBeCloseTo(before, 1);

    const bounds = await page.locator("#awards").evaluate(panel => {
      const first = panel.querySelector('[data-project="usaco"]')!.getBoundingClientRect();
      const third = panel.querySelector('[data-project="cvrp"]')!.getBoundingClientRect();
      return { gap: third.top - first.bottom, containsLast: panel.getBoundingClientRect().bottom >= third.bottom };
    });
    expect(bounds.gap).toBeCloseTo(28, 1);
    expect(bounds.containsLast).toBe(true);
  }
});

test("award expansion preserves the single-column order without overlap on phones", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [720, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#awards");
    const speed = page.locator('.award-entry[data-project="speed"]');
    await speed.locator("summary").click();
    const layout = await page.locator("#awards").evaluate(panel => {
      const entries = [...panel.querySelectorAll<HTMLElement>(".award-entry")];
      const boxes = entries.map(entry => entry.getBoundingClientRect());
      return {
        order: entries.map(entry => entry.dataset.project),
        separated: boxes.slice(1).every((box, index) => box.top >= boxes[index].bottom + 23),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(layout).toEqual({ order: ["usaco", "speed", "cvrp"], separated: true, overflow: false });
  }
});

test("each featured project has one visual with no duplicate walkthrough", async ({ page }) => {
  await page.goto("/#work");
  for (const project of featuredProjects) {
    const entry = page.locator(`.portfolio-entry[data-project="${project.demo}"]`);
    const recorded = project.demo === "quantiv" || project.demo === "fdre";
    await entry.locator('.project-artwork').scrollIntoViewIfNeeded();
    await expect(entry.locator('.product-browser-preview')).toHaveCount(recorded ? 1 : 0);
    await expect(entry.locator('.animated-artwork')).toHaveCount(recorded ? 0 : 1);
    await expect(entry.locator('.animated-artwork-playground')).toHaveCount(project.demo === "amazon" ? 1 : 0);
    await entry.locator('.portfolio-details > summary').click();
    await expect(entry.getByText('Interactive walkthrough', { exact: true })).toHaveCount(0);
    await expect(entry.locator('.animated-artwork, .product-browser-preview')).toHaveCount(1);
    await entry.locator('.portfolio-details > summary').click();
  }
});

test("gallery animations advance while visible, pause on demand, and stop in hidden categories", async ({ page }) => {
  await page.goto("/#work");
  await page.locator('[data-artwork="amazon"]').scrollIntoViewIfNeeded();
  const artwork = page.locator('[data-artwork="amazon"] .animated-artwork');
  await artwork.scrollIntoViewIfNeeded();
  await expect(artwork).toHaveAttribute("data-running", "true");
  await expect(artwork).toHaveAttribute("data-stage", "1", { timeout: 6500 });
  await artwork.getByRole("button", { name: "Pause animation", exact: true }).click();
  await expect(artwork).toHaveAttribute("data-running", "false");
  const stage = await artwork.getAttribute("data-stage");
  await page.waitForTimeout(350);
  await expect(artwork).toHaveAttribute("data-stage", stage!);
  await expect.poll(() => artwork.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(0);
  await artwork.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect(artwork).toHaveAttribute("data-running", "true");
  await page.getByRole("tab", { name: "Research", exact: true }).click();
  await expect(artwork).toHaveAttribute("data-running", "false");
});

test("research shows published results and keeps only the CML animation", async ({ page }) => {
  await page.goto("/#research");
  const wasserstein = page.locator('[data-artwork="wasserstein"]');
  await expect(wasserstein.getByRole('img')).toHaveAttribute('src', /wasserstein-cross-asset-comparison/);
  await expect(wasserstein).toContainText('600 five-session forecasts');
  await expect(wasserstein).toContainText('no advantage over four simpler baselines');
  await expect(wasserstein.getByRole('link')).toHaveAttribute('href', '/media/research/wasserstein-cross-asset-comparison.png');

  const aster = page.locator('[data-artwork="aster"]');
  await expect(aster).toContainText('72');
  await expect(aster).toContainText('432');
  await expect(aster).toContainText('Same selected candidate');
  await expect(aster).toContainText('100 independent audit evaluations');
  await expect(aster).toContainText('One synthetic experiment');
  await expect(aster.getByRole('img')).toHaveCount(2);
  await expect(aster.getByRole('img').nth(0)).toHaveAttribute('src', /^\/media\/research\/aster-full-budget\.svg(?:\?|$)/);
  await expect(aster.getByRole('img').nth(1)).toHaveAttribute('src', /^\/media\/research\/aster-replication-race\.svg(?:\?|$)/);
  const gcinf = page.locator('[data-artwork="gcinf"]');
  await expect(gcinf.getByRole('img')).toHaveAttribute('src', /^\/media\/research\/gcinf-model-architecture\.png(?:\?|$)/);
  await expect(gcinf).toContainText('Figure 5');
  for (const artwork of [wasserstein, aster, gcinf]) {
    await expect(artwork.locator('.animated-artwork')).toHaveCount(0);
    await expect(artwork.getByRole('button')).toHaveCount(0);
    expect(await artwork.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
    for (const figure of await artwork.getByRole('img').all()) {
      expect(await figure.evaluate(node => ({ blend: getComputedStyle(node).mixBlendMode, filter: getComputedStyle(node).filter }))).toEqual({ blend: 'normal', filter: 'none' });
    }
  }

  const cml = page.locator('.portfolio-entry[data-project="cml"]');
  await cml.locator('.portfolio-details > summary').click();
  await expect(cml).toContainText("1,602");
  await expect(cml).toContainText("990");
  await expect(cml).toContainText("provisional");
  await expect(cml).toContainText("detector training");
  await expect(cml.locator('.animated-artwork')).toBeVisible();
  await expect(page.locator('#research .animated-artwork')).toHaveCount(1);

  await page.getByRole("tab", { name: "Awards", exact: true }).click();
  await expect(page.locator('#awards .portfolio-entry')).toHaveCount(3);
  await expect(page.locator('#awards')).not.toContainText('Egleston');
  const scholar = page.locator('#columbia .columbia-scholar-title');
  await expect(scholar).toHaveText('Egleston Scholar');
  expect(await scholar.evaluate(node => parseInt(getComputedStyle(node).fontWeight))).toBe(700);
  expect(await scholar.evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(22);
  const logo = page.locator('.artwork-usaco-logo');
  expect((await logo.boundingBox())!.width).toBeGreaterThan(200);
});

test("gallery fits compact screens and remains still with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const category of categories) {
      await page.getByRole("tab", { name: category.name, exact: true }).click();
      const panel = page.locator(`#${category.id}`);
      await expect.poll(() => panel.evaluate(node => ({
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        panelOverflow: node.scrollWidth > node.clientWidth + 1,
        running: node.getAnimations({ subtree: true }).filter(animation => animation instanceof CSSAnimation && animation.playState === "running").length,
      }))).toEqual({ pageOverflow: false, panelOverflow: false, running: 0 });
      for (const artwork of await panel.locator(".project-artwork").all()) {
        const button = artwork.locator('button:not([aria-haspopup="dialog"])').first();
        if (await button.count() && await button.isVisible() && await button.isEnabled()) await button.click();
        await expect.poll(() => artwork.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation instanceof CSSAnimation && animation.playState === "running").length)).toBe(0);
      }
    }
  }
});

test("the gallery content and native disclosures remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  for (const category of categories) {
    const panel = page.locator(`#${category.id}`);
    await expect(panel).toBeVisible();
    await expect(panel.locator(".portfolio-entry")).toHaveCount(category.name === "Awards" ? 3 : 4);
  }
  await page.getByRole("navigation", { name: "Portfolio categories", exact: true }).getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(/#research$/);
  const details = page.locator('#research .portfolio-details').filter({ hasText: "Wasserstein Regimes" });
  await details.locator(":scope > summary").click();
  await expect(details).toContainText("did not demonstrate an advantage over four simpler baselines");
  await expect(details.locator('a[href="https://wasserstein-regimes.vercel.app"]')).toBeVisible();
  await context.close();
});
