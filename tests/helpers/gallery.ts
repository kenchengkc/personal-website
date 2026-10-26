import { expect, type Page } from "@playwright/test";

export type FeaturedAnimation = "amazon" | "embers";
export type ProductRecording = "quantiv" | "fdre";

/** Select the Work gallery and bring its single interactive animation into view. */
export async function openProjectAnimation(page: Page, project: FeaturedAnimation) {
  const work = page.getByRole("tab", { name: "Work", exact: true });
  if (await work.getAttribute("aria-selected") !== "true") await work.click();
  await page.locator(`.portfolio-entry[data-project="${project}"] .project-artwork`).scrollIntoViewIfNeeded();
  const animation = page.locator(`.portfolio-entry[data-project="${project}"] .animated-artwork`);
  await expect(animation).toBeAttached();
  await animation.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  return animation;
}

/** Select Work and bring the recorded product preview into view. */
export async function openProductRecording(page: Page, project: ProductRecording) {
  const work = page.getByRole("tab", { name: "Work", exact: true });
  if (await work.getAttribute("aria-selected") !== "true") await work.click();
  await page.locator(`.portfolio-entry[data-project="${project}"] .project-artwork`).scrollIntoViewIfNeeded();
  const preview = page.locator(`.portfolio-entry[data-project="${project}"] .product-browser-preview`);
  await expect(preview).toBeAttached();
  await preview.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  return preview;
}
