"use client";

import { useEffect, useRef } from "react";
import { ASSEMBLY_DURATION, BRAIN_HEIGHT, BRAIN_WIDTH } from "./brain-particles";
import { createBrainRenderer } from "./brain-renderer";
import { loadBrainAtlas } from "./load-brain-atlas";
import { BRAIN_ASSET_PATH, SMALL_POSTER_MEDIA, brainPosterMedia, type AtlasScale } from "./brain-assets";

const PLAYBACK_RATE = 1.2;

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
    let lastScrollX = window.scrollX;
    let lastScrollY = window.scrollY;
    // Preserve a scroll that happened before this component hydrated.
    let started = lastScrollX !== 0 || lastScrollY !== 0;
    let complete = false;
    let disposed = false;
    let atlasScale: AtlasScale | undefined;
    let requestedScale: AtlasScale | undefined;

    function prepareRenderer() {
      if (disposed || reducedMotion.matches) return;
      const pixels = canvas!.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 2);
      const scale: AtlasScale = pixels > BRAIN_WIDTH ? 2 : 1;
      if (atlasScale === scale || requestedScale === scale) return;
      requestedScale = scale;
      loadBrainAtlas(scale).then(atlas => {
        if (disposed || requestedScale !== scale) return;
        requestedScale = undefined;
        if (reducedMotion.matches) return;
        atlasScale = scale;
        renderer = createBrainRenderer(canvas!, context!, atlas);
        node!.dataset.atlasScale = String(scale);
        resize();
        syncAnimation();
      }).catch(() => {
        if (requestedScale === scale) requestedScale = undefined;
        // The matching server-rendered poster remains visible on a load failure.
      });
    }

    function tick(time: number) {
      // A busy frame must not fast-forward the visible rain by a large distance.
      const delta = lastTime ? Math.min((time - lastTime) * PLAYBACK_RATE, 34) : 0;
      if (started) elapsed += delta;
      else rainLeadIn += delta;
      lastTime = time;
      complete = elapsed >= ASSEMBLY_DURATION;
      node!.dataset.phase = complete ? "complete" : started ? "assembling" : "raining";
      renderer!.draw(elapsed, rainLeadIn);
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
        // The responsive finished poster needs no atlas, bitmap crops, or canvas.
        if (renderer) {
          renderer.resize();
          renderer.draw(elapsed, rainLeadIn);
        }
      } else {
        prepareRenderer();
        if (renderer && (visible || started) && !document.hidden && !complete) {
          frame = requestAnimationFrame(tick);
        }
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
      if (visible === nextVisible) return;
      visible = nextVisible;
      syncAnimation();
    }

    function handleScroll() {
      const moved = window.scrollX !== lastScrollX || window.scrollY !== lastScrollY;
      lastScrollX = window.scrollX;
      lastScrollY = window.scrollY;
      if (!started && moved) {
        started = true;
        syncAnimation();
      }
      updateVisibility();
    }

    function resize() {
      if (renderer) {
        renderer.resize();
        renderer.draw(elapsed, rainLeadIn);
        node!.dataset.ready = "true";
      }
      updateVisibility();
      prepareRenderer();
    }

    // Prioritize the matching poster, then prepare the animation at its final
    // resolution. The 2x desktop atlas is never requested by a small phone.
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(updateVisibility, { threshold: [0, 1] });
    observer.observe(canvas);
    window.addEventListener("scroll", handleScroll, { passive: true });
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
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={ref} className="hero-binary-art" data-phase="raining" aria-hidden="true">
      {([1, 2] as const).map(scale => <link key={`rain-${scale}`} rel="preload" as="image" href={`${BRAIN_ASSET_PATH}/rain-${scale}x.webp`} media={brainPosterMedia("no-preference", scale)} fetchPriority="high" />)}
      {([1, 2] as const).map(scale => <link key={`still-${scale}`} rel="preload" as="image" href={`${BRAIN_ASSET_PATH}/still-${scale}x.webp`} media={brainPosterMedia("reduce", scale)} fetchPriority="high" />)}
      <div className="hero-brain-stage">
        <picture>
          <source media={brainPosterMedia("reduce", 1)} srcSet={`${BRAIN_ASSET_PATH}/still-1x.webp`} />
          <source media="(prefers-reduced-motion: reduce)" srcSet={`${BRAIN_ASSET_PATH}/still-2x.webp`} />
          <source media={SMALL_POSTER_MEDIA} srcSet={`${BRAIN_ASSET_PATH}/rain-1x.webp`} />
          {/* Native picture URLs match the preload exactly, including on deployed builds. */}
          <img
            className="hero-brain-poster"
            src={`${BRAIN_ASSET_PATH}/rain-2x.webp`}
            alt=""
            width={BRAIN_WIDTH}
            height={BRAIN_HEIGHT}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <canvas ref={canvasRef} width={BRAIN_WIDTH} height={BRAIN_HEIGHT} className="hero-brain-canvas" />
      </div>
    </div>
  );
}
