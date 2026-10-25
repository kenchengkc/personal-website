import { expect, test } from "@playwright/test";
import { featuredProjects, otherWork } from "../data/portfolio";
import { openProjectWalkthrough } from "./helpers/gallery";

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
    await expect(entries).toHaveCount(4);
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

test("closing a walkthrough or leaving Work stops its animation until reopened", async ({ page }) => {
  await page.goto("/");
  const name = "Amazon configuration infrastructure";
  const demo = await openProjectWalkthrough(page, name);
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute("data-running", "true");
  const entry = page.locator('.portfolio-entry[data-project="amazon"]');
  const walkthrough = entry.locator(".project-walkthrough");
  await walkthrough.locator(":scope > summary").click();
  await expect(demo).toHaveCount(0);
  await walkthrough.locator(":scope > summary").click();
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute("data-running", "true");
  await page.getByRole("tab", { name: "Research", exact: true }).click();
  await expect(demo).toHaveCount(0);
  await page.getByRole("tab", { name: "Work", exact: true }).click();
  await openProjectWalkthrough(page, name);
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute("data-running", "true");
});

test("gallery artwork replay finishes instead of looping", async ({ page }) => {
  await page.goto("/#work");
  const artwork = page.locator('.project-artwork[data-artwork="amazon"]');
  await artwork.getByRole("button").click();
  const running = () => artwork.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation instanceof CSSAnimation && animation.playState === "running").length);
  await expect.poll(running).toBeGreaterThan(0);
  await expect.poll(running, { timeout: 7000 }).toBe(0);
});

test("research artifacts expose original figures and the saved allocation comparison", async ({ page }) => {
  await page.goto("/#research");
  const aster = page.locator('[data-artwork="aster"]');
  await expect(aster.getByRole("img")).toHaveAccessibleName(/72 evaluations.*candidate 00 receives 27/);
  await aster.getByRole("button", { name: "Full budget", exact: true }).click();
  await expect(aster.getByRole("img")).toHaveAccessibleName(/432 evaluations.*16 candidates receive 27/);
  await aster.getByRole("button", { name: "Replication race", exact: true }).click();
  await expect(aster.getByRole("img")).toHaveAccessibleName(/72 evaluations/);

  const model = page.locator('[data-artwork="cml"]');
  await model.getByRole("button", { name: "Feature shapes", exact: true }).click();
  await expect(model).toContainText("[batch, 4, 4, 64]");

  for (const [category, kind, view] of [["Research", "wasserstein", "Cross-asset"], ["Awards", "speed", "CFD results"]]) {
    await page.getByRole("tab", { name: category, exact: true }).click();
    const artwork = page.locator(`[data-artwork="${kind}"]`);
    await artwork.getByRole("button", { name: view, exact: true }).click();
    const enlarge = artwork.getByRole("button", { name: `Enlarge ${view} figure` });
    await enlarge.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("img")).toBeVisible();
    await expect(dialog.getByRole("link", { name: "View original source" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(enlarge).toBeFocused();
  }
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
        const button = artwork.getByRole("button").first();
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
    await expect(panel.locator(".portfolio-entry")).toHaveCount(4);
  }
  await page.getByRole("navigation", { name: "Portfolio categories", exact: true }).getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(/#research$/);
  const details = page.locator('#research .portfolio-details').filter({ hasText: "Wasserstein Regimes" });
  await details.locator(":scope > summary").click();
  await expect(details).toContainText("did not demonstrate an advantage over four simpler baselines");
  await expect(details.locator('a[href="https://wasserstein-regimes.vercel.app"]')).toBeVisible();
  await context.close();
});
