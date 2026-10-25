"use client";

import { useId, type CSSProperties } from "react";
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

/** Sample configuration values illustrate the published project description. */
export function AmazonArtwork() {
  const panelId = useId();
  return (
    <div className="amazon-artifact">
      <AnimatedArtwork label="Amazon configuration infrastructure" steps={steps} duration={3600}>
        {stage => (
          <div className="animated-artwork-scene amazon-artifact-scene" data-amazon-stage={stage}>
            <svg viewBox="0 0 400 244" role="img" aria-label="Reconstructed workflow: compare a versioned JSON change, trace downstream dependencies, then distribute the same version through Lambda, S3, and internal APIs to 17 packages and services.">
              <defs>
                <linearGradient id={panelId} x2="0" y2="1"><stop stopColor="#1c3143" /><stop offset="1" stopColor="#101f2c" /></linearGradient>
              </defs>
              <text x="18" y="22" className="amazon-artifact-brand">Amazon</text>
              <text x="383" y="22" textAnchor="end" className="amazon-artifact-context">Reconstructed workflow</text>
              <path d="M17 33H383" stroke="#405364" strokeWidth=".6" />

              <rect x="17" y="46" width="187" height="132" rx="3" fill={`url(#${panelId})`} stroke="#3a5164" strokeWidth=".7" />
              <path d="M17 70H204" stroke="#3a5164" strokeWidth=".7" />
              <text x="29" y="61" className="amazon-artifact-filename">config.json</text>
              <text x="190" y="61" textAnchor="end" className="amazon-artifact-small">v041 → v042</text>
              <g className="amazon-artifact-code">
                <g className="amazon-artifact-lines"><text x="27" y="91">1</text><text x="27" y="108">2</text><text x="27" y="125">3</text><text x="27" y="142">4</text><text x="27" y="159">5</text></g>
                <text x="42" y="91">{"{"}</text>
                <text x="50" y="108"><tspan className="amazon-artifact-key">&quot;source&quot;</tspan>: &quot;forecast&quot;,</text>
                <path d="M39 113H196V130H39Z" fill="#ac6a60" fillOpacity=".15" />
                <text x="43" y="125" className="amazon-artifact-removed">− &quot;version&quot;: &quot;v041&quot;,</text>
                <path className="amazon-artifact-diff" d="M39 130H196V147H39Z" fill="#dfab63" fillOpacity=".22" />
                <text x="43" y="142" className="amazon-artifact-added">+ &quot;version&quot;: &quot;v042&quot;,</text>
                <text x="42" y="159">{"}"}</text>
              </g>

              <g fill="none">
                <path d="M204 138H225V44H352M258 44V161M305 44V161M352 44V140" stroke="#526a7c" strokeOpacity=".45" strokeWidth=".8" />
                <path className="amazon-artifact-trunk" d="M204 138H225V44H352" pathLength="100" stroke="#edb979" strokeWidth="1.6" />
                {consumers.map(({ x, y, index }) => <g key={index} style={{ "--consumer": index } as CSSProperties}>
                  <path className="amazon-artifact-branch" d={`M${x} 44V${y}h-8`} pathLength="100" stroke="#cba578" strokeWidth="1" />
                  <rect className="amazon-artifact-consumer" x={x - 12} y={y - 6} width="29" height="13" rx="1.5" fill="#192e3f" stroke="#547080" strokeWidth=".65" />
                  <text x={x + 2} y={y + 3} textAnchor="middle" className="amazon-artifact-node-id">{String(index + 1).padStart(2, "0")}</text>
                  <path className="amazon-artifact-ack" d={`M${x + 9} ${y - 1}l2 2 4-4`} stroke="#e3c18c" strokeWidth=".8" />
                </g>)}
              </g>
              <text x="307" y="178" textAnchor="middle" className="amazon-artifact-small">17 packages / services</text>

              <path d="M110 178V212H354V165" className="amazon-artifact-publish-base" />
              <path d="M110 178V212H354V165" pathLength="100" className="amazon-artifact-publish-path" />
              <g className="amazon-artifact-deployment">
                <rect x="79" y="200" width="63" height="23" rx="2" /><text x="110" y="215" textAnchor="middle">Lambda</text>
                <rect x="177" y="200" width="48" height="23" rx="2" /><text x="201" y="215" textAnchor="middle">S3</text>
                <rect x="260" y="200" width="80" height="23" rx="2" /><text x="300" y="215" textAnchor="middle">Internal APIs</text>
              </g>
              <g className="amazon-artifact-version-packet" aria-hidden="true">
                <rect x="-16" y="-8" width="32" height="16" rx="3" fill="#e4b779" />
                <text y="3" textAnchor="middle">v042</text>
              </g>
              <text x="18" y="237" className="amazon-artifact-small">Sample values</text>
              <text x="383" y="237" textAnchor="end" className="amazon-artifact-status">{stage === 0 ? "Version comparison" : stage === 1 ? "Dependency trace" : "Configuration delivery"}</text>
            </svg>
          </div>
        )}
      </AnimatedArtwork>
    </div>
  );
}
