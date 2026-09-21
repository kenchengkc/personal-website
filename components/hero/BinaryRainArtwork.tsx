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
  // Outer silhouette, based on a recognizable lateral brain profile.
  { from: { x: 18, y: 60 }, control: { x: 13, y: 48 }, to: { x: 19, y: 34 }, role: "outline" },
  { from: { x: 19, y: 34 }, control: { x: 25, y: 20 }, to: { x: 37, y: 17 }, role: "outline" },
  { from: { x: 37, y: 17 }, control: { x: 48, y: 8 }, to: { x: 59, y: 15 }, role: "outline" },
  { from: { x: 59, y: 15 }, control: { x: 72, y: 13 }, to: { x: 80, y: 25 }, role: "outline" },
  { from: { x: 80, y: 25 }, control: { x: 88, y: 35 }, to: { x: 84, y: 48 }, role: "outline" },
  { from: { x: 84, y: 48 }, control: { x: 89, y: 59 }, to: { x: 80, y: 68 }, role: "outline" },
  { from: { x: 80, y: 68 }, control: { x: 76, y: 77 }, to: { x: 66, y: 78 }, role: "outline" },
  { from: { x: 66, y: 78 }, control: { x: 59, y: 83 }, to: { x: 52, y: 76 }, role: "outline" },
  { from: { x: 52, y: 76 }, control: { x: 43, y: 78 }, to: { x: 36, y: 83 }, role: "outline" },
  { from: { x: 36, y: 83 }, control: { x: 24, y: 84 }, to: { x: 18, y: 72 }, role: "outline" },
  { from: { x: 18, y: 72 }, control: { x: 14, y: 67 }, to: { x: 18, y: 60 }, role: "outline" },

  // Major folds. These are intentionally sparse, like the simple reference drawing.
  { from: { x: 27, y: 35 }, control: { x: 34, y: 22 }, to: { x: 44, y: 27 }, role: "fold" },
  { from: { x: 39, y: 18 }, control: { x: 36, y: 31 }, to: { x: 41, y: 40 }, role: "fold" },
  { from: { x: 55, y: 17 }, control: { x: 49, y: 27 }, to: { x: 53, y: 39 }, role: "fold" },
  { from: { x: 69, y: 23 }, control: { x: 77, y: 28 }, to: { x: 76, y: 38 }, role: "fold" },
  { from: { x: 22, y: 52 }, control: { x: 29, y: 42 }, to: { x: 37, y: 48 }, role: "fold" },
  { from: { x: 35, y: 43 }, control: { x: 41, y: 37 }, to: { x: 46, y: 46 }, role: "fold" },
  { from: { x: 48, y: 44 }, control: { x: 57, y: 34 }, to: { x: 66, y: 42 }, role: "fold", accent: true },
  { from: { x: 65, y: 44 }, control: { x: 76, y: 40 }, to: { x: 79, y: 53 }, role: "fold", accent: true },
  { from: { x: 27, y: 63 }, control: { x: 42, y: 52 }, to: { x: 56, y: 57 }, role: "fold" },
  { from: { x: 56, y: 57 }, control: { x: 67, y: 61 }, to: { x: 71, y: 49 }, role: "fold", accent: true },
  { from: { x: 36, y: 69 }, control: { x: 45, y: 73 }, to: { x: 51, y: 66 }, role: "fold" },
  { from: { x: 67, y: 65 }, control: { x: 76, y: 62 }, to: { x: 79, y: 70 }, role: "fold" },

  // Brainstem, separate from the cortex silhouette.
  { from: { x: 55, y: 77 }, control: { x: 57, y: 88 }, to: { x: 59, y: 94 }, role: "stem" },
  { from: { x: 59, y: 94 }, control: { x: 64, y: 92 }, to: { x: 63, y: 80 }, role: "stem" },
];

const MESH_NODES: Point[] = [
  { x: 25, y: 38 },
  { x: 33, y: 27 },
  { x: 43, y: 22 },
  { x: 54, y: 22 },
  { x: 65, y: 25 },
  { x: 75, y: 32 },
  { x: 29, y: 51 },
  { x: 40, y: 42 },
  { x: 51, y: 43 },
  { x: 62, y: 41 },
  { x: 73, y: 47 },
  { x: 27, y: 65 },
  { x: 38, y: 61 },
  { x: 49, y: 60 },
  { x: 60, y: 59 },
  { x: 72, y: 62 },
  { x: 39, y: 75 },
  { x: 51, y: 70 },
  { x: 63, y: 72 },
];

const MESH_EDGES: Array<[number, number, boolean]> = [
  [0, 1, false], [1, 2, false], [2, 3, false], [3, 4, false], [4, 5, false],
  [0, 6, false], [1, 7, false], [2, 7, false], [2, 8, false], [3, 8, false],
  [3, 9, true], [4, 9, false], [4, 10, false], [5, 10, false],
  [6, 7, false], [7, 8, false], [8, 9, true], [9, 10, true],
  [6, 11, false], [6, 12, false], [7, 12, false], [7, 13, false],
  [8, 13, true], [8, 14, true], [9, 14, true], [9, 15, false], [10, 15, false],
  [11, 12, false], [12, 13, false], [13, 14, true], [14, 15, false],
  [12, 16, false], [12, 17, false], [13, 17, false], [14, 17, true],
  [14, 18, false], [15, 18, false], [16, 17, false], [17, 18, false],
];

const FACETS = [
  [7, 8, 13],
  [8, 9, 14],
  [12, 13, 17],
  [9, 14, 15],
] as const;

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

const polygonPoints = (indices: readonly number[]) =>
  indices.map((index) => `${MESH_NODES[index].x},${MESH_NODES[index].y}`).join(" ");

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
        {FACETS.map((facet, index) => (
          <polygon
            className={index === 1 ? "brain-facet is-accent" : "brain-facet"}
            key={facet.join("-")}
            points={polygonPoints(facet)}
          />
        ))}

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
            className={index === 8 || index === 14 ? "brain-mesh-node is-accent" : "brain-mesh-node"}
            cx={node.x}
            cy={node.y}
            key={`${node.x}-${node.y}`}
            r={index === 8 || index === 14 ? 0.7 : 0.48}
          />
        ))}
      </svg>
    </div>
  );
}
