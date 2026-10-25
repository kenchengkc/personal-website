"use client";

import { useId, useState, type CSSProperties } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";

const steps = [
  { label: "Compare", caption: "A versioned JSON diff isolates the changed forecasting input." },
  { label: "Trace", caption: "The same change is traced to its downstream configurations." },
  { label: "Publish", caption: "Version v042 reaches the dependent packages and services." },
] as const;

const consumers = Array.from({ length: 17 }, (_, index) => ({
  x: 258 + Math.floor(index / 6) * 47,
  y: 56 + (index % 6) * 21,
  index,
}));

type Output = "A" | "B";
const affectedByOutput: Record<Output, readonly number[]> = {
  A: [0, 1, 2, 3, 4, 5, 12, 13, 14],
  B: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
};

function ServiceIcon({ kind, prefix }: { kind: "Lambda" | "S3" | "Internal APIs"; prefix: string }) {
  return <g className="amazon-service-icon" data-service={kind}>
    <g transform="scale(.58)">
      <path d="M-25-24H18L26-16V25H-18L-25 18Z" transform="translate(0 4)" fill="#091725" stroke="#2e4659" strokeWidth=".7" />
      <path d="M-25-24H18L26-16V25H-18L-25 18Z" fill={`url(#${prefix}-service)`} stroke="#b8813c" strokeWidth=".8" />
      {kind === "Lambda" ? <path d="M-10-12H-3L10 16H16M-3-5-15 16M3 5-4 16" fill="none" stroke="#ffbb68" strokeWidth="2.2" /> : kind === "S3" ? <g fill="none" stroke="#ffbb68" strokeWidth="1.5"><ellipse cy="-10" rx="14" ry="4.5" /><path d="M-14-10-10 13Q0 19 10 13L14-10M-12-1Q0 5 12-1" /></g> : <path d="M-10-8-18 1-10 10M10-8 18 1 10 10M4-12-4 14" fill="none" stroke="#ffbb68" strokeWidth="1.7" />}
    </g>
    <text x="0" y="29" textAnchor="middle">{kind}</text>
  </g>;
}

/** Sample configuration values illustrate the published project description. */
export function AmazonArtwork() {
  const panelId = useId().replace(/:/g, "");
  const [output, setOutput] = useState<Output>("A");
  const affected = affectedByOutput[output];
  return (
    <div className="amazon-artifact">
      <AnimatedArtwork label="Amazon configuration infrastructure" steps={steps} duration={3600} playground={() => <div className="amazon-output-playground">
        <div role="group" aria-label="Research output"><span>Trace</span>{(["A", "B"] as const).map(value => <button key={value} type="button" aria-pressed={output === value} onClick={() => setOutput(value)}>Output {value}</button>)}</div>
        <span className="amazon-output-count">{affected.length} linked · 17 total</span>
      </div>}>
        {stage => (
          <div className="animated-artwork-scene amazon-artifact-scene" data-amazon-stage={stage}>
            <svg viewBox="0 0 400 244" role="img" aria-label={`Reconstructed workflow with sample relationships: output ${output} affects ${affected.length} of 17 consumers. Compare its versioned JSON change, trace the highlighted dependencies, and distribute v042 through Lambda, S3, and internal APIs.`}>
              <defs>
                <linearGradient id={panelId} x2="0" y2="1"><stop stopColor="#1c3143" /><stop offset="1" stopColor="#101f2c" /></linearGradient>
                <linearGradient id={`${panelId}-service`} x2=".8" y2="1"><stop stopColor="#34495a" /><stop offset="1" stopColor="#172b3d" /></linearGradient>
              </defs>
              <text x="18" y="22" className="amazon-artifact-brand">Amazon</text>
              <text x="383" y="22" textAnchor="end" className="amazon-artifact-context">Reconstructed workflow</text>
              <path d="M17 33H383" stroke="#405364" strokeWidth=".6" />

              <rect x="17" y="46" width="187" height="132" rx="3" fill={`url(#${panelId})`} stroke="#3a5164" strokeWidth=".7" />
              <path d="M17 70H204" stroke="#3a5164" strokeWidth=".7" />
              <text x="29" y="61" className="amazon-artifact-filename">config-{output.toLowerCase()}.json</text>
              <text x="190" y="61" textAnchor="end" className="amazon-artifact-small">v041 → v042</text>
              <g className="amazon-artifact-code">
                <g className="amazon-artifact-lines"><text x="27" y="91">1</text><text x="27" y="108">2</text><text x="27" y="125">3</text><text x="27" y="142">4</text><text x="27" y="159">5</text></g>
                <text x="42" y="91">{"{"}</text>
                <text x="50" y="108"><tspan className="amazon-artifact-key">&quot;source&quot;</tspan>: &quot;output-{output.toLowerCase()}&quot;,</text>
                <path d="M39 113H196V130H39Z" fill="#ac6a60" fillOpacity=".15" />
                <text x="43" y="125" className="amazon-artifact-removed">− &quot;version&quot;: &quot;v041&quot;,</text>
                <path className="amazon-artifact-diff" d="M39 130H196V147H39Z" fill="#dfab63" fillOpacity=".22" />
                <text x="43" y="142" className="amazon-artifact-added">+ &quot;version&quot;: &quot;v042&quot;,</text>
                <text x="42" y="159">{"}"}</text>
              </g>

              <g fill="none">
                <path d="M204 138H225V44H352M258 44V161M305 44V161M352 44V140" stroke="#526a7c" strokeOpacity=".45" strokeWidth=".8" />
                <path className="amazon-artifact-trunk" d="M204 138H225V44H352" pathLength="100" stroke="#edb979" strokeWidth="1.6" />
                {consumers.map(({ x, y, index }) => <g key={index} className={`amazon-artifact-recipient${affected.includes(index) ? " is-affected" : ""}`} data-affected={affected.includes(index)} style={{ "--consumer": index } as CSSProperties}>
                  <path className="amazon-artifact-branch" d={`M${x} 44V${y}h-8`} pathLength="100" stroke="#cba578" strokeWidth="1" />
                  <rect className="amazon-artifact-consumer" x={x - 12} y={y - 6} width="29" height="13" rx="1.5" fill="#192e3f" stroke="#547080" strokeWidth=".65" />
                  <text x={x + 2} y={y + 3} textAnchor="middle" className="amazon-artifact-node-id">{String(index + 1).padStart(2, "0")}</text>
                  <path className="amazon-artifact-ack" d={`M${x + 9} ${y - 1}l2 2 4-4`} stroke="#e3c18c" strokeWidth=".8" />
                </g>)}
              </g>
              <text x="307" y="178" textAnchor="middle" className="amazon-artifact-small">{affected.length} linked / 17 total</text>

              <path d="M110 178V207H354V165" className="amazon-artifact-publish-base" />
              <path d="M110 178V207H354V165" pathLength="100" className="amazon-artifact-publish-path" />
              <g className="amazon-artifact-deployment">
                <g transform="translate(110 207)"><ServiceIcon kind="Lambda" prefix={panelId} /></g>
                <g transform="translate(201 207)"><ServiceIcon kind="S3" prefix={panelId} /></g>
                <g transform="translate(300 207)"><ServiceIcon kind="Internal APIs" prefix={panelId} /></g>
              </g>
              <g className="amazon-artifact-version-packet" data-flow-id="amazon-gallery-config" aria-hidden="true">
                <rect x="-16" y="-8" width="32" height="16" rx="3" fill="#e4b779" />
                <text y="3" textAnchor="middle">v042</text>
              </g>
            </svg>
          </div>
        )}
      </AnimatedArtwork>
    </div>
  );
}
