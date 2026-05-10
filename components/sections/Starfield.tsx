"use client";

// Deterministic starfield (percentage coords). A random star sparkles every 5s.

import { useEffect, useState } from "react";

type StarTone = "white" | "ice" | "warm" | "lavender";

type Star = {
  x: number; // 0-100, left
  y: number; // 0-100, top
  size: number; // px diameter
  opacity: number;
  tone?: StarTone; // color hue, defaults to "white"
  twinkle?: number; // animation duration in seconds, omit for static
  delay?: number; // animation delay in seconds
};

const TONES: Record<StarTone, { core: string; halo: string }> = {
  white: { core: "#ffffff", halo: "rgba(255, 255, 255, 0.55)" },
  ice: { core: "#cfe4ff", halo: "rgba(132, 173, 255, 0.55)" },
  warm: { core: "#fff5d6", halo: "rgba(255, 215, 130, 0.5)" },
  lavender: { core: "#d8d2ff", halo: "rgba(160, 140, 255, 0.45)" },
};

const stars: Star[] = [
  // Dense cluster around / behind the car (right half, mid-vertical)
  { x: 56, y: 38, size: 1.5, opacity: 0.55, twinkle: 4.2, tone: "ice" },
  { x: 62, y: 22, size: 2, opacity: 0.85, twinkle: 3.6, delay: 0.4 },
  { x: 68, y: 55, size: 1.5, opacity: 0.7, tone: "warm" },
  { x: 71, y: 30, size: 2.5, opacity: 0.95, twinkle: 5.1, delay: 1.1 },
  { x: 74, y: 70, size: 1, opacity: 0.5 },
  { x: 78, y: 48, size: 1.5, opacity: 0.7, twinkle: 4.4, delay: 0.8, tone: "ice" },
  { x: 81, y: 18, size: 1, opacity: 0.55, tone: "lavender" },
  { x: 83, y: 62, size: 2, opacity: 0.9, twinkle: 3.8, delay: 0.2 },
  { x: 86, y: 35, size: 1.5, opacity: 0.6, tone: "warm" },
  { x: 88, y: 78, size: 1, opacity: 0.5, twinkle: 5.5, delay: 1.6 },
  { x: 90, y: 12, size: 2, opacity: 0.85, twinkle: 4.0, tone: "ice" },
  { x: 92, y: 50, size: 1.5, opacity: 0.7 },
  { x: 94, y: 28, size: 1, opacity: 0.5, tone: "lavender" },
  { x: 96, y: 65, size: 2, opacity: 0.9, twinkle: 3.2, delay: 1.3 },

  // Tighter halo near the car silhouette
  { x: 65, y: 44, size: 1, opacity: 0.45, tone: "ice" },
  { x: 73, y: 58, size: 1, opacity: 0.6, twinkle: 4.6 },
  { x: 79, y: 52, size: 1, opacity: 0.5, tone: "warm" },
  { x: 84, y: 46, size: 1, opacity: 0.7, twinkle: 3.4, delay: 0.5 },
  { x: 87, y: 56, size: 1.5, opacity: 0.85, twinkle: 5.2, delay: 0.9, tone: "ice" },
  { x: 91, y: 41, size: 1, opacity: 0.55 },
  { x: 95, y: 54, size: 1, opacity: 0.65, twinkle: 4.0, delay: 1.4, tone: "lavender" },
  { x: 60, y: 64, size: 1, opacity: 0.5, twinkle: 4.2, delay: 1.7 },
  { x: 67, y: 36, size: 1, opacity: 0.6, tone: "warm" },
  { x: 76, y: 26, size: 1.5, opacity: 0.7, twinkle: 5.0, delay: 0.6, tone: "ice" },
  { x: 82, y: 50, size: 0.8, opacity: 0.4 },
  { x: 89, y: 44, size: 1, opacity: 0.55, twinkle: 3.8 },
  { x: 93, y: 38, size: 1.2, opacity: 0.7, tone: "ice", twinkle: 4.4, delay: 0.3 },

  // Wider scatter across the hero for depth
  { x: 4, y: 12, size: 1, opacity: 0.4, twinkle: 5.0, tone: "lavender" },
  { x: 9, y: 26, size: 1, opacity: 0.45 },
  { x: 12, y: 30, size: 1.5, opacity: 0.55, twinkle: 4.2, delay: 1.8, tone: "ice" },
  { x: 15, y: 60, size: 1, opacity: 0.5, twinkle: 5.4, delay: 0.9 },
  { x: 18, y: 8, size: 1, opacity: 0.45, tone: "warm" },
  { x: 21, y: 42, size: 0.8, opacity: 0.4 },
  { x: 22, y: 88, size: 1, opacity: 0.5 },
  { x: 25, y: 50, size: 1, opacity: 0.55, tone: "lavender" },
  { x: 28, y: 16, size: 1.5, opacity: 0.6, twinkle: 4.6, delay: 0.7 },
  { x: 31, y: 70, size: 1, opacity: 0.5, twinkle: 5.0, delay: 1.4, tone: "ice" },
  { x: 34, y: 76, size: 1, opacity: 0.45 },
  { x: 36, y: 22, size: 0.8, opacity: 0.5, tone: "warm" },
  { x: 38, y: 50, size: 1, opacity: 0.55 },
  { x: 40, y: 6, size: 1, opacity: 0.4, twinkle: 5.5 },
  { x: 42, y: 90, size: 1, opacity: 0.45, tone: "lavender" },
  { x: 44, y: 32, size: 1.2, opacity: 0.65, twinkle: 4.0, delay: 0.4, tone: "ice" },
  { x: 46, y: 84, size: 1, opacity: 0.5 },
  { x: 48, y: 60, size: 0.9, opacity: 0.45, tone: "warm" },
  { x: 50, y: 14, size: 1.5, opacity: 0.6, twinkle: 3.8, delay: 1.2 },
  { x: 52, y: 44, size: 1, opacity: 0.55, twinkle: 5.2, delay: 0.6 },
  { x: 54, y: 80, size: 1, opacity: 0.5, tone: "ice" },

  // Far-left fill (x: 0-12): covers a previously sparse band
  { x: 1, y: 4, size: 1, opacity: 0.5, twinkle: 4.4, tone: "ice" },
  { x: 2, y: 38, size: 1.2, opacity: 0.6, twinkle: 3.6, delay: 0.8 },
  { x: 3, y: 70, size: 1, opacity: 0.5, tone: "warm" },
  { x: 5, y: 54, size: 0.8, opacity: 0.45, twinkle: 5.0, delay: 1.5 },
  { x: 6, y: 84, size: 1, opacity: 0.55, tone: "lavender" },
  { x: 7, y: 18, size: 1.4, opacity: 0.7, twinkle: 4.0 },
  { x: 8, y: 64, size: 1, opacity: 0.5, tone: "ice", twinkle: 5.4, delay: 0.4 },
  { x: 10, y: 46, size: 0.9, opacity: 0.5 },
  { x: 11, y: 92, size: 1, opacity: 0.45, twinkle: 4.6, delay: 1.2, tone: "warm" },

  // Far-right bottom fill (x: 88-99, y: 68-96): was thin
  { x: 88, y: 88, size: 1.2, opacity: 0.7, twinkle: 4.4, delay: 0.6, tone: "ice" },
  { x: 90, y: 72, size: 1, opacity: 0.55 },
  { x: 91, y: 95, size: 1, opacity: 0.5, twinkle: 5.0, tone: "warm" },
  { x: 93, y: 80, size: 1.4, opacity: 0.75, twinkle: 3.8, delay: 1.0 },
  { x: 95, y: 70, size: 1, opacity: 0.55, tone: "lavender" },
  { x: 96, y: 88, size: 1, opacity: 0.6, twinkle: 4.6, delay: 0.3 },
  { x: 98, y: 76, size: 1.2, opacity: 0.7, tone: "ice" },
  { x: 99, y: 92, size: 1, opacity: 0.5, twinkle: 5.2, delay: 1.4 },

  // Mid-bottom band fill (x: 16-86, y: 72-95): the section that previously
  // had only 4-5 stars across half the screen width
  { x: 16, y: 74, size: 1, opacity: 0.5, tone: "ice" },
  { x: 19, y: 90, size: 1.2, opacity: 0.6, twinkle: 4.2, delay: 0.5 },
  { x: 24, y: 80, size: 1, opacity: 0.55, tone: "warm" },
  { x: 27, y: 92, size: 1, opacity: 0.45, twinkle: 5.0, delay: 1.2 },
  { x: 30, y: 76, size: 1.2, opacity: 0.65, twinkle: 3.8, delay: 0.2, tone: "ice" },
  { x: 33, y: 86, size: 0.9, opacity: 0.5 },
  { x: 36, y: 94, size: 1, opacity: 0.5, tone: "lavender" },
  { x: 39, y: 78, size: 1.4, opacity: 0.7, twinkle: 4.6, delay: 1.0 },
  { x: 43, y: 72, size: 1, opacity: 0.55, tone: "ice" },
  { x: 47, y: 88, size: 1, opacity: 0.5, twinkle: 5.4, delay: 0.8 },
  { x: 51, y: 76, size: 1.2, opacity: 0.65, tone: "warm" },
  { x: 54, y: 94, size: 1, opacity: 0.45, twinkle: 4.0, delay: 1.6 },
  { x: 57, y: 82, size: 0.9, opacity: 0.5 },
  { x: 60, y: 70, size: 1.4, opacity: 0.7, twinkle: 3.6, delay: 0.4, tone: "ice" },
  { x: 63, y: 90, size: 1, opacity: 0.55, tone: "lavender" },
  { x: 67, y: 78, size: 1, opacity: 0.5, twinkle: 5.2 },
  { x: 70, y: 86, size: 1.2, opacity: 0.65, twinkle: 4.4, delay: 1.1, tone: "warm" },
  { x: 73, y: 94, size: 1, opacity: 0.5 },
  { x: 76, y: 72, size: 1, opacity: 0.55, tone: "ice", twinkle: 4.8, delay: 0.6 },
  { x: 80, y: 84, size: 1.2, opacity: 0.6 },
  { x: 84, y: 78, size: 1, opacity: 0.55, twinkle: 5.0, delay: 1.3, tone: "lavender" },

  // Page-wide expansion: left edge, full height
  { x: 1, y: 22, size: 1, opacity: 0.5, twinkle: 4.4, tone: "ice" },
  { x: 2, y: 50, size: 1.2, opacity: 0.6 },
  { x: 2, y: 82, size: 1, opacity: 0.55, twinkle: 5.0, delay: 0.7 },
  { x: 3, y: 14, size: 1, opacity: 0.5, tone: "warm" },
  { x: 3, y: 46, size: 0.9, opacity: 0.5, tone: "lavender" },
  { x: 4, y: 60, size: 1.2, opacity: 0.65, twinkle: 4.6, delay: 0.9 },
  { x: 4, y: 76, size: 1, opacity: 0.5, tone: "ice" },
  { x: 5, y: 30, size: 1, opacity: 0.55 },
  { x: 5, y: 90, size: 1, opacity: 0.5, twinkle: 5.4, delay: 1.4 },
  { x: 6, y: 6, size: 1.2, opacity: 0.6, tone: "ice", twinkle: 3.8 },
  { x: 7, y: 50, size: 0.9, opacity: 0.5 },
  { x: 8, y: 38, size: 1, opacity: 0.55, tone: "warm" },
  { x: 9, y: 78, size: 1.2, opacity: 0.65, twinkle: 4.2, delay: 0.5 },
  { x: 10, y: 18, size: 1, opacity: 0.5, tone: "lavender" },

  // Right edge, full height
  { x: 89, y: 6, size: 1.2, opacity: 0.65, twinkle: 4.0, tone: "ice" },
  { x: 90, y: 28, size: 1, opacity: 0.55 },
  { x: 91, y: 42, size: 1, opacity: 0.5, tone: "warm" },
  { x: 92, y: 16, size: 1.2, opacity: 0.65, twinkle: 5.2, delay: 0.6 },
  { x: 93, y: 56, size: 0.9, opacity: 0.5 },
  { x: 94, y: 36, size: 1, opacity: 0.55, tone: "lavender" },
  { x: 95, y: 22, size: 1.4, opacity: 0.7, twinkle: 4.4 },
  { x: 96, y: 10, size: 1, opacity: 0.5, tone: "ice" },
  { x: 97, y: 48, size: 1.2, opacity: 0.65, twinkle: 3.8, delay: 1.0 },
  { x: 98, y: 32, size: 1, opacity: 0.55 },
  { x: 99, y: 18, size: 0.9, opacity: 0.5, tone: "warm" },
  { x: 99, y: 60, size: 1, opacity: 0.55, twinkle: 5.0, delay: 0.4 },

  // Wider bottom band fill: make sure scrolled-to sections always see stars
  { x: 12, y: 96, size: 1, opacity: 0.55, twinkle: 4.6 },
  { x: 14, y: 80, size: 1.2, opacity: 0.6, tone: "ice" },
  { x: 17, y: 68, size: 1, opacity: 0.5 },
  { x: 20, y: 84, size: 1.4, opacity: 0.7, twinkle: 4.0, delay: 0.3 },
  { x: 23, y: 96, size: 1, opacity: 0.5, tone: "warm" },
  { x: 26, y: 70, size: 0.9, opacity: 0.5 },
  { x: 29, y: 88, size: 1.2, opacity: 0.65, twinkle: 5.0, delay: 1.5, tone: "lavender" },
  { x: 32, y: 96, size: 1, opacity: 0.5 },
  { x: 35, y: 70, size: 1, opacity: 0.55, tone: "ice" },
  { x: 38, y: 88, size: 1.2, opacity: 0.65, twinkle: 4.4, delay: 0.7 },
  { x: 41, y: 96, size: 1, opacity: 0.5, tone: "warm" },
  { x: 45, y: 80, size: 1, opacity: 0.55 },
  { x: 49, y: 96, size: 1.2, opacity: 0.6, twinkle: 5.2, delay: 1.1 },
  { x: 52, y: 70, size: 0.9, opacity: 0.5, tone: "ice" },
  { x: 56, y: 90, size: 1, opacity: 0.55 },
  { x: 59, y: 96, size: 1, opacity: 0.5, tone: "lavender" },
  { x: 62, y: 80, size: 1.2, opacity: 0.65, twinkle: 4.0, delay: 0.6 },
  { x: 65, y: 96, size: 1, opacity: 0.5 },
  { x: 69, y: 74, size: 1, opacity: 0.55, twinkle: 4.8, tone: "warm" },
  { x: 72, y: 90, size: 0.9, opacity: 0.5 },
  { x: 75, y: 96, size: 1.2, opacity: 0.6, tone: "ice" },
  { x: 78, y: 78, size: 1, opacity: 0.55 },
  { x: 81, y: 96, size: 1, opacity: 0.5, twinkle: 5.4, delay: 1.3 },
  { x: 86, y: 90, size: 1, opacity: 0.55, tone: "lavender" },
  { x: 89, y: 80, size: 1.2, opacity: 0.6, twinkle: 4.2 },

  // Mid-page gap fill (y: 30-70) since stars stay fixed and need to sit
  // visible while users scroll through About, Projects, etc.
  { x: 13, y: 36, size: 1, opacity: 0.5, twinkle: 4.6, tone: "ice" },
  { x: 17, y: 52, size: 1.2, opacity: 0.6 },
  { x: 21, y: 64, size: 1, opacity: 0.5, tone: "warm" },
  { x: 26, y: 38, size: 0.9, opacity: 0.5, twinkle: 5.0, delay: 0.8 },
  { x: 32, y: 56, size: 1.2, opacity: 0.65, tone: "lavender" },
  { x: 37, y: 42, size: 1, opacity: 0.55 },
  { x: 41, y: 60, size: 1, opacity: 0.5, twinkle: 4.0, delay: 1.2, tone: "ice" },
  { x: 45, y: 36, size: 1.2, opacity: 0.6 },
  { x: 49, y: 52, size: 0.9, opacity: 0.5, tone: "warm" },
  { x: 53, y: 38, size: 1, opacity: 0.55, twinkle: 5.2, delay: 0.5 },
  { x: 56, y: 56, size: 1, opacity: 0.5 },
  { x: 60, y: 42, size: 1.2, opacity: 0.65, tone: "ice" },
  { x: 64, y: 60, size: 1, opacity: 0.55, twinkle: 4.4, delay: 1.0 },
  { x: 68, y: 38, size: 0.9, opacity: 0.5, tone: "lavender" },
  { x: 72, y: 50, size: 1, opacity: 0.55 },
  { x: 76, y: 64, size: 1.2, opacity: 0.6, tone: "ice", twinkle: 3.8 },
  { x: 81, y: 42, size: 1, opacity: 0.5, tone: "warm" },
  { x: 85, y: 56, size: 1, opacity: 0.55, twinkle: 5.0, delay: 0.9 },
  { x: 88, y: 64, size: 1.2, opacity: 0.6 },
];

export function Starfield({ className }: { className?: string }) {
  const [sparkleIndex, setSparkleIndex] = useState<number | null>(null);

  useEffect(() => {
    let sparkleTimer: ReturnType<typeof setTimeout>;

    const pulse = () => {
      const idx = Math.floor(Math.random() * stars.length);
      setSparkleIndex(idx);
      clearTimeout(sparkleTimer);
      sparkleTimer = setTimeout(() => setSparkleIndex(null), 1150);
    };

    const interval = setInterval(pulse, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(sparkleTimer);
    };
  }, []);

  return (
    <div className={`v2-stars ${className ?? ""}`} aria-hidden>
      {stars.map((s, i) => {
        const tone = TONES[s.tone ?? "white"];
        const isSparkle = sparkleIndex === i;
        const twinkleOn = Boolean(s.twinkle) && !isSparkle;
        return (
          <span
            key={i}
            className={`v2-star ${twinkleOn ? "v2-star--twinkle" : ""} ${
              isSparkle ? "v2-star--sparkle" : ""
            }`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              background: tone.core,
              boxShadow: `0 0 6px ${tone.halo}`,
              ["--star-opacity" as string]: String(s.opacity),
              ...(s.twinkle && !isSparkle
                ? {
                    animationDuration: `${s.twinkle}s`,
                    animationDelay: `${s.delay ?? 0}s`,
                  }
                : {}),
            }}
          />
        );
      })}
    </div>
  );
}
