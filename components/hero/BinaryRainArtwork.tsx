"use client";

import { useEffect, useRef } from "react";
import {
  ASSEMBLY_DURATION,
  BRAIN_HEIGHT,
  BRAIN_WIDTH,
  createBrainParticles,
} from "./brain-particles";

export function BinaryRainArtwork() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = ref.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!node || !canvas || !context) return;

    // Effects may run again on the same canvas in development. Sample masks in
    // their original coordinates, independent of the previous display scale.
    context.setTransform(1, 0, 0, 1, 0, 0);
    const particles = createBrainParticles(context);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let visible = false;
    let complete = false;

    // Cache glyphs once: the falling stream uses image copies instead of
    // reshaping thousands of text runs on every animation frame.
    const atlas = document.createElement("canvas");
    const atlasContext = atlas.getContext("2d");
    if (!atlasContext) return;
    const cell = 40;
    const columns = 100;
    atlas.width = columns * cell;
    atlas.height = Math.ceil(particles.length / columns) * cell;
    atlasContext.textAlign = "center";
    atlasContext.textBaseline = "middle";
    particles.forEach((particle, i) => {
      atlasContext.font = `${particle.weight} ${particle.size * 2}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      atlasContext.fillStyle = particle.color;
      atlasContext.fillText(particle.char, (i % columns) * cell + cell / 2, Math.floor(i / columns) * cell + cell / 2);
    });

    function draw() {
      if (!canvas || !context) return;
      context.clearRect(0, 0, BRAIN_WIDTH, BRAIN_HEIGHT);
      particles.forEach((particle, i) => {
        const progress = complete ? 1 : Math.max(0, Math.min(1, (elapsed - particle.delay) / 3100));
        if (progress === 0) return;
        const falling = Math.min(1, progress / 0.38);
        const assembling = Math.max(0, (progress - 0.3) / 0.7);
        const ease = 1 - (1 - assembling) ** 3;
        const rainY = particle.startY + (particle.rainY - particle.startY) * falling;
        const x = particle.startX + (particle.x - particle.startX) * ease;
        const y = rainY + (particle.y - rainY) * ease;
        context.globalAlpha = particle.alpha * Math.min(1, progress * 7) * (0.42 + ease * 0.58);
        context.drawImage(atlas, (i % columns) * cell, Math.floor(i / columns) * cell, cell, cell, x - 10, y - 10, 20, 20);
      });
      context.globalAlpha = 1;
    }

    function tick(time: number) {
      elapsed += lastTime ? time - lastTime : 0;
      lastTime = time;
      complete = elapsed >= ASSEMBLY_DURATION;
      node!.dataset.phase = complete ? "complete" : "assembling";
      draw();
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
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round((width / BRAIN_WIDTH) * BRAIN_HEIGHT * ratio);
      const scale = canvas.width / BRAIN_WIDTH;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      draw();
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    }, { threshold: 0.12 });
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
