import { expect, type Page } from "@playwright/test";

const projectsByDemo: Record<string, string> = {
  "Amazon configuration infrastructure": "amazon",
  "Financial Document Retrieval Engine search demonstration": "fdre",
  "Embers product walkthrough": "embers",
};

/** Open the same disclosures a visitor uses, leaving earlier walkthroughs intact. */
export async function openProjectWalkthrough(page: Page, demoName: string) {
  const project = projectsByDemo[demoName];
  if (!project) throw new Error(`Unknown project walkthrough: ${demoName}`);
  const work = page.getByRole("tab", { name: "Work", exact: true });
  if (await work.getAttribute("aria-selected") !== "true") await work.click();
  const entry = page.locator(`.portfolio-entry[data-project="${project}"]`);
  const details = entry.locator(".portfolio-details");
  if (await details.getAttribute("open") === null) await details.locator(":scope > summary").click();
  const walkthrough = entry.locator(".project-walkthrough");
  if (await walkthrough.getAttribute("open") === null) await walkthrough.locator(":scope > summary").click();
  const demo = page.getByRole("region", { name: demoName, exact: true });
  await expect(demo).toBeAttached();
  // Preserve the off-screen starting state used by the playback tests.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  return demo;
}
