"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Trace", detail: "Follow one research output through shared dependencies to affected downstream configurations." },
  { label: "Compare", detail: "Compare the versioned JSON inputs used by the affected configuration." },
  { label: "Distribute", detail: "Follow one configuration version through Lambda, S3, and internal APIs to planning lanes." },
] as const;

type Point = readonly [number, number];
type Selection = "A" | "B";
const EDGES = [
  { from: 0, to: 2, outputs: "A" },
  { from: 0, to: 3, outputs: "A" },
  { from: 1, to: 3, outputs: "B" },
  { from: 1, to: 4, outputs: "B" },
  { from: 2, to: 5, outputs: "A" },
  { from: 3, to: 5, outputs: "AB" },
  { from: 3, to: 6, outputs: "AB" },
  { from: 4, to: 7, outputs: "B" },
] as const;

function subscribeSmallScreen(notify: () => void) {
  const query = window.matchMedia("(max-width: 620px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

function route(from: Point, to: Point, vertical: boolean) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  return vertical
    ? `M${x1} ${y1}C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`
    : `M${x1} ${y1}C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;
}

function FileGlyph({ prefix, name, version, active = true }: { prefix: string; name: string; version?: string; active?: boolean }) {
  return (
    <g className={`amz-file-glyph ${active ? "is-linked" : ""}`}>
      <path d="M-45-32H33L46-19V40H-45Z" transform="translate(-5 5)" fill="#0a1523" stroke="#37516b" strokeWidth=".8" />
      <path d="M-45-32H33L46-19V40H-45Z" fill={`url(#${prefix}-paper)`} stroke="currentColor" strokeWidth=".8" />
      <path d="M33-32V-19H46" fill="#263e53" stroke="currentColor" strokeWidth=".6" />
      <path d="M-29-11H20M-29-3H11M-29 5H25" stroke="#9eb5c6" strokeOpacity=".36" strokeWidth="2" strokeLinecap="round" />
      <path className="amz-file-accent" d="M-29 14H25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <text x="0" y="31" textAnchor="middle" className="amz-file-name">{version ?? name}</text>
      {version && <text x="0" y="59" textAnchor="middle" className="amz-small-label">{name}</text>}
    </g>
  );
}

function TraceGraph({ selected, small, prefix }: { selected: Selection; small: boolean; prefix: string }) {
  const positions: Point[] = small
    ? [[145, 104], [335, 104], [80, 300], [240, 300], [400, 300], [80, 520], [240, 520], [400, 520]]
    : [[110, 157], [110, 342], [350, 112], [350, 250], [350, 388], [700, 128], [700, 260], [700, 392]];
  const outputs = ["A", "B"] as const;
  const dependencyNames = ["Input A", "Shared input", "Input B"];
  const activeNodes = selected === "A" ? [0, 2, 3, 5, 6] : [1, 3, 4, 5, 6, 7];
  return (
    <g className="amz-trace-graph">
      <g className="amz-column-labels">
        <text x={small ? 240 : 110} y={small ? 35 : 50} textAnchor="middle">Research outputs</text>
        <text x={small ? 240 : 350} y={small ? 224 : 50} textAnchor="middle">Dependencies</text>
        <text x={small ? 240 : 700} y={small ? 437 : 50} textAnchor="middle">Downstream configurations</text>
      </g>
      {EDGES.map((edge, index) => {
        const active = edge.outputs.includes(selected);
        const path = route(positions[edge.from], positions[edge.to], small);
        return (
          <g key={`${edge.from}-${edge.to}`} className={`amz-edge ${active ? "is-linked" : ""}`}>
            <path d={path} className="amz-edge-base" />
            <path d={path} className={`amz-edge-signal amz-edge-signal-${index % 3}`} pathLength="100" />
          </g>
        );
      })}
      {outputs.map((output, index) => {
        const [x, y] = positions[index];
        return (
          <g key={output} transform={`translate(${x} ${y})`} className={`amz-output ${selected === output ? "is-linked" : ""}`}>
            <path d="M-42 5 0-18 42 5 0 28Z" fill="#0a1525" stroke="currentColor" strokeWidth=".7" />
            <path d="M-42-3 0-26 42-3 0 20Z" fill={`url(#${prefix}-paper)`} stroke="currentColor" strokeWidth=".8" />
            <path d="M-42-11 0-34 42-11 0 12Z" fill={`url(#${prefix}-plane)`} stroke="currentColor" strokeWidth=".8" />
            <path d="M-21-10-9-17 0-12 12-25 24-18" className="amz-output-plot" />
            <text x="0" y="53" textAnchor="middle" className="amz-output-label">Output {output}</text>
          </g>
        );
      })}
      {dependencyNames.map((name, index) => {
        const [x, y] = positions[index + 2];
        return (
          <g key={name} transform={`translate(${x} ${y})`} className={`amz-dependency ${activeNodes.includes(index + 2) ? "is-linked" : ""}`}>
            <path d="M-33-20H33V20H-33Z" transform="translate(0 4)" fill="#081421" stroke="#263c52" />
            <path d="M-33-20H33V20H-33Z" fill={`url(#${prefix}-plane)`} stroke="currentColor" strokeWidth=".8" />
            <path d="M-17-5H17M-17 2H9M-17 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <text x="0" y="43" textAnchor="middle" className="amz-node-label">{name}</text>
            {index === 1 && <text x="0" y="60" textAnchor="middle" className="amz-shared-label">2 outputs · 2 configs</text>}
          </g>
        );
      })}
      {["config-a.json", "config-b.json", "config-c.json"].map((file, index) => {
        const [x, y] = positions[index + 5];
        return <g transform={`translate(${x} ${y})`} key={file}><FileGlyph prefix={prefix} name={small ? `Config ${String.fromCharCode(65 + index)}` : file} active={activeNodes.includes(index + 5)} /></g>;
      })}
      <text x={small ? 240 : 438} y={small ? 622 : 461} className="amz-selection-summary" textAnchor="middle">
        Output {selected} → {selected === "A" ? "2" : "3"} affected configurations
      </text>
    </g>
  );
}

function ConfigurationVersion({ prefix, version, current }: { prefix: string; version: string; current: boolean }) {
  return (
    <g className={`amz-version-sheet ${current ? "is-current" : ""}`}>
      <path d="M0 0H149L173 24V224H0Z" transform="translate(-7 8)" fill="#091321" stroke="#344c61" />
      <path d="M0 0H149L173 24V224H0Z" fill={`url(#${prefix}-paper)`} stroke={current ? "#e5ae60" : "#66829a"} strokeWidth=".9" />
      <path d="M149 0V24H173" fill="#253e54" stroke="#66829a" strokeWidth=".6" />
      <text x="18" y="32" className="amz-code-file">config-a.json</text>
      <text x="18" y="55" className="amz-version-number">{version}</text>
      <path d="M18 71H153" stroke="#8fa5b4" strokeOpacity=".18" />
      <text x="18" y="97" className="amz-code-brace">{"{"}</text>
      <text x="29" y="120" className="amz-code-key">&quot;input&quot;:</text>
      <path d="M25 131H148V158H25Z" fill={current ? "#eb9a28" : "#9aadc0"} fillOpacity={current ? ".12" : ".05"} />
      <text x="39" y="149" className="amz-code-value">&quot;{version}&quot;</text>
      <text x="18" y="184" className="amz-code-brace">{"}"}</text>
      <path className="amz-sheet-underline" d="M39 158H96" stroke={current ? "#ffac40" : "#8398aa"} strokeWidth="2" />
    </g>
  );
}

function CompareScene({ small, prefix }: { small: boolean; prefix: string }) {
  return (
    <g className="amz-compare-scene">
      <text x={small ? 240 : 594} y={small ? 282 : 72} textAnchor="middle" className="amz-scene-label">One affected configuration. Two input versions.</text>
      <g transform={small ? "translate(48 329) rotate(-4)" : "translate(394 132) rotate(-4)"}>
        <ConfigurationVersion prefix={prefix} version="v041" current={false} />
      </g>
      <g transform={small ? "translate(261 337) rotate(4)" : "translate(639 142) rotate(4)"}>
        <ConfigurationVersion prefix={prefix} version="v042" current />
      </g>
      <path d={small ? "M215 454H253M244 449 253 454 244 459" : "M570 257H623M614 252 623 257 614 262"} fill="none" stroke="#ffac40" strokeWidth="1.5" />
      <text x={small ? 240 : 604} y={small ? 614 : 420} textAnchor="middle" className="amz-comparison-note">Compare the input revision; preserve the configuration identity.</text>
    </g>
  );
}

function Service({ type, prefix }: { type: "Lambda" | "S3" | "Internal APIs"; prefix: string }) {
  return (
    <g className="amz-service">
      <path d="M-38-27H28L38-17V33H-28L-38 23Z" transform="translate(0 7)" fill="#071422" stroke="#274159" />
      <path d="M-38-27H28L38-17V33H-28L-38 23Z" fill={`url(#${prefix}-service)`} stroke="#cf913c" strokeWidth=".8" />
      {type === "Lambda" ? <path d="M-15-14H-6L12 21H19M-6-5-21 21M3 5-6 21" fill="none" stroke="#ffbc62" strokeWidth="3" strokeLinecap="square" /> : type === "S3" ? <g fill="none" stroke="#ffbc62" strokeWidth="1.7"><ellipse cy="-12" rx="19" ry="6" /><path d="M-19-12-14 17Q0 26 14 17L19-12M-17 0Q0 9 17 0" /></g> : <g fill="none" stroke="#ffbc62" strokeWidth="2"><path d="M-12-10-23 2-12 14M12-10 23 2 12 14M5-15-5 19" /></g>}
      <text x="0" y="62" textAnchor="middle" className="amz-service-label">{type}</text>
    </g>
  );
}

function Distribution({ selected, small, prefix }: { selected: Selection; small: boolean; prefix: string }) {
  const points: Point[] = small ? [[240, 67], [240, 199], [240, 330], [240, 461], [80, 620], [240, 620], [400, 620]] : [[97, 240], [275, 240], [445, 240], [615, 240], [796, 132], [796, 240], [796, 348]];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [3, 6]];
  return (
    <g className="amz-distribution-scene">
      {edges.map(([from, to], index) => {
        const active = to !== 6 || selected === "B";
        const path = route(points[from], points[to], small);
        return (
          <g key={`${from}-${to}`} className={`amz-delivery-edge ${active ? "is-linked" : ""}`}>
            <path d={path} className="amz-edge-base" />
            <path d={path} className={`amz-delivery-packet amz-delivery-packet-${index}`} pathLength="100" />
          </g>
        );
      })}
      <g transform={`translate(${points[0][0]} ${points[0][1]})`}><FileGlyph name="config-a.json" version="v042" prefix={prefix} /></g>
      {(["Lambda", "S3", "Internal APIs"] as const).map((type, index) => <g key={type} transform={`translate(${points[index + 1][0]} ${points[index + 1][1]})`}><Service type={type} prefix={prefix} /></g>)}
      {["A", "B", "C"].map((lane, index) => {
        const [x, y] = points[index + 4];
        const active = index !== 2 || selected === "B";
        return (
          <g key={lane} transform={`translate(${x} ${y})`} className={`amz-lane ${active ? "is-linked" : ""}`}>
            <path d="M-47-23H47V29H-47Z" fill={`url(#${prefix}-paper)`} stroke="currentColor" strokeWidth=".8" />
            <path d="M-47 29 0 36 47 29" fill="#152a3e" stroke="#344e63" strokeWidth=".6" />
            <text x="0" y="-4" textAnchor="middle" className="amz-lane-label">Lane {lane}</text>
            <text x="0" y="16" textAnchor="middle" className="amz-lane-version">{active ? "v042" : "—"}</text>
          </g>
        );
      })}
      {!small && <text x="796" y="427" textAnchor="middle" className="amz-small-label">Planning lanes</text>}
    </g>
  );
}

export function AmazonDemo() {
  const prefix = `amz${useId().replaceAll(":", "")}`;
  const smallScreen = useSyncExternalStore(subscribeSmallScreen, () => window.matchMedia("(max-width: 620px)").matches, () => false);
  const [selected, setSelected] = useState<Selection>("A");
  return (
    <DemoPlayer className="amazon-demo" label="Amazon configuration infrastructure" eyebrow="Amazon SCOT" title="Configuration dependencies and distribution" stages={STAGES} note="Illustrative nodes and values" duration={4200}>
      {({ stage }) => (
        <div className="amz-explainer" data-stage={stage}>
          <div className="amz-explainer-toolbar">
            <div className="amz-output-picker" role="group" aria-label="Research output to trace">
              <span>Trace</span>
              {(["A", "B"] as const).map(output => <button key={output} type="button" data-demo-interaction aria-pressed={selected === output} onClick={() => setSelected(output)}>Output {output}</button>)}
            </div>
            <span className="amz-illustration-label">Illustrative nodes &amp; values</span>
          </div>
          <div className="motion-artwork amz-artwork">
            <svg viewBox={smallScreen ? "0 0 480 700" : "0 0 900 490"} className="amz-art" role="img" aria-label={`Output ${selected} affects ${selected === "A" ? "two" : "three"} configurations through shared dependencies. Compare an illustrative input revision and follow version v042 through AWS Lambda, S3, and internal APIs to planning lanes.`}>
              <defs>
                <linearGradient id={`${prefix}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2b485f" /><stop offset=".42" stopColor="#152c42" /><stop offset="1" stopColor="#102135" /></linearGradient>
                <linearGradient id={`${prefix}-plane`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3c5a70" /><stop offset=".5" stopColor="#233d54" /><stop offset="1" stopColor="#172b40" /></linearGradient>
                <linearGradient id={`${prefix}-service`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#644423" /><stop offset=".48" stopColor="#3d2e20" /><stop offset="1" stopColor="#25282a" /></linearGradient>
                <radialGradient id={`${prefix}-floor`}><stop stopColor="#365675" stopOpacity=".17" /><stop offset="1" stopColor="#091725" stopOpacity="0" /></radialGradient>
              </defs>
              <ellipse cx={smallScreen ? 240 : 460} cy={smallScreen ? 385 : 257} rx={smallScreen ? 240 : 425} ry={smallScreen ? 330 : 235} fill={`url(#${prefix}-floor)`} />
              <TraceGraph selected={selected} small={smallScreen} prefix={prefix} />
              <CompareScene small={smallScreen} prefix={prefix} />
              <Distribution selected={selected} small={smallScreen} prefix={prefix} />
            </svg>
          </div>
        </div>
      )}
    </DemoPlayer>
  );
}
