// Deterministic starfield. Coordinates are percentage-based so the layer scales
// with its container. Stars are weighted toward the right side of the frame
// where the hero car sits, with a denser scatter across the rest for depth
// and a mix of warm/cool/neutral hues for variation.

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
];

export function Starfield({ className }: { className?: string }) {
  return (
    <div className={`v2-stars ${className ?? ""}`} aria-hidden>
      {stars.map((s, i) => {
        const tone = TONES[s.tone ?? "white"];
        return (
          <span
            key={i}
            className={`v2-star ${s.twinkle ? "v2-star--twinkle" : ""}`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              background: tone.core,
              boxShadow: `0 0 6px ${tone.halo}`,
              ...(s.twinkle
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
