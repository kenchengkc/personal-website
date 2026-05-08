import Image from "next/image";

type Props = {
  fill?: string;
  className?: string;
};

export function CarSilhouette({ className }: Props) {
  return (
    <span className={className} aria-hidden>
      {/* Directional motion-blur filter for the wheels. Horizontal-only blur
          so the wheels read as fast-spinning without depending on the photo
          being a perfect axis-aligned circle. */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden
      >
        <defs>
          <filter id="rb-wheel-motion" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4 0" />
          </filter>
        </defs>
      </svg>
      <Image
        src="/images/cars/redbull-real-car.png"
        alt=""
        width={1644}
        height={530}
        className="v2-hero-track-car-img"
        draggable={false}
        priority
        sizes="(max-width: 720px) 88vw, 560px"
      />
      <span className="rb-wheel-shell rb-wheel-shell--front">
        <Image
          src="/images/cars/redbull-wheel-front.png"
          alt=""
          width={184}
          height={184}
          className="rb-wheel"
          draggable={false}
        />
        <RenderedSpinner className="rb-wheel-spinner" />
      </span>
      <span className="rb-wheel-shell rb-wheel-shell--rear">
        <Image
          src="/images/cars/redbull-wheel-rear.png"
          alt=""
          width={176}
          height={176}
          className="rb-wheel"
          draggable={false}
        />
        <RenderedSpinner className="rb-wheel-spinner" />
      </span>
    </span>
  );
}

// A clean axis-aligned circular wheel rendered as SVG so rotation is
// pixel-perfect (the photo wheels are 3/4-angle and would wobble if rotated).
// Layered on top of the photo wheel; the rim disc is sized to fully cover
// the photo wheel's rim so misalignment edges don't peek through.
function RenderedSpinner({ className }: { className?: string }) {
  const spokeAngles = [0, 60, 120, 180, 240, 300];
  return (
    <span className={className} aria-hidden>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rb-spinner-tire" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.78" stopColor="#0b0b0d" stopOpacity="0" />
            <stop offset="0.88" stopColor="#1a1a1d" stopOpacity="0.95" />
            <stop offset="1" stopColor="#000" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="rb-spinner-disc" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#1a1c22" stopOpacity="1" />
            <stop offset="0.7" stopColor="#0e1015" stopOpacity="1" />
            <stop offset="1" stopColor="#06070a" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Outer tire shadow ring (only renders the dark tire edge) */}
        <circle cx="50" cy="50" r="50" fill="url(#rb-spinner-tire)" />

        {/* Red rim trim (Pirelli-style sidewall accent) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(220, 0, 0, 0.6)"
          strokeWidth="1.4"
        />

        {/* Rim disc — fills the visible wheel face so the photo wheel
            beneath is fully covered while spinning */}
        <circle
          cx="50"
          cy="50"
          r="43"
          fill="url(#rb-spinner-disc)"
          stroke="rgba(70, 76, 86, 0.55)"
          strokeWidth="0.8"
        />

        {/* Faint brake-disc concentric ring for depth */}
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="rgba(140, 146, 158, 0.18)"
          strokeWidth="0.6"
        />

        {/* Spokes — extended to reach the rim edge so rotation reads at any
            scale */}
        <g
          stroke="rgba(220, 224, 232, 0.55)"
          strokeWidth="3.2"
          strokeLinecap="round"
        >
          {spokeAngles.map((a) => {
            const r1 = 12;
            const r2 = 39;
            const rad = ((a - 90) * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={50 + r1 * Math.cos(rad)}
                y1={50 + r1 * Math.sin(rad)}
                x2={50 + r2 * Math.cos(rad)}
                y2={50 + r2 * Math.sin(rad)}
              />
            );
          })}
        </g>

        {/* Spoke shadow pass (slightly inset, darker) for depth */}
        <g
          stroke="rgba(0, 0, 0, 0.45)"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          {spokeAngles.map((a) => {
            const r1 = 13;
            const r2 = 38;
            const rad = ((a - 90 + 1.5) * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={50 + r1 * Math.cos(rad)}
                y1={50 + r1 * Math.sin(rad)}
                x2={50 + r2 * Math.cos(rad)}
                y2={50 + r2 * Math.sin(rad)}
              />
            );
          })}
        </g>

        {/* Center hub */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="#0a0b0f"
          stroke="rgba(90, 96, 106, 0.7)"
          strokeWidth="1.2"
        />

        {/* Red center nut (matches photo wheel) */}
        <circle cx="50" cy="50" r="4.5" fill="#dc0000" />
        <circle cx="48.5" cy="48.5" r="1.4" fill="rgba(255, 200, 200, 0.7)" />

        {/* High-contrast valve / marker so rotation reads on close inspection */}
        <circle cx="50" cy="17" r="2.6" fill="#ffd45c" />
      </svg>
    </span>
  );
}
