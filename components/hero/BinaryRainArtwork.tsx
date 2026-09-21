"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Anchor = {
  x: number;
  y: number;
  strength: "small" | "medium" | "large";
  accent?: boolean;
};

type Link = {
  from: number;
  to: number;
  bend: number;
  accent?: boolean;
};

type Target = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  gold: boolean;
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

const ANCHORS: Anchor[] = [
  { x: 8, y: 27, strength: "small" },
  { x: 5, y: 61, strength: "small" },
  { x: 10, y: 82, strength: "small" },

  { x: 27, y: 38, strength: "medium" },
  { x: 24, y: 73, strength: "medium" },

  { x: 46, y: 21, strength: "small" },
  { x: 49, y: 52, strength: "large", accent: true },
  { x: 43, y: 84, strength: "small" },

  { x: 67, y: 34, strength: "medium" },
  { x: 70, y: 69, strength: "medium" },

  { x: 88, y: 25, strength: "small" },
  { x: 92, y: 55, strength: "medium", accent: true },
  { x: 86, y: 84, strength: "small" },
];

const LINKS: Link[] = [
  { from: 0, to: 3, bend: -7 },
  { from: 1, to: 3, bend: 6 },
  { from: 1, to: 4, bend: -6 },
  { from: 2, to: 4, bend: 7 },

  { from: 3, to: 5, bend: -9 },
  { from: 3, to: 6, bend: 7, accent: true },
  { from: 4, to: 6, bend: -7, accent: true },
  { from: 4, to: 7, bend: 9 },

  { from: 5, to: 8, bend: 8 },
  { from: 6, to: 8, bend: -6, accent: true },
  { from: 6, to: 9, bend: 7, accent: true },
  { from: 7, to: 9, bend: -8 },

  { from: 8, to: 10, bend: -7 },
  { from: 8, to: 11, bend: 8, accent: true },
  { from: 9, to: 11, bend: -8, accent: true },
  { from: 9, to: 12, bend: 7 },

  { from: 5, to: 6, bend: 4 },
  { from: 6, to: 7, bend: -4 },
  { from: 8, to: 9, bend: 4 },
];

const controlPoint = (from: Anchor, to: Anchor, bend: number) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, Math.hypot(dx, dy));

  return {
    x: (from.x + to.x) / 2 - (dy / length) * bend,
    y: (from.y + to.y) / 2 + (dx / length) * bend,
  };
};

const pointOnCurve = (
  from: Anchor,
  to: Anchor,
  bend: number,
  t: number,
) => {
  const control = controlPoint(from, to, bend);
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

const sizeForStrength = (
  strength: Anchor["strength"],
  seed: number,
) => {
  if (strength === "large") return 11 + hash(seed) * 2;
  if (strength === "medium") return 8 + hash(seed) * 1.8;
  return 5.5 + hash(seed) * 1.4;
};

const alphaForStrength = (strength: Anchor["strength"]) => {
  if (strength === "large") return 0.96;
  if (strength === "medium") return 0.76;
  return 0.48;
};

const buildTargets = () => {
  const targets: Target[] = [];

  LINKS.forEach((link, linkIndex) => {
    const from = ANCHORS[link.from];
    const to = ANCHORS[link.to];
    const steps = link.accent ? 14 : 10;

    for (let index = 1; index < steps; index += 1) {
      const t = index / steps;
      const point = pointOnCurve(from, to, link.bend, t);
      const accent = Boolean(link.accent && t > 0.16 && t < 0.9);

      targets.push({
        x: point.x,
        y: point.y,
        size: accent
          ? 7.2 + hash(linkIndex * 100 + index + 13) * 1.4
          : 5.2 + hash(linkIndex * 100 + index + 29) * 1.2,
        alpha: accent ? 0.72 : 0.4,
        gold: accent,
        pulseDelay: 0.2 + point.x / 100 * 1.35,
      });
    }
  });

  ANCHORS.forEach((anchor, anchorIndex) => {
    const count =
      anchor.strength === "large"
        ? 18
        : anchor.strength === "medium"
          ? 11
          : 7;

    for (let index = 0; index < count; index += 1) {
      if (index === 0) {
        targets.push({
          x: anchor.x,
          y: anchor.y,
          size: sizeForStrength(anchor.strength, anchorIndex + 311),
          alpha: alphaForStrength(anchor.strength),
          gold: Boolean(anchor.accent),
          pulseDelay: 0.2 + anchor.x / 100 * 1.35,
        });
        continue;
      }

      const angle = ((index - 1) / (count - 1)) * Math.PI * 2;
      const radius =
        anchor.strength === "large"
          ? 4.8 + hash(anchorIndex * 71 + index) * 3
          : anchor.strength === "medium"
            ? 3 + hash(anchorIndex * 73 + index) * 2.2
            : 1.8 + hash(anchorIndex * 79 + index) * 1.8;

      const squash = anchor.strength === "large" ? 0.72 : 0.82;

      targets.push({
        x: anchor.x + Math.cos(angle) * radius,
        y: anchor.y + Math.sin(angle) * radius * squash,
        size: sizeForStrength(
          anchor.strength === "large" ? "medium" : "small",
          anchorIndex * 97 + index,
        ),
        alpha:
          anchor.strength === "large"
            ? 0.78
            : anchor.strength === "medium"
              ? 0.58
              : 0.42,
        gold: Boolean(anchor.accent && index % 3 === 0),
        pulseDelay: 0.2 + anchor.x / 100 * 1.35,
      });
    }
  });

  const reasoningField = [
    [36, 46],
    [39, 57],
    [40, 68],
    [53, 30],
    [57, 43],
    [58, 61],
    [54, 73],
    [61, 79],
    [73, 47],
    [78, 57],
  ];

  reasoningField.forEach(([x, y], index) => {
    targets.push({
      x,
      y,
      size: 4.8 + hash(index + 503) * 1.4,
      alpha: 0.3 + hash(index + 509) * 0.2,
      gold: false,
      pulseDelay: 0,
    });
  });

  return targets;
};

const TARGETS = buildTargets();

const RAIN_LANES = [4, 10, 17, 25, 34, 45, 56, 68, 79, 89, 96];

const PARTICLES: Particle[] = TARGETS.map((target, index) => {
  const lane = RAIN_LANES[index % RAIN_LANES.length];

  return {
    ...target,
    char: index % 3 === 0 ? "1" : "0",
    startX: lane + (hash(index + 17) - 0.5) * 5,
    startY: -8 - hash(index + 31) * 42,
    rainY: 12 + hash(index + 47) * 82,
    delay: hash(index + 61) * 0.62,
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
        timer = window.setTimeout(() => setComplete(true), 3200);
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
              particle.gold ? "is-gold" : "",
              particle.gold ? "is-signal" : "",
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
    </div>
  );
}
