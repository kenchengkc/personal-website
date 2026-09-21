"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Target = {
  x: number;
  y: number;
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

const buildTargets = () => {
  const targets: Target[] = [];

  const pushRect = (
    left: number,
    right: number,
    top: number,
    bottom: number,
    count: number,
  ) => {
    const width = right - left;
    const height = bottom - top;
    const perimeter = width * 2 + height * 2;

    for (let index = 0; index < count; index += 1) {
      let distance = (index / count) * perimeter;
      let x = left;
      let y = top;

      if (distance <= width) {
        x = left + distance;
      } else if ((distance -= width) <= height) {
        x = right;
        y = top + distance;
      } else if ((distance -= height) <= width) {
        x = right - distance;
        y = bottom;
      } else {
        distance -= width;
        y = bottom - distance;
      }

      targets.push({ x, y, accent: index % 19 === 0 });
    }
  };

  pushRect(-78, 78, -68, 68, 80);
  pushRect(-44, 44, -38, 38, 48);

  const tracePositions = [-48, -24, 0, 24, 48];

  for (const y of tracePositions) {
    for (const x of [-102, -94, -86, -78]) {
      targets.push({ x, y, accent: y === 0 && x === -94 });
      targets.push({ x: -x, y, accent: y === 0 && x === -94 });
    }
  }

  for (const x of tracePositions) {
    for (const y of [-92, -84, -76, -68]) {
      targets.push({ x, y, accent: x === 0 && y === -84 });
      targets.push({ x, y: -y, accent: x === 0 && y === -84 });
    }
  }

  const interiorX = [-28, -17, -6, 6, 17, 28];
  const interiorY = [-23, -8, 8, 23];

  for (const y of interiorY) {
    for (const x of interiorX) {
      targets.push({ x, y, accent: Math.abs(x) === 6 && Math.abs(y) === 8 });
    }
  }

  return targets;
};

const TARGETS = buildTargets();

const PARTICLES: Particle[] = TARGETS.map((target, index) => {
  const startY = -4 + hash(index + 29) * 72;

  return {
    char: index % 3 === 0 ? "1" : "0",
    startX: 4 + hash(index + 11) * 92,
    startY,
    rainY: Math.min(96, startY + 26 + hash(index + 47) * 36),
    targetX: target.x,
    targetY: target.y,
    size:
      index % 11 === 0
        ? 10 + hash(index + 61) * 2
        : index % 4 === 0
          ? 7.5 + hash(index + 71) * 1.5
          : 5.5 + hash(index + 83) * 1.4,
    alpha: 0.42 + hash(index + 97) * 0.44,
    delay: hash(index + 109) * 0.38,
    gold: Boolean(target.accent) || index % 79 === 0,
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
        timer = window.setTimeout(() => setComplete(true), 3400);
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -4% 0px",
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

      <svg
        className="hero-circuit-art"
        viewBox="0 0 240 180"
        role="presentation"
      >
        <rect
          className="circuit-path"
          x="42"
          y="20"
          width="156"
          height="140"
          rx="10"
          pathLength="1"
        />
        <rect
          className="circuit-path circuit-path-inner"
          x="76"
          y="52"
          width="88"
          height="76"
          rx="5"
          pathLength="1"
        />

        {[42, 66, 90, 114, 138].map((y, index) => (
          <g key={`h-${y}`}>
            <path
              className={index === 2 ? "circuit-path circuit-path-accent" : "circuit-path"}
              d={`M22 ${y} H42 M198 ${y} H218`}
              pathLength="1"
            />
            <circle className="circuit-node" cx="22" cy={y} r="1.8" />
            <circle className="circuit-node" cx="218" cy={y} r="1.8" />
          </g>
        ))}

        {[72, 96, 120, 144, 168].map((x, index) => (
          <g key={`v-${x}`}>
            <path
              className={index === 2 ? "circuit-path circuit-path-accent" : "circuit-path"}
              d={`M${x} 0 V20 M${x} 160 V180`}
              pathLength="1"
            />
            <circle className="circuit-node" cx={x} cy="2" r="1.8" />
            <circle className="circuit-node" cx={x} cy="178" r="1.8" />
          </g>
        ))}

        <path
          className="circuit-path circuit-path-inner"
          d="M76 72 H95 V62 H120 V52 M164 108 H145 V118 H120 V128"
          pathLength="1"
        />
        <path
          className="circuit-path circuit-path-inner"
          d="M96 128 V105 H86 V90 H76 M144 52 V75 H154 V90 H164"
          pathLength="1"
        />

        <circle className="circuit-node circuit-node-core" cx="120" cy="90" r="4" />
      </svg>
    </div>
  );
}
