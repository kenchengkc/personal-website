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
// Layered on top of the photo wheel; fades in only while the car is moving.
function RenderedSpinner({ className }: { className?: string }) {
  const spokeAngles = [0, 60, 120, 180, 240, 300];
  return (
    <span className={className} aria-hidden>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rb-spinner-rim" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.55" stopColor="#0b0b0d" stopOpacity="0" />
            <stop offset="0.78" stopColor="#1a1a1d" stopOpacity="0.95" />
            <stop offset="1" stopColor="#000" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Tire shadow ring (mostly transparent in the middle so the photo
            wheel shows through) */}
        <circle cx="50" cy="50" r="48" fill="url(#rb-spinner-rim)" />

        {/* Inner rim disc */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="rgba(15, 17, 22, 0.85)"
          stroke="rgba(60, 64, 72, 0.6)"
          strokeWidth="1.2"
        />

        {/* Spokes — these are what visually "spin" */}
        <g
          stroke="rgba(225, 228, 235, 0.55)"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          {spokeAngles.map((a) => {
            const r1 = 9;
            const r2 = 28;
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

        {/* Center hub + accent nut */}
        <circle
          cx="50"
          cy="50"
          r="9"
          fill="#0d0e12"
          stroke="rgba(80, 86, 96, 0.7)"
          strokeWidth="1.2"
        />
        <circle cx="50" cy="50" r="3.5" fill="#dc0000" />

        {/* High-contrast indicator marker so spin is unmistakable up close */}
        <circle cx="50" cy="22" r="2.4" fill="#ffd45c" />
      </svg>
    </span>
  );
}
