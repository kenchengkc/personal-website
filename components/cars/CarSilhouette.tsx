type Props = {
  fill?: string;
  className?: string;
};

export function CarSilhouette({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 330"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="rb-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#17233a" />
          <stop offset="0.5" stopColor="#050b17" />
          <stop offset="1" stopColor="#01040a" />
        </linearGradient>
        <linearGradient id="rb-black" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#07101d" />
          <stop offset="0.5" stopColor="#02050b" />
          <stop offset="1" stopColor="#000207" />
        </linearGradient>
        <linearGradient id="rb-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffdf67" />
          <stop offset="0.48" stopColor="#f5a400" />
          <stop offset="1" stopColor="#d86b00" />
        </linearGradient>
        <linearGradient id="rb-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff352c" />
          <stop offset="0.55" stopColor="#df0000" />
          <stop offset="1" stopColor="#820000" />
        </linearGradient>
        <radialGradient id="rb-tyre" cx="0.5" cy="0.48" r="0.62">
          <stop offset="0" stopColor="#283241" />
          <stop offset="0.45" stopColor="#070a10" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <filter id="rb-shadow" x="-5%" y="-14%" width="110%" height="145%">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="8"
            floodColor="#000"
            floodOpacity="0.62"
          />
        </filter>
      </defs>

      <ellipse cx="604" cy="286" rx="522" ry="15" fill="#000" opacity="0.48" />

      <g filter="url(#rb-shadow)" strokeLinejoin="round">
        <path
          d="M122 250 C278 268 511 271 726 250 C842 239 942 221 1038 191 L1080 213 C976 258 806 282 552 288 C360 291 210 277 122 250 Z"
          fill="#02050b"
          stroke="#101b2e"
          strokeWidth="6"
        />

        <g>
          <path
            d="M35 236 L210 236 L256 252 L202 266 L42 260 Z"
            fill="#040811"
            stroke="#010308"
            strokeWidth="6"
          />
          <path
            d="M52 198 L52 164 L158 152 L220 170 L210 226 L74 226 Z"
            fill="#0e182a"
            stroke="#010308"
            strokeWidth="6"
          />
          <path d="M66 178 L158 164 L202 174 L88 196 Z" fill="#1c2940" stroke="#31425c" strokeWidth="4" />
          <path d="M62 238 L219 239" stroke="#e00000" strokeWidth="7" strokeLinecap="round" />
          <path d="M112 254 L183 258" stroke="#e00000" strokeWidth="8" strokeLinecap="round" />
          <text
            x="86"
            y="218"
            fill="#f8fafc"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="34"
            fontWeight="900"
          >
            11
          </text>
        </g>

        <path
          d="M115 209 C178 181 273 163 402 151 L526 141 C594 135 642 117 706 94 L777 70 C849 53 930 73 991 121 L1052 169 C982 190 866 209 722 221 L415 247 C279 256 173 240 115 209 Z"
          fill="url(#rb-dark)"
          stroke="#010308"
          strokeWidth="7"
        />

        <path
          d="M116 202 C180 176 279 160 407 151 L482 147 C418 171 330 187 229 197 C181 202 143 204 116 202 Z"
          fill="url(#rb-yellow)"
          stroke="#05070b"
          strokeWidth="6"
        />
        <path
          d="M176 199 C214 177 259 172 306 184 C270 194 238 210 210 229 C202 214 190 204 176 199 Z"
          fill="url(#rb-red)"
          stroke="#410000"
          strokeWidth="4"
        />
        <path
          d="M184 196 C219 174 257 176 298 190"
          fill="none"
          stroke="#ffd233"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M359 151 C435 132 525 126 609 133 C573 149 541 169 522 194 L329 201 C276 202 235 198 204 190 C263 177 315 164 359 151 Z"
          fill="#101a2d"
          stroke="#02040a"
          strokeWidth="6"
        />
        <path
          d="M387 174 L535 172 L516 192 L351 197 Z"
          fill="#06101e"
          stroke="#22324c"
          strokeWidth="4"
        />

        <path
          d="M604 103 C680 81 792 83 885 130 C854 164 794 181 714 178 L575 162 C542 148 543 123 604 103 Z"
          fill="url(#rb-yellow)"
          stroke="#05070b"
          strokeWidth="7"
        />
        <path
          d="M562 143 L603 100 L655 96 L642 169 L564 171 Z"
          fill="url(#rb-yellow)"
          stroke="#05070b"
          strokeWidth="7"
        />
        <ellipse cx="584" cy="127" rx="24" ry="31" fill="#03060c" stroke="#17243a" strokeWidth="5" />
        <path d="M554 96 L653 92 L666 105 L568 113 Z" fill="#050914" stroke="#1a2940" strokeWidth="4" />

        <path
          d="M657 159 C735 173 819 177 917 166 C895 202 824 227 705 239 L441 254 C366 255 293 246 235 229 C310 212 399 203 502 199 L625 191 C637 177 648 166 657 159 Z"
          fill="#02070f"
          stroke="#142037"
          strokeWidth="6"
        />
        <path d="M616 182 L765 194" stroke="#e00000" strokeWidth="6" strokeLinecap="round" />
        <path d="M411 249 C538 236 708 230 846 203" stroke="#263752" strokeWidth="5" fill="none" />

        <g>
          <path
            d="M508 147 C517 111 546 90 585 87 C625 84 657 102 671 135"
            fill="none"
            stroke="#010308"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M516 145 C526 121 551 108 583 107 C616 107 641 119 652 139"
            fill="none"
            stroke="#263752"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <ellipse cx="573" cy="138" rx="29" ry="25" fill="#141e31" stroke="#02040a" strokeWidth="4" />
          <path d="M548 131 Q574 109 598 131 L597 144 L549 144 Z" fill="#dbe5f5" opacity="0.66" />
          <path d="M556 122 Q575 109 594 123" fill="none" stroke="#e00000" strokeWidth="5" strokeLinecap="round" />
        </g>

        <g>
          <path d="M394 170 L284 219" stroke="#010308" strokeWidth="8" strokeLinecap="round" />
          <path d="M418 188 L357 232" stroke="#010308" strokeWidth="8" strokeLinecap="round" />
          <path d="M775 177 L929 223" stroke="#010308" strokeWidth="9" strokeLinecap="round" />
          <path d="M834 168 L981 222" stroke="#010308" strokeWidth="8" strokeLinecap="round" />
          <path d="M284 219 L357 232" stroke="#2b3c57" strokeWidth="3" strokeLinecap="round" />
          <path d="M929 223 L981 222" stroke="#2b3c57" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g>
          <path
            d="M688 123 C731 94 777 98 824 126 C786 128 753 138 724 158 C716 143 704 131 688 123 Z"
            fill="url(#rb-red)"
            stroke="#410000"
            strokeWidth="4"
          />
          <path
            d="M697 123 C735 96 773 99 815 126"
            fill="none"
            stroke="#ffd233"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path d="M755 124 L824 105" stroke="#ffd233" strokeWidth="6" strokeLinecap="round" />
          <circle cx="768" cy="122" r="6" fill="#ffd233" />
        </g>

        <g>
          <path
            d="M913 93 L1032 82 L1127 115 L1102 139 L936 130 Z"
            fill="#050914"
            stroke="#010308"
            strokeWidth="6"
          />
          <path
            d="M900 122 L1135 149 L1124 171 L914 150 Z"
            fill="#070b13"
            stroke="#010308"
            strokeWidth="6"
          />
          <path d="M906 86 L922 198 L946 198 L934 86 Z" fill="#02050b" stroke="#101a2c" strokeWidth="5" />
          <path d="M1095 112 L1151 120 L1142 191 L1078 184 Z" fill="#090e18" stroke="#010308" strokeWidth="6" />
          <text
            x="980"
            y="134"
            fill="#f8fafc"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="32"
            fontWeight="900"
            transform="rotate(8 980 134)"
          >
            HONDA
          </text>
          <text x="1090" y="175" fill="#f8fafc" fontFamily="Arial Black, Arial, sans-serif" fontSize="22" fontWeight="900">
            1
          </text>
        </g>

        <g className="rb-wheel rb-wheel-front">
          <circle cx="336" cy="235" r="61" fill="url(#rb-tyre)" />
          <circle
            cx="336"
            cy="235"
            r="51"
            fill="none"
            stroke="#e00000"
            strokeWidth="7"
          />
          <circle
            cx="336"
            cy="235"
            r="34"
            fill="#07101a"
            stroke="#2c3b51"
            strokeWidth="6"
          />
          <path
            d="M336 202 L336 268 M303 235 L369 235 M313 212 L359 258 M359 212 L313 258"
            stroke="#697789"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.72"
          />
          <circle
            cx="336"
            cy="235"
            r="9"
            fill="#d7df00"
            stroke="#02040a"
            strokeWidth="4"
          />
        </g>

        <g className="rb-wheel rb-wheel-rear">
          <circle cx="948" cy="224" r="66" fill="url(#rb-tyre)" />
          <circle
            cx="948"
            cy="224"
            r="55"
            fill="none"
            stroke="#e00000"
            strokeWidth="8"
          />
          <circle
            cx="948"
            cy="224"
            r="37"
            fill="#07101a"
            stroke="#2c3b51"
            strokeWidth="6"
          />
          <path
            d="M948 188 L948 260 M912 224 L984 224 M923 199 L973 249 M973 199 L923 249"
            stroke="#697789"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.72"
          />
          <circle
            cx="948"
            cy="224"
            r="9"
            fill="#d7df00"
            stroke="#02040a"
            strokeWidth="4"
          />
        </g>

        <text
          x="527"
          y="223"
          fill="#f8fafc"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="50"
          fontWeight="900"
          letterSpacing="3"
        >
          ORACLE
        </text>
        <text
          x="760"
          y="194"
          fill="#df0000"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="32"
          fontWeight="900"
        >
          RedBull
        </text>
      </g>
    </svg>
  );
}
