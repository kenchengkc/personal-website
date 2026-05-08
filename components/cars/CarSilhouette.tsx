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
        <linearGradient id="rbHeroBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#101827" />
          <stop offset="0.48" stopColor="#050914" />
          <stop offset="1" stopColor="#01030a" />
        </linearGradient>
        <linearGradient id="rbHeroCarbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#152136" />
          <stop offset="1" stopColor="#02050b" />
        </linearGradient>
        <linearGradient id="rbHeroYellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe166" />
          <stop offset="0.5" stopColor="#f4a300" />
          <stop offset="1" stopColor="#d87800" />
        </linearGradient>
        <linearGradient id="rbHeroRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4438" />
          <stop offset="0.52" stopColor="#e00000" />
          <stop offset="1" stopColor="#8b0000" />
        </linearGradient>
        <radialGradient id="rbHeroTyre" cx="0.48" cy="0.48" r="0.64">
          <stop offset="0" stopColor="#202a39" />
          <stop offset="0.54" stopColor="#05080f" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <filter id="rbHeroShadow" x="-6%" y="-18%" width="112%" height="150%">
          <feDropShadow
            dx="0"
            dy="13"
            stdDeviation="8"
            floodColor="#000"
            floodOpacity="0.62"
          />
        </filter>
      </defs>

      <ellipse cx="604" cy="287" rx="500" ry="18" fill="#000" opacity="0.45" />

      <g filter="url(#rbHeroShadow)" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M108 240 C250 267 493 276 720 257 C880 244 1010 213 1105 168 L1132 188 C1028 245 855 276 621 287 C386 297 207 281 95 255 Z"
          fill="#01040a"
          stroke="#0d1728"
          strokeWidth="7"
        />

        <g>
          <path
            d="M42 230 L194 230 L252 247 L186 263 L44 256 Z"
            fill="#02050b"
            stroke="#010206"
            strokeWidth="6"
          />
          <path
            d="M58 185 L61 151 L176 138 L238 157 L211 218 L82 218 Z"
            fill="#101a2c"
            stroke="#010206"
            strokeWidth="7"
          />
          <path
            d="M73 165 L175 150 L219 160 L95 184 Z"
            fill="#24334d"
            stroke="#40516c"
            strokeWidth="4"
          />
          <path d="M62 233 L210 234" stroke="#e00000" strokeWidth="8" />
          <path d="M113 252 L182 255" stroke="#e00000" strokeWidth="8" />
        </g>

        <path
          d="M120 205 C188 177 296 156 444 145 L558 137 C650 131 731 108 815 81 C899 58 991 84 1082 156 C982 192 850 216 684 228 L408 249 C278 257 181 240 120 205 Z"
          fill="url(#rbHeroBody)"
          stroke="#010206"
          strokeWidth="8"
        />

        <path
          d="M114 201 C183 171 291 153 444 145 C371 166 276 183 175 196 C149 200 129 202 114 201 Z"
          fill="url(#rbHeroYellow)"
          stroke="#04060b"
          strokeWidth="6"
        />
        <path
          d="M163 196 C207 172 260 169 315 184 C273 196 238 212 210 231 C200 215 184 203 163 196 Z"
          fill="url(#rbHeroRed)"
          stroke="#4d0000"
          strokeWidth="4"
        />
        <path
          d="M178 194 C219 171 259 174 303 187"
          fill="none"
          stroke="#ffd23a"
          strokeWidth="6"
        />

        <path
          d="M330 155 C405 132 520 125 621 137 C579 152 545 174 525 203 L334 207 C279 206 232 200 193 189 C242 177 288 165 330 155 Z"
          fill="#111b2e"
          stroke="#02040a"
          strokeWidth="6"
        />
        <path
          d="M379 176 L548 173 L521 199 L337 202 Z"
          fill="#06101d"
          stroke="#263852"
          strokeWidth="4"
        />

        <path
          d="M565 164 C645 172 733 174 826 164 C797 207 714 232 590 241 L402 251 C462 222 514 193 565 164 Z"
          fill="#020711"
          stroke="#142139"
          strokeWidth="6"
        />
        <path
          d="M646 171 C737 182 823 178 933 156 C906 208 820 240 665 256 L455 270 C520 240 582 205 646 171 Z"
          fill="#01040a"
          stroke="#17243d"
          strokeWidth="7"
        />
        <path
          d="M471 256 C591 241 746 226 874 194"
          fill="none"
          stroke="#283a58"
          strokeWidth="5"
        />

        <path
          d="M596 104 C682 80 789 87 884 130 C847 165 786 182 705 177 L579 165 C540 151 539 121 596 104 Z"
          fill="url(#rbHeroYellow)"
          stroke="#04060b"
          strokeWidth="7"
        />
        <path
          d="M560 141 L602 101 L658 98 L646 166 L563 169 Z"
          fill="url(#rbHeroYellow)"
          stroke="#04060b"
          strokeWidth="7"
        />
        <path
          d="M548 95 L654 93 L671 107 L572 116 Z"
          fill="#040812"
          stroke="#16243b"
          strokeWidth="4"
        />
        <ellipse cx="584" cy="128" rx="25" ry="31" fill="#03060c" stroke="#17243a" strokeWidth="5" />

        <path
          d="M507 146 C516 110 547 88 589 86 C629 84 661 102 674 135"
          fill="none"
          stroke="#010206"
          strokeWidth="23"
        />
        <path
          d="M517 145 C529 119 554 107 586 108 C618 108 643 120 654 139"
          fill="none"
          stroke="#2b3d5b"
          strokeWidth="6"
        />
        <ellipse cx="575" cy="139" rx="29" ry="25" fill="#151f32" stroke="#02040a" strokeWidth="4" />
        <path d="M550 132 Q575 110 600 132 L598 145 L550 145 Z" fill="#dbe5f5" opacity="0.64" />

        <g>
          <path
            d="M684 122 C728 96 776 98 826 128 C786 130 751 140 721 159 C713 143 700 131 684 122 Z"
            fill="url(#rbHeroRed)"
            stroke="#4d0000"
            strokeWidth="4"
          />
          <path
            d="M700 122 C736 99 775 101 814 126"
            fill="none"
            stroke="#ffd23a"
            strokeWidth="7"
          />
          <path d="M752 124 L825 105" stroke="#ffd23a" strokeWidth="6" />
          <circle cx="767" cy="122" r="6" fill="#ffd23a" />
        </g>

        <g>
          <path
            d="M392 169 L311 211"
            stroke="#02040a"
            strokeWidth="8"
          />
          <path
            d="M423 189 L352 231"
            stroke="#02040a"
            strokeWidth="8"
          />
          <path
            d="M815 176 L929 219"
            stroke="#02040a"
            strokeWidth="8"
          />
          <path
            d="M864 160 L980 218"
            stroke="#02040a"
            strokeWidth="8"
          />
        </g>

        <g>
          <path
            d="M914 93 L1030 84 L1128 116 L1105 144 L936 131 Z"
            fill="#041018"
            stroke="#010206"
            strokeWidth="7"
          />
          <path
            d="M910 124 L1138 151 L1126 179 L918 152 Z"
            fill="#070b14"
            stroke="#010206"
            strokeWidth="7"
          />
          <path
            d="M901 85 L921 206 L947 205 L936 86 Z"
            fill="#02050c"
            stroke="#111c30"
            strokeWidth="5"
          />
          <path
            d="M1088 116 L1152 124 L1143 194 L1075 185 Z"
            fill="#080d18"
            stroke="#010206"
            strokeWidth="7"
          />
          <text
            x="980"
            y="135"
            fill="#f8fafc"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="32"
            fontWeight="900"
            transform="rotate(8 980 135)"
            paintOrder="stroke"
            stroke="#02040a"
            strokeWidth="3"
          >
            HONDA
          </text>
        </g>

        <g>
          <path
            d="M604 185 C692 198 792 197 893 176"
            fill="none"
            stroke="#e00000"
            strokeWidth="7"
          />
          <text
            x="548"
            y="229"
            fill="#f9fafb"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="49"
            fontWeight="900"
            letterSpacing="3"
            paintOrder="stroke"
            stroke="#02040a"
            strokeWidth="5"
          >
            ORACLE
          </text>
          <text
            x="760"
            y="177"
            fill="#e00000"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="27"
            fontWeight="900"
            paintOrder="stroke"
            stroke="#02040a"
            strokeWidth="4"
          >
            RedBull
          </text>
        </g>

        <g className="rb-wheel rb-wheel-front">
          <circle cx="334" cy="235" r="61" fill="url(#rbHeroTyre)" />
          <circle cx="334" cy="235" r="52" fill="none" stroke="#e00000" strokeWidth="8" />
          <circle cx="334" cy="235" r="36" fill="#07101a" stroke="#2f415d" strokeWidth="6" />
          <path
            d="M334 201 L334 269 M300 235 L368 235 M311 212 L357 258 M357 212 L311 258"
            stroke="#748095"
            strokeWidth="4"
            opacity="0.75"
          />
          <circle cx="334" cy="235" r="9" fill="#d8e600" stroke="#0a0d12" strokeWidth="3" />
        </g>

        <g className="rb-wheel rb-wheel-rear">
          <circle cx="944" cy="224" r="65" fill="url(#rbHeroTyre)" />
          <circle cx="944" cy="224" r="55" fill="none" stroke="#e00000" strokeWidth="9" />
          <circle cx="944" cy="224" r="38" fill="#07101a" stroke="#2f415d" strokeWidth="6" />
          <path
            d="M944 187 L944 261 M907 224 L981 224 M918 198 L970 250 M970 198 L918 250"
            stroke="#748095"
            strokeWidth="4"
            opacity="0.72"
          />
          <circle cx="944" cy="224" r="9" fill="#d8e600" stroke="#0a0d12" strokeWidth="3" />
        </g>

        <path
          d="M230 242 C343 260 544 265 741 246 C861 235 965 210 1055 174"
          fill="none"
          stroke="#243756"
          strokeWidth="5"
        />
      </g>
    </svg>
  );
}
