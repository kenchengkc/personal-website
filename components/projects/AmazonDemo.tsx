"use client";

import { useId, useSyncExternalStore } from "react";
import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Edit", detail: "Version a configuration change" },
  { label: "Trace", detail: "Resolve the affected dependencies" },
  { label: "Deliver", detail: "Distribute a consistent version" },
] as const;

const BRANCHES = [
  "M330 236C446 236 454 121 616 121",
  "M330 236C452 236 519 228 688 228",
  "M330 236C448 236 457 337 616 337",
];
const MOBILE_BRANCHES = [
  "M306 295C306 350 150 352 150 430",
  "M306 295C306 355 295 390 295 470",
  "M306 295C306 350 440 352 440 430",
];

function subscribeSmallScreen(notify: () => void) {
  const query = window.matchMedia("(max-width: 620px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

const PLANE = "M-78 0 0-39 78 0 0 39Z";

function ModelLayers({ x, y, index, prefix, scale = 1 }: { x: number; y: number; index: number; prefix: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse className="amz-model-shadow" cx="0" cy="57" rx="77" ry="10" fill={`url(#${prefix}-shadow)`} />
      <g className={`amz-model amz-model-${index}`}>
        <g className="amz-model-bottom"><path d={PLANE} transform="translate(0 24)" fill={`url(#${prefix}-lower)`} /><path d="M-78 24V28L0 67 78 28V24L0 63Z" fill="#1b2021" /></g>
        <g className="amz-model-middle"><path d={PLANE} transform="translate(0 12)" fill={`url(#${prefix}-lower)`} /><path d="M-78 12V16L0 55 78 16V12L0 51Z" fill="#272c2d" /></g>
        <g className="amz-model-top">
          <path d={PLANE} fill={`url(#${prefix}-plane)`} stroke={`url(#${prefix}-edge)`} strokeWidth="0.8" />
          <path d="M-78 0V4L0 43 78 4V0L0 39Z" fill="#3b4142" />
          <path className="amz-model-rim" d="M-78 0 0 39 78 0" fill="none" stroke={`url(#${prefix}-gold)`} strokeWidth="1.3" />
          <path d="M-57 0 0 28 57 0M-38-9 19 19M-19-19 38 9" fill="none" stroke="#8c9696" strokeOpacity=".16" strokeWidth=".6" />
          {[-26, 0, 26].map((barX, bar) => {
            const baseline = 8 - bar * 11;
            const height = [17, 34, 25][(bar + index) % 3];
            return (
              <g className={`amz-model-bar amz-model-bar-${bar}`} key={barX} style={{ transformOrigin: `${barX}px ${baseline}px` }}>
                <path d={`M${barX - 8} ${baseline - height}L${barX} ${baseline - height + 4}V${baseline + 4}L${barX - 8} ${baseline}Z`} fill={bar === 1 ? `url(#${prefix}-gold-side)` : "#5c6565"} />
                <path d={`M${barX} ${baseline - height + 4}L${barX + 8} ${baseline - height}V${baseline}L${barX} ${baseline + 4}Z`} fill={bar === 1 ? "#a28a53" : "#363e3f"} />
                <path d={`M${barX - 8} ${baseline - height}L${barX} ${baseline - height - 4}L${barX + 8} ${baseline - height}L${barX} ${baseline - height + 4}Z`} fill={bar === 1 ? "#f1dfad" : "#a8b1af"} />
              </g>
            );
          })}
        </g>
      </g>
    </g>
  );
}

function ConfigurationSheet({ prefix }: { prefix: string }) {
  return (
    <g className="amz-config-position">
      <g className="amz-config-float">
        <g transform="rotate(-8 240 225)">
          <path className="amz-sheet-back" d="M134 109H307L334 136V353H134Z" fill={`url(#${prefix}-lower)`} stroke="#444d4d" strokeWidth=".8" />
          <path className="amz-sheet-middle" d="M145 96H318L345 123V340H145Z" fill={`url(#${prefix}-lower)`} stroke="#697272" strokeWidth=".8" />
          <path d="M156 83H329L356 110V327H156Z" fill={`url(#${prefix}-sheet)`} stroke={`url(#${prefix}-edge)`} strokeWidth="1" />
          <path d="M329 83V110H356" fill="#373e3e" stroke="#7d8786" strokeWidth=".7" />
          <path d="M157 84H328" stroke="#cdd1cb" strokeOpacity=".7" />
          <text x="179" y="123" className="amz-file-title">config.json</text>
          <circle cx="319" cy="121" r="2.5" fill="#c5b582" />
          <path d="M178 140H333" stroke="#8d9793" strokeOpacity=".18" />
          <g fill="#6e7a78" opacity=".7">
            <rect x="179" y="161" width="16" height="4" rx="2" />
            <rect x="192" y="179" width="58" height="4" rx="2" />
            <rect x="260" y="179" width="52" height="4" rx="2" opacity=".5" />
            <rect x="192" y="197" width="37" height="4" rx="2" />
            <rect x="239" y="197" width="79" height="4" rx="2" opacity=".5" />
            <rect x="192" y="251" width="65" height="4" rx="2" />
            <rect x="267" y="251" width="44" height="4" rx="2" opacity=".5" />
            <rect x="179" y="269" width="16" height="4" rx="2" />
          </g>
          <rect x="174" y="214" width="160" height="21" rx="3" fill="#b19b65" fillOpacity=".08" stroke="#c9b581" strokeOpacity=".2" strokeWidth=".6" />
          <g className="amz-change-line">
            <rect x="192" y="222" width="124" height="4" rx="2" fill={`url(#${prefix}-gold)`} />
            <circle cx="180" cy="224" r="1.5" fill="#e3d2a2" />
          </g>
          <text x="179" y="305" className="amz-version">v042</text>
          <path d="M304 302H332" stroke="#99a39d" strokeWidth="1" strokeOpacity=".4" />
          <path d="M324 298L332 302 324 306" stroke="#c4cebf" strokeWidth="1" fill="none" strokeOpacity=".6" />
        </g>
      </g>
    </g>
  );
}

export function AmazonDemo() {
  const prefix = `amz${useId().replaceAll(":", "")}`;
  const smallScreen = useSyncExternalStore(subscribeSmallScreen, () => window.matchMedia("(max-width: 620px)").matches, () => false);
  const branches = smallScreen ? MOBILE_BRANCHES : BRANCHES;
  const returnPath = smallScreen ? "M440 445C470 558 92 558 204 285" : "M696 343C589 421 371 399 294 308";
  return (
    <DemoPlayer
      className="amazon-demo"
      label="Amazon configuration infrastructure"
      eyebrow="Amazon / Configuration Infrastructure"
      title="Configuration propagation"
      stages={STAGES}
      note="Illustrative workflow"
      duration={3200}
    >
      {({ stage }) => (
        <div className="motion-artwork amz-artwork" data-stage={stage}>
          <svg viewBox={smallScreen ? "80 25 430 570" : "70 35 780 390"} className="amz-art" role="img" aria-label="A versioned configuration sheet lifts a changed line, traces its dependencies, and delivers the update to three layered planning models">
            <defs>
              <linearGradient id={`${prefix}-sheet`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#555d5c" /><stop offset=".25" stopColor="#303737" /><stop offset=".66" stopColor="#1c2324" /><stop offset="1" stopColor="#2d3434" /></linearGradient>
              <linearGradient id={`${prefix}-lower`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3d4545" /><stop offset=".48" stopColor="#202728" /><stop offset="1" stopColor="#151c1d" /></linearGradient>
              <linearGradient id={`${prefix}-plane`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#626d6b" /><stop offset=".4" stopColor="#35403f" /><stop offset="1" stopColor="#20292b" /></linearGradient>
              <linearGradient id={`${prefix}-edge`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d9ddcf" /><stop offset=".32" stopColor="#849390" /><stop offset=".7" stopColor="#465958" /><stop offset="1" stopColor="#a4aca0" /></linearGradient>
              <linearGradient id={`${prefix}-gold`}><stop stopColor="#8f753d" /><stop offset=".42" stopColor="#e8d3a1" /><stop offset=".59" stopColor="#fbefc9" /><stop offset="1" stopColor="#ae9158" /></linearGradient>
              <linearGradient id={`${prefix}-gold-side`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c9b17a" /><stop offset="1" stopColor="#6d5830" /></linearGradient>
              <radialGradient id={`${prefix}-shadow`}><stop stopColor="#000" stopOpacity=".7" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
              <radialGradient id={`${prefix}-light`}><stop stopColor="#7e8a7a" stopOpacity=".09" /><stop offset="1" stopColor="#101311" stopOpacity="0" /></radialGradient>
            </defs>
            <ellipse cx="468" cy="235" rx="370" ry="205" fill={`url(#${prefix}-light)`} />
            <ellipse className="amz-config-shadow" cx={smallScreen ? 283 : 243} cy={smallScreen ? 349 : 374} rx="145" ry="21" fill={`url(#${prefix}-shadow)`} />
            <g className="amz-branches" fill="none">
              {branches.map((path, index) => (
                <g key={path}>
                  <path className="amz-branch-base" d={path} stroke="#65736a" strokeOpacity=".3" strokeWidth="1" />
                  <path className={`amz-travel amz-travel-${index}`} d={path} stroke={`url(#${prefix}-gold)`} strokeWidth="2" strokeLinecap="round" pathLength="100" />
                </g>
              ))}
              <path className="amz-return-base" d={returnPath} stroke="#747e6a" strokeOpacity=".12" strokeWidth=".8" />
              <path className="amz-return" d={returnPath} stroke="#dbd6bd" strokeWidth="1.4" strokeLinecap="round" pathLength="100" />
            </g>
            <ModelLayers x={smallScreen ? 150 : 690} y={smallScreen ? 425 : 106} scale={smallScreen ? .7 : 1} index={0} prefix={prefix} />
            <ModelLayers x={smallScreen ? 295 : 760} y={smallScreen ? 465 : 216} scale={smallScreen ? .7 : 1} index={1} prefix={prefix} />
            <ModelLayers x={smallScreen ? 440 : 690} y={smallScreen ? 425 : 326} scale={smallScreen ? .7 : 1} index={2} prefix={prefix} />
            <g transform={smallScreen ? "translate(40 -25)" : undefined}><ConfigurationSheet prefix={prefix} /></g>
            <text className="amz-model-caption" x={smallScreen ? 295 : 691} y={smallScreen ? 572 : 410} textAnchor="middle">Planning models</text>
          </svg>
        </div>
      )}
    </DemoPlayer>
  );
}
