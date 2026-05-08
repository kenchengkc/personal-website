type Props = {
  fill?: string;
  className?: string;
};

export function CarSilhouette({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1120 310"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="rb-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#101828" />
          <stop offset="0.48" stopColor="#050b17" />
          <stop offset="1" stopColor="#00040a" />
        </linearGradient>
        <linearGradient id="rb-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd45c" />
          <stop offset="0.52" stopColor="#f59b00" />
          <stop offset="1" stopColor="#d66a00" />
        </linearGradient>
        <linearGradient id="rb-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff2a20" />
          <stop offset="1" stopColor="#b30000" />
        </linearGradient>
        <radialGradient id="rb-tire" cx="0.48" cy="0.48" r="0.58">
          <stop offset="0" stopColor="#22242a" />
          <stop offset="0.55" stopColor="#07080b" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <filter id="rb-shadow" x="-8%" y="-12%" width="116%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="#000" floodOpacity="0.58" />
        </filter>
      </defs>

      <ellipse cx="560" cy="268" rx="520" ry="14" fill="#000" opacity="0.48" />

      <g filter="url(#rb-shadow)">
        <g>
          <circle cx="305" cy="220" r="58" fill="url(#rb-tire)" />
          <circle cx="305" cy="220" r="47" fill="none" stroke="#dc0000" strokeWidth="6" opacity="0.92" />
          <circle cx="305" cy="220" r="31" fill="#05070b" stroke="#202936" strokeWidth="6" />
          <circle cx="305" cy="220" r="9" fill="#d4e000" stroke="#06070a" strokeWidth="4" />
          <path d="M260 192 Q305 178 350 192" fill="none" stroke="#111827" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
        </g>

        <g>
          <circle cx="932" cy="207" r="62" fill="url(#rb-tire)" />
          <circle cx="932" cy="207" r="50" fill="none" stroke="#dc0000" strokeWidth="7" opacity="0.92" />
          <circle cx="932" cy="207" r="33" fill="#05070b" stroke="#1c2634" strokeWidth="6" />
          <circle cx="932" cy="207" r="9" fill="#d4e000" stroke="#06070a" strokeWidth="4" />
        </g>

        <g>
          <path d="M36 210 L36 166 L126 154 L176 169 L174 229 L56 231 Z" fill="#05080d" />
          <path d="M42 176 L141 164 L166 173 L56 190 Z" fill="#111827" />
          <path d="M16 226 L210 226 L228 239 L76 248 L20 241 Z" fill="#070a10" />
          <path d="M35 225 L216 225" stroke="#dc0000" strokeWidth="5" strokeLinecap="round" />
          <path d="M84 214 L162 206" stroke="#f6a400" strokeWidth="5" strokeLinecap="round" />
          <path d="M104 236 L160 241" stroke="#dc0000" strokeWidth="6" strokeLinecap="round" />
          <text x="78" y="196" fill="#f3f4f6" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="800">11</text>
        </g>

        <path
          d="M92 196 C140 178 218 160 326 151 L424 144 C486 137 539 126 602 111 L704 91 C766 83 833 99 883 131 L940 167 C898 183 818 201 711 212 L406 235 C276 244 160 232 92 196 Z"
          fill="url(#rb-body)"
        />

        <path
          d="M95 190 C144 173 220 157 326 149 L398 144 C351 161 286 175 207 185 C162 190 125 193 95 190 Z"
          fill="url(#rb-yellow)"
        />
        <path
          d="M602 100 C674 86 766 89 846 129 C824 155 774 171 704 172 L566 158 C536 145 538 121 602 100 Z"
          fill="url(#rb-yellow)"
        />
        <path
          d="M548 135 L585 98 L635 93 L617 163 L556 163 Z"
          fill="url(#rb-yellow)"
        />
        <ellipse cx="565" cy="121" rx="24" ry="32" fill="#05070b" />
        <path d="M547 94 L617 91 L628 101 L560 109 Z" fill="#080b12" />

        <path
          d="M352 149 C421 134 491 126 559 128 C536 142 512 157 494 180 L329 187 C292 189 250 191 208 185 C260 173 308 161 352 149 Z"
          fill="#111827"
        />
        <path
          d="M338 167 L512 166 L495 183 L327 188 Z"
          fill="#05070b"
          opacity="0.72"
        />

        <path
          d="M488 146 C496 113 525 94 563 91 C598 89 626 104 638 132"
          fill="none"
          stroke="#03050a"
          strokeWidth="17"
          strokeLinecap="round"
        />
        <path
          d="M495 145 C501 121 526 108 561 107 C593 107 615 119 624 138"
          fill="none"
          stroke="#1b2330"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <ellipse cx="552" cy="132" rx="27" ry="24" fill="#121826" />
        <path d="M529 125 Q552 105 575 125 L574 138 L530 138 Z" fill="#e5e7eb" opacity="0.55" />
        <path d="M537 116 Q554 103 573 118" fill="none" stroke="#dc0000" strokeWidth="5" />

        <path
          d="M665 156 C725 166 789 174 866 168 C846 198 782 218 684 225 L420 239 C357 241 297 238 241 228 C301 212 374 203 462 200 L618 191 C637 176 652 165 665 156 Z"
          fill="#03060b"
          opacity="0.94"
        />
        <path d="M410 230 C534 217 704 215 826 201" fill="none" stroke="#1f2937" strokeWidth="5" opacity="0.9" />
        <path d="M604 177 L744 188" stroke="#dc0000" strokeWidth="5" strokeLinecap="round" />

        <path d="M395 168 L260 211" stroke="#05070b" strokeWidth="7" strokeLinecap="round" />
        <path d="M404 181 L342 217" stroke="#05070b" strokeWidth="7" strokeLinecap="round" />
        <path d="M770 179 L895 205" stroke="#05070b" strokeWidth="8" strokeLinecap="round" />
        <path d="M815 171 L940 206" stroke="#05070b" strokeWidth="7" strokeLinecap="round" />

        <g>
          <path d="M860 96 L978 85 L1062 114 L1042 134 L884 128 Z" fill="#05070b" />
          <path d="M850 121 L1067 147 L1056 165 L860 147 Z" fill="#070a10" />
          <path d="M857 88 L870 190 L889 190 L879 88 Z" fill="#03050a" />
          <path d="M1032 112 L1084 119 L1076 190 L1017 183 Z" fill="#090c13" />
          <path d="M912 121 L1020 136" stroke="#1f2937" strokeWidth="7" strokeLinecap="round" />
          <text x="926" y="132" fill="#f8fafc" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="900" transform="rotate(10 926 132)">HONDA</text>
          <text x="1000" y="170" fill="#f8fafc" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="800">1</text>
        </g>

        <path
          d="M676 119 C719 115 775 121 821 144 C789 144 748 139 704 131 Z"
          fill="url(#rb-red)"
        />
        <path
          d="M641 136 C677 116 707 114 737 130 C710 137 685 146 660 165 C658 151 651 143 641 136 Z"
          fill="url(#rb-red)"
        />
        <path
          d="M155 185 C184 171 218 166 253 171 C228 181 206 192 186 207 C180 196 171 189 155 185 Z"
          fill="url(#rb-red)"
        />
        <path d="M652 127 C683 102 711 104 742 126" fill="none" stroke="#ffc400" strokeWidth="6" strokeLinecap="round" />
        <path d="M163 181 C190 163 219 164 249 178" fill="none" stroke="#ffc400" strokeWidth="5" strokeLinecap="round" />
        <circle cx="698" cy="122" r="5" fill="#ffc400" />
        <circle cx="217" cy="174" r="4" fill="#ffc400" />

        <text x="520" y="210" fill="#f8fafc" fontFamily="Arial Black, Arial, sans-serif" fontSize="52" fontWeight="900" letterSpacing="3">ORACLE</text>
        <text x="756" y="190" fill="#dc0000" fontFamily="Arial, sans-serif" fontSize="34" fontWeight="900">RedBull</text>
        <text x="434" y="169" fill="#f8fafc" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="800">ROKT</text>
        <text x="358" y="171" fill="#f8fafc" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="800">1Password</text>
        <text x="738" y="148" fill="#dc0000" fontFamily="Arial, sans-serif" fontSize="35" fontWeight="900">1</text>

        <g opacity="0.75">
          <path d="M210 225 L272 235" stroke="#111827" strokeWidth="9" strokeLinecap="round" />
          <path d="M676 230 C720 224 768 215 811 198" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <path d="M470 232 L512 224" stroke="#202a37" strokeWidth="4" />
          <path d="M516 231 L558 222" stroke="#202a37" strokeWidth="4" />
          <path d="M562 229 L604 220" stroke="#202a37" strokeWidth="4" />
        </g>

        <g opacity="0.9">
          <path d="M320 206 C333 197 348 194 363 198" fill="none" stroke="#dc0000" strokeWidth="4" />
          <path d="M910 193 C925 184 943 184 958 192" fill="none" stroke="#dc0000" strokeWidth="4" />
        </g>
      </g>
    </svg>
  );
}
