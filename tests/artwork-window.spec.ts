import { expect, test } from "@playwright/test";
import { openProjectAnimation } from "./helpers/gallery";

for (const product of [{ kind: "amazon", name: "Amazon" }, { kind: "embers", name: "Embers" }] as const) {
  test(`${product.name} expands without restarting its animation or moving the page`, async ({ page }) => {
    await page.goto("/#work");
    const animation = await openProjectAnimation(page, product.kind);
    const host = page.locator(`[data-window="${product.kind}"]`);
    const scene = await animation.elementHandle();
    const steps = animation.getByRole("group", { name: "Animation steps" }).getByRole("button");
    await steps.nth(1).click();
    if (product.kind === "amazon") await animation.getByRole("button", { name: "Output B", exact: true }).click();
    const inline = (await host.boundingBox())!;
    const scrollY = await page.evaluate(() => window.scrollY);
    const expand = host.getByRole("button", { name: `Expand ${product.name} preview`, exact: true });

    for (const dismiss of ["escape", "green", "red", "backdrop"]) {
      await expand.click();
      const dialog = page.getByRole("dialog", { name: `${product.name} enlarged preview`, exact: true });
      await expect(dialog).toBeVisible();
      expect(await dialog.evaluate(node => node.matches(":modal"))).toBe(true);
      await expect(animation).toHaveAttribute("data-stage", "1");
      await expect(animation).toHaveAttribute("data-running", "false");
      expect(await scene!.evaluate(node => node.isConnected)).toBe(true);
      expect((await host.boundingBox())!.height).toBeCloseTo(inline.height, 1);
      const enlarged = (await dialog.boundingBox())!;
      expect(enlarged.width).toBeGreaterThan(inline.width);
      expect(enlarged.x + enlarged.width / 2).toBeCloseTo(720, 0);
      expect(enlarged.y + enlarged.height / 2).toBeCloseTo(500, 0);
      expect(await dialog.evaluate(node => getComputedStyle(node, "::backdrop").backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
      await page.mouse.wheel(0, 120);
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
      if (product.kind === "amazon") await expect(animation.getByRole("button", { name: "Output B", exact: true })).toHaveAttribute("aria-pressed", "true");
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate(node => !document.hasFocus() || node.contains(document.activeElement))).toBe(true);

      if (dismiss === "escape") await page.keyboard.press("Escape");
      else if (dismiss === "green") await dialog.getByRole("button", { name: `Restore ${product.name} preview`, exact: true }).click();
      else if (dismiss === "red") await dialog.getByRole("button", { name: `Close ${product.name} preview`, exact: true }).click();
      else await page.mouse.click(2, 2);
      await expect(page.getByRole("dialog", { name: `${product.name} enlarged preview`, exact: true })).toHaveCount(0);
      await expect(expand).toBeFocused();
      expect(await scene!.evaluate(node => node.isConnected)).toBe(true);
      await expect(animation).toHaveAttribute("data-stage", "1");
      expect((await host.boundingBox())!.height).toBeCloseTo(inline.height, 1);
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    }
  });
}

test("animation windows have evenly spaced lights and fit compact and landscape screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#work");
  for (const viewport of [{ width: 320, height: 640 }, { width: 844, height: 390 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    for (const product of [{ kind: "amazon", name: "Amazon" }, { kind: "embers", name: "Embers" }] as const) {
      const animation = await openProjectAnimation(page, product.kind);
      const host = page.locator(`[data-window="${product.kind}"]`);
      const centers = await host.locator(".product-browser-light").evaluateAll(nodes => nodes.map(node => {
        const bounds = node.getBoundingClientRect();
        return bounds.x + bounds.width / 2;
      }));
      expect(centers).toHaveLength(3);
      expect(centers[1] - centers[0]).toBeCloseTo(centers[2] - centers[1], 3);
      expect(await host.evaluate(node => node.scrollWidth <= node.clientWidth + 1 && document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await host.getByRole("button", { name: `Expand ${product.name} preview`, exact: true }).click();
      const dialog = page.getByRole("dialog", { name: `${product.name} enlarged preview`, exact: true });
      const bounds = (await dialog.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(8);
      expect(bounds.y).toBeGreaterThanOrEqual(8);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width - 8);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height - 8);
      expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      await expect(animation).toHaveAttribute("data-running", "false");
      expect(await animation.evaluate(node => node.getAnimations({ subtree: true }).filter(item => item.playState === "running").length)).toBe(0);
      await dialog.getByRole("button", { name: `Restore ${product.name} preview`, exact: true }).click();
    }
  }
});

test("Embers automatically tracks the object, places it in inventory, and pauses offscreen", async ({ page }) => {
  await page.goto("/#work");
  const animation = await openProjectAnimation(page, "embers");
  const steps = animation.getByRole("group", { name: "Animation steps" });
  await steps.getByRole("button", { name: "Detect", exact: true }).click();
  const actor = await animation.locator('[data-flow-id="embers-gallery-track"]').elementHandle();
  await animation.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect(animation).toHaveAttribute("data-stage", "1", { timeout: 5000 });
  await expect(animation.locator(".eflow-captured-image")).toHaveCSS("opacity", "1");
  await expect(animation).toHaveAttribute("data-stage", "2", { timeout: 5000 });
  await expect(animation.locator(".eflow-inventory-view")).toHaveCSS("opacity", "1");
  await expect(animation.locator(".eflow-saved-outline")).toHaveCSS("opacity", "0.8");
  await expect(animation.locator(".eflow-captured-image")).toHaveCSS("opacity", "0");
  const id = (await animation.locator(".eflow-id").boundingBox())!;
  const tile = (await animation.locator(".eflow-saved-outline").boundingBox())!;
  expect(id.x).toBeGreaterThanOrEqual(tile.x);
  expect(id.y).toBeGreaterThanOrEqual(tile.y);
  expect(id.x + id.width).toBeLessThanOrEqual(tile.x + tile.width + 1);
  expect(id.y + id.height).toBeLessThanOrEqual(tile.y + tile.height + 1);
  expect(await actor!.evaluate(node => node.isConnected)).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(animation).toHaveAttribute("data-running", "false");
  expect(await animation.evaluate(node => node.getAnimations({ subtree: true }).filter(item => item.playState === "running").length)).toBe(0);
});
