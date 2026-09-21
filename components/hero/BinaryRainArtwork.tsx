"use client";

import { useEffect, useRef } from "react";
import {
  ASSEMBLY_DURATION,
  BRAIN_HEIGHT,
  BRAIN_WIDTH,
  createBrainParticles,
  type BrainParticle,
} from "./brain-particles";

const MAX_ANIMATED_PARTICLES = 1450;
const TARGET_FRAME_MS = 1000 / 30;
const PARTICLE_TRAVEL_DURATION = 3400;
const RAIN_FADE_START = 1250;
const RAIN_FADE_END = 2750;
const FINAL_REVEAL_START = 3050;
const FINAL_REVEAL_END = 3900;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp01((value - start) / Math.max(1, end - start));
  return t * t * (3 - 2 * t);
};

const hash = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

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

function renderRainTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = BRAIN_WIDTH;
  canvas.height = 900;

  const context = canvas.getContext("2d");
  if (!context) return canvas;

  context.textAlign = "center";
  context.textBaseline = "middle";

  const glyphCount = 2350;
  const palette = [
    "rgb(64, 118, 120)",
    "rgb(92, 151, 151)",
    "rgb(138, 185, 182)",
    "rgb(198, 216, 210)",
    "rgb(232, 239, 231)",
  ];

  for (let index = 0; index < glyphCount; index += 1) {
    const x = 55 + hash(index + 11) * 890;
    const y = hash(index + 29) * canvas.height;
    const size = 5 + hash(index + 43) * 4.6;
    const bright = hash(index + 67);
    const gold = hash(index + 101) > 0.982;

    context.font = `${bright > 0.82 ? 600 : 400} ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    context.fillStyle = gold
      ? "rgb(222, 193, 121)"
      : palette[Math.min(palette.length - 1, Math.floor(bright * palette.length))];
    context.globalAlpha = 0.16 + bright * 0.58;
    context.fillText(hash(index + 149) > 0.5 ? "1" : "0", x, y);
  }

  context.globalAlpha = 1;
  return canvas;
}

function sampleAnimationParticles(particles: BrainParticle[]) {
  if (particles.length <= MAX_ANIMATED_PARTICLES) return particles;

  // Spread the moving sample evenly across the full final brain, then force in
  // the largest/highest-alpha glyphs so the silhouette and strongest ridges
  // visibly emerge from the waterfall rather than appearing later.
  const stride = Math.ceil(particles.length / MAX_ANIMATED_PARTICLES);
  const sampled = particles.filter((_, index) => index % stride === 0);
  const sampledSet = new Set(sampled);

  const priority = [...particles].sort(
    (a, b) =>
      b.size * b.alpha * (b.weight / 400) -
      a.size * a.alpha * (a.weight / 400),
  );

  for (const particle of priority) {
    if (sampled.length >= MAX_ANIMATED_PARTICLES + 260) break;
    if (sampledSet.has(particle)) continue;
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

    context.setTransform(1, 0, 0, 1, 0, 0);

    const particles = createBrainParticles(context);
    const movingParticles = sampleAnimationParticles(particles);
    const finalBrain = renderFinalBrain(particles);
    const rainTexture = renderRainTexture();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let lastDrawTime = 0;
    let visible = false;
    let complete = false;

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

    function drawRain() {
      if (!context) return;

      const rainFade =
        1 - smoothstep(RAIN_FADE_START, RAIN_FADE_END, elapsed);
      if (rainFade <= 0) return;

      const offset = (elapsed * 0.19) % rainTexture.height;

      context.save();
      context.globalAlpha = rainFade * 0.82;
      context.drawImage(
        rainTexture,
        0,
        offset - rainTexture.height,
        BRAIN_WIDTH,
        rainTexture.height,
      );
      context.drawImage(
        rainTexture,
        0,
        offset,
        BRAIN_WIDTH,
        rainTexture.height,
      );
      context.restore();
    }

    function draw() {
      if (!canvas || !context) return;

      context.clearRect(0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);

      if (complete) {
        context.globalAlpha = 1;
        context.drawImage(finalBrain, 0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
        return;
      }

      drawRain();

      const finalReveal = smoothstep(
        FINAL_REVEAL_START,
        FINAL_REVEAL_END,
        elapsed,
      );

      // The dense filler layer only starts resolving once the moving particles
      // are already near their destinations. It sits underneath them so the
      // brain appears to condense out of the stream rather than pop in front.
      if (finalReveal > 0) {
        context.globalAlpha = finalReveal;
        context.drawImage(finalBrain, 0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
      }

      movingParticles.forEach((particle, index) => {
        const progress = clamp01(
          (elapsed - particle.delay) / PARTICLE_TRAVEL_DURATION,
        );
        if (progress === 0) return;

        const falling = smoothstep(0, 0.3, progress);
        const condensing = smoothstep(0.2, 0.9, progress);
        const locking = smoothstep(0.72, 1, progress);

        const rainY =
          particle.startY + (particle.rainY - particle.startY) * falling;

        // First the stream narrows toward the brain region. Then the same glyph
        // travels into its exact final coordinate, so the brain emerges from
        // continuous particle motion rather than a separate replacement image.
        const funnelX =
          BRAIN_WIDTH / 2 + (particle.x - BRAIN_WIDTH / 2) * 0.72;
        const funnelY =
          150 + (particle.y - BRAIN_HEIGHT / 2) * 0.18;

        const x =
          particle.startX +
          (funnelX - particle.startX) * condensing +
          (particle.x - funnelX) * locking;
        const y =
          rainY +
          (funnelY - rainY) * condensing +
          (particle.y - funnelY) * locking;

        const arrivalAlpha =
          particle.alpha *
          Math.min(1, progress * 7) *
          (0.5 + condensing * 0.5);

        // Once the full-density layer resolves, let duplicate animated glyphs
        // recede slightly while staying visible long enough to preserve motion.
        context.globalAlpha =
          arrivalAlpha * (1 - finalReveal * 0.42);

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
