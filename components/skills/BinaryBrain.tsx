"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

type BrainPoint = Point & {
  edge: boolean;
  shade: number;
};

type GlyphSize = "xs" | "sm" | "md" | "lg";

type Particle = {
  lane: number;
  offset: number;
  target: BrainPoint;
  char: "0" | "1";
  gold: boolean;
  phase: number;
  size: GlyphSize;
  alphaBias: number;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const hash = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function drawBrainMask(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const cx = width / 2;
  const cy = height / 2 + 4;
  const sx = width / 420;
  const sy = height / 310;

  context.save();
  context.translate(cx, cy);
  context.scale(sx, sy);

  const brain = new Path2D();
  brain.moveTo(0, -132);

  brain.bezierCurveTo(-24, -150, -66, -147, -92, -128);
  brain.bezierCurveTo(-124, -137, -157, -114, -160, -83);
  brain.bezierCurveTo(-187, -72, -198, -39, -183, -14);
  brain.bezierCurveTo(-199, 14, -183, 48, -157, 57);
  brain.bezierCurveTo(-158, 88, -126, 111, -96, 107);
  brain.bezierCurveTo(-75, 133, -35, 134, -13, 111);
  brain.bezierCurveTo(-4, 98, -2, 78, 0, 62);

  brain.bezierCurveTo(2, 78, 4, 98, 13, 111);
  brain.bezierCurveTo(35, 134, 75, 133, 96, 107);
  brain.bezierCurveTo(126, 111, 158, 88, 157, 57);
  brain.bezierCurveTo(183, 48, 199, 14, 183, -14);
  brain.bezierCurveTo(198, -39, 187, -72, 160, -83);
  brain.bezierCurveTo(157, -114, 124, -137, 92, -128);
  brain.bezierCurveTo(66, -147, 24, -150, 0, -132);
  brain.closePath();

  context.fillStyle = "#fff";
  context.fill(brain);

  context.globalCompositeOperation = "destination-out";
  context.strokeStyle = "#000";
  context.lineCap = "round";
  context.lineJoin = "round";

  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(0, -134);
  context.bezierCurveTo(-5, -95, 5, -64, 0, -28);
  context.bezierCurveTo(-4, 6, 5, 31, 0, 58);
  context.stroke();

  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(0, 63);
  context.bezierCurveTo(-8, 82, -7, 101, 0, 116);
  context.stroke();

  const folds = [
    [-112, -101, -86, -118, -54, -106, -47, -82],
    [-149, -72, -116, -87, -80, -74, -71, -50],
    [-165, -31, -128, -48, -96, -34, -83, -7],
    [-162, 12, -129, -8, -92, 7, -81, 33],
    [-139, 55, -112, 34, -76, 49, -64, 75],
    [-105, 92, -81, 70, -52, 75, -35, 99],
    [-62, -126, -42, -109, -32, -82, -40, -59],
    [-52, -47, -34, -30, -32, -8, -43, 12],
    [-50, 26, -31, 42, -32, 63, -44, 79],
    [112, -101, 86, -118, 54, -106, 47, -82],
    [149, -72, 116, -87, 80, -74, 71, -50],
    [165, -31, 128, -48, 96, -34, 83, -7],
    [162, 12, 129, -8, 92, 7, 81, 33],
    [139, 55, 112, 34, 76, 49, 64, 75],
    [105, 92, 81, 70, 52, 75, 35, 99],
    [62, -126, 42, -109, 32, -82, 40, -59],
    [52, -47, 34, -30, 32, -8, 43, 12],
    [50, 26, 31, 42, 32, 63, 44, 79],
  ];

  context.lineWidth = 5.5;
  for (const [x1, y1, cx1, cy1, cx2, cy2, x2, y2] of folds) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
    context.stroke();
  }

  const shortFolds = [
    [-122, -8, -105, 5, -96, 20],
    [-104, -62, -88, -51, -84, -37],
    [-92, 58, -76, 67, -69, 85],
    [-30, -103, -22, -88, -26, -72],
    [-31, 7, -19, 19, -23, 36],
    [122, -8, 105, 5, 96, 20],
    [104, -62, 88, -51, 84, -37],
    [92, 58, 76, 67, 69, 85],
    [30, -103, 22, -88, 26, -72],
    [31, 7, 19, 19, 23, 36],
  ];

  context.lineWidth = 3.5;
  for (const [x1, y1, x2, y2, x3, y3] of shortFolds) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.quadraticCurveTo(x2, y2, x3, y3);
    context.stroke();
  }

  context.restore();
}

function buildBrain(width: number, height: number) {
  const mask = document.createElement("canvas");
  const maskWidth = 420;
  const maskHeight = 310;
  mask.width = maskWidth;
  mask.height = maskHeight;

  const maskContext = mask.getContext("2d");
  if (!maskContext) return [];

  drawBrainMask(maskContext, maskWidth, maskHeight);

  const pixels = maskContext.getImageData(0, 0, maskWidth, maskHeight).data;
  const points: BrainPoint[] = [];
  const step = 7;
  let sampleIndex = 0;

  const displayWidth = Math.min(width * 0.56, 525);
  const displayHeight = Math.min(height * 0.8, 340);
  const left = width / 2 - displayWidth / 2;
  const top = height / 2 - displayHeight / 2 - 5;

  const alphaAt = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= maskWidth || y >= maskHeight) return 0;
    return pixels[(Math.floor(y) * maskWidth + Math.floor(x)) * 4 + 3];
  };

  const edgeOffsets = [
    [-6, 0],
    [6, 0],
    [0, -6],
    [0, 6],
    [-4, -4],
    [4, -4],
    [-4, 4],
    [4, 4],
  ];

  for (let y = 4; y < maskHeight - 4; y += step) {
    for (let x = 4; x < maskWidth - 4; x += step) {
      if (alphaAt(x, y) < 100) continue;

      const edge = edgeOffsets.some(
        ([dx, dy]) => alphaAt(x + dx, y + dy) < 100,
      );

      const nx = (x - maskWidth / 2) / (maskWidth / 2);
      const ny = (y - maskHeight / 2) / (maskHeight / 2);
      const radial = clamp(1 - Math.sqrt(nx * nx + ny * ny));
      const shade = clamp(
        0.38 + radial * 0.34 + hash(sampleIndex + 313) * 0.28,
      );

      const jitterX = (hash(sampleIndex + 17) - 0.5) * 2.2;
      const jitterY = (hash(sampleIndex + 91) - 0.5) * 2.2;

      points.push({
        x: left + (x / maskWidth) * displayWidth + jitterX,
        y: top + (y / maskHeight) * displayHeight + jitterY,
        edge,
        shade,
      });

      sampleIndex += 1;
    }
  }

  return points;
}

function sizeForPoint(point: BrainPoint, index: number): GlyphSize {
  if (point.edge) {
    return hash(index + 401) > 0.42 ? "lg" : "md";
  }

  const sample = hash(index + 719);
  if (sample < 0.46) return "xs";
  if (sample < 0.78) return "sm";
  return "md";
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
        lane: index % 28,
        offset: (index * 19) % 340,
        target,
        char: index % 3 === 0 ? "1" : "0",
        gold: index % 101 === 0,
        phase: hash(index + 211) * Math.PI * 2,
        size: sizeForPoint(target, index),
        alphaBias: (target.shade - 0.5) * 0.24 + (target.edge ? 0.1 : -0.02),
      }));
    };

    const updateProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const viewport = window.innerHeight;

      // Hold the binary streams still until roughly 82% of the canvas is visible.
      const start = viewport - rect.height * 0.82;
      const end = Math.max(viewport * 0.16, start - viewport * 0.48);

      progressRef.current = reducedMotionRef.current
        ? 1
        : clamp((start - rect.top) / Math.max(1, start - end));
    };

    const draw = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const progress = progressRef.current;
      const streamPhase = ease(progress / 0.34);
      const formPhase = ease((progress - 0.1) / 0.82);

      context.clearRect(0, 0, width, height);
      context.textAlign = "center";
      context.textBaseline = "middle";

      if (formPhase > 0.42) {
        const glow = (formPhase - 0.42) / 0.58;
        const gradient = context.createRadialGradient(
          width / 2,
          height * 0.5,
          24,
          width / 2,
          height * 0.5,
          Math.min(width, 540) * 0.47,
        );
        gradient.addColorStop(0, `rgba(199,164,91,${0.038 * glow})`);
        gradient.addColorStop(0.44, `rgba(208,210,213,${0.032 * glow})`);
        gradient.addColorStop(1, "rgba(10,10,10,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }

      const fontFamily = window.getComputedStyle(document.body).fontFamily;
      const mobile = width < 720;
      const sizes: Array<[GlyphSize, number, number]> = [
        ["xs", mobile ? 5.5 : 6.5, 400],
        ["sm", mobile ? 7 : 8, 450],
        ["md", mobile ? 8.5 : 10, 500],
        ["lg", mobile ? 10 : 12, 600],
      ];

      for (const [tier, glyphSize, weight] of sizes) {
        context.font = `${weight} ${glyphSize}px ${fontFamily}`;

        for (let i = 0; i < particlesRef.current.length; i += 1) {
          const particle = particlesRef.current[i];
          if (particle.size !== tier) continue;

          const laneX = ((particle.lane + 0.5) / 28) * width;
          const travel =
            ((time * 0.029 + particle.offset) % (height + 230)) - 115;
          const streamY = lerp(
            -105 - particle.offset * 0.31,
            travel,
            streamPhase,
          );

          const stagger = (i % 43) / 43;
          const localForm = ease((formPhase - stagger * 0.1) / 0.9);

          const settledMotion =
            localForm > 0.97
              ? Math.sin(time * 0.00145 + particle.phase) * 0.35
              : 0;

          const x =
            lerp(laneX, particle.target.x, localForm) + settledMotion;
          const y =
            lerp(streamY, particle.target.y, localForm) +
            Math.cos(time * 0.0012 + particle.phase) * 0.2 * localForm;

          const sizeAlpha =
            tier === "xs" ? -0.12 : tier === "sm" ? -0.06 : tier === "lg" ? 0.08 : 0;
          const alpha = clamp(
            0.13 + 0.73 * localForm + particle.alphaBias + sizeAlpha,
            0.08,
            0.96,
          );

          context.fillStyle = particle.gold
            ? `rgba(222,193,121,${clamp(alpha + 0.08)})`
            : `rgba(208,211,216,${alpha})`;

          context.fillText(particle.char, x, y);
        }
      }

      if (visibleRef.current) {
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) wake();
      },
      {
        rootMargin: "0px",
        threshold: 0.08,
      },
    );

    const onResize = () => {
      rebuild();
      wake();
    };

    rebuild();
    updateProgress();
    observer.observe(wrap);
    frameRef.current = window.requestAnimationFrame(draw);

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="binary-brain" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="binary-brain-label">
        <span>binary stream</span>
        <i />
        <span>neural structure</span>
      </div>
    </div>
  );
}
