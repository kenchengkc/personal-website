"use client";

import { useId, type CSSProperties } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";

const steps = [
  { label: "Simulate", caption: "Airflow simulations evaluate the rear-wing geometry." },
  { label: "Learn", caption: "A neural surrogate learns how geometry changes aerodynamic performance." },
  { label: "Refine", caption: "The surrogate guides the search for a lower-drag wing." },
] as const;

// A projected airfoil illustration, not sampled CFD output. Geometry and field
// traces remain in the same coordinate system throughout the explanation.
function surface(t: number, span: number, upper: boolean, refined: boolean) {
  const thickness = 5 * .13 * (.2969 * Math.sqrt(t) - .126 * t - .3516 * t * t + .2843 * t ** 3 - .1015 * t ** 4);
  const camber = (refined ? .035 : .065) * Math.sin(Math.PI * t);
  return [118 + 305 * t + 112 * span, 208 - 77 * span - 305 * (camber + (upper ? thickness : -thickness))];
}
function point(t: number, span: number, upper: boolean, refined: boolean) {
  return surface(t, span, upper, refined).map(value => value.toFixed(2)).join(" ");
}
function face(span: number, refined: boolean) {
  const top = Array.from({ length: 45 }, (_, i) => point(i / 44, span, true, refined));
  const bottom = Array.from({ length: 45 }, (_, i) => point(1 - i / 44, span, false, refined));
  return `M${top.join("L")}L${bottom.join("L")}Z`;
}
function flow(index: number, refined: boolean) {
  const y = 24 + index * 12;
  const proximity = Math.max(0, 1 - Math.abs(y - 180) / 112);
  const bend = y < 180 ? -38 * proximity : 32 * proximity;
  const wake = (refined ? 3 : 13) * proximity;
  return `M-50 ${y}C70 ${y} 99 ${y + bend} 207 ${y + bend}S371 ${y + bend - 12} 448 ${y - wake}S507 ${y + wake} 552 ${y - wake}S622 ${y + wake} 690 ${y}`;
}

export function SpeedArtwork() {
  const prefix = useId().replace(/:/g, "");
  return <AnimatedArtwork label="F1 rear-wing simulation and surrogate optimization" steps={steps} duration={4100}>
    {stage => <div className="animated-artwork-scene speed-scene" data-phase={stage}>
      <div className="speed-scene-heading"><span>Rear-wing aerodynamics</span><span>Flow illustration</span></div>
      <svg className="speed-tunnel" viewBox="0 0 640 350" role="img" aria-label="A dimensional rear wing stays visible as airflow passes over its surface, simulation samples reach a surrogate model, and the wing geometry is refined.">
        <defs>
          <linearGradient id={`${prefix}-metal`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#c6e2e4"/><stop offset=".35" stopColor="#65909b"/><stop offset=".62" stopColor="#d4e8e5"/><stop offset="1" stopColor="#466675"/></linearGradient>
          <linearGradient id={`${prefix}-side`} x2=".2" y2="1"><stop stopColor="#8fb2bd"/><stop offset=".5" stopColor="#253b49"/><stop offset="1" stopColor="#0c1c27"/></linearGradient>
          <linearGradient id={`${prefix}-flow`}><stop stopColor="#74b5c1" stopOpacity="0"/><stop offset=".22" stopColor="#74b5c1"/><stop offset=".68" stopColor="#b7d8d6"/><stop offset="1" stopColor="#75b7bd" stopOpacity="0"/></linearGradient>
          <linearGradient id={`${prefix}-pressure`} gradientUnits="userSpaceOnUse" x1="118" y1="208" x2="423" y2="208"><stop stopColor="#e0af69"/><stop offset=".22" stopColor="#d4cf93"/><stop offset=".6" stopColor="#68a9ae"/><stop offset="1" stopColor="#547a99"/></linearGradient>
          <filter id={`${prefix}-shadow`} x="-30%" y="-30%" width="180%" height="190%"><feDropShadow dx="0" dy="18" stdDeviation="15" floodColor="#000c16" floodOpacity=".7"/></filter>
        </defs>
        <g className="speed-grid" stroke="#7695a8" strokeWidth=".65" fill="none">
          {Array.from({ length: 13 }, (_, i) => <path key={`grid-x-${i}`} d={`M${i * 65 - 120} 275l170-125`} />)}
          {Array.from({ length: 6 }, (_, i) => <path key={`grid-y-${i}`} d={`M-20 ${156 + i * 24}H660`} />)}
        </g>
        <g fill="none" stroke={`url(#${prefix}-flow)`}>
          {Array.from({ length: 22 }, (_, i) => <g key={i} style={{ "--flow-delay": `${-i * .173}s`, "--flow-duration": `${2.4 + (i % 4) * .19}s` } as CSSProperties}>
            <path className="speed-streamline" d={flow(i, stage === 2)} strokeWidth=".6" />
            <path className="speed-air-particle" d={flow(i, stage === 2)} pathLength="100" strokeWidth={i % 3 === 0 ? 1.8 : 1.1} strokeLinecap="round" />
          </g>)}
        </g>
        <g className="speed-wing" filter={`url(#${prefix}-shadow)`}>
          <path className="speed-airfoil" d={face(1, stage === 2)} fill={`url(#${prefix}-side)`} stroke="#a6c5ce" strokeWidth=".8" />
          <path className="speed-airfoil" d={`M${point(0, 0, true, stage === 2)}L${point(0, 1, true, stage === 2)}L${point(1, 1, true, stage === 2)}L${point(1, 0, true, stage === 2)}Z`} fill={`url(#${prefix}-metal)`} />
          {Array.from({ length: 32 }, (_, chord) => Array.from({ length: 5 }, (_, strip) => {
            const a = chord / 32, b = (chord + 1) / 32, s = strip / 5, e = (strip + 1) / 5;
            return <path key={`${chord}-${strip}`} className="speed-surface-cell" d={`M${point(a, s, true, stage === 2)}L${point(b, s, true, stage === 2)}L${point(b, e, true, stage === 2)}L${point(a, e, true, stage === 2)}Z`} fill={`url(#${prefix}-pressure)`} fillOpacity={.18 + Math.sin(chord / 32 * Math.PI) * .28} stroke="#c6e1e4" strokeOpacity=".16" strokeWidth=".5" />;
          }))}
          <path className="speed-airfoil" d={face(0, stage === 2)} fill={`url(#${prefix}-side)`} stroke="#b5d0d4" strokeWidth=".95" />
          <path className="speed-airfoil speed-leading-edge" d={`M${point(0, 0, true, stage === 2)}L${point(0, 1, true, stage === 2)}`} fill="none" stroke="#d6ece8" strokeWidth="2.5" />
          <path className="speed-airfoil" d={`M${point(1, 0, true, stage === 2)}L${point(1, 1, true, stage === 2)}`} fill="none" stroke="#a6c9d4" strokeWidth="1.2" />
        </g>
        <g className="speed-dimension" fill="none" stroke="#769aa9" strokeWidth=".8"><path d="M119 229l305 0m-305-5v10m305-10v10"/><path d="M441 205l113-77m-117 75 7 5m106-82 8 5"/></g>
        <g className="speed-surrogate" transform="translate(392 272)">
          <path d="M0 1V51H197" fill="none" stroke="#597685" strokeWidth=".8" />
          <path className="speed-model-curve" d="M8 9C38 17 48 43 83 38S143 12 184 18" fill="none" stroke="#92c6c4" strokeWidth="1.6" pathLength="100" />
          {[ [12,11], [31,17], [55,31], [76,38], [91,37], [117,28], [142,19], [170,17] ].map(([x, y], i) => <circle key={i} className="speed-sample" cx={x} cy={y} r="2.8" fill="#9dc8c9" style={{ "--sample": i } as CSSProperties} />)}
          <circle className="speed-selected" cx="80" cy="38" r="7" fill="none" stroke="#e1b975" strokeWidth="1.3" />
          <text x="0" y="67">Neural surrogate</text>
        </g>
        <path className="speed-sample-route" d="M347 206C341 259 343 284 401 300" fill="none" stroke="#d2af74" strokeWidth="1.4" pathLength="100" />
        <path className="speed-feedback-route" d="M472 310C548 312 594 269 558 231S457 232 411 192" fill="none" stroke="#d2af74" strokeWidth="1.2" pathLength="100" />
        <text className="speed-geometry-label" x="121" y="251">Wing geometry</text>
      </svg>
    </div>}
  </AnimatedArtwork>;
}
