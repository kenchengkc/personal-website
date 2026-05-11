type Livery = "blue" | "dark" | "ghost" | "accent";

type Props = {
  accent?: string;
  livery?: Livery;
  detailed?: boolean;
  className?: string;
};

export function RacingCar({
  accent = "#3f59a0",
  livery = "blue",
  detailed = true,
  className = "",
}: Props) {
  const palettes: Record<
    Livery,
    {
      body: string;
      dark: string;
      stripe: string;
      tire: string;
      rim: string;
      glass: string;
    }
  > = {
    blue: {
      body: accent,
      dark: "#001e3c",
      stripe: "#0a0a0b",
      tire: "#0c0c0d",
      rim: "#2a2a2e",
      glass: "#0a0a0b",
    },
    dark: {
      body: "#1c1c1f",
      dark: "#0a0a0b",
      stripe: accent,
      tire: "#0c0c0d",
      rim: "#3a3a3e",
      glass: "#0a0a0b",
    },
    ghost: {
      body: "#2a2a2e",
      dark: "#0a0a0b",
      stripe: "#444",
      tire: "#0c0c0d",
      rim: "#2a2a2e",
      glass: "#0a0a0b",
    },
    accent: {
      body: accent,
      dark: "#001e3c",
      stripe: "#fff",
      tire: "#0c0c0d",
      rim: "#3a3a3e",
      glass: "#0a0a0b",
    },
  };

  const palette = palettes[livery];
  const id = livery;

  return (
    <svg
      viewBox="0 0 880 220"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={`bodyGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.body} stopOpacity="1" />
          <stop offset="60%" stopColor={palette.body} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.dark} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`tireGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1d" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <radialGradient id={`rimGrad-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#444" />
          <stop offset="70%" stopColor="#222" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </radialGradient>
        <filter
          id={`carShadow-${id}`}
          x="-10%"
          y="-10%"
          width="120%"
          height="140%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dx="0" dy="6" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="440" cy="195" rx="380" ry="8" fill="#000" opacity="0.55" />

      <g filter={`url(#carShadow-${id})`}>
        {/* Front wing */}
        <path
          d="M 30 158 L 30 168 L 130 168 L 145 162 L 145 158 Z"
          fill={palette.dark}
        />
        <rect x="30" y="166" width="115" height="3" fill={palette.body} />
        {[42, 58, 74, 90, 106, 122].map((x) => (
          <rect key={x} x={x} y="155" width="2" height="6" fill={palette.body} />
        ))}

        {/* Nose cone */}
        <path
          d="M 60 150 L 220 150 L 245 138 L 245 132 L 220 122 L 80 122 L 60 132 Z"
          fill={`url(#bodyGrad-${id})`}
        />
        <path
          d="M 80 132 L 220 130 L 240 132 L 240 138 L 220 142 L 80 144 Z"
          fill={palette.stripe}
          opacity="0.85"
        />

        {/* Sidepod / chassis */}
        <path
          d="M 245 142 L 245 122 L 320 100 L 470 95 L 540 102 L 600 110 L 660 130 L 720 142 L 720 168 L 245 168 Z"
          fill={`url(#bodyGrad-${id})`}
        />

        {/* Halo */}
        <path
          d="M 380 95 Q 380 58 430 56 Q 480 56 480 95"
          stroke={palette.dark}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 380 95 Q 380 58 430 56 Q 480 56 480 95"
          stroke="#000"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />

        {/* Cockpit */}
        <path
          d="M 388 98 Q 395 80 430 78 Q 470 80 475 98 L 475 110 L 388 110 Z"
          fill={palette.glass}
        />

        {detailed && (
          <g>
            <ellipse cx="430" cy="92" rx="22" ry="20" fill="#0d0d10" />
            <path
              d="M 410 88 Q 430 70 450 88 L 450 95 L 410 95 Z"
              fill={palette.stripe}
              opacity="0.9"
            />
            <rect x="416" y="93" width="28" height="5" fill="#1a1a1d" />
            <rect
              x="416"
              y="93"
              width="28"
              height="2"
              fill={palette.body}
              opacity="0.7"
            />
          </g>
        )}

        {/* Engine cover */}
        <path
          d="M 470 95 L 540 102 L 600 110 L 615 118 L 540 110 L 470 105 Z"
          fill={palette.dark}
        />

        {/* Side stripe */}
        <path
          d="M 260 145 L 700 145 L 700 152 L 260 158 Z"
          fill={palette.stripe}
          opacity="0.75"
        />

        {/* Air intake */}
        <path
          d="M 320 110 L 380 105 L 380 130 L 320 130 Z"
          fill={palette.dark}
          opacity="0.85"
        />
        <rect x="328" y="116" width="44" height="3" fill="#000" />
        <rect x="328" y="121" width="44" height="3" fill="#000" />

        {detailed && (
          <g>
            <rect x="510" y="112" width="36" height="24" fill="#fff" opacity="0.92" />
            <text
              x="528"
              y="132"
              textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="800"
              fontSize="20"
              fill={accent}
            >
              07
            </text>
          </g>
        )}

        {/* Rear wing */}
        <path
          d="M 720 80 L 720 168 L 820 168 L 820 158 L 740 158 L 740 80 Z"
          fill={palette.dark}
        />
        <rect x="720" y="80" width="100" height="10" fill={palette.body} />
        <rect x="720" y="95" width="100" height="4" fill={palette.body} opacity="0.5" />
        <rect x="720" y="105" width="100" height="3" fill={palette.body} opacity="0.4" />
        <rect x="725" y="83" width="90" height="3" fill={palette.stripe} opacity="0.8" />
        <rect x="816" y="80" width="6" height="88" fill={palette.body} />
        <rect x="818" y="82" width="2" height="84" fill={palette.dark} />

        {/* Suspension */}
        <line x1="190" y1="155" x2="160" y2="170" stroke={palette.dark} strokeWidth="3" />
        <line x1="220" y1="155" x2="200" y2="170" stroke={palette.dark} strokeWidth="3" />
        <line x1="630" y1="155" x2="600" y2="170" stroke={palette.dark} strokeWidth="3" />
        <line x1="660" y1="155" x2="690" y2="170" stroke={palette.dark} strokeWidth="3" />

        {/* Tires */}
        <circle cx="180" cy="170" r="32" fill={`url(#tireGrad-${id})`} />
        <circle cx="180" cy="170" r="16" fill={`url(#rimGrad-${id})`} />
        <circle cx="180" cy="170" r="6" fill="#000" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line
            key={a}
            x1="180"
            y1="170"
            x2={180 + 14 * Math.cos((a * Math.PI) / 180)}
            y2={170 + 14 * Math.sin((a * Math.PI) / 180)}
            stroke="#0a0a0b"
            strokeWidth="2"
          />
        ))}
        <circle cx="660" cy="170" r="36" fill={`url(#tireGrad-${id})`} />
        <circle cx="660" cy="170" r="18" fill={`url(#rimGrad-${id})`} />
        <circle cx="660" cy="170" r="7" fill="#000" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line
            key={a}
            x1="660"
            y1="170"
            x2={660 + 16 * Math.cos((a * Math.PI) / 180)}
            y2={170 + 16 * Math.sin((a * Math.PI) / 180)}
            stroke="#0a0a0b"
            strokeWidth="2"
          />
        ))}
        <circle cx="180" cy="170" r="28" fill="none" stroke="#222" strokeWidth="1" />
        <circle cx="660" cy="170" r="32" fill="none" stroke="#222" strokeWidth="1" />
        <circle
          cx="180"
          cy="170"
          r="11"
          fill="none"
          stroke={accent}
          strokeWidth="0.5"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
