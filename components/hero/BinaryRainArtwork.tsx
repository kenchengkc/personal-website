"use client";

import { useEffect, useRef } from "react";
import { ASSEMBLY_DURATION } from "./brain-particles";
import { createBrainRenderer } from "./brain-renderer";

export function BinaryRainArtwork() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = ref.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!node || !canvas || !context) return;
    const renderer = createBrainRenderer(canvas, context);
    if (!renderer) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let visible = false;
    let complete = false;
    let disposed = false;

    function tick(time: number) {
      elapsed += lastTime ? time - lastTime : 0;
      lastTime = time;
      complete = elapsed >= ASSEMBLY_DURATION;
      node!.dataset.phase = complete ? "complete" : "assembling";
      renderer!.draw(elapsed);
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
        renderer!.draw(elapsed);
      } else if (visible && !document.hidden && !complete) {
        frame = requestAnimationFrame(tick);
      }
    }

    function resize() {
      renderer!.resize();
      renderer!.draw(elapsed);
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
    // A restored tab should get a fresh backing store if its pixel ratio changed.
    window.addEventListener("resize", resize);
    document.fonts.ready.then(() => { if (!disposed) resize(); });
    syncAnimation();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
      window.removeEventListener("resize", resize);
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
