import { expect, test } from "@playwright/test";
import { featuredProjects, otherWork } from "../data/portfolio";

const categories = [
  { name: "Work", id: "portfolio-work", hash: "work" },
  { name: "Research", id: "research", hash: "research" },
  { name: "Awards", id: "awards", hash: "awards" },
] as const;

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
      const details = panel.locator(".portfolio-details").filter({ has: page.locator("summary", { hasText: item.title }) });
      await details.locator(":scope > summary").click();
      await expect(details).toContainText(item.detail);
      if (item.href) await expect(details.locator(`a[href="${item.href}"]`)).toBeVisible();
      await details.locator(":scope > summary").click();
    }
  }
  await expect(page.locator('#writing a[href="https://ieeexplore.ieee.org/abstract/document/10422188"]')).toBeAttached();
  await expect(page.locator('#writing a[href*="researchgate.net/publication/371141171"]')).toBeAttached();
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
