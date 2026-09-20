"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

type Particle = {
  lane: number;
  offset: number;
  target: Point;
  char: "0" | "1";
  gold: boolean;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function sampleCubic(
  start: Point,
  c1: Point,
  c2: Point,
  end: Point,
  count: number,
) {
  const points: Point[] = [];

  for (let i = 0; i < count; i += 1) {
    const t = i / Math.max(1, count - 1);
    const mt = 1 - t;
    points.push({
      x:
        mt * mt * mt * start.x +
        3 * mt * mt * t * c1.x +
        3 * mt * t * t * c2.x +
        t * t * t * end.x,
      y:
        mt * mt * mt * start.y +
        3 * mt * mt * t * c1.y +
        3 * mt * t * t * c2.y +
        t * t * t * end.y,
    });
  }

  return points;
}

function buildBrain(width: number, height: number) {
  const cx = width / 2;
  const cy = height * 0.52;
  const sx = Math.min(width / 760, 1.25);
  const sy = Math.min(height / 390, 1.15);
  const p = (x: number, y: number): Point => ({
    x: cx + x * sx,
    y: cy + y * sy,
  });

  const paths: Point[][] = [
    sampleCubic(p(-8, -118), p(-78, -148), p(-152, -112), p(-170, -54), 34),
    sampleCubic(p(-170, -54), p(-216, -22), p(-207, 56), p(-157, 83), 30),
    sampleCubic(p(-157, 83), p(-132, 128), p(-72, 130), p(-26, 104), 28),
    sampleCubic(p(-26, 104), p(-5, 93), p(-3, 62), p(-5, 43), 18),
    sampleCubic(p(8, -118), p(78, -148), p(152, -112), p(170, -54), 34),
    sampleCubic(p(170, -54), p(216, -22), p(207, 56), p(157, 83), 30),
    sampleCubic(p(157, 83), p(132, 128), p(72, 130), p(26, 104), 28),
    sampleCubic(p(26, 104), p(5, 93), p(3, 62), p(5, 43), 18),
    sampleCubic(p(0, -119), p(-8, -72), p(9, -33), p(0, 18), 28),
    sampleCubic(p(-126, -64), p(-90, -94), p(-54, -83), p(-38, -51), 20),
    sampleCubic(p(-154, -12), p(-111, -37), p(-74, -27), p(-55, 5), 20),
    sampleCubic(p(-142, 38), p(-108, 15), p(-69, 30), p(-51, 61), 20),
    sampleCubic(p(-104, 88), p(-74, 65), p(-43, 73), p(-25, 91), 18),
    sampleCubic(p(126, -64), p(90, -94), p(54, -83), p(38, -51), 20),
    sampleCubic(p(154, -12), p(111, -37), p(74, -27), p(55, 5), 20),
    sampleCubic(p(142, 38), p(108, 15), p(69, 30), p(51, 61), 20),
    sampleCubic(p(104, 88), p(74, 65), p(43, 73), p(25, 91), 18),
  ];

  return paths.flat();
}

export function BinaryBrain() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const rebuild = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targets = buildBrain(rect.width, rect.height);
      particlesRef.current = targets.map((target, index) => ({
        lane: index % 18,
        offset: (index * 29) % 240,
        target,
        char: index % 3 === 0 ? "1" : "0",
        gold: index % 41 === 0,
      }));
    };

    const updateProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.93;
      const end = viewport * 0.22;
      progressRef.current = reducedMotionRef.current
        ? 1
        : clamp((start - rect.top) / (start - end));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "30% 0px 30% 0px" },
    );

    const draw = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const progress = progressRef.current;
      const streamPhase = ease(progress / 0.38);
      const formPhase = ease((progress - 0.18) / 0.74);

      context.clearRect(0, 0, width, height);
      context.font = "500 11px var(--font-sans), Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";

      if (formPhase > 0.45) {
        const glow = (formPhase - 0.45) / 0.55;
        const gradient = context.createRadialGradient(
          width / 2,
          height * 0.53,
          20,
          width / 2,
          height * 0.53,
          Math.min(width, 460) * 0.48,
        );
        gradient.addColorStop(0, `rgba(199,164,91,${0.055 * glow})`);
        gradient.addColorStop(0.48, `rgba(174,176,180,${0.028 * glow})`);
        gradient.addColorStop(1, "rgba(10,10,10,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < particlesRef.current.length; i += 1) {
        const particle = particlesRef.current[i];
        const laneX = ((particle.lane + 1) / 19) * width;
        const travel =
          ((time * 0.028 + particle.offset) % (height + 180)) - 90;
        const streamY = lerp(-70 - particle.offset * 0.45, travel, streamPhase);

        const stagger = (i % 23) / 23;
        const localForm = ease((formPhase - stagger * 0.16) / 0.84);
        const x = lerp(laneX, particle.target.x, localForm);
        const y = lerp(streamY, particle.target.y, localForm);

        const baseAlpha = 0.18 + 0.68 * localForm;
        context.fillStyle = particle.gold
          ? `rgba(222,193,121,${0.24 + 0.66 * localForm})`
          : `rgba(205,208,213,${baseAlpha})`;

        context.fillText(particle.char, x, y);
      }

      if (visibleRef.current || progress < 1) {
        frameRef.current = window.requestAnimationFrame(draw);
      } else {
        frameRef.current = null;
      }
    };

    const wake = () => {
      updateProgress();
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(draw);
      }
    };

    rebuild();
    updateProgress();
    observer.observe(wrap);
    frameRef.current = window.requestAnimationFrame(draw);

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", () => {
      rebuild();
      wake();
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", wake);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="binary-brain" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="binary-brain-label">
        <span>binary input</span>
        <i />
        <span>structure</span>
      </div>
    </div>
  );
}
