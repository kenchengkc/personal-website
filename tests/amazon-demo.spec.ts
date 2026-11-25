import { expect, test } from "@playwright/test";
import { openProjectAnimation } from "./helpers/gallery";

for (const width of [320, 390, 1440]) {
  test(`Amazon shows why three configurations receive the new version at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const animation = await openProjectAnimation(page, "amazon");
    const steps = animation.getByRole("group", { name: "Animation steps" });
    const outputs = animation.getByRole("group", { name: "Research output" });
    const source = animation.locator(".amazon-source");
    const rows = animation.getByRole("table", { name: "Downstream configurations" }).locator("tbody tr");
    const linked = rows.and(animation.locator('[data-linked="true"]'));
    const unlinked = rows.and(animation.locator('[data-linked="false"]'));

    for (const [output, unchangedConfig] of [["A", "cfg-08"], ["B", "cfg-01"]] as const) {
      await steps.getByRole("button", { name: "Compare", exact: true }).click();
      const choice = outputs.getByRole("button", { name: `Output ${output}`, exact: true });
      await choice.click();
      await expect(choice).toHaveAttribute("aria-pressed", "true");
      await expect(animation).toHaveAttribute("data-running", "false");
      const reference = `output-${output.toLowerCase()}`;
      await expect(source).toContainText(reference);
      await expect(source).toContainText(/v041.*v042/s);
      await expect(rows.locator("td:last-child")).toHaveText(Array(4).fill("v041"));
      await expect(unlinked).toContainText(unchangedConfig);

      await steps.getByRole("button", { name: "Trace", exact: true }).click();
      await expect(linked).toHaveCount(3);
      const evidence = linked.getByText(new RegExp(`"source"\\s*:\\s*"${reference}"`));
      await expect(evidence).toHaveCount(1);
      await expect(evidence).toBeVisible();
      await expect(rows.locator("td:last-child")).toHaveText(Array(4).fill("v041"));

      const layoutIssues = await animation.evaluate(node => {
        const dialog = node.closest("dialog")!.getBoundingClientRect();
        const host = node.closest(".artwork-window-host")!.getBoundingClientRect();
        const items = [...node.querySelectorAll("tbody th, tbody td, button")].map(element => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return {
            label: element.getAttribute("aria-label") || element.textContent,
            rect: element.matches("button") ? element.getBoundingClientRect() : range.getBoundingClientRect(),
          };
        });
        const issues: string[] = [];
        for (const [index, { label, rect }] of items.entries()) {
          if ([dialog, host].some(bounds => rect.left < bounds.left - 1 || rect.right > bounds.right + 1
            || rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1)) issues.push(`${label} is clipped`);
          for (const other of items.slice(index + 1)) {
            if (Math.min(rect.right, other.rect.right) - Math.max(rect.left, other.rect.left) > 1
              && Math.min(rect.bottom, other.rect.bottom) - Math.max(rect.top, other.rect.top) > 1) {
              issues.push(`${label} overlaps ${other.label}`);
            }
          }
        }
        return issues;
      });
      expect(layoutIssues).toEqual([]);

      await steps.getByRole("button", { name: "Publish", exact: true }).click();
      await expect(linked.locator("td:last-child")).toHaveText(Array(3).fill("v042"));
      await expect(unlinked.locator("td:last-child")).toHaveText("v041");
      await expect(unlinked).toContainText(unchangedConfig);
    }
  });
}

test("Amazon plays through the trace once, holds the published versions, and replays from the diff", async ({ page }) => {
  await page.goto("/");
  const animation = await openProjectAnimation(page, "amazon");
  const play = animation.getByRole("button", { name: "Play animation", exact: true });
  const replay = animation.getByRole("button", { name: "Replay animation", exact: true });
  await animation.getByRole("button", { name: "Compare", exact: true }).click();
  await play.click();
  await expect(animation).toHaveAttribute("data-stage", "1", { timeout: 3500 });
  await expect(animation).toHaveAttribute("data-stage", "2", { timeout: 5500 });
  await expect(replay).toBeVisible({ timeout: 4500 });
  await expect(animation).toHaveAttribute("data-running", "false");
  await expect(animation).toHaveAttribute("data-stage", "2");
  await replay.click();
  await expect(animation).toHaveAttribute("data-stage", "0");
  await expect(animation).toHaveAttribute("data-running", "true");
  await expect(animation.getByRole("table").locator("tbody td:last-child")).toHaveText(Array(4).fill("v041"));
});
