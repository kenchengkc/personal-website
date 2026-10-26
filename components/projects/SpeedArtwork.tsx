"use client";

import Image from "next/image";
import { useId, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatedArtwork } from "./AnimatedArtwork";

const steps = [
  { label: "Pressure", caption: "Original pressure contours on the optimized rear-wing model." },
  { label: "Velocity", caption: "Original velocity contours on the same optimized rear-wing model." },
] as const;

// Illustrative tracers follow the projected flow direction in Figure 17:
// from the nose at lower right toward the rear wing at upper left. The source
// images carry the measured fields and legends; these paths do not encode data.
const streamlines = [
  "M539 285C487 264 449 221 409 195S314 128 265 104L92 0",
  "M535 296C482 275 444 233 401 204S312 141 260 114L70 0",
  "M529 309C478 290 433 241 393 215S308 153 252 124L48 0",
  "M523 320C473 301 428 255 385 226S302 165 245 135L25 0",
  "M509 329C462 310 421 266 376 237S292 176 235 146L3 0",
  "M493 335C445 317 408 280 367 249S285 187 225 157L-18 0",
  "M472 336C428 319 390 291 354 264S276 201 216 168L-39 0",
  "M448 338C409 324 372 308 340 280S275 215 225 191C199 179 189 158 168 146L-24 29",
  "M427 337C389 325 353 313 320 294S252 257 221 236S154 207 126 185L33 129",
  "M407 341C368 326 334 316 301 301S240 274 207 251S143 222 114 198L26 146",
  "M381 339C347 328 312 315 282 306S225 282 193 260S130 231 102 211L17 162",
  "M356 339C318 326 288 318 259 307S210 288 178 270S118 244 88 224L9 181",
  "M328 339C289 325 257 317 229 307S182 289 151 275S100 253 70 238L0 202",
  "M296 339C260 326 228 316 199 308S156 291 126 280S80 261 48 249L-12 222",
  "M263 339C229 326 196 316 167 309S124 294 95 284S53 267 23 258L-24 243",
  "M230 339C194 326 164 317 135 309S94 296 66 288S24 273 -11 264",
];

export function SpeedArtwork() {
  const clipId = `speed-flow-${useId().replace(/:/g, "")}`;
  return (
    <AnimatedArtwork label="Need for Speed published CFD with animated flow tracers" steps={steps} cycleSteps={false}>
      {stage => <div className="speed-scene" data-field={stage === 0 ? "pressure" : "velocity"}>
        <div className="speed-scene-heading">
          <span>ANSYS Fluent · {steps[stage].label}</span>
          <span>33 m/s inlet</span>
        </div>
        <div className="speed-viewport">
          <Image
            className="speed-field" data-cfd-field="pressure"
            aria-hidden={stage !== 0}
            src="/media/research/f1-optimized-pressure.png"
            alt="Original ANSYS pressure contours and legend for the F1 car with its optimized rear wing, from Figure 17."
            fill unoptimized sizes="(max-width: 700px) calc(100vw - 56px), 500px"
          />
          <Image
            className="speed-field" data-cfd-field="velocity"
            aria-hidden={stage !== 1}
            src="/media/research/f1-optimized-velocity.png"
            alt="Original ANSYS velocity contours, streamlines, and legend for the same optimized F1 car at a 33 metre-per-second inlet."
            fill unoptimized sizes="(max-width: 700px) calc(100vw - 56px), 500px"
          />
          <svg className="speed-flow-overlay" viewBox="0 0 515 327" aria-hidden="true">
            <defs>
              <clipPath id={clipId}><path d="M94 0H515V327H0V214H94Z" /></clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`} fill="none" transform="translate(0 7)">
              {streamlines.map((path, index) => <path
                key={path} className="speed-tracer" d={path} pathLength="100"
                style={{ "--flow-delay": `${-index * .37}s`, "--flow-duration": `${3.7 + (index % 4) * .28}s` } as CSSProperties}
              />)}
            </g>
          </svg>
        </div>
        <div className="speed-source">
          <span>Illustrative flow tracers</span>
          <a href="/media/research/f1-cfd-source-comparison.png" target="_blank" rel="noreferrer">Original CFD comparison <ArrowUpRight size={12} aria-hidden="true" /></a>
        </div>
      </div>}
    </AnimatedArtwork>
  );
}
