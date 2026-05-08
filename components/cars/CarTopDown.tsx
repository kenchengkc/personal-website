type Props = {
  fill?: string;
  className?: string;
};

// Top-down view of an open-wheel racing car. Reads as "F1 from above"
// at small sizes (timeline marker) without livery or markings.
export function CarTopDown({ fill = "currentColor", className }: Props) {
  return (
    <svg
      viewBox="0 0 60 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g fill={fill}>
        {/* Front wing */}
        <rect x="6" y="0" width="48" height="3" rx="1" />
        {/* Front-wing endplates */}
        <rect x="3" y="0" width="3" height="6" />
        <rect x="54" y="0" width="3" height="6" />
        {/* Nose cone */}
        <path d="M 24 3 L 36 3 L 34 16 L 26 16 Z" />
        {/* Front tires */}
        <rect x="0" y="14" width="9" height="14" rx="1.5" />
        <rect x="51" y="14" width="9" height="14" rx="1.5" />
        {/* Chassis / sidepods */}
        <path d="M 22 16 L 38 16 L 42 30 L 42 64 L 38 78 L 22 78 L 18 64 L 18 30 Z" />
        {/* Halo (slightly darker via opacity) */}
        <ellipse
          cx="30"
          cy="36"
          rx="4"
          ry="6"
          fill="#0a0a0b"
          opacity="0.55"
        />
        {/* Rear tires (wider) */}
        <rect x="0" y="62" width="11" height="18" rx="1.5" />
        <rect x="49" y="62" width="11" height="18" rx="1.5" />
        {/* Rear wing */}
        <rect x="6" y="86" width="48" height="4" rx="1" />
        <rect x="3" y="84" width="3" height="8" />
        <rect x="54" y="84" width="3" height="8" />
      </g>
    </svg>
  );
}
