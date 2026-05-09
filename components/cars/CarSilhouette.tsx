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
          <filter id="rb-wheel-motion" x="-12%" y="-12%" width="124%" height="124%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5 0" />
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
        <SpinningWheelFace className="rb-wheel-spinner" />
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
        <SpinningWheelFace className="rb-wheel-spinner" />
      </span>
    </span>
  );
}

/** Side-view photo of the full wheel (rubber tire + rim/cover), masked to a
 *  circle and stacked over the static wheel plate. Rotates while the hero
 *  track is “running” so motion reads on the tire sidewall and hub together. */
function SpinningWheelFace({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      {/* Hub-centered PNG; only .rb-wheel-spin-scale rotates (globals.css). */}
      <span className="rb-wheel-spin-yaw">
        <span className="rb-wheel-spin-inner">
          <span className="rb-wheel-spin-scale">
            <img
              src="/images/cars/wheel-spin-hub-centered.png"
              alt=""
              width={1006}
              height={1006}
              className="rb-wheel-spin-img"
              draggable={false}
            />
          </span>
        </span>
      </span>
    </span>
  );
}
