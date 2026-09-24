"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ASSEMBLY_DURATION, BRAIN_HEIGHT, BRAIN_WIDTH } from "./brain-particles";
import { createBrainRenderer } from "./brain-renderer";
import { loadBrainAtlas } from "./load-brain-atlas";

export function BinaryRainArtwork() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = ref.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!node || !canvas || !context) return;
    let renderer: ReturnType<typeof createBrainRenderer> | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let rainLeadIn = 0;
    let lastTime = 0;
    let visible = false;
    let started = false;
    let complete = false;
    let disposed = false;

    function tick(time: number) {
      // A busy frame must not fast-forward the visible rain by a large distance.
      const delta = lastTime ? Math.min(time - lastTime, 34) : 0;
      if (started) elapsed += delta;
      else rainLeadIn += delta;
      lastTime = time;
      complete = elapsed >= ASSEMBLY_DURATION;
      node!.dataset.phase = complete ? "complete" : started ? "assembling" : "raining";
      if (complete) renderer!.resize(true);
      renderer!.draw(elapsed, rainLeadIn);
      frame = complete ? 0 : requestAnimationFrame(tick);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (!renderer) return;
      if (reducedMotion.matches) {
        complete = true;
        elapsed = ASSEMBLY_DURATION;
        node!.dataset.phase = "complete";
        renderer.resize(true);
        renderer!.draw(elapsed, rainLeadIn);
      } else if (visible && !document.hidden && !complete) {
        frame = requestAnimationFrame(tick);
      }
    }

    function updateVisibility() {
      const bounds = canvas!.getBoundingClientRect();
      const container = node!.getBoundingClientRect();
      // The artwork clips the canvas on desktop; measure its displayed height.
      const top = Math.max(bounds.top, container.top);
      const bottom = Math.min(bounds.bottom, container.bottom);
      const visibleHeight = Math.max(0, Math.min(bottom, window.innerHeight) - Math.max(top, 0));
      const nextVisible = visibleHeight > 0;
      const nextStarted = started || (window.scrollY > 0 && visibleHeight > (bottom - top) * 0.5);
      if (visible === nextVisible && started === nextStarted) return;
      visible = nextVisible;
      started = nextStarted;
      syncAnimation();
    }

    function resize() {
      if (!renderer) return;
      renderer.resize(complete);
      renderer!.draw(elapsed, rainLeadIn);
      node!.dataset.ready = "true";
      updateVisibility();
    }

    // Keep the matching poster visible while decoding; no glyph generation
    // or thousands of text paints run on the page's first animation frame.
    loadBrainAtlas().then(atlas => {
      if (disposed) return;
      renderer = createBrainRenderer(canvas, context, atlas);
      resize();
      syncAnimation();
    }).catch(() => {
      // The server-rendered artwork remains visible if its atlas cannot load.
    });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(updateVisibility, { threshold: [0, 0.5, 1] });
    observer.observe(canvas);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    reducedMotion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    // A restored tab should get a fresh backing store if its pixel ratio changed.
    window.addEventListener("resize", resize);
    document.fonts.ready.then(() => { if (!disposed) resize(); });
    syncAnimation();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateVisibility);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={ref} className="hero-binary-art" data-phase="raining" aria-hidden="true">
      <link rel="preload" as="image" href="/images/brain-rain.webp" media="(prefers-reduced-motion: no-preference)" fetchPriority="high" />
      <link rel="preload" as="image" href="/images/brain-still.webp" media="(prefers-reduced-motion: reduce)" fetchPriority="high" />
      <link rel="preload" as="image" href="/images/brain-atlas.webp" />
      <div className="hero-brain-stage">
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet="/images/brain-still.webp" />
          <Image
            className="hero-brain-poster"
            src="/images/brain-rain.webp"
            alt=""
            width={BRAIN_WIDTH}
            height={BRAIN_HEIGHT}
            loading="eager"
            fetchPriority="high"
            unoptimized
          />
        </picture>
        <canvas ref={canvasRef} width={BRAIN_WIDTH} height={BRAIN_HEIGHT} className="hero-brain-canvas" />
      </div>
    </div>
  );
}
