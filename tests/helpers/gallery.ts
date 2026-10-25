import { expect, type Page } from "@playwright/test";

export type FeaturedAnimation = "amazon" | "quantiv" | "fdre" | "embers";

/** Select the Work gallery and bring its single interactive animation into view. */
export async function openProjectAnimation(page: Page, project: FeaturedAnimation) {
  const work = page.getByRole("tab", { name: "Work", exact: true });
  if (await work.getAttribute("aria-selected") !== "true") await work.click();
  const animation = page.locator(`.portfolio-entry[data-project="${project}"] .animated-artwork`);
  await expect(animation).toBeAttached();
  await animation.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  return animation;
}
