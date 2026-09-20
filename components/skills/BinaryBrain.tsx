"use client";

import { Brain } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Particle = {
  char: "0" | "1";
  startX: number;
  startY: number;
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

const ellipse = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
) => {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return dx * dx + dy * dy <= 1;
};

const insideBrain = (x: number, y: number) => {
  const left =
    ellipse(x, y, -0.28, -0.42, 0.48, 0.42) ||
    ellipse(x, y, -0.5, -0.08, 0.43, 0.5) ||
    ellipse(x, y, -0.38, 0.38, 0.42, 0.38) ||
    ellipse(x, y, -0.1, 0.04, 0.32, 0.72);

  const right =
    ellipse(x, y, 0.28, -0.42, 0.48, 0.42) ||
    ellipse(x, y, 0.5, -0.08, 0.43, 0.5) ||
    ellipse(x, y, 0.38, 0.38, 0.42, 0.38) ||
    ellipse(x, y, 0.1, 0.04, 0.32, 0.72);

  const centerFissure = Math.abs(x) < 0.045 && y < 0.52;
  return (left || right) && !centerFissure;
};

const buildParticles = () => {
  const particles: Particle[] = [];
  let seed = 0;

  while (particles.length < 270 && seed < 5000) {
    const x = hash(seed + 13) * 2 - 1;
    const y = hash(seed + 37) * 1.8 - 0.9;

    if (insideBrain(x, y)) {
      const density = hash(seed + 83);
      const size =
        density < 0.56
          ? 5.5 + hash(seed + 101) * 1.7
          : density < 0.88
            ? 7.5 + hash(seed + 131) * 1.6
            : 9.5 + hash(seed + 151) * 1.9;

      const lane = particles.length % 24;
      particles.push({
        char: particles.length % 3 === 0 ? "1" : "0",
        startX: 13 + (lane / 23) * 74,
        startY: 8 + hash(seed + 173) * 84,
        targetX: 50 + x * 29,
        targetY: 50 + y * 39,
        size,
        alpha: 0.34 + hash(seed + 197) * 0.5,
        delay: hash(seed + 211) * 0.42,
        gold: particles.length % 67 === 0,
      });
    }

    seed += 1;
  }

  return particles;
};

const PARTICLES = buildParticles();

export function BinaryBrain() {
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
        timer = window.setTimeout(() => setComplete(true), 2650);
      },
      {
        threshold: 0.7,
        rootMargin: "0px",
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
        "binary-brain",
        active ? "is-active" : "",
        complete ? "is-complete" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="binary-brain-field">
        {PARTICLES.map((particle, index) => (
          <span
            className={particle.gold ? "binary-particle is-gold" : "binary-particle"}
            key={index}
            style={
              {
                "--sx": `${particle.startX}%`,
                "--sy": `${particle.startY}%`,
                "--tx": `${particle.targetX}%`,
                "--ty": `${particle.targetY}%`,
                "--particle-size": `${particle.size}px`,
                "--particle-alpha": particle.alpha,
                "--particle-delay": `${particle.delay}s`,
              } as CSSProperties
            }
          >
            {particle.char}
          </span>
        ))}
      </div>

      <Brain className="binary-brain-guide" strokeWidth={0.9} />
      <Brain className="binary-brain-guide binary-brain-guide-detail" strokeWidth={1.45} />
    </div>
  );
}
