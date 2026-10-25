"use client";

import { useId, type CSSProperties } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";

const transportSteps = [
  { label: "Windows", caption: "Two return windows become empirical distributions." },
  { label: "Quantiles", caption: "Sort each window. Match observations by their quantile rank." },
  { label: "Transport", caption: "Average squared travel gives W₂² between the windows." },
  { label: "Regimes", caption: "Assign the window to its closest distributional centroid." },
] as const;
const samples = Array.from({ length: 48 }, (_, index) => {
  const rank = (index + .5) / 48;
  const quantile = Math.log(rank / (1 - rank)) / 1.8;
  return { index, quantile, first: 225 + quantile * 45, second: 250 + quantile * 64 };
});
const curve = (center: number, spread: number, baseline: number) => Array.from({ length: 81 }, (_, i) => {
  const x = 30 + i * 5.2;
  const y = baseline - Math.exp(-.5 * ((x - center) / spread) ** 2) * 42;
  return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(" ");

export function WassersteinArtwork() {
  const id = useId().replace(/:/g, "");
  return <AnimatedArtwork label="Wasserstein clustering: return windows are sorted, matched by quantile, and assigned to a distributional regime. Illustrative data, not market predictions." steps={transportSteps} duration={3700}>
    {stage => <svg className="wasserstein-motion" viewBox="0 0 480 260" role="img" aria-label="The same two sets of return samples move from time order to quantile order, then their matched displacement is compared with regime centroids.">
      <defs><linearGradient id={`${id}-density`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7eb6d8" stopOpacity=".25" /><stop offset="1" stopColor="#7eb6d8" stopOpacity="0" /></linearGradient></defs>
      <text className="wm-title" x="24" y="26">Wasserstein Regimes</text><text className="wm-note" x="456" y="26" textAnchor="end">Illustrative returns</text>
      {[83, 151].map(y => <path key={y} d={`M28 ${y}H452`} className="wm-axis" />)}
      <text className="wm-label" x="26" y="55">Window A</text><text className="wm-label wm-label-b" x="26" y="123">Window B</text>
      <g className="wm-densities" style={{ opacity: stage > 0 ? 1 : 0 }}>
        <path d={`${curve(225,45,83)}L446 83H30Z`} fill={`url(#${id}-density)`} />
        <path d={curve(225,45,83)} className="wm-density" />
        <path d={curve(250,64,151)} className="wm-density wm-density-b" />
      </g>
      <g className="wm-transport" style={{ opacity: stage >= 2 ? .6 : 0 }}>
        {samples.filter((_,i) => i % 2 === 0).map(sample => <path key={sample.index} d={`M${sample.first} 83L${sample.second} 151`} />)}
      </g>
      {samples.map(sample => {
        // A fixed permutation preserves each observation as it changes from time order to rank order.
        const timeIndex = (sample.index * 19) % 48;
        const x = 34 + timeIndex * 8.65;
        return <g key={sample.index}>
          <circle className="wm-observation" r="2.65" style={{ transform: `translate(${stage === 0 ? x : sample.first}px, ${stage === 0 ? 83 + sample.quantile * 10 : 83}px)` }} />
          <circle className="wm-observation wm-observation-b" r="2.65" style={{ transform: `translate(${stage === 0 ? x : sample.second}px, ${stage === 0 ? 151 + sample.quantile * 10 : 151}px)` }} />
          {sample.index % 3 === 0 && <circle className="wm-moving-match" r="2" style={{ "--from-x": `${sample.first}px`, "--to-x": `${sample.second}px`, "--sample": sample.index } as CSSProperties} />}
        </g>;
      })}
      <path className="wm-assignment-route" d="M250 157V177Q250 185 260 185H365V202" />
      {[{x:88,spread:11},{x:240,spread:18},{x:392,spread:27}].map((centroid,i) => <g key={i} className={`wm-centroid${stage === 3 && i === 2 ? " is-nearest" : ""}`}>
        <path d={`M${centroid.x-54} 228H${centroid.x+54}`} />
        <path d={Array.from({length:41},(_,j)=>{const x=centroid.x-52+j*2.6; const y=228-30*Math.exp(-.5*((x-centroid.x)/centroid.spread)**2);return `${j?'L':'M'}${x} ${y}`;}).join(' ')} />
        <text x={centroid.x} y="249" textAnchor="middle">{i===2 && stage===3 ? "Closest centroid" : `Centroid ${i+1}`}</text>
      </g>)}
    </svg>}
  </AnimatedArtwork>;
}

const allocationSteps = [
  { label: "Sample", caption: "Both workers evaluate all 16 configurations three times." },
  { label: "Prune", caption: "The race stops 15 candidates after the first checkpoint." },
  { label: "Refine", caption: "Candidate 00 reaches 27 replications: 72 search evaluations total." },
  { label: "Audit", caption: "A separate 100-evaluation audit checks the selected candidate." },
] as const;

export function AsterArtwork() {
  return <AnimatedArtwork label="Aster replication race: two workers evaluate 16 candidates, stop 15 early, allocate the remaining replications to candidate 00, and independently audit it. One saved synthetic run, seed 17." steps={allocationSteps} duration={3000}>
    {stage => <div className={`aster-motion aster-phase-${stage}`}>
      <div className="aster-motion-header"><span>aster-hpo</span><span>16 candidates · 2 workers</span></div>
      <div className="aster-run-context"><strong>{stage === 0 ? "48" : stage === 1 ? "48" : "72"}</strong><span>search evaluations <small>432 with full allocation</small></span><span className="aster-saved-run">Seed 17<br />Synthetic run</span></div>
      <div className="aster-race-field" role="img" aria-label={stage < 2 ? "Three replications for each of 16 candidates: 48 evaluations before further allocation" : "Candidate 00: 27 replications. Other 15 candidates: three each. 72 total search evaluations."}>
        <div className="aster-race-axis"><span>ID</span><span>1</span><span>9</span><span>18</span><span>27 replications</span></div>
        {Array.from({length:16},(_,i)=><div key={i} className={`aster-race-candidate${i===0?" is-winner":""}`} style={{"--trial": i} as CSSProperties}>
          <span>{String(i).padStart(2,"0")}</span><div className="aster-race-track"><div className="aster-race-initial" /><div className="aster-race-extra" /><span className="aster-worker-packet" /></div><span className="aster-candidate-state">{i===0 ? stage>1?"27":"3" : stage>0?"stop":"3"}</span>
        </div>)}
      </div>
      <div className="aster-audit"><span className="aster-audit-token">00</span><div className="aster-audit-route"><span /></div><span>Independent audit<br /><strong>{stage===3?"100 new evaluations":"Held out from search"}</strong></span></div>
    </div>}
  </AnimatedArtwork>;
}
