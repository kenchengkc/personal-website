import { expect, test } from "@playwright/test";
import { openProjectAnimation } from "./helpers/gallery";

type Frame = { time: number; stage: number; x: number; y: number; retained: boolean; visible: boolean; height: number };
const flows = [
  { kind: "fdre", actor: "fdre-gallery-passage" },
  { kind: "quantiv", actor: "quantiv-gallery-event" },
] as const;

for (const flow of flows) {
  test(`${flow.kind} keeps the same visible data object through intermediate animation frames`, async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const animation = await openProjectAnimation(page, flow.kind);
    const steps = animation.getByRole("group", { name: "Animation steps" }).getByRole("button");
    await steps.first().click();
    await expect(animation).toHaveAttribute("data-running", "false");
    const actor = await animation.locator(`[data-flow-id="${flow.actor}"]`).elementHandle();
    if (!actor) throw new Error(`Missing data object: ${flow.actor}`);

    const capture = actor.evaluate(async node => {
      const root = node.closest(".animated-artwork")!;
      const samples: Frame[] = [];
      const start = performance.now();
      let movedAt: number | undefined;
      return new Promise<Frame[]>(resolve => {
        const sample = (now: number) => {
          const stage = Number(root.getAttribute("data-stage"));
          if (stage === 1 && movedAt === undefined) movedAt = now;
          const rect = node.getBoundingClientRect();
          const anchor = new DOMPoint().matrixTransform((node as SVGGraphicsElement).getScreenCTM()!);
          let visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
          for (let ancestor: Element | null = node; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            visible &&= style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .2;
          }
          samples.push({ time: now - start, stage, x: anchor.x, y: anchor.y, height: root.getBoundingClientRect().height, visible,
            retained: node.isConnected && root.querySelector(`[data-flow-id="${node.getAttribute("data-flow-id")}"]`) === node });
          if ((movedAt !== undefined && now - movedAt >= 2200) || now - start > 10000) resolve(samples);
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
    });
    await animation.getByRole("button", { name: "Play animation", exact: true }).click();
    const frames = await capture;
    expect(new Set(frames.map(frame => frame.stage))).toEqual(new Set([0, 1]));
    expect(frames.every(frame => frame.retained && frame.visible)).toBe(true);
    expect(Math.max(...frames.map(frame => frame.height)) - Math.min(...frames.map(frame => frame.height))).toBeLessThan(1);
    const before = frames.filter(frame => frame.stage === 0).at(-1)!;
    const movement = frames.filter(frame => frame.stage === 1);
    const after = movement.at(-1)!;
    expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeGreaterThan(15);
    const intermediate = movement.filter(frame => Math.hypot(frame.x - before.x, frame.y - before.y) > 3 && Math.hypot(frame.x - after.x, frame.y - after.y) > 3);
    expect(new Set(intermediate.map(frame => `${Math.round(frame.x)},${Math.round(frame.y)}`)).size).toBeGreaterThan(5);

    await animation.getByRole("button", { name: "Pause animation", exact: true }).click();
    await expect(animation).toHaveAttribute("data-running", "false");
    await expect.poll(() => animation.evaluate(node => node.getAnimations({ subtree: true }).filter(item => item.playState === "running").length)).toBe(0);
  });
}

test("Quantiv's bundle traverses verification checkpoints and a corrupt bundle stops at its digest check", async ({ page }) => {
  test.setTimeout(20000);
  await page.goto("/");
  const animation = await openProjectAnimation(page, "quantiv");
  const steps = animation.getByRole("group", { name: "Animation steps" });
  const actor = await animation.locator('[data-flow-id="quantiv-gallery-event"]').elementHandle();
  if (!actor) throw new Error("Missing persistent Quantiv bundle");

  for (const corrupt of [false, true]) {
    await steps.getByRole("button", { name: "Serve", exact: true }).click();
    await animation.getByRole("button", { name: corrupt ? "Corrupt" : "Verified", exact: true }).click();
    await steps.getByRole("button", { name: "Validate", exact: true }).click();
    const capture = actor.evaluate(async node => {
      const root = node.closest(".animated-artwork")!;
      const center = (circle: SVGCircleElement) => {
        const point = new DOMPoint(circle.cx.baseVal.value, circle.cy.baseVal.value).matrixTransform(circle.getScreenCTM()!);
        return { x: point.x, y: point.y };
      };
      const checkpoints = [...root.querySelectorAll<SVGCircleElement>(".qflow-checkpoint, .qflow-rejected")].map(center);
      const endpoint = center(root.querySelector<SVGCircleElement>(".qflow-active-model, .qflow-previous-model")!);
      const frames: { x: number; y: number; retained: boolean }[] = [];
      const start = performance.now();
      let servingAt: number | undefined;
      return new Promise<{ checkpoints: typeof checkpoints; endpoint: typeof endpoint; frames: typeof frames }>(resolve => {
        const sample = (now: number) => {
          if (root.getAttribute("data-stage") === "3") {
            servingAt ??= now;
            const point = new DOMPoint().matrixTransform((node as SVGGraphicsElement).getScreenCTM()!);
            frames.push({ x: point.x, y: point.y, retained: node.isConnected && root.querySelector('[data-flow-id="quantiv-gallery-event"]') === node });
          }
          if ((servingAt !== undefined && now - servingAt >= 3100) || now - start >= 9000) resolve({ checkpoints, endpoint, frames });
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
    });
    await animation.getByRole("button", { name: "Play animation", exact: true }).click();
    const { checkpoints, endpoint, frames } = await capture;
    expect(checkpoints).toHaveLength(3);
    expect(frames.length).toBeGreaterThan(30);
    expect(frames.every(frame => frame.retained)).toBe(true);
    const nearest = (target: { x: number; y: number }) => Math.min(...frames.map(frame => Math.hypot(frame.x - target.x, frame.y - target.y)));
    for (const checkpoint of checkpoints.slice(0, corrupt ? 2 : 3)) expect(nearest(checkpoint)).toBeLessThan(6);
    const final = frames.at(-1)!;
    const destination = corrupt ? checkpoints[1] : endpoint;
    expect(Math.hypot(final.x - destination.x, final.y - destination.y)).toBeLessThan(1);
    if (corrupt) {
      expect(nearest(checkpoints[2])).toBeGreaterThan(20);
      expect(nearest(endpoint)).toBeGreaterThan(40);
      const onVerificationRail = frames.filter(frame => Math.abs(frame.y - checkpoints[1].y) < 2);
      expect(Math.max(...onVerificationRail.map(frame => frame.x))).toBeLessThanOrEqual(checkpoints[1].x + 1);
      await expect(animation.locator(".qflow-serve-result")).toContainText("Previous model v1 retained");
    } else {
      expect(nearest(endpoint)).toBeLessThan(1);
      const arrivals = [...checkpoints, endpoint].map(target => frames.findIndex(frame => Math.hypot(frame.x - target.x, frame.y - target.y) < 6));
      expect(arrivals.every((index, position) => position === 0 || index > arrivals[position - 1])).toBe(true);
      await expect(animation.locator(".qflow-serve-result")).toContainText("Model v2 active");
    }
  }
});
