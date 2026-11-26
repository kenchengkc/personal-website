import { expect, test, type Locator } from "@playwright/test";
import { openProjectAnimation } from "./helpers/gallery";

async function advanceTo(artwork: Locator, phase: string) {
  const next = artwork.getByRole("button", { name: "Next event", exact: true });
  for (let step = 0; step < 20 && (await artwork.getAttribute("data-phase")) !== phase; step++) {
    await next.click();
  }
  await expect(artwork).toHaveAttribute("data-phase", phase);
}

for (const width of [320, 1440]) {
  test(`Amazon stages a revision for its readers and activates it on the next run at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const artwork = await openProjectAnimation(page, "amazon");
    const arrow = artwork.getByRole("button", { name: "View configuration diff" });
    await expect(arrow).toBeHidden();
    await expect(artwork.getByRole("status")).toContainText(/Run 184 uses v41.*run 185/);
    await expect(artwork.getByRole("combobox", { name: /run/i })).toHaveCount(0);
    const diff = artwork.getByRole("region", { name: "Configuration file diff" });
    const horizon = diff.getByRole("spinbutton", { name: "New value for horizon_weeks" });
    const push = artwork.getByRole("button", { name: "Click to push version 42", exact: true });
    await horizon.fill("12");
    await expect(diff.getByText("No changes", { exact: true })).toBeVisible();
    await expect(push).toBeDisabled();
    await horizon.fill("1.5");
    await expect(push).toBeDisabled();
    await horizon.fill("104");
    await expect(diff.locator('[data-kind="delete"][data-old-line="3"]')).toContainText("12");
    await expect(diff.locator('[data-kind="add"][data-new-line="3"]')).toContainText('"horizon_weeks"');
    await expect(diff).toContainText("@@ -1,5 +1,5 @@");
    await expect(artwork.locator('[data-consumer="0"]')).toHaveCount(0);
    await expect(artwork.locator("[data-consumer]")).toHaveCount(3);
    await push.press("Enter");
    await expect(artwork).toHaveAttribute("data-phase", "push");
    await expect(arrow).toBeHidden();
    await expect(artwork.getByRole("button", { name: "Pause", exact: true })).toHaveCount(0);
    await advanceTo(artwork, "queued");
    const readers = artwork.locator("[data-consumer]");
    for (const row of await readers.all()) await expect(row).toHaveAttribute("data-state", "staged");
    await expect(artwork.getByRole("status")).toContainText(/184.*v41/);

    // Ingestion does not read forecast-window.json. It starts without activating any delivery.
    const next = artwork.getByRole("button", { name: "Next event", exact: true });
    await next.click();
    await expect(artwork.locator('[data-consumer][data-state="applied"]')).toHaveCount(0);
    for (const [index, time] of ["07:04", "07:12", "07:20"].entries()) {
      await next.click();
      await expect(artwork.locator('[data-consumer][data-state="applied"]')).toHaveCount(index + 1);
      await expect(artwork.locator(`[data-consumer="${index + 1}"]`)).toContainText(time);
    }
    await advanceTo(artwork, "complete");
    await expect(artwork.getByRole("status")).toContainText(/185.*v42/);
    await expect(arrow).toBeVisible();
    await arrow.click();
    await expect(arrow).toBeHidden();
    await expect(diff.locator('[data-kind="add"]')).toBeInViewport();
    await artwork.getByRole("button", { name: "Edit again" }).click();
    await expect(arrow).toBeHidden();
    await expect(horizon).toHaveValue("104");
    const pushNextVersion = artwork.getByRole("button", { name: "Click to push version 43", exact: true });
    await expect(pushNextVersion).toBeDisabled();
    await horizon.fill("24");
    await pushNextVersion.click();
    await advanceTo(artwork, "complete");
    await expect(artwork.getByRole("status")).toContainText(/186.*v43/);
    expect(await artwork.evaluate(el => el.scrollWidth <= el.clientWidth + 1 && document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("switching the author and edited file changes the diff and recipient routes", async ({ page }) => {
  await page.goto("/");
  const artwork = await openProjectAnimation(page, "amazon");
  const publishing = artwork.getByRole("button", { name: /^Publishing/ });
  await publishing.press("Enter");
  await expect(publishing).toHaveAttribute("aria-pressed", "true");
  const file = artwork.getByRole("combobox", { name: "Configuration file" });
  await expect(file).toHaveValue("delivery");
  await artwork.getByRole("combobox", { name: "New value for format" }).selectOption("jsonl");
  await expect(artwork.locator("[data-consumer]")).toHaveCount(2);
  await expect(artwork.locator('[data-consumer="2"]')).toContainText(/SNS.*Lambda.*demand-model/s);
  await expect(artwork.locator('[data-consumer="3"]')).toContainText(/S3.*CloudFormation.*forecast-publisher/s);
  await file.selectOption("window");
  await expect(artwork.locator("[data-consumer]")).toHaveCount(3);
  await file.selectOption("delivery");
  await expect(artwork.getByRole("combobox", { name: "New value for format" })).toHaveValue("jsonl");
  await artwork.getByRole("button", { name: /^Ingestion/ }).press("Enter");
  await expect(file).toHaveValue("input");
  await expect(artwork.locator('[data-consumer="0"]')).toContainText("sales-ingest");
  await expect(artwork.locator('[data-consumer="2"], [data-consumer="3"]')).toHaveCount(0);
  await artwork.getByRole("spinbutton", { name: "New value for history_days" }).fill("730");
  await artwork.getByRole("button", { name: "Click to push version 42", exact: true }).click();
  await expect(artwork.locator('[data-kind="add"]')).toContainText('"history_days": 730');
});
