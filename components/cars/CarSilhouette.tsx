type Props = {
  fill?: string;
  className?: string;
};

export function CarSilhouette({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1180 330"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="rb-carbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16213a" />
          <stop offset="0.44" stopColor="#060c18" />
          <stop offset="1" stopColor="#010308" />
        </linearGradient>
        <linearGradient id="rb-carbon-soft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#10192b" />
          <stop offset="0.56" stopColor="#050913" />
          <stop offset="1" stopColor="#000207" />
        </linearGradient>
        <linearGradient id="rb-yellow-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffde65" />
          <stop offset="0.5" stopColor="#f7a700" />
          <stop offset="1" stopColor="#d66c00" />
        </linearGradient>
        <linearGradient id="rb-red-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff342a" />
          <stop offset="0.52" stopColor="#df0000" />
          <stop offset="1" stopColor="#820000" />
        </linearGradient>
        <radialGradient id="rb-tire" cx="0.5" cy="0.5" r="0.62">
          <stop offset="0" stopColor="#252a31" />
          <stop offset="0.44" stopColor="#090b10" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <filter id="rb-car-shadow" x="-6%" y="-12%" width="112%" height="140%">
          <feDropShadow
            dx="0"
            dy="13"
            stdDeviation="8"
            floodColor="#000"
            floodOpacity="0.62"
          />
        </filter>
      </defs>

      <ellipse cx="590" cy="286" rx="535" ry="16" fill="#000" opacity="0.5" />

      <g filter="url(#rb-car-shadow)" strokeLinejoin="round">
        <g className="rb-wheel rb-wheel-front">
          <circle cx="325" cy="226" r="70" fill="url(#rb-tire)" />
          <circle
            cx="325"
            cy="226"
            r="57"
            fill="none"
            stroke="#dc0000"
            strokeWidth="7"
          />
          <circle
            cx="325"
            cy="226"
            r="40"
            fill="#05070c"
            stroke="#263244"
            strokeWidth="7"
          />
          <path
            d="M325 186 L325 266 M285 226 L365 226 M297 198 L353 254 M353 198 L297 254"
            stroke="#5f6b7a"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M281 180 A70 70 0 0 1 366 187"
            fill="none"
            stroke="#ef0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M359 270 A70 70 0 0 1 284 269"
            fill="none"
            stroke="#ef0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            cx="325"
            cy="226"
            r="10"
            fill="#d8df00"
            stroke="#030407"
            strokeWidth="4"
          />
        </g>

        <g className="rb-wheel rb-wheel-rear">
          <circle cx="965" cy="213" r="73" fill="url(#rb-tire)" />
          <circle
            cx="965"
            cy="213"
            r="60"
            fill="none"
            stroke="#dc0000"
            strokeWidth="7"
          />
          <circle
            cx="965"
            cy="213"
            r="41"
            fill="#05070c"
            stroke="#263244"
            strokeWidth="7"
          />
          <path
            d="M965 172 L965 254 M924 213 L1006 213 M936 184 L994 242 M994 184 L936 242"
            stroke="#5f6b7a"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M920 166 A73 73 0 0 1 1011 174"
            fill="none"
            stroke="#ef0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M1002 260 A73 73 0 0 1 925 258"
            fill="none"
            stroke="#ef0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            cx="965"
            cy="213"
            r="10"
            fill="#d8df00"
            stroke="#030407"
            strokeWidth="4"
          />
        </g>

        <g className="rb-front-wing">
          <path
            d="M34 232 L224 232 L254 247 L202 262 L44 256 Z"
            fill="#050811"
            stroke="#010307"
            strokeWidth="5"
          />
          <path
            d="M42 199 L42 164 L136 151 L194 164 L194 225 L70 224 Z"
            fill="url(#rb-carbon-soft)"
            stroke="#010307"
            strokeWidth="5"
          />
          <path
            d="M50 178 L145 164 L181 172 L72 193 Z"
            fill="#121c30"
            stroke="#273247"
            strokeWidth="3"
          />
          <path
            d="M58 229 L218 230"
            stroke="#df0000"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M92 216 L171 208"
            stroke="#f4a900"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M111 246 L171 251"
            stroke="#df0000"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <text
            x="83"
            y="207"
            fill="#f8fafc"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="31"
            fontWeight="900"
            letterSpacing="-1"
          >
            11
          </text>
        </g>

        <path
          className="rb-floor"
          d="M210 246 C332 254 514 254 694 238 C786 230 863 216 922 196 L1025 205 C933 245 776 269 552 278 C412 283 294 275 210 246 Z"
          fill="#02050b"
          stroke="#111b2f"
          strokeWidth="5"
        />
        <path
          d="M382 258 C507 244 719 238 850 214"
          fill="none"
          stroke="#27344a"
          strokeWidth="5"
          opacity="0.9"
        />

        <path
          className="rb-main-body"
          d="M112 204 C169 178 252 158 369 148 L493 140 C548 134 596 122 659 102 L743 78 C816 64 897 84 959 132 L1015 177 C953 197 856 215 724 226 L407 249 C278 255 172 239 112 204 Z"
          fill="url(#rb-carbon)"
          stroke="#010307"
          strokeWidth="6"
        />

        <path
          className="rb-yellow-nose"
          d="M114 197 C169 174 248 158 366 149 L438 145 C394 164 317 181 227 190 C181 195 143 198 114 197 Z"
          fill="url(#rb-yellow-panel)"
          stroke="#06070b"
          strokeWidth="5"
        />
        <path
          className="rb-red-nose-livery"
          d="M160 193 C193 174 232 168 272 177 C243 188 219 202 197 219 C188 206 178 198 160 193 Z"
          fill="url(#rb-red-panel)"
          stroke="#330000"
          strokeWidth="3"
        />
        <path
          d="M168 190 C198 169 230 171 265 186"
          fill="none"
          stroke="#ffd02a"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <path
          className="rb-cockpit-shell"
          d="M352 149 C421 132 506 125 584 129 C554 143 526 162 509 187 L331 195 C284 197 241 195 206 188 C260 176 311 163 352 149 Z"
          fill="#101a2d"
          stroke="#02040a"
          strokeWidth="5"
        />
        <path
          d="M366 170 L526 168 L509 187 L342 193 Z"
          fill="#050912"
          stroke="#1c2a43"
          strokeWidth="3"
          opacity="0.95"
        />

        <path
          className="rb-engine-cover"
          d="M602 100 C673 82 778 84 869 131 C839 165 782 181 705 180 L571 165 C536 151 537 122 602 100 Z"
          fill="url(#rb-yellow-panel)"
          stroke="#05070b"
          strokeWidth="6"
        />
        <path
          className="rb-airbox"
          d="M555 140 L592 99 L643 94 L631 167 L558 168 Z"
          fill="url(#rb-yellow-panel)"
          stroke="#05070b"
          strokeWidth="6"
        />
        <ellipse
          cx="574"
          cy="124"
          rx="24"
          ry="31"
          fill="#03060c"
          stroke="#141e31"
          strokeWidth="5"
        />
        <path
          d="M548 95 L638 92 L650 104 L561 112 Z"
          fill="#050811"
          stroke="#1a2438"
          strokeWidth="4"
        />

        <path
          className="rb-sidepod"
          d="M651 157 C720 170 801 179 907 168 C881 202 816 226 702 236 L431 250 C357 252 291 244 236 229 C306 211 392 202 492 198 L624 190 C635 176 644 166 651 157 Z"
          fill="#030711"
          stroke="#111b2f"
          strokeWidth="5"
        />
        <path
          d="M595 180 L759 193"
          fill="none"
          stroke="#df0000"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M675 232 C726 227 786 216 833 198"
          fill="none"
          stroke="#1c2840"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <g opacity="0.84">
          <path d="M468 244 L512 235" stroke="#28354b" strokeWidth="4" />
          <path d="M516 244 L560 234" stroke="#28354b" strokeWidth="4" />
          <path d="M566 241 L611 232" stroke="#28354b" strokeWidth="4" />
          <path d="M615 238 L661 229" stroke="#28354b" strokeWidth="4" />
        </g>

        <g className="rb-halo">
          <path
            d="M500 146 C508 111 538 90 578 87 C616 85 648 104 661 135"
            fill="none"
            stroke="#010307"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M508 145 C516 121 541 107 576 106 C608 106 632 119 642 139"
            fill="none"
            stroke="#253147"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <ellipse
            cx="566"
            cy="137"
            rx="29"
            ry="25"
            fill="#121a2b"
            stroke="#02040a"
            strokeWidth="4"
          />
          <path
            d="M541 130 Q566 108 591 130 L590 143 L542 143 Z"
            fill="#e7eef9"
            opacity="0.6"
          />
          <path
            d="M550 120 Q569 106 589 122"
            fill="none"
            stroke="#df0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        <g className="rb-suspension">
          <path
            d="M388 168 L270 214"
            stroke="#02050b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M404 183 L348 221"
            stroke="#02050b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M771 177 L929 212"
            stroke="#02050b"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M821 169 L976 211"
            stroke="#02050b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M271 214 L348 221"
            stroke="#26344b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M929 212 L976 211"
            stroke="#26344b"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        <g className="rb-rear-wing">
          <path
            d="M895 95 L1017 83 L1110 115 L1087 138 L920 130 Z"
            fill="#050811"
            stroke="#010307"
            strokeWidth="5"
          />
          <path
            d="M884 122 L1115 149 L1104 170 L895 149 Z"
            fill="#070b13"
            stroke="#010307"
            strokeWidth="5"
          />
          <path
            d="M890 87 L905 197 L927 197 L916 87 Z"
            fill="#02050b"
            stroke="#0d1424"
            strokeWidth="4"
          />
          <path
            d="M1076 112 L1132 120 L1123 192 L1060 184 Z"
            fill="#090e18"
            stroke="#010307"
            strokeWidth="5"
          />
          <path
            d="M951 121 L1065 137"
            stroke="#28354b"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <text
            x="962"
            y="134"
            fill="#f8fafc"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="31"
            fontWeight="900"
            transform="rotate(9 962 134)"
          >
            HONDA
          </text>
          <text
            x="1070"
            y="174"
            fill="#f8fafc"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="22"
            fontWeight="900"
          >
            1
          </text>
        </g>

        <g className="rb-bull-livery">
          <path
            d="M688 124 C725 99 764 100 807 126 C774 128 743 136 714 154 C707 142 698 132 688 124 Z"
            fill="url(#rb-red-panel)"
            stroke="#4d0000"
            strokeWidth="3"
          />
          <path
            d="M696 124 C730 96 766 99 801 125"
            fill="none"
            stroke="#ffd02a"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M758 121 L812 107"
            stroke="#ffd02a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="754" cy="120" r="5" fill="#ffd02a" />
          <path
            d="M721 137 C745 128 768 129 792 142"
            fill="none"
            stroke="#ffd02a"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        <text
          x="525"
          y="221"
          fill="#f8fafc"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="56"
          fontWeight="900"
          letterSpacing="3"
        >
          ORACLE
        </text>
        <text
          x="770"
          y="196"
          fill="#df0000"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="35"
          fontWeight="900"
        >
          RedBull
        </text>
        <text
          x="443"
          y="172"
          fill="#f8fafc"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="800"
        >
          ROKT
        </text>
        <text
          x="356"
          y="179"
          fill="#f8fafc"
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="800"
        >
          1Password
        </text>
        <text
          x="772"
          y="153"
          fill="#df0000"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="38"
          fontWeight="900"
        >
          1
        </text>
      </g>
    </svg>
  );
}
