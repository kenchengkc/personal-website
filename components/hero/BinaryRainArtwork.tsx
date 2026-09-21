"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type GraphNode = {
  id: string;
  x: number;
  y: number;
  radius: number;
  accent?: boolean;
};

type GraphEdge = {
  from: string;
  to: string;
  bend: number;
  accent?: boolean;
};

type Particle = {
  char: "0" | "1";
  startX: number;
  startY: number;
  rainY: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
  delay: number;
  gold: boolean;
};

const hash = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const NODES: GraphNode[] = [
  { id: "s1", x: 22, y: 30, radius: 3.5 },
  { id: "s2", x: 18, y: 70, radius: 3.5 },
  { id: "s3", x: 26, y: 116, radius: 3.5 },
  { id: "s4", x: 20, y: 154, radius: 3.5 },

  { id: "p1", x: 78, y: 48, radius: 4 },
  { id: "p2", x: 84, y: 132, radius: 4 },

  { id: "h1", x: 138, y: 24, radius: 3.5 },
  { id: "hub", x: 146, y: 92, radius: 5.5, accent: true },
  { id: "h2", x: 132, y: 158, radius: 3.5 },

  { id: "r1", x: 208, y: 54, radius: 4 },
  { id: "r2", x: 214, y: 126, radius: 4 },

  { id: "o1", x: 284, y: 72, radius: 4.5, accent: true },
  { id: "o2", x: 292, y: 120, radius: 4.5 },
];

const EDGES: GraphEdge[] = [
  { from: "s1", to: "p1", bend: -12 },
  { from: "s2", to: "p1", bend: 9 },
  { from: "s2", to: "p2", bend: -9 },
  { from: "s3", to: "p2", bend: 11 },
  { from: "s4", to: "p2", bend: -8 },

  { from: "p1", to: "h1", bend: -15 },
  { from: "p1", to: "hub", bend: 10, accent: true },
  { from: "p2", to: "hub", bend: -11, accent: true },
  { from: "p2", to: "h2", bend: 15 },

  { from: "h1", to: "r1", bend: 12 },
  { from: "hub", to: "r1", bend: -8, accent: true },
  { from: "hub", to: "r2", bend: 10, accent: true },
  { from: "h2", to: "r2", bend: -12 },

  { from: "r1", to: "o1", bend: -10, accent: true },
  { from: "r1", to: "o2", bend: 15 },
  { from: "r2", to: "o1", bend: -16 },
  { from: "r2", to: "o2", bend: 8, accent: true },

  { from: "h1", to: "hub", bend: 9 },
  { from: "hub", to: "h2", bend: -10 },
  { from: "r1", to: "r2", bend: 11 },
];

const getNode = (id: string) => {
  const node = NODES.find((candidate) => candidate.id === id);
  if (!node) {
    throw new Error(`Missing graph node: ${id}`);
  }
  return node;
};

const getControlPoint = (from: GraphNode, to: GraphNode, bend: number) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, Math.hypot(dx, dy));

  return {
    x: midX - (dy / length) * bend,
    y: midY + (dx / length) * bend,
  };
};

const pointOnCurve = (
  from: GraphNode,
  to: GraphNode,
  bend: number,
  t: number,
) => {
  const control = getControlPoint(from, to, bend);
  const inverse = 1 - t;

  return {
    x:
      inverse * inverse * from.x +
      2 * inverse * t * control.x +
      t * t * to.x,
    y:
      inverse * inverse * from.y +
      2 * inverse * t * control.y +
      t * t * to.y,
  };
};

const buildTargets = () => {
  const targets: Array<{
    x: number;
    y: number;
    gold: boolean;
    weight: "small" | "medium" | "large";
  }> = [];

  for (const edge of EDGES) {
    const from = getNode(edge.from);
    const to = getNode(edge.to);
    const steps = edge.accent ? 10 : 7;

    for (let index = 1; index < steps; index += 1) {
      const point = pointOnCurve(from, to, edge.bend, index / steps);

      targets.push({
        x: point.x,
        y: point.y,
        gold: Boolean(edge.accent && index > 2 && index < steps - 2),
        weight: edge.accent ? "medium" : "small",
      });
    }
  }

  for (const node of NODES) {
    const ringCount = node.accent ? 11 : 7;

    for (let index = 0; index < ringCount; index += 1) {
      if (index === 0) {
        targets.push({
          x: node.x,
          y: node.y,
          gold: Boolean(node.accent),
          weight: node.accent ? "large" : "medium",
        });
        continue;
      }

      const angle = ((index - 1) / (ringCount - 1)) * Math.PI * 2;
      const radius = node.accent ? 7 : 4.5;

      targets.push({
        x: node.x + Math.cos(angle) * radius,
        y: node.y + Math.sin(angle) * radius,
        gold: Boolean(node.accent && index % 3 === 0),
        weight: node.accent ? "medium" : "small",
      });
    }
  }

  const latentCloud = [
    [111, 64],
    [122, 78],
    [116, 104],
    [129, 118],
    [164, 54],
    [174, 72],
    [168, 110],
    [180, 132],
    [186, 88],
    [98, 92],
  ];

  for (const [x, y] of latentCloud) {
    targets.push({
      x,
      y,
      gold: false,
      weight: "small",
    });
  }

  return targets;
};

const TARGETS = buildTargets();

const RAIN_LANES = [5, 11, 18, 27, 39, 51, 64, 76, 87, 95];

const PARTICLES: Particle[] = TARGETS.map((target, index) => {
  const lane = RAIN_LANES[index % RAIN_LANES.length];
  const laneJitter = (hash(index + 17) - 0.5) * 5.5;
  const startY = -12 - hash(index + 23) * 34;

  const size =
    target.weight === "large"
      ? 10.2 + hash(index + 31) * 1.8
      : target.weight === "medium"
        ? 7.3 + hash(index + 43) * 1.7
        : 5.2 + hash(index + 59) * 1.3;

  const alpha =
    target.weight === "large"
      ? 0.92
      : target.weight === "medium"
        ? 0.7
        : 0.42;

  return {
    char: index % 3 === 0 ? "1" : "0",
    startX: lane + laneJitter,
    startY,
    rainY: 18 + hash(index + 71) * 76,
    targetX: target.x,
    targetY: target.y,
    size,
    alpha,
    delay: hash(index + 89) * 0.58,
    gold: target.gold,
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

  const paths = useMemo(
    () =>
      EDGES.map((edge) => {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        const control = getControlPoint(from, to, edge.bend);

        return {
          key: `${edge.from}-${edge.to}`,
          d: `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`,
          accent: Boolean(edge.accent),
        };
      }),
    [],
  );

  return (
    <div
      ref={ref}
      className={[
        "hero-binary-art",
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
            className={particle.gold ? "hero-binary-bit is-gold" : "hero-binary-bit"}
            key={index}
            style={
              {
                "--sx": `${particle.startX}%`,
                "--sy": `${particle.startY}%`,
                "--ry": `${particle.rainY}%`,
                "--tx": `${particle.targetX}px`,
                "--ty": `${particle.targetY}px`,
                "--bit-size": `${particle.size}px`,
                "--bit-alpha": particle.alpha,
                "--bit-delay": `${particle.delay}s`,
              } as CSSProperties
            }
          >
            {particle.char}
          </span>
        ))}
      </div>

      <svg className="hero-graph-art" viewBox="0 0 320 180" role="presentation">
        {paths.map((path) => (
          <path
            className={
              path.accent ? "graph-path graph-path-accent" : "graph-path"
            }
            d={path.d}
            key={path.key}
            pathLength="1"
          />
        ))}

        {NODES.map((node) => (
          <circle
            className={
              node.accent ? "graph-node graph-node-accent" : "graph-node"
            }
            cx={node.x}
            cy={node.y}
            key={node.id}
            r={node.radius}
          />
        ))}
      </svg>
    </div>
  );
}
