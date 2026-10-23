import { expect, test, type Locator } from "@playwright/test";

type ActorFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  visible: boolean;
  retained: boolean;
};
type Frame = { time: number; stage: number; height: number; actors: Record<string, ActorFrame> };

const flows = [
  { name: "Amazon configuration infrastructure", actors: ["amazon-config"], moving: "amazon-config", finalStage: 2, finalDwell: 5700 },
  { name: "Financial Document Retrieval Engine search demonstration", actors: ["fdre-passage"], moving: "fdre-passage", finalStage: 2, finalDwell: 2200 },
  { name: "Quantiv earnings research demonstration", actors: ["quantiv-market", "quantiv-model"], moving: "quantiv-model", stationary: "quantiv-market", finalStage: 3, finalDwell: 6300 },
] as const;

async function showSettledDemo(demo: Locator) {
  await demo.evaluate(node => node.scrollIntoView({ behavior: "instant", block: "center" }));
  // The reveal observer may not have started its transition when scrolling
  // returns. Wait for the visible composition, not an empty animation list.
  await expect.poll(() => demo.evaluate(node => {
    const reveal = node.closest("[data-reveal]")!;
    return getComputedStyle(reveal).opacity === "1" && reveal.getAnimations().every(animation => animation.playState === "finished");
  })).toBe(true);
}

async function quantivLandmarks(demo: Locator) {
  return demo.evaluate(root => {
    const point = (node: SVGGraphicsElement, x = 0, y = 0) => {
      const position = new DOMPoint(x, y).matrixTransform(node.getScreenCTM()!);
      return { x: position.x, y: position.y };
    };
    const checks = [...root.querySelectorAll<SVGGraphicsElement>(".qv-checkpoint")].map(node => point(node));
    const serving = root.querySelector<SVGCircleElement>(".qv-serving-dot")!;
    return [...checks, point(serving, serving.cx.baseVal.value, serving.cy.baseVal.value)];
  });
}

// The tall viewport keeps the complete continuous map visible during sampling.
test.use({ viewport: { width: 1440, height: 1400 } });

for (const flow of flows) {
  test(`${flow.name} carries the same actor through visible intermediate frames`, async ({ page }) => {
    test.setTimeout(35000);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const demo = page.getByRole("region", { name: flow.name, exact: true });
    await expect(demo).toHaveAttribute("data-running", "false");
    await showSettledDemo(demo);
    await expect(demo).toHaveAttribute("data-stage", "0");
    await expect(demo).toHaveAttribute("data-running", "true");

    // Retain actual DOM references before playback advances. A replacement with
    // the same selector must fail, as must a fade-out/cut to the destination.
    const frames: Frame[] = await demo.evaluate(async (root, options) => {
      const references = options.actors.map(id => {
        const node = root.querySelector(`[data-flow-id="${id}"]`);
        if (!node) throw new Error(`Missing persistent actor: ${id}`);
        return { id, node };
      });
      const samples: Frame[] = [];
      const start = performance.now();
      let finalStageAt: number | undefined;

      return new Promise<Frame[]>(resolve => {
        const sample = (now: number) => {
          const stage = Number(root.getAttribute("data-stage"));
          if (stage === options.finalStage && finalStageAt === undefined) finalStageAt = now;
          const actors: Record<string, ActorFrame> = {};
          for (const { id, node } of references) {
            const rect = node.getBoundingClientRect();
            const anchor = node instanceof SVGGraphicsElement
              ? new DOMPoint(0, 0).matrixTransform(node.getScreenCTM()!)
              : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            let opacity = 1;
            let visible = rect.width > 0 && rect.height > 0;
            for (let ancestor: Element | null = node; ancestor; ancestor = ancestor.parentElement) {
              const style = getComputedStyle(ancestor);
              opacity *= Number(style.opacity);
              visible &&= style.visibility !== "hidden" && style.display !== "none";
            }
            actors[id] = {
              x: anchor.x,
              y: anchor.y,
              width: rect.width,
              height: rect.height,
              opacity,
              visible: visible && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth,
              retained: node.isConnected && root.querySelector(`[data-flow-id="${id}"]`) === node,
            };
          }
          samples.push({ time: now - start, stage, height: root.getBoundingClientRect().height, actors });
          if ((finalStageAt !== undefined && now - finalStageAt >= options.finalDwell) || now - start > 26000) {
            resolve(samples);
          } else {
            requestAnimationFrame(sample);
          }
        };
        requestAnimationFrame(sample);
      });
    }, { actors: [...flow.actors], finalStage: flow.finalStage, finalDwell: flow.finalDwell });

    expect([...new Set(frames.map(frame => frame.stage))]).toEqual(Array.from({ length: flow.finalStage + 1 }, (_, index) => index));
    expect(Math.max(...frames.map(frame => frame.height)) - Math.min(...frames.map(frame => frame.height))).toBeLessThan(1);
    for (const id of flow.actors) {
      expect(frames.every(frame => frame.actors[id].retained), `${id} must remain the same connected DOM element`).toBe(true);
      const invisibleFrames = frames.filter(frame => !frame.actors[id].visible || frame.actors[id].opacity <= 0.2);
      expect(invisibleFrames.slice(0, 3).map(frame => ({ time: frame.time, stage: frame.stage, actor: frame.actors[id] })), `${id} must stay visible instead of fading between scenes`).toEqual([]);
    }

    for (let stage = 1; stage <= flow.finalStage; stage++) {
      const before = frames.filter(frame => frame.stage === stage - 1).at(-1)!.actors[flow.moving];
      const movement = frames.filter(frame => frame.stage === stage);
      const after = movement.at(-1)!.actors[flow.moving];
      const dx = after.x - before.x;
      const dy = after.y - before.y;
      const distanceSquared = dx * dx + dy * dy;
      expect(Math.sqrt(distanceSquared), `${flow.moving} should travel between stages ${stage - 1} and ${stage}`).toBeGreaterThan(8);
      const intermediate = movement.filter(frame => {
        const point = frame.actors[flow.moving];
        const progress = ((point.x - before.x) * dx + (point.y - before.y) * dy) / distanceSquared;
        return progress > 0.08 && progress < 0.92;
      });
      const positions = new Set(intermediate.map(frame => {
        const point = frame.actors[flow.moving];
        return `${Math.round(point.x * 2)},${Math.round(point.y * 2)}`;
      }));
      expect(positions.size, `${flow.moving} must render intermediate positions, not jump to stage ${stage}`).toBeGreaterThanOrEqual(4);
    }

    if ("stationary" in flow) {
      const anchor = frames[0].actors[flow.stationary];
      expect(Math.max(...frames.map(frame => Math.hypot(frame.actors[flow.stationary].x - anchor.x, frame.actors[flow.stationary].y - anchor.y))), "The market reference must stay fixed while the model travels").toBeLessThan(1);

      const landmarks = await quantivLandmarks(demo);
      const delivery = frames.filter(frame => frame.stage === flow.finalStage).map(frame => frame.actors[flow.moving]);
      for (const [index, landmark] of landmarks.entries()) {
        expect(Math.min(...delivery.map(point => Math.hypot(point.x - landmark.x, point.y - landmark.y))), `The same bundle must pass verification checkpoint ${index + 1}`).toBeLessThan(4);
      }
      await expect(demo.locator('[data-flow-id="quantiv-model"]')).toHaveAttribute("data-flow-stop", "activation");
      const delivered = delivery.at(-1)!;
      expect(Math.hypot(delivered.x - landmarks[3].x, delivered.y - landmarks[3].y), "Verified bundle must reach the active serving endpoint").toBeLessThan(1);
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(demo).toHaveAttribute("data-running", "false");
    await expect.poll(() => demo.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(0);
  });
}

for (const flow of [flows[0], flows[2]]) {
  test(`${flow.name} keeps its delivered actor in place when inspection resumes`, async ({ page }) => {
    await page.goto("/");
    const demo = page.getByRole("region", { name: flow.name, exact: true });
    await showSettledDemo(demo);
    await demo.getByRole("group", { name: "Animation steps" }).getByRole("button").nth(flow.finalStage).click();
    await expect(demo).toHaveAttribute("data-inspecting", "true");
    const actor = await demo.locator(`[data-flow-id="${flow.moving}"]`).elementHandle();
    if (!actor) throw new Error(`Missing persistent actor: ${flow.moving}`);

    // Start capturing before the real Play click, so even the first resumed
    // frame is compared with the completed composition the visitor inspected.
    const capture = actor.evaluate(async node => {
      const root = node.closest(".demo-player")!;
      const position = () => {
        const rect = node.getBoundingClientRect();
        const container = root.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - container.left, y: rect.top + rect.height / 2 - container.top };
      };
      const start = performance.now();
      const initial = position();
      let maxDistance = 0;
      let retained = true;
      return new Promise<{ maxDistance: number; retained: boolean }>(resolve => {
        const sample = (now: number) => {
          const current = position();
          maxDistance = Math.max(maxDistance, Math.hypot(current.x - initial.x, current.y - initial.y));
          retained &&= node.isConnected && root.querySelector(`[data-flow-id="${node.getAttribute("data-flow-id")}"]`) === node;
          if (now - start >= 1400) resolve({ maxDistance, retained });
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
    });
    await demo.getByRole("button", { name: "Play animation", exact: true }).click();
    await expect(demo).toHaveAttribute("data-running", "true");
    const result = await capture;
    expect(result.retained).toBe(true);
    expect(result.maxDistance, "Play must hold the delivered actor, not restart its trip from the previous stage").toBeLessThan(1);
    await expect(demo).toHaveAttribute("data-stage", String(flow.finalStage));
  });
}

test("a corrupt Quantiv bundle travels to the digest check and stops before activation", async ({ page }) => {
  await page.goto("/");
  const demo = page.getByRole("region", { name: flows[2].name, exact: true });
  await showSettledDemo(demo);
  const steps = demo.getByRole("group", { name: "Animation steps" });
  await steps.getByRole("button", { name: /^Serve:/ }).click();
  await demo.getByRole("button", { name: "Corrupt bundle", exact: true }).click();
  await steps.getByRole("button", { name: /^Validate:/ }).click();
  await demo.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect(demo).toHaveAttribute("data-stage", "3", { timeout: 6000 });
  const actor = demo.locator('[data-flow-id="quantiv-model"]');
  await expect(actor).toHaveAttribute("data-flow-stop", "digest");
  await expect(actor).toHaveAttribute("data-rejected", "true");
  const samples = await actor.evaluate(async node => {
    const start = performance.now();
    const frames: { x: number; y: number }[] = [];
    return new Promise<typeof frames>(resolve => {
      const sample = (now: number) => {
        const point = new DOMPoint(0, 0).matrixTransform((node as SVGGraphicsElement).getScreenCTM()!);
        frames.push({ x: point.x, y: point.y });
        if (now - start >= 5500) resolve(frames);
        else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  });
  const [signature, digest, , serving] = await quantivLandmarks(demo);
  expect(Math.min(...samples.map(point => Math.hypot(point.x - signature.x, point.y - signature.y))), "The rejected bundle must still travel through the signature check").toBeLessThan(4);
  expect(Math.max(...samples.map(point => point.x)), "A digest failure must not pass into native loading or activation").toBeLessThanOrEqual(digest.x + 1);
  const stopped = samples.at(-1)!;
  expect(Math.hypot(stopped.x - digest.x, stopped.y - digest.y)).toBeLessThan(1);
  expect(Math.hypot(stopped.x - serving.x, stopped.y - serving.y)).toBeGreaterThan(20);
  await expect(demo.locator(".qv-serve-result")).toContainText("Previous model retained");
  await expect(demo.getByText("current → v1", { exact: true })).toBeVisible();
});
