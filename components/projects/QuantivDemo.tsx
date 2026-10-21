"use client";

import { useId, type CSSProperties } from "react";
import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Price", detail: "Market prices move before the event" },
  { label: "History", detail: "Past observations form a distribution" },
  { label: "Range", detail: "Quantiles express uncertainty" },
] as const;

// A deterministic conceptual distribution; these are not market observations.
const PARTICLES = Array.from({ length: 23 }, (_, column) => {
  const x = 142 + column * 28;
  const count = Math.round(2 + 12 * Math.exp(-Math.pow((column - 11) / 6, 2)));
  return Array.from({ length: count }, (_, row) => ({
    x, y: 338 - row * 15,
    waveX: 105 + ((column * 37 + row * 59) % 690),
    waveY: 220 + Math.sin((column * 37 + row * 59) / 95) * 42 + (row % 3 - 1) * 9,
    size: row % 4 === 0 ? 3 : 2,
    delay: (column % 4) * 50 + row * 12,
  }));
}).flat();

export function QuantivDemo() {
  const id = useId().replace(/:/g, "");
  return <DemoPlayer className="quantiv-demo" label="Quantiv earnings research demonstration" eyebrow="Quantiv" title="Earnings uncertainty" stages={STAGES} note="Conceptual illustration" duration={3000}>
    {({ stage }) => <div className="motion-artwork qv-sculpture" data-stage={stage}>
      <svg viewBox="0 0 900 460" role="img" aria-label="Price observations flow into a distribution, then three quantile planes reveal its range.">
        <defs>
          <linearGradient id={`${id}-silver`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#6d839b"/><stop offset=".45" stopColor="#e6eef4"/><stop offset=".65" stopColor="#91a6ba"/><stop offset="1" stopColor="#476078"/></linearGradient>
          <linearGradient id={`${id}-veil`} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#b8d7ed" stopOpacity=".26"/><stop offset="1" stopColor="#81a2c8" stopOpacity="0"/></linearGradient>
          <linearGradient id={`${id}-gold`} x1="0" x2="1"><stop stopColor="#826f4c"/><stop offset=".5" stopColor="#f3dc9f"/><stop offset="1" stopColor="#af8b55"/></linearGradient>
          <radialGradient id={`${id}-ground`}><stop stopColor="#354b62" stopOpacity=".22"/><stop offset="1" stopColor="#17202b" stopOpacity="0"/></radialGradient>
        </defs>
        <ellipse cx="450" cy="355" rx="355" ry="70" fill={`url(#${id}-ground)`}/>
        <g className="qv-perspective-grid" aria-hidden="true">
          {[0,1,2,3].map(i=><path key={i} d={`M${80+i*23} ${350+i*12}H${820-i*23}`} />)}
          {[170,310,450,590,730].map(x=><path key={x} d={`M${x} 350L${450+(x-450)*.7} 386`} />)}
        </g>
        <path className="qv-price-thread" d="M80 242C145 242 155 160 225 176S305 280 375 240S480 168 540 188S655 280 720 236S780 193 820 211" stroke={`url(#${id}-silver)`}/>
        <g className="qv-observations">
          {PARTICLES.map((point,index)=><g className="qv-particle" key={index} style={{ transform: `translate(${stage === 0 ? point.waveX : point.x}px, ${stage === 0 ? point.waveY : point.y}px)`, "--delay": `${point.delay}ms` } as CSSProperties}>
            <circle className="qv-particle-light" r={point.size} fill={`url(#${id}-silver)`} style={{ animationDelay: `${index * -.11}s` }}/>
          </g>)}
        </g>
        <g className="qv-distribution">
          {[0,1,2].map(i=><g key={i} className="qv-density-sheet" style={{ "--layer": i } as CSSProperties}>
            <path d="M114 345C205 345 253 331 302 287C352 241 379 137 450 137C521 137 548 241 598 287C647 331 695 345 786 345Z" fill={`url(#${id}-veil)`}/>
            <path d="M114 345C205 345 253 331 302 287C352 241 379 137 450 137C521 137 548 241 598 287C647 331 695 345 786 345" fill="none" stroke={`url(#${id}-silver)`}/>
          </g>)}
        </g>
        <g className="qv-quantile-planes">
          {[{x:295,y:293,label:"P10"},{x:450,y:137,label:"P50"},{x:605,y:293,label:"P90"}].map(({x,y,label},i)=><g className={`qv-plane qv-plane-${i}`} key={label} style={{ "--plane": i } as CSSProperties}>
            <path d={`M${x} 346V${y-40}l32-17V329Z`} fill={`url(#${id}-veil)`}/>
            <path d={`M${x} 346V${y-40}`} stroke={i===1?`url(#${id}-gold)`:'#b8cddc'} strokeWidth={i===1?2:1}/>
            <circle cx={x} cy={y} r={i===1?5:3.5} fill={i===1?'#ecd39c':'#cfdfeb'}/>
            <circle className="qv-quantile-halo" cx={x} cy={y} r="12" fill="none" stroke={i===1?'#d4b674':'#b8d1e5'}/>
            <text x={x} y="381" textAnchor="middle">{label}</text>
          </g>)}
        </g>
      </svg>
    </div>}
  </DemoPlayer>;
}
