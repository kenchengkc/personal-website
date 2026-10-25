"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties, type ReactNode } from "react";

export type ArtworkKind =
  | "amazon" | "quantiv" | "fdre" | "embers"
  | "cml" | "wasserstein" | "aster" | "gcinf"
  | "usaco" | "speed" | "cvrp" | "egleston";

const imageSizes = "(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 44vw, 480px";
const amazonNodes = Array.from({ length: 17 }, (_, i) => ({
  x: 240 + (i % 3) * 48,
  y: 38 + Math.floor(i / 3) * 39,
}));
const modelNodes = [55, 100, 145, 190, 235].flatMap(y =>
  [0, 1, 2].map(column => ({ x: 43 + column * 38, y: y + (column % 2 ? 10 : 0) })),
);
const playbackLabels: Partial<Record<ArtworkKind, string>> = {
  amazon: "Trace a change",
  cml: "Trace a message",
  wasserstein: "Trace transport",
  aster: "Allocate budget",
  speed: "Trace airflow",
};

function Illustration({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg className="artwork-illustration" viewBox="0 0 400 294" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}

function AmazonArtwork({ prefix }: { prefix: string }) {
  return (
    <>
      <Image className="artwork-amazon-logo" src="/images/amazon/amazon-logo.svg" alt="Amazon" width={76} height={28} />
      <Illustration label="Architecture illustration: one shared configuration reaches 17 packages and services">
        <defs>
          <linearGradient id={`${prefix}-sheet`} x2=".7" y2="1">
            <stop stopColor="#fff5df" /><stop offset="1" stopColor="#efd5ad" />
          </linearGradient>
          <filter id={`${prefix}-shadow`}><feDropShadow dx="0" dy="12" stdDeviation="9" floodOpacity=".13" /></filter>
        </defs>
        <g stroke="#7c532f" strokeWidth="1" fill="none" opacity=".38">
          {amazonNodes.map((node, i) => <path key={i} d={`M139 151 C195 151 177 ${node.y} ${node.x} ${node.y}`} />)}
        </g>
        <g stroke="#fff7da" strokeWidth="3" strokeDasharray="20 120" fill="none">
          {amazonNodes.map((node, i) => <path key={i} className="artwork-pulse" d={`M139 151 C195 151 177 ${node.y} ${node.x} ${node.y}`} />)}
        </g>
        <g filter={`url(#${prefix}-shadow)`}>
          <path d="M62 101 L139 86 L158 198 L80 211Z" fill="#8f603c" />
          <path d="M51 94 L128 80 L147 191 L69 205Z" fill="#d6b182" />
          <path d="M41 88 L117 74 L136 186 L59 200Z" fill={`url(#${prefix}-sheet)`} />
          <g stroke="#986e44" strokeWidth="3" opacity=".7"><path d="M62 120 L105 112 M65 134 L100 128 M68 148 L116 140 M70 162 L103 156" /></g>
          <text x="58" y="105" fill="#6f492b" fontSize="12" transform="rotate(-10 58 105)">{"{ config }"}</text>
        </g>
        {amazonNodes.map((node, i) => (
          <g key={i} transform={`translate(${node.x},${node.y})`}>
            <path d="M-12 -7 L0 -14 L12 -7 L12 7 L0 14 L-12 7Z" fill={i % 4 === 0 ? "#f5e4c4" : "#b9804d"} />
            <path d="M-12 -7 L0 0 L12 -7 M0 0 L0 14" fill="none" stroke="#5b3e27" strokeOpacity=".35" />
          </g>
        ))}
      </Illustration>
      <span className="artwork-note">Architecture illustration</span>
    </>
  );
}

function ModelArtwork({ prefix }: { prefix: string }) {
  return (
    <>
      <Illustration label="Research illustration of model activations, transmitted messages, and a detector">
        <defs><radialGradient id={`${prefix}-glow`}><stop stopColor="#a5c5d7" stopOpacity=".17" /><stop offset="1" stopColor="#20212b" stopOpacity="0" /></radialGradient></defs>
        <circle cx="185" cy="142" r="173" fill={`url(#${prefix}-glow)`} />
        <g stroke="#718097" strokeOpacity=".3" strokeWidth=".75" fill="none">
          {modelNodes.flatMap((node, i) => modelNodes.filter(next => next.x === node.x + 38).map((next, j) => (
            <path key={`${i}-${j}`} d={`M${node.x} ${node.y} L${next.x} ${next.y}`} />
          )))}
          {modelNodes.filter(node => node.x === 119).map((node, i) => <path key={i} d={`M${node.x} ${node.y} Q185 ${node.y} 201 147`} />)}
        </g>
        {modelNodes.map((node, i) => <circle key={i} cx={node.x} cy={node.y} r={i % 3 === 0 ? 4 : 3} fill={i % 4 === 0 ? "#f4c18c" : "#8a9dbd"} />)}
        <g fill="#d7e4ee" fontSize="13" aria-hidden="true">
          {["010 011", "101 001", "110 010", "011 100", "001 110"].map((message, i) => <text key={message} className="artwork-message" x="169" y={108 + i * 19}>{message}</text>)}
        </g>
        <path d="M245 104 Q270 104 289 147 M245 123 Q270 123 289 147 M245 142 L289 147 M245 161 Q270 161 289 147 M245 180 Q270 180 289 147" fill="none" stroke="#8e9aaf" strokeOpacity=".5" />
        <circle cx="316" cy="147" r="28" stroke="#d7b38e" strokeWidth="1" fill="#2a2e39" />
        <circle cx="316" cy="147" r="15" stroke="#d7b38e" strokeWidth="1" fill="none" />
        <circle cx="316" cy="147" r="4" fill="#eed2ad" />
      </Illustration>
      <span className="artwork-note artwork-note-top">Research illustration</span>
    </>
  );
}

function WassersteinArtwork() {
  return (
    <>
      <Illustration label="Method illustration of transport between return distributions">
        {Array.from({ length: 18 }, (_, i) => {
          const y = 88 + i * 6;
          const shift = i * 3.9;
          return <path key={i} className="artwork-flowline" d={`M24 ${y} C90 ${y} 79 ${24 + shift} 139 ${45 + shift} S203 ${224 - shift} 247 ${224 - shift} S302 ${105 + i * 3} 379 ${105 + i * 3}`} fill="none" stroke={i < 9 ? "#4c788d" : "#b07858"} strokeWidth="1.15" opacity={.25 + i * .025} strokeDasharray="10 3 35 2" />;
        })}
        <path d="M28 246 H376" stroke="#526c7e" opacity=".35" />
      </Illustration>
      <span className="artwork-heading">Return distributions</span>
      <span className="artwork-note">Method illustration</span>
    </>
  );
}

function AsterArtwork() {
  return (
    <>
      <Illustration label="Illustration of adaptive evaluation across 16 candidate configurations">
        {Array.from({ length: 16 }, (_, i) => (
          <g key={i} className={`artwork-candidate${i === 9 ? " artwork-candidate-kept" : ""}`} style={{ "--candidate": i } as CSSProperties} transform={`translate(${30 + i * 22},86)`}>
            {Array.from({ length: 8 }, (_, j) => <rect key={j} x="0" y={j * 15} width="10" height="10" rx="1" fill={i === 9 ? "#d5dc9f" : j < (i % 4) + 3 ? "#90a180" : "#485044"} />)}
          </g>
        ))}
      </Illustration>
      <div className="artwork-aster-count"><strong>72</strong><span> / 432 evaluations</span></div>
      <span className="artwork-aster-result">16 candidates. Same selection.</span>
      <span className="artwork-note">One synthetic experiment</span>
    </>
  );
}

function SpeedArtwork({ prefix }: { prefix: string }) {
  return (
    <>
      <Illustration label="Illustrative airflow around a Formula 1 car; not a simulation result">
        <defs><linearGradient id={`${prefix}-stream`}><stop stopColor="#4da3ab" /><stop offset=".55" stopColor="#d4d69b" /><stop offset="1" stopColor="#4da3ab" /></linearGradient></defs>
        {Array.from({ length: 22 }, (_, i) => {
          const y = 40 + i * 10;
          const bend = i > 7 && i < 16 ? (i < 12 ? -1 : 1) * (54 - Math.abs(11 - i) * 6) : 0;
          return <path key={i} className="artwork-flowline" d={`M-15 ${y} C70 ${y} 85 ${y + bend} 175 ${y + bend} S299 ${y + 8} 418 ${y}`} fill="none" stroke={`url(#${prefix}-stream)`} strokeWidth={i % 4 === 0 ? 1.2 : .6} strokeOpacity={i > 7 && i < 16 ? .8 : .3} strokeDasharray="40 3 15 2" />;
        })}
        <g fill="#cbd2c0" stroke="#163740" strokeWidth="2">
          <path d="M80 166 L87 149 L142 146 L163 124 L200 125 L218 142 L288 149 L309 160 L306 168Z" />
          <path d="M77 145 L88 145 L92 173 L77 173Z M288 152 L321 152 L322 164 L289 164Z" />
          <circle cx="128" cy="165" r="20" fill="#172e34" /><circle cx="270" cy="165" r="20" fill="#172e34" />
          <circle cx="128" cy="165" r="9" fill="#728c8b" /><circle cx="270" cy="165" r="9" fill="#728c8b" />
          <path d="M170 125 L174 114 L193 114 L202 129" fill="none" stroke="#cad2c1" strokeWidth="5" />
        </g>
      </Illustration>
      <span className="artwork-note">Airflow illustration</span>
    </>
  );
}

function UsacoArtwork() {
  return (
    <>
      <Illustration label="Gold to Platinum division progression">
        <g fill="none" stroke="#5a7189" opacity=".3">
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${210 + i * 12} 34 L${160 + i * 15} 252 L${315 + i * 7} 252Z`} />)}
        </g>
      </Illustration>
      <Image className="artwork-usaco-logo" src="/images/usaco/usaco-logo.png" alt="USA Computing Olympiad" width={900} height={130} sizes="120px" />
      <div className="artwork-score">1000<span>/1000</span><small>Gold division score</small></div>
      <div className="artwork-division">Gold → Platinum</div>
    </>
  );
}

export function ProjectArtwork({ kind }: { kind: ArtworkKind }) {
  const prefix = useId().replace(/:/g, "");
  const [playback, setPlayback] = useState(0);
  const [inventory, setInventory] = useState(false);
  const playLabel = playbackLabels[kind];

  function content() {
    switch (kind) {
      case "amazon": return <AmazonArtwork prefix={prefix} />;
      case "quantiv": return <>
        <span className="artwork-brand">Quantiv</span>
        <Image className="artwork-screen" src="/media/quantiv-earnings-calendar.png" alt="Quantiv earnings calendar with company reports and forecast ranges" width={1280} height={577} sizes={imageSizes} />
        <span className="artwork-note">Live product</span>
      </>;
      case "fdre": return <Image className="artwork-screen" src="/media/fdre-research-answer.png" alt="Financial research answer with a verified citation and the original SEC filing passage" width={1427} height={871} sizes={imageSizes} />;
      case "embers": return <>
        <Image src={inventory ? "/media/embers-inventory-dashboard.png" : "/media/embers-yolo-live-detection.png"} alt={inventory ? "Embers inventory populated with detected objects and replacement values" : "Embers identifying objects in a real camera frame"} fill sizes={imageSizes} />
        <span className="artwork-photo-note" aria-live="polite">{inventory ? "Saved inventory" : "Object detection"}</span>
      </>;
      case "cml": return <ModelArtwork prefix={prefix} />;
      case "wasserstein": return <WassersteinArtwork />;
      case "aster": return <AsterArtwork />;
      case "gcinf": return <>
        <Image src="/images/gc-inf/ieeeconf.png" alt="Ken Cheng presenting his traffic forecasting research at IEEE ITSC 2023" fill sizes={imageSizes} />
        <span className="artwork-photo-note">IEEE ITSC · 2023</span>
      </>;
      case "usaco": return <UsacoArtwork />;
      case "speed": return <SpeedArtwork prefix={prefix} />;
      case "cvrp": return <Image src="/media/cvrp-visualizer.png" alt="Vehicle routing problem visualizer with optimized routes" fill sizes={imageSizes} />;
      case "egleston": return <>
        <Image src="/images/butler-library.jpg" alt="Butler Library on Columbia University’s campus" fill sizes={imageSizes} />
        <span className="artwork-photo-note">Columbia University</span>
      </>;
    }
  }

  return (
    <div className={`project-artwork artwork-${kind}`} data-artwork={kind}>
      <div key={playback} className={`artwork-content${playback ? " has-played" : ""}`}>{content()}</div>
      {playLabel && <button type="button" className="artwork-action artwork-replay" onClick={() => setPlayback(value => value + 1)}>{playLabel}</button>}
      {kind === "embers" && <button type="button" className="artwork-action" onClick={() => setInventory(value => !value)}>{inventory ? "View detection" : "View inventory"}</button>}
    </div>
  );
}
