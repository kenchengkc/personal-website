"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type Point = {
  x: number;
  y: number;
};

type Triangle = readonly [number, number, number];

type Particle = {
  char: "0" | "1";
  startX: number;
  startY: number;
  rainY: number;
  targetX: number;
  targetY: number;
  size: number;
  delay: number;
  accent: boolean;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 600;

const hash = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const BRAIN_PATH =
  "M145 320 C105 300 108 245 165 220 C170 168 220 145 275 155 C310 95 370 92 405 142 C448 85 510 92 535 150 C585 102 650 118 665 175 C725 145 785 180 780 235 C845 240 870 295 830 335 C865 385 830 435 770 430 C748 485 690 495 650 450 C615 492 555 492 520 445 C475 505 405 500 375 450 C330 485 270 465 260 420 C205 445 160 415 175 370 C125 365 115 335 145 320 Z";

const CEREBELLUM_PATH =
  "M635 440 C690 420 755 440 748 482 C745 530 665 540 620 500 C600 475 605 448 635 440 Z";

const STEM_PATH =
  "M525 438 C525 500 545 545 575 565 C615 542 625 500 610 455 C580 470 550 466 525 438 Z";

const MESH_NODES: Point[] = [
  { x: 165, y: 305 },
  { x: 185, y: 235 },
  { x: 250, y: 175 },
  { x: 340, y: 130 },
  { x: 440, y: 118 },
  { x: 540, y: 132 },
  { x: 640, y: 160 },
  { x: 735, y: 205 },
  { x: 805, y: 275 },
  { x: 815, y: 350 },
  { x: 770, y: 420 },
  { x: 680, y: 455 },
  { x: 600, y: 446 },
  { x: 515, y: 470 },
  { x: 425, y: 468 },
  { x: 340, y: 452 },
  { x: 260, y: 418 },
  { x: 198, y: 365 },

  { x: 245, y: 285 },
  { x: 315, y: 220 },
  { x: 405, y: 190 },
  { x: 500, y: 190 },
  { x: 595, y: 205 },
  { x: 690, y: 245 },

  { x: 245, y: 350 },
  { x: 340, y: 310 },
  { x: 435, y: 285 },
  { x: 530, y: 290 },
  { x: 625, y: 305 },
  { x: 715, y: 335 },

  { x: 315, y: 395 },
  { x: 405, y: 365 },
  { x: 500, y: 355 },
  { x: 590, y: 375 },
  { x: 675, y: 395 },

  { x: 645, y: 458 },
  { x: 710, y: 468 },
  { x: 720, y: 505 },
  { x: 660, y: 520 },

  { x: 545, y: 462 },
  { x: 560, y: 515 },
  { x: 580, y: 548 },
  { x: 607, y: 495 },
];

const TRIANGLES: Triangle[] = [
  [0, 1, 18], [0, 18, 24], [0, 24, 17],
  [1, 2, 19], [1, 19, 18],
  [2, 3, 19], [3, 20, 19], [3, 4, 20],
  [4, 21, 20], [4, 5, 21], [5, 22, 21],
  [5, 6, 22], [6, 23, 22], [6, 7, 23],
  [7, 8, 23], [8, 29, 23], [8, 9, 29],
  [9, 10, 29], [10, 34, 29], [10, 11, 34],
  [11, 12, 34], [12, 33, 34], [12, 13, 33],
  [13, 32, 33], [13, 14, 32], [14, 31, 32],
  [14, 15, 31], [15, 30, 31], [15, 16, 30],
  [16, 24, 30], [16, 17, 24],

  [18, 19, 25], [18, 25, 24],
  [19, 20, 26], [19, 26, 25],
  [20, 21, 26], [21, 27, 26],
  [21, 22, 27], [22, 28, 27],
  [22, 23, 28], [23, 29, 28],

  [24, 25, 30], [25, 31, 30],
  [25, 26, 31], [26, 32, 31],
  [26, 27, 32], [27, 33, 32],
  [27, 28, 33], [28, 34, 33],
  [28, 29, 34],

  [11, 35, 34], [35, 36, 34], [36, 37, 34],
  [35, 37, 38], [35, 38, 12],

  [13, 39, 32], [39, 40, 32], [40, 41, 32],
  [39, 42, 40], [39, 12, 42],
];

const faceCenter = (triangle: Triangle) => {
  const [a, b, c] = triangle.map((index) => MESH_NODES[index]);

  return {
    x: (a.x + b.x + c.x) / 3,
    y: (a.y + b.y + c.y) / 3,
  };
};

const edgeKey = (a: number, b: number) =>
  a < b ? `${a}-${b}` : `${b}-${a}`;

const MESH_EDGES = Array.from(
  TRIANGLES.reduce((edges, [a, b, c]) => {
    edges.add(edgeKey(a, b));
    edges.add(edgeKey(b, c));
    edges.add(edgeKey(c, a));
    return edges;
  }, new Set<string>()),
).map((key) => key.split("-").map(Number) as [number, number]);

const toPercent = (point: Point) => ({
  x: (point.x / VIEWBOX_WIDTH) * 100,
  y: (point.y / VIEWBOX_HEIGHT) * 100,
});

const PARTICLE_TARGETS = [
  ...MESH_NODES.map((point, index) => ({
    point,
    accent: index === 21 || index === 27 || index === 32 || index === 33,
  })),
  ...TRIANGLES.filter((_, index) => index % 2 === 0).map((triangle, index) => ({
    point: faceCenter(triangle),
    accent: index % 9 === 4,
  })),
  ...MESH_EDGES.filter((_, index) => index % 3 === 0).map(([a, b], index) => ({
    point: {
      x: (MESH_NODES[a].x + MESH_NODES[b].x) / 2,
      y: (MESH_NODES[a].y + MESH_NODES[b].y) / 2,
    },
    accent: index % 13 === 6,
  })),
];

const RAIN_LANES = [3, 8, 13, 19, 26, 34, 43, 52, 61, 70, 79, 87, 94, 98];

const PARTICLES: Particle[] = PARTICLE_TARGETS.map((target, index) => {
  const lane = RAIN_LANES[index % RAIN_LANES.length];
  const percent = toPercent(target.point);

  return {
    char: index % 3 === 0 ? "1" : "0",
    startX: lane + (hash(index + 17) - 0.5) * 4.4,
    startY: -12 - hash(index + 31) * 42,
    rainY: 12 + hash(index + 47) * 82,
    targetX: percent.x,
    targetY: percent.y,
    size: 5.3 + hash(index + 59) * 2,
    delay: hash(index + 71) * 0.6,
    accent: target.accent,
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

  const accentFaces = useMemo(
    () => new Set([5, 14, 22, 35, 41, 47, 52]),
    [],
  );
  const filledFaces = useMemo(
    () => new Set([3, 8, 12, 18, 25, 31, 37, 43, 49, 55]),
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
      <div className="hero-brain-stage">
        <div className="hero-binary-rain">
          {PARTICLES.map((particle, index) => (
            <span
              className={[
                "hero-binary-bit",
                particle.accent ? "is-gold" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={index}
              style={
                {
                  "--sx": `${particle.startX}%`,
                  "--sy": `${particle.startY}%`,
                  "--ry": `${particle.rainY}%`,
                  "--tx": `${particle.targetX}%`,
                  "--ty": `${particle.targetY}%`,
                  "--bit-size": `${particle.size}px`,
                  "--bit-delay": `${particle.delay}s`,
                } as CSSProperties
              }
            >
              {particle.char}
            </span>
          ))}
        </div>

        <svg
          className="hero-brain-mesh"
          viewBox="0 0 1000 600"
          role="presentation"
        >
          <defs>
            <clipPath id="brain-cortex-clip">
              <path d={BRAIN_PATH} />
            </clipPath>
          </defs>

          <g clipPath="url(#brain-cortex-clip)">
            <path className="brain-mesh-fill" d={BRAIN_PATH} />

            {TRIANGLES.map((triangle, index) => (
              <polygon
                className={[
                  "brain-mesh-face",
                  filledFaces.has(index) ? "is-filled" : "",
                  accentFaces.has(index) ? "is-accent" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={triangle.join("-")}
                points={triangle
                  .map((nodeIndex) => {
                    const node = MESH_NODES[nodeIndex];
                    return `${node.x},${node.y}`;
                  })
                  .join(" ")}
              />
            ))}

            {MESH_EDGES.map(([a, b], index) => (
              <line
                className={
                  index % 17 === 8
                    ? "brain-mesh-edge is-accent"
                    : "brain-mesh-edge"
                }
                key={`${a}-${b}`}
                x1={MESH_NODES[a].x}
                y1={MESH_NODES[a].y}
                x2={MESH_NODES[b].x}
                y2={MESH_NODES[b].y}
              />
            ))}

            {MESH_NODES.map((node, index) => (
              <circle
                className={
                  index === 21 || index === 27 || index === 32
                    ? "brain-mesh-node is-accent"
                    : "brain-mesh-node"
                }
                cx={node.x}
                cy={node.y}
                key={`${node.x}-${node.y}`}
                r={index === 21 || index === 27 || index === 32 ? 5 : 3.2}
              />
            ))}
          </g>

          <path className="brain-mesh-outline" d={BRAIN_PATH} />
          <path className="brain-mesh-outline is-secondary" d={CEREBELLUM_PATH} />
          <path className="brain-mesh-outline is-secondary" d={STEM_PATH} />
        </svg>
      </div>
    </div>
  );
}
