type Props = {
  fill?: string;
  className?: string;
};

// Side-profile open-wheel car silhouette. No livery, no markings,
// no sponsor logos: pure shape, reads as "F1" instantly.
export function CarSilhouette({
  fill = "currentColor",
  className,
}: Props) {
  return (
    <svg
      viewBox="0 0 880 220"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g fill={fill}>
        {/* Front wing + endplate */}
        <path d="M 30 158 L 30 168 L 130 168 L 145 162 L 145 158 Z" />
        <rect x="30" y="166" width="115" height="3" />
        <rect x="42" y="155" width="2" height="6" />
        <rect x="58" y="155" width="2" height="6" />
        <rect x="74" y="155" width="2" height="6" />
        <rect x="90" y="155" width="2" height="6" />
        <rect x="106" y="155" width="2" height="6" />
        <rect x="122" y="155" width="2" height="6" />

        {/* Nose cone */}
        <path d="M 60 150 L 220 150 L 245 138 L 245 132 L 220 122 L 80 122 L 60 132 Z" />

        {/* Chassis / sidepod */}
        <path d="M 245 142 L 245 122 L 320 100 L 470 95 L 540 102 L 600 110 L 660 130 L 720 142 L 720 168 L 245 168 Z" />

        {/* Halo */}
        <path
          d="M 380 95 Q 380 58 430 56 Q 480 56 480 95"
          stroke={fill}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Engine cover / shark fin */}
        <path d="M 470 95 L 540 102 L 600 110 L 615 118 L 540 110 L 470 105 Z" />

        {/* Rear wing assembly */}
        <path d="M 720 80 L 720 168 L 820 168 L 820 158 L 740 158 L 740 80 Z" />
        <rect x="720" y="80" width="100" height="10" />
        <rect x="816" y="80" width="6" height="88" />

        {/* Suspension wishbones */}
        <line x1="190" y1="155" x2="160" y2="170" stroke={fill} strokeWidth="3" />
        <line x1="220" y1="155" x2="200" y2="170" stroke={fill} strokeWidth="3" />
        <line x1="630" y1="155" x2="600" y2="170" stroke={fill} strokeWidth="3" />
        <line x1="660" y1="155" x2="690" y2="170" stroke={fill} strokeWidth="3" />

        {/* Tires */}
        <circle cx="180" cy="170" r="32" />
        <circle cx="660" cy="170" r="36" />
      </g>
    </svg>
  );
}
