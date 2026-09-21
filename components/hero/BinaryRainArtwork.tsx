"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Point = {
  x: number;
  y: number;
};

type CurveRole = "outline" | "fold" | "stem" | "cerebellum";

type CubicCurve = {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
  role: CurveRole;
  accent?: boolean;
};

type Target = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  gold: boolean;
  role: CurveRole;
  pulseDelay: number;
};

type Particle = Target & {
  char: "0" | "1";
  startX: number;
  startY: number;
  rainY: number;
  delay: number;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 600;

const hash = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const OUTLINE_CURVES: CubicCurve[] = [
  {
    p0: { x: 145, y: 320 },
    p1: { x: 105, y: 300 },
    p2: { x: 108, y: 245 },
    p3: { x: 165, y: 220 },
    role: "outline",
  },
  {
    p0: { x: 165, y: 220 },
    p1: { x: 170, y: 168 },
    p2: { x: 220, y: 145 },
    p3: { x: 275, y: 155 },
    role: "outline",
  },
  {
    p0: { x: 275, y: 155 },
    p1: { x: 310, y: 95 },
    p2: { x: 370, y: 92 },
    p3: { x: 405, y: 142 },
    role: "outline",
  },
  {
    p0: { x: 405, y: 142 },
    p1: { x: 448, y: 85 },
    p2: { x: 510, y: 92 },
    p3: { x: 535, y: 150 },
    role: "outline",
  },
  {
    p0: { x: 535, y: 150 },
    p1: { x: 585, y: 102 },
    p2: { x: 650, y: 118 },
    p3: { x: 665, y: 175 },
    role: "outline",
  },
  {
    p0: { x: 665, y: 175 },
    p1: { x: 725, y: 145 },
    p2: { x: 785, y: 180 },
    p3: { x: 780, y: 235 },
    role: "outline",
  },
  {
    p0: { x: 780, y: 235 },
    p1: { x: 845, y: 240 },
    p2: { x: 870, y: 295 },
    p3: { x: 830, y: 335 },
    role: "outline",
  },
  {
    p0: { x: 830, y: 335 },
    p1: { x: 865, y: 385 },
    p2: { x: 830, y: 435 },
    p3: { x: 770, y: 430 },
    role: "outline",
  },
  {
    p0: { x: 770, y: 430 },
    p1: { x: 748, y: 485 },
    p2: { x: 690, y: 495 },
    p3: { x: 650, y: 450 },
    role: "outline",
  },
  {
    p0: { x: 650, y: 450 },
    p1: { x: 615, y: 492 },
    p2: { x: 555, y: 492 },
    p3: { x: 520, y: 445 },
    role: "outline",
  },
  {
    p0: { x: 520, y: 445 },
    p1: { x: 475, y: 505 },
    p2: { x: 405, y: 500 },
    p3: { x: 375, y: 450 },
    role: "outline",
  },
  {
    p0: { x: 375, y: 450 },
    p1: { x: 330, y: 485 },
    p2: { x: 270, y: 465 },
    p3: { x: 260, y: 420 },
    role: "outline",
  },
  {
    p0: { x: 260, y: 420 },
    p1: { x: 205, y: 445 },
    p2: { x: 160, y: 415 },
    p3: { x: 175, y: 370 },
    role: "outline",
  },
  {
    p0: { x: 175, y: 370 },
    p1: { x: 125, y: 365 },
    p2: { x: 115, y: 335 },
    p3: { x: 145, y: 320 },
    role: "outline",
  },
];

const FOLD_CURVES: CubicCurve[] = [
  {
    p0: { x: 220, y: 255 },
    p1: { x: 245, y: 205 },
    p2: { x: 310, y: 205 },
    p3: { x: 330, y: 250 },
    role: "fold",
  },
  {
    p0: { x: 300, y: 165 },
    p1: { x: 275, y: 220 },
    p2: { x: 285, y: 285 },
    p3: { x: 330, y: 305 },
    role: "fold",
  },
  {
    p0: { x: 420, y: 160 },
    p1: { x: 385, y: 220 },
    p2: { x: 392, y: 285 },
    p3: { x: 430, y: 315 },
    role: "fold",
  },
  {
    p0: { x: 540, y: 165 },
    p1: { x: 590, y: 185 },
    p2: { x: 615, y: 230 },
    p3: { x: 585, y: 265 },
    role: "fold",
  },
  {
    p0: { x: 650, y: 200 },
    p1: { x: 715, y: 205 },
    p2: { x: 735, y: 255 },
    p3: { x: 700, y: 290 },
    role: "fold",
  },
  {
    p0: { x: 190, y: 320 },
    p1: { x: 240, y: 275 },
    p2: { x: 300, y: 282 },
    p3: { x: 315, y: 330 },
    role: "fold",
  },
  {
    p0: { x: 315, y: 330 },
    p1: { x: 350, y: 275 },
    p2: { x: 425, y: 285 },
    p3: { x: 445, y: 335 },
    role: "fold",
  },
  {
    p0: { x: 450, y: 330 },
    p1: { x: 505, y: 265 },
    p2: { x: 585, y: 280 },
    p3: { x: 600, y: 335 },
    role: "fold",
    accent: true,
  },
  {
    p0: { x: 600, y: 335 },
    p1: { x: 665, y: 290 },
    p2: { x: 735, y: 318 },
    p3: { x: 715, y: 370 },
    role: "fold",
    accent: true,
  },
  {
    p0: { x: 230, y: 390 },
    p1: { x: 340, y: 335 },
    p2: { x: 455, y: 345 },
    p3: { x: 505, y: 390 },
    role: "fold",
  },
  {
    p0: { x: 505, y: 390 },
    p1: { x: 565, y: 430 },
    p2: { x: 640, y: 405 },
    p3: { x: 650, y: 355 },
    role: "fold",
    accent: true,
  },
  {
    p0: { x: 335, y: 415 },
    p1: { x: 385, y: 455 },
    p2: { x: 455, y: 445 },
    p3: { x: 485, y: 405 },
    role: "fold",
  },
];

const CEREBELLUM_CURVES: CubicCurve[] = [
  {
    p0: { x: 635, y: 440 },
    p1: { x: 690, y: 420 },
    p2: { x: 755, y: 440 },
    p3: { x: 748, y: 482 },
    role: "cerebellum",
  },
  {
    p0: { x: 748, y: 482 },
    p1: { x: 745, y: 530 },
    p2: { x: 665, y: 540 },
    p3: { x: 620, y: 500 },
    role: "cerebellum",
  },
  {
    p0: { x: 620, y: 500 },
    p1: { x: 600, y: 475 },
    p2: { x: 605, y: 448 },
    p3: { x: 635, y: 440 },
    role: "cerebellum",
  },
];

const STEM_CURVES: CubicCurve[] = [
  {
    p0: { x: 525, y: 438 },
    p1: { x: 525, y: 500 },
    p2: { x: 545, y: 545 },
    p3: { x: 575, y: 565 },
    role: "stem",
  },
  {
    p0: { x: 575, y: 565 },
    p1: { x: 615, y: 542 },
    p2: { x: 625, y: 500 },
    p3: { x: 610, y: 455 },
    role: "stem",
  },
];

const ALL_CURVES = [
  ...OUTLINE_CURVES,
  ...FOLD_CURVES,
  ...CEREBELLUM_CURVES,
  ...STEM_CURVES,
];

const MESH_NODES: Point[] = [
  { x: 245, y: 245 },
  { x: 355, y: 195 },
  { x: 470, y: 205 },
  { x: 585, y: 205 },
  { x: 690, y: 250 },
  { x: 285, y: 335 },
  { x: 405, y: 295 },
  { x: 520, y: 305 },
  { x: 625, y: 300 },
  { x: 730, y: 340 },
  { x: 330, y: 405 },
  { x: 455, y: 380 },
  { x: 575, y: 385 },
  { x: 675, y: 405 },
];

const MESH_EDGES: Array<[number, number, boolean]> = [
  [0, 1, false],
  [1, 2, false],
  [2, 3, true],
  [3, 4, false],
  [0, 5, false],
  [1, 6, false],
  [2, 6, false],
  [2, 7, true],
  [3, 7, false],
  [3, 8, true],
  [4, 8, false],
  [4, 9, false],
  [5, 6, false],
  [6, 7, true],
  [7, 8, true],
  [8, 9, false],
  [5, 10, false],
  [6, 10, false],
  [6, 11, false],
  [7, 11, true],
  [7, 12, true],
  [8, 12, false],
  [8, 13, false],
  [9, 13, false],
  [10, 11, false],
  [11, 12, false],
  [12, 13, false],
];

const cubicPoint = (curve: CubicCurve, t: number) => {
  const inverse = 1 - t;

  return {
    x:
      inverse * inverse * inverse * curve.p0.x +
      3 * inverse * inverse * t * curve.p1.x +
      3 * inverse * t * t * curve.p2.x +
      t * t * t * curve.p3.x,
    y:
      inverse * inverse * inverse * curve.p0.y +
      3 * inverse * inverse * t * curve.p1.y +
      3 * inverse * t * t * curve.p2.y +
      t * t * t * curve.p3.y,
  };
};

const toPercent = (point: Point) => ({
  x: (point.x / VIEWBOX_WIDTH) * 100,
  y: (point.y / VIEWBOX_HEIGHT) * 100,
});

const buildPath = (curves: CubicCurve[], close = false) => {
  if (!curves.length) return "";

  const first = curves[0].p0;
  const body = curves
    .map(
      (curve) =>
        `C ${curve.p1.x} ${curve.p1.y}, ${curve.p2.x} ${curve.p2.y}, ${curve.p3.x} ${curve.p3.y}`,
    )
    .join(" ");

  return `M ${first.x} ${first.y} ${body}${close ? " Z" : ""}`;
};

const OUTLINE_PATH = buildPath(OUTLINE_CURVES, true);
const CEREBELLUM_PATH = buildPath(CEREBELLUM_CURVES, true);

const buildTargets = () => {
  const targets: Target[] = [];

  ALL_CURVES.forEach((curve, curveIndex) => {
    const steps =
      curve.role === "outline"
        ? 18
        : curve.role === "cerebellum"
          ? 15
          : curve.role === "stem"
            ? 13
            : 11;

    for (let index = 0; index <= steps; index += 1) {
      const point = toPercent(cubicPoint(curve, index / steps));
      const outline = curve.role === "outline";
      const secondary =
        curve.role === "cerebellum" || curve.role === "stem";
      const accent = Boolean(
        curve.accent && index > 1 && index < steps - 1,
      );

      targets.push({
        x: point.x,
        y: point.y,
        size: outline
          ? 7.3 + hash(curveIndex * 109 + index + 11) * 1.7
          : secondary
            ? 6.1 + hash(curveIndex * 113 + index + 17) * 1.5
            : 5.3 + hash(curveIndex * 127 + index + 23) * 1.25,
        alpha: outline ? 0.82 : secondary ? 0.66 : 0.5,
        gold: accent,
        role: curve.role,
        pulseDelay: accent ? 0.25 + point.x / 100 * 1.25 : 0,
      });
    }
  });

  return targets;
};

const TARGETS = buildTargets();

const RAIN_LANES = [4, 9, 15, 22, 30, 39, 49, 59, 69, 78, 87, 94, 98];

const PARTICLES: Particle[] = TARGETS.map((target, index) => {
  const lane = RAIN_LANES[index % RAIN_LANES.length];

  return {
    ...target,
    char: index % 3 === 0 ? "1" : "0",
    startX: lane + (hash(index + 31) - 0.5) * 4.2,
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
          viewBox="0 0 1000 600"
          role="presentation"
        >
          <defs>
            <clipPath id="brain-cortex-clip">
              <path d={OUTLINE_PATH} />
            </clipPath>
          </defs>

          <path className="brain-surface" d={OUTLINE_PATH} />
          <path className="brain-surface brain-surface-secondary" d={CEREBELLUM_PATH} />

          <g clipPath="url(#brain-cortex-clip)">
            {MESH_EDGES.map(([from, to, accent], index) => (
              <line
                className={
                  accent
                    ? "brain-mesh-edge is-accent"
                    : "brain-mesh-edge"
                }
                key={`${from}-${to}-${index}`}
                x1={MESH_NODES[from].x}
                y1={MESH_NODES[from].y}
                x2={MESH_NODES[to].x}
                y2={MESH_NODES[to].y}
              />
            ))}

            {MESH_NODES.map((node, index) => (
              <circle
                className={
                  index === 7 || index === 12
                    ? "brain-mesh-node is-accent"
                    : "brain-mesh-node"
                }
                cx={node.x}
                cy={node.y}
                key={`${node.x}-${node.y}`}
                r={index === 7 || index === 12 ? 5.2 : 3.7}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
