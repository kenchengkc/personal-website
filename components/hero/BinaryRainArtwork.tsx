"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Point = {
  x: number;
  y: number;
};

type BrainCurve = {
  from: Point;
  control: Point;
  to: Point;
  role: "outline" | "fold" | "stem";
  accent?: boolean;
};

type Target = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  gold: boolean;
  role: BrainCurve["role"];
  pulseDelay: number;
};

type Particle = Target & {
  char: "0" | "1";
  startX: number;
  startY: number;
  rainY: number;
  delay: number;
};

const hash = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const BRAIN_CURVES: BrainCurve[] = [
  // Outer silhouette: lateral brain profile with distinct lobe bumps.
  { from: { x: 16, y: 58 }, control: { x: 11, y: 49 }, to: { x: 16, y: 39 }, role: "outline" },
  { from: { x: 16, y: 39 }, control: { x: 18, y: 28 }, to: { x: 27, y: 23 }, role: "outline" },
  { from: { x: 27, y: 23 }, control: { x: 31, y: 14 }, to: { x: 41, y: 16 }, role: "outline" },
  { from: { x: 41, y: 16 }, control: { x: 48, y: 9 }, to: { x: 57, y: 15 }, role: "outline" },
  { from: { x: 57, y: 15 }, control: { x: 67, y: 12 }, to: { x: 73, y: 21 }, role: "outline" },
  { from: { x: 73, y: 21 }, control: { x: 82, y: 23 }, to: { x: 82, y: 34 }, role: "outline" },
  { from: { x: 82, y: 34 }, control: { x: 89, y: 41 }, to: { x: 84, y: 51 }, role: "outline" },
  { from: { x: 84, y: 51 }, control: { x: 89, y: 60 }, to: { x: 81, y: 67 }, role: "outline" },
  { from: { x: 81, y: 67 }, control: { x: 79, y: 77 }, to: { x: 69, y: 77 }, role: "outline" },
  { from: { x: 69, y: 77 }, control: { x: 63, y: 84 }, to: { x: 55, y: 77 }, role: "outline" },
  { from: { x: 55, y: 77 }, control: { x: 48, y: 82 }, to: { x: 40, y: 79 }, role: "outline" },
  { from: { x: 40, y: 79 }, control: { x: 30, y: 84 }, to: { x: 23, y: 75 }, role: "outline" },
  { from: { x: 23, y: 75 }, control: { x: 14, y: 72 }, to: { x: 17, y: 63 }, role: "outline" },
  { from: { x: 17, y: 63 }, control: { x: 12, y: 61 }, to: { x: 16, y: 58 }, role: "outline" },

  // Major cortical folds, intentionally sparse and rounded.
  { from: { x: 24, y: 38 }, control: { x: 29, y: 27 }, to: { x: 38, y: 31 }, role: "fold" },
  { from: { x: 34, y: 20 }, control: { x: 32, y: 32 }, to: { x: 37, y: 41 }, role: "fold" },
  { from: { x: 49, y: 17 }, control: { x: 44, y: 29 }, to: { x: 48, y: 40 }, role: "fold" },
  { from: { x: 62, y: 20 }, control: { x: 70, y: 25 }, to: { x: 68, y: 35 }, role: "fold" },
  { from: { x: 72, y: 29 }, control: { x: 78, y: 32 }, to: { x: 75, y: 40 }, role: "fold" },
  { from: { x: 22, y: 51 }, control: { x: 27, y: 42 }, to: { x: 35, y: 47 }, role: "fold" },
  { from: { x: 34, y: 45 }, control: { x: 42, y: 37 }, to: { x: 47, y: 47 }, role: "fold" },
  { from: { x: 49, y: 45 }, control: { x: 57, y: 35 }, to: { x: 65, y: 43 }, role: "fold", accent: true },
  { from: { x: 65, y: 43 }, control: { x: 75, y: 40 }, to: { x: 77, y: 51 }, role: "fold", accent: true },
  { from: { x: 24, y: 62 }, control: { x: 37, y: 53 }, to: { x: 51, y: 57 }, role: "fold" },
  { from: { x: 50, y: 57 }, control: { x: 60, y: 64 }, to: { x: 66, y: 52 }, role: "fold", accent: true },
  { from: { x: 33, y: 68 }, control: { x: 41, y: 73 }, to: { x: 49, y: 66 }, role: "fold" },
  { from: { x: 64, y: 65 }, control: { x: 72, y: 61 }, to: { x: 76, y: 68 }, role: "fold" },

  // Brainstem.
  { from: { x: 54, y: 77 }, control: { x: 56, y: 88 }, to: { x: 59, y: 95 }, role: "stem" },
  { from: { x: 59, y: 95 }, control: { x: 64, y: 91 }, to: { x: 62, y: 79 }, role: "stem" },
];

const MESH_NODES: Point[] = [
  { x: 29, y: 36 },
  { x: 42, y: 27 },
  { x: 56, y: 29 },
  { x: 70, y: 36 },
  { x: 33, y: 53 },
  { x: 49, y: 47 },
  { x: 65, y: 50 },
  { x: 35, y: 68 },
  { x: 51, y: 65 },
  { x: 67, y: 66 },
];

const MESH_EDGES: Array<[number, number, boolean]> = [
  [0, 1, false],
  [1, 2, false],
  [2, 3, false],
  [0, 4, false],
  [1, 5, false],
  [2, 5, true],
  [2, 6, false],
  [3, 6, false],
  [4, 5, false],
  [5, 6, true],
  [4, 7, false],
  [4, 8, false],
  [5, 8, true],
  [6, 8, false],
  [6, 9, false],
  [7, 8, false],
  [8, 9, false],
];

const pointOnCurve = (curve: BrainCurve, t: number) => {
  const inverse = 1 - t;

  return {
    x:
      inverse * inverse * curve.from.x +
      2 * inverse * t * curve.control.x +
      t * t * curve.to.x,
    y:
      inverse * inverse * curve.from.y +
      2 * inverse * t * curve.control.y +
      t * t * curve.to.y,
  };
};

const buildTargets = () => {
  const targets: Target[] = [];

  BRAIN_CURVES.forEach((curve, curveIndex) => {
    const steps =
      curve.role === "outline"
        ? 18
        : curve.role === "stem"
          ? 13
          : 12;

    for (let index = 0; index <= steps; index += 1) {
      const t = index / steps;
      const point = pointOnCurve(curve, t);
      const outline = curve.role === "outline";
      const stem = curve.role === "stem";
      const accent = Boolean(curve.accent && t > 0.12 && t < 0.9);

      targets.push({
        x: point.x,
        y: point.y,
        size: outline
          ? 7.2 + hash(curveIndex * 97 + index + 11) * 1.5
          : stem
            ? 6.4 + hash(curveIndex * 101 + index + 17) * 1.3
            : 5.5 + hash(curveIndex * 103 + index + 23) * 1.2,
        alpha: outline ? 0.78 : stem ? 0.64 : 0.52,
        gold: accent,
        role: curve.role,
        pulseDelay: accent ? 0.3 + point.x / 100 * 1.2 : 0,
      });
    }
  });

  return targets;
};

const TARGETS = buildTargets();

const RAIN_LANES = [4, 10, 17, 25, 34, 44, 55, 66, 76, 85, 93, 98];

const PARTICLES: Particle[] = TARGETS.map((target, index) => {
  const lane = RAIN_LANES[index % RAIN_LANES.length];

  return {
    ...target,
    char: index % 3 === 0 ? "1" : "0",
    startX: lane + (hash(index + 31) - 0.5) * 4.5,
    startY: -10 - hash(index + 47) * 42,
    rainY: 12 + hash(index + 59) * 82,
    delay: hash(index + 71) * 0.58,
  };
});

export function BinaryRainArtwork() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setActive(true);
      setComplete(true);
      return;
    }

    let timer = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();
        setActive(true);
        timer = window.setTimeout(() => setComplete(true), 3300);
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -2% 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "hero-binary-art",
        "hero-binary-brain",
        active ? "is-active" : "",
        complete ? "is-complete" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="hero-brain-stage">
        <div className="hero-binary-rain">
          {PARTICLES.map((particle, index) => (
          <span
            className={[
              "hero-binary-bit",
              `is-${particle.role}`,
              particle.gold ? "is-gold is-signal" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={index}
            style={
              {
                "--sx": `${particle.startX}%`,
                "--sy": `${particle.startY}%`,
                "--ry": `${particle.rainY}%`,
                "--tx": `${particle.x}%`,
                "--ty": `${particle.y}%`,
                "--bit-size": `${particle.size}px`,
                "--bit-alpha": particle.alpha,
                "--bit-delay": `${particle.delay}s`,
                "--pulse-delay": `${particle.pulseDelay}s`,
              } as CSSProperties
            }
          >
            {particle.char}
          </span>
          ))}
        </div>

        <svg
          className="hero-brain-mesh"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="presentation"
      >
        {MESH_EDGES.map(([from, to, accent], index) => (
          <line
            className={accent ? "brain-mesh-edge is-accent" : "brain-mesh-edge"}
            key={`${from}-${to}-${index}`}
            x1={MESH_NODES[from].x}
            y1={MESH_NODES[from].y}
            x2={MESH_NODES[to].x}
            y2={MESH_NODES[to].y}
          />
        ))}

          {MESH_NODES.map((node, index) => (
            <circle
              className={index === 5 || index === 8 ? "brain-mesh-node is-accent" : "brain-mesh-node"}
              cx={node.x}
              cy={node.y}
              key={`${node.x}-${node.y}`}
              r={index === 5 || index === 8 ? 0.62 : 0.44}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
