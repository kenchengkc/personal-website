"use client";

import { useEffect, useRef } from "react";
import {
  ASSEMBLY_DURATION,
  BRAIN_HEIGHT,
  BRAIN_WIDTH,
  createBrainParticles,
  type BrainParticle,
} from "./brain-particles";

const MAX_ANIMATED_PARTICLES = 1150;
const TARGET_FRAME_MS = 1000 / 30;
const FINAL_REVEAL_START = 2500;
const FINAL_REVEAL_DURATION = 850;

function renderFinalBrain(
  particles: BrainParticle[],
  width = BRAIN_WIDTH,
  height = BRAIN_HEIGHT,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return canvas;

  context.textAlign = "center";
  context.textBaseline = "middle";

  for (const particle of particles) {
    context.font = `${particle.weight} ${particle.size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    context.fillStyle = particle.color;
    context.globalAlpha = particle.alpha;
    context.fillText(particle.char, particle.x, particle.y);
  }

  context.globalAlpha = 1;
  return canvas;
}

function sampleAnimationParticles(particles: BrainParticle[]) {
  if (particles.length <= MAX_ANIMATED_PARTICLES) return particles;

  const stride = Math.ceil(particles.length / MAX_ANIMATED_PARTICLES);
  const sampled = particles.filter((_, index) => index % stride === 0);

  // Keep a small share of the largest glyphs in the moving set so the
  // formation still carries the final brain's visual hierarchy.
  const sampledSet = new Set(sampled);
  for (const particle of particles) {
    if (sampled.length >= MAX_ANIMATED_PARTICLES + 180) break;
    if (particle.size < 12 || sampledSet.has(particle)) continue;
    sampled.push(particle);
    sampledSet.add(particle);
  }

  return sampled;
}

export function BinaryRainArtwork() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = ref.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!node || !canvas || !context) return;

    // Sample masks in their original design-space coordinates, independent of
    // the display scale applied during resize.
    context.setTransform(1, 0, 0, 1, 0, 0);
    const particles = createBrainParticles(context);
    const movingParticles = sampleAnimationParticles(particles);
    const finalBrain = renderFinalBrain(particles);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let lastDrawTime = 0;
    let visible = false;
    let complete = false;

    // Cache only the glyphs that actually move. The full dense brain is
    // pre-rendered once above and becomes a single draw call near completion.
    const atlas = document.createElement("canvas");
    const atlasContext = atlas.getContext("2d");
    if (!atlasContext) return;

    const cell = 40;
    const columns = 50;
    atlas.width = columns * cell;
    atlas.height = Math.ceil(movingParticles.length / columns) * cell;
    atlasContext.textAlign = "center";
    atlasContext.textBaseline = "middle";

    movingParticles.forEach((particle, index) => {
      atlasContext.font = `${particle.weight} ${particle.size * 2}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      atlasContext.fillStyle = particle.color;
      atlasContext.fillText(
        particle.char,
        (index % columns) * cell + cell / 2,
        Math.floor(index / columns) * cell + cell / 2,
      );
    });

    function draw() {
      if (!canvas || !context) return;

      context.clearRect(0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);

      if (complete) {
        context.globalAlpha = 1;
        context.drawImage(finalBrain, 0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
        return;
      }

      const finalReveal = Math.max(
        0,
        Math.min(1, (elapsed - FINAL_REVEAL_START) / FINAL_REVEAL_DURATION),
      );

      if (finalReveal > 0) {
        context.globalAlpha = finalReveal * 0.94;
        context.drawImage(finalBrain, 0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
      }

      movingParticles.forEach((particle, index) => {
        const progress = Math.max(
          0,
          Math.min(1, (elapsed - particle.delay) / 3100),
        );
        if (progress === 0) return;

        const falling = Math.min(1, progress / 0.38);
        const assembling = Math.max(0, (progress - 0.3) / 0.7);
        const ease = 1 - (1 - assembling) ** 3;
        const rainY =
          particle.startY + (particle.rainY - particle.startY) * falling;
        const x = particle.startX + (particle.x - particle.startX) * ease;
        const y = rainY + (particle.y - rainY) * ease;

        context.globalAlpha =
          particle.alpha *
          Math.min(1, progress * 7) *
          (0.42 + ease * 0.58) *
          (1 - finalReveal * 0.62);

        context.drawImage(
          atlas,
          (index % columns) * cell,
          Math.floor(index / columns) * cell,
          cell,
          cell,
          x - 10,
          y - 10,
          20,
          20,
        );
      });

      context.globalAlpha = 1;
    }

    function tick(time: number) {
      elapsed += lastTime ? time - lastTime : 0;
      lastTime = time;
      complete = elapsed >= ASSEMBLY_DURATION;
      node!.dataset.phase = complete ? "complete" : "assembling";

      if (
        complete ||
        lastDrawTime === 0 ||
        time - lastDrawTime >= TARGET_FRAME_MS
      ) {
        draw();
        lastDrawTime = time;
      }

      frame = complete ? 0 : requestAnimationFrame(tick);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;

      if (reducedMotion.matches) {
        complete = true;
        elapsed = ASSEMBLY_DURATION;
        node!.dataset.phase = "complete";
        draw();
      } else if (visible && !document.hidden && !complete) {
        frame = requestAnimationFrame(tick);
      }
    }

    function resize() {
      if (!canvas || !context) return;

      const width = canvas.getBoundingClientRect().width;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(
        (width / BRAIN_WIDTH) * BRAIN_HEIGHT * ratio,
      );

      const scale = canvas.width / BRAIN_WIDTH;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      draw();
    }

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncAnimation();
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    reducedMotion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    syncAnimation();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, []);

  return (
    <div ref={ref} className="hero-binary-art" aria-hidden="true">
      <div className="hero-brain-stage">
        <canvas ref={canvasRef} className="hero-brain-canvas" />
      </div>
    </div>
  );
}
