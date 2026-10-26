import { expect, test, type Page } from "@playwright/test";
import { cvrpNodes, cvrpCapacity, cvrpRoutes, cvrpCandidates } from "../data/cvrp-demo";

async function openRouting(page: Page) {
  await page.goto("/#awards");
  await page.getByRole("tab", { name: "Awards", exact: true }).click();
  const artwork = page.locator(".artwork-cvrp .animated-artwork");
  await expect(artwork).toBeAttached({ timeout: 2500 });
  await artwork.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  return artwork;
}

test("the routing animation follows the same customers and routes through all three phases", async ({ page }) => {
  const artwork = await openRouting(page);
  await expect(artwork).toHaveAccessibleName("Capacitated vehicle routing on an illustrative delivery network");
  await expect(artwork).toContainText("Illustrative instance");
  await expect(artwork).toContainText("Vehicle capacity");
  await expect(artwork.locator('img[src*="cvrp-visualizer"]')).toHaveCount(0);
  await expect(artwork.getByRole("img")).toHaveAccessibleName(/\S/);
  const customers = artwork.locator("[data-customer-id]");
  await expect(customers).toHaveCount(12);
  await expect(artwork.locator("[data-depot]")).toHaveCount(1);
  const nodes = await customers.elementHandles();
  const routes = await artwork.locator("[data-route-id]").elementHandles();
  expect(routes.length).toBe(3);
  const positions = await customers.evaluateAll(elements => elements.map(node => {
    const bounds = node.getBoundingClientRect();
    return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  }));
  const height = (await artwork.boundingBox())!.height;
  const controls = artwork.getByRole("group", { name: "Animation steps", exact: true });

  for (const [index, phase] of ["Generate", "Select", "Dispatch"].entries()) {
    const button = controls.getByRole("button", { name: phase, exact: true });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(artwork.locator(".cvrp-scene")).toHaveAttribute("data-phase", String(index));
    await expect(artwork).toHaveAttribute("data-running", "false");
    expect((await artwork.boundingBox())!.height).toBeCloseTo(height, 1);
    const current = await customers.evaluateAll(elements => elements.map(node => {
      const bounds = node.getBoundingClientRect();
      return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
    }));
    current.forEach((point, customer) => {
      expect(point.x).toBeCloseTo(positions[customer].x, 0);
      expect(point.y).toBeCloseTo(positions[customer].y, 0);
    });
  }
  for (const node of [...nodes, ...routes]) expect(await node.evaluate(element => element.isConnected)).toBe(true);
  const loads = await artwork.locator("[data-route-load]").evaluateAll(rows => rows.map(row => ({
    load: Number(row.getAttribute("data-route-load")),
    capacity: Number(row.getAttribute("data-route-capacity")),
  })));
  expect(loads).toHaveLength(3);
  for (const { load, capacity } of loads) {
    expect(load).toBeGreaterThan(0);
    expect(load).toBeLessThanOrEqual(capacity);
  }
});

test("the illustrative fleet serves every customer once with valid capacity and measured distances", () => {
  const nodes = new Map<number, (typeof cvrpNodes)[number]>(cvrpNodes.map(node => [node.id, node]));
  expect(nodes.size).toBe(cvrpNodes.length);
  expect(nodes.get(0)?.demand).toBe(0);
  expect(cvrpCapacity).toBeGreaterThan(0);
  const customers = cvrpNodes.filter(node => node.id !== 0).map(node => node.id).sort((a, b) => a - b);
  const served = cvrpRoutes.flatMap(route => route.stops.slice(1, -1)).sort((a, b) => a - b);
  expect(served).toEqual(customers);

  for (const route of [...cvrpRoutes, ...cvrpCandidates]) {
    expect(route.stops[0]).toBe(0);
    expect(route.stops.at(-1)).toBe(0);
    const stops = route.stops.slice(1, -1);
    expect(stops).not.toContain(0);
    expect(new Set(stops).size).toBe(stops.length);
    const load = stops.reduce((sum, id) => sum + nodes.get(id)!.demand, 0);
    expect(route.load).toBe(load);
    expect(load).toBeLessThanOrEqual(cvrpCapacity);
    const distance = route.stops.slice(1).reduce((sum, id, index) => {
      const from = nodes.get(route.stops[index])!;
      const to = nodes.get(id)!;
      return sum + Math.hypot(to.x - from.x, to.y - from.y);
    }, 0);
    expect(route.distance).toBeCloseTo(distance, 2);
  }
  for (const route of cvrpRoutes) {
    expect(cvrpCandidates.some(candidate => candidate.id === route.id && candidate.stops.join(",") === route.stops.join(","))).toBe(true);
  }
});

test("dispatch motion pauses and suspends outside the active gallery", async ({ page }) => {
  const artwork = await openRouting(page);
  await artwork.getByRole("button", { name: "Dispatch", exact: true }).click();
  await artwork.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect(artwork).toHaveAttribute("data-running", "true");
  const times = () => artwork.locator(".cvrp-vehicle").evaluateAll(markers => markers.flatMap(marker => marker.getAnimations().map(animation => Number(animation.currentTime))));
  await expect.poll(async () => (await times()).length).toBeGreaterThan(0);
  const initial = await times();
  await expect.poll(times).not.toEqual(initial);
  await artwork.getByRole("button", { name: "Pause animation", exact: true }).click();
  await expect.poll(() => artwork.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(0);
  const paused = await times();
  await page.waitForTimeout(200);
  expect(await times()).toEqual(paused);
  await artwork.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect.poll(times).not.toEqual(paused);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(artwork).toHaveAttribute("data-running", "false");
  await artwork.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  await expect(artwork).toHaveAttribute("data-running", "true");
  await page.getByRole("tab", { name: "Work", exact: true }).click();
  await expect(artwork).toHaveAttribute("data-running", "false");
});

test("routing controls and capacity labels fit mobile with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const artwork = await openRouting(page);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await artwork.scrollIntoViewIfNeeded();
    for (const name of ["Generate", "Select", "Dispatch"]) {
      await artwork.getByRole("button", { name, exact: true }).click();
      await expect(artwork).toHaveAttribute("data-running", "false");
      await expect(artwork.getByRole("button", { name: /^(Play|Pause) animation$/ })).toHaveCount(0);
      expect(await artwork.evaluate(node => {
        const bounds = node.getBoundingClientRect();
        return {
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
          artworkOverflow: node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1,
          controlsFit: [...node.querySelectorAll("button, a, [data-route-load]")].every(control => {
            const box = control.getBoundingClientRect();
            return box.left >= bounds.left - 1 && box.right <= bounds.right + 1 && box.top >= bounds.top - 1 && box.bottom <= bounds.bottom + 1;
          }),
          running: node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length,
        };
      })).toEqual({ pageOverflow: false, artworkOverflow: false, controlsFit: true, running: 0 });
    }
  }
});
