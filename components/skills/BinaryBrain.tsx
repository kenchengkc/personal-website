"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

type Particle = {
  lane: number;
  offset: number;
  target: Point;
  char: "0" | "1";
  gold: boolean;
  phase: number;
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

function drawBrainMask(context: CanvasRenderingContext2D, width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2 + 4;
  const sx = width / 420;
  const sy = height / 310;

  context.save();
  context.translate(cx, cy);
  context.scale(sx, sy);

  const brain = new Path2D();
  brain.moveTo(0, -132);

  // Left hemisphere: rounded frontal/parietal lobes with a temporal bulge.
  brain.bezierCurveTo(-24, -150, -66, -147, -92, -128);
  brain.bezierCurveTo(-124, -137, -157, -114, -160, -83);
  brain.bezierCurveTo(-187, -72, -198, -39, -183, -14);
  brain.bezierCurveTo(-199, 14, -183, 48, -157, 57);
  brain.bezierCurveTo(-158, 88, -126, 111, -96, 107);
  brain.bezierCurveTo(-75, 133, -35, 134, -13, 111);
  brain.bezierCurveTo(-4, 98, -2, 78, 0, 62);

  // Right hemisphere.
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
  context.lineCap = "round";
  context.lineJoin = "round";

  // Longitudinal fissure.
  context.strokeStyle = "#000";
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(0, -134);
  context.bezierCurveTo(-5, -95, 5, -64, 0, -28);
  context.bezierCurveTo(-4, 6, 5, 31, 0, 58);
  context.stroke();

  // Lower central notch makes the two hemispheres unmistakable.
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(0, 63);
  context.bezierCurveTo(-8, 82, -7, 101, 0, 116);
  context.stroke();

  // Major sulci. These negative-space folds are what make the silhouette read as a brain.
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

  // A few shorter secondary folds avoid an overly geometric look.
  context.lineWidth = 3.5;
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
  const points: Point[] = [];
  const step = 9;
  let sampleIndex = 0;

  const displayWidth = Math.min(width * 0.54, 510);
  const displayHeight = Math.min(height * 0.78, 330);
  const left = width / 2 - displayWidth / 2;
  const top = height / 2 - displayHeight / 2 - 6;

  for (let y = 5; y < maskHeight - 5; y += step) {
    for (let x = 5; x < maskWidth - 5; x += step) {
      const pixel = (y * maskWidth + x) * 4;
      if (pixels[pixel + 3] < 100) continue;

      const jitterX = (hash(sampleIndex + 17) - 0.5) * 2.5;
      const jitterY = (hash(sampleIndex + 91) - 0.5) * 2.5;

      points.push({
        x: left + (x / maskWidth) * displayWidth + jitterX,
        y: top + (y / maskHeight) * displayHeight + jitterY,
      });

      sampleIndex += 1;
    }
  }

  return points;
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
        lane: index % 24,
        offset: (index * 23) % 310,
        target,
        char: index % 3 === 0 ? "1" : "0",
        gold: index % 67 === 0,
        phase: hash(index + 211) * Math.PI * 2,
      }));
    };

    const updateProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.93;
      const end = viewport * 0.18;
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
      const streamPhase = ease(progress / 0.32);
      const formPhase = ease((progress - 0.12) / 0.78);

      context.clearRect(0, 0, width, height);
      const fontFamily = window.getComputedStyle(document.body).fontFamily;
      const glyphSize = width < 720 ? 9 : 10;
      context.font = `500 ${glyphSize}px ${fontFamily}`;
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
          Math.min(width, 520) * 0.46,
        );
        gradient.addColorStop(0, `rgba(199,164,91,${0.04 * glow})`);
        gradient.addColorStop(0.42, `rgba(208,210,213,${0.032 * glow})`);
        gradient.addColorStop(1, "rgba(10,10,10,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < particlesRef.current.length; i += 1) {
        const particle = particlesRef.current[i];
        const laneX = ((particle.lane + 0.5) / 24) * width;
        const travel =
          ((time * 0.03 + particle.offset) % (height + 220)) - 110;
        const streamY = lerp(-90 - particle.offset * 0.34, travel, streamPhase);

        const stagger = (i % 37) / 37;
        const localForm = ease((formPhase - stagger * 0.12) / 0.88);

        // The final structure stays alive like the reference point cloud,
        // but only with a sub-pixel shimmer so the anatomy remains readable.
        const settledMotion = localForm > 0.96
          ? Math.sin(time * 0.0015 + particle.phase) * 0.45
          : 0;

        const x =
          lerp(laneX, particle.target.x, localForm) + settledMotion;
        const y =
          lerp(streamY, particle.target.y, localForm) +
          Math.cos(time * 0.0013 + particle.phase) * 0.28 * localForm;

        const baseAlpha = 0.14 + 0.76 * localForm;
        context.fillStyle = particle.gold
          ? `rgba(222,193,121,${0.22 + 0.68 * localForm})`
          : `rgba(208,211,216,${baseAlpha})`;

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
