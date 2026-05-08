// Deterministic starfield. Coordinates are percentage-based so the layer scales
// with its container. Stars are weighted toward the right side of the frame
// where the hero car sits, with a few scattered across the rest for depth.

type Star = {
  x: number; // 0-100, left
  y: number; // 0-100, top
  size: number; // px diameter
  opacity: number;
  twinkle?: number; // animation duration in seconds, omit for static
  delay?: number; // animation delay in seconds
};

const stars: Star[] = [
  // Dense cluster around / behind the car (right half, mid-vertical)
  { x: 56, y: 38, size: 1.5, opacity: 0.55, twinkle: 4.2 },
  { x: 62, y: 22, size: 2, opacity: 0.85, twinkle: 3.6, delay: 0.4 },
  { x: 68, y: 55, size: 1.5, opacity: 0.7 },
  { x: 71, y: 30, size: 2.5, opacity: 0.95, twinkle: 5.1, delay: 1.1 },
  { x: 74, y: 70, size: 1, opacity: 0.5 },
  { x: 78, y: 48, size: 1.5, opacity: 0.7, twinkle: 4.4, delay: 0.8 },
  { x: 81, y: 18, size: 1, opacity: 0.55 },
  { x: 83, y: 62, size: 2, opacity: 0.9, twinkle: 3.8, delay: 0.2 },
  { x: 86, y: 35, size: 1.5, opacity: 0.6 },
  { x: 88, y: 78, size: 1, opacity: 0.5, twinkle: 5.5, delay: 1.6 },
  { x: 90, y: 12, size: 2, opacity: 0.85, twinkle: 4.0 },
  { x: 92, y: 50, size: 1.5, opacity: 0.7 },
  { x: 94, y: 28, size: 1, opacity: 0.5 },
  { x: 96, y: 65, size: 2, opacity: 0.9, twinkle: 3.2, delay: 1.3 },

  // Tighter halo near the car silhouette (around 70-90% x, 40-65% y)
  { x: 65, y: 44, size: 1, opacity: 0.45 },
  { x: 73, y: 58, size: 1, opacity: 0.6, twinkle: 4.6 },
  { x: 79, y: 52, size: 1, opacity: 0.5 },
  { x: 84, y: 46, size: 1, opacity: 0.7, twinkle: 3.4, delay: 0.5 },
  { x: 87, y: 56, size: 1.5, opacity: 0.85, twinkle: 5.2, delay: 0.9 },
  { x: 91, y: 41, size: 1, opacity: 0.55 },
  { x: 95, y: 54, size: 1, opacity: 0.65, twinkle: 4.0, delay: 1.4 },

  // Scattered across the rest of the hero for depth
  { x: 6, y: 10, size: 1, opacity: 0.4, twinkle: 5.0 },
  { x: 12, y: 30, size: 1.5, opacity: 0.55, twinkle: 4.2, delay: 1.8 },
  { x: 18, y: 8, size: 1, opacity: 0.45 },
  { x: 22, y: 88, size: 1, opacity: 0.5 },
  { x: 28, y: 16, size: 1.5, opacity: 0.6, twinkle: 4.6, delay: 0.7 },
  { x: 34, y: 76, size: 1, opacity: 0.45 },
  { x: 40, y: 6, size: 1, opacity: 0.4, twinkle: 5.5 },
  { x: 46, y: 84, size: 1, opacity: 0.5 },
  { x: 50, y: 14, size: 1.5, opacity: 0.6, twinkle: 3.8, delay: 1.2 },
];

export function Starfield({ className }: { className?: string }) {
  return (
    <div className={`v2-stars ${className ?? ""}`} aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className={`v2-star ${s.twinkle ? "v2-star--twinkle" : ""}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            ...(s.twinkle
              ? {
                  animationDuration: `${s.twinkle}s`,
                  animationDelay: `${s.delay ?? 0}s`,
                }
              : {}),
          }}
        />
      ))}
    </div>
  );
}
