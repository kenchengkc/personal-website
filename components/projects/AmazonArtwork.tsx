import type { CSSProperties } from "react";

const consumers = Array.from({ length: 17 }, (_, index) => ({
  x: index < 6 ? 269 : index < 12 ? 319 : 369,
  y: 85 + (index % 6) * 23,
  index,
}));

/** A public reconstruction with sample values, not an internal Amazon interface. */
export function AmazonArtwork({ played }: { played: boolean }) {
  return (
    <div className={`amazon-artifact${played ? " is-playing" : ""}`}>
      <div className="amazon-artifact-heading"><span>Amazon</span><span>Configuration infrastructure</span></div>
      <svg className="amazon-artifact-scene" viewBox="0 0 400 294" role="img" aria-label="Reconstructed workflow with sample values: a versioned JSON change is compared, then traced through a shared dependency to 17 packages and services.">
        <path d="M17 51H383M17 236H383" stroke="#324453" strokeWidth=".75" />
        <text x="18" y="70" className="amazon-artifact-filename">config.json</text>
        <text x="166" y="70" className="amazon-artifact-small">v041 → v042</text>
        <path d="M226 62V224" stroke="#324453" strokeWidth=".75" />
        <g className="amazon-artifact-code">
          <g className="amazon-artifact-lines"><text x="20" y="95">1</text><text x="20" y="115">2</text><text x="20" y="135">3</text><text x="20" y="155">4</text><text x="20" y="175">5</text><text x="20" y="195">6</text></g>
          <text x="41" y="95">{"{"}</text>
          <text x="52" y="115"><tspan className="amazon-artifact-key">&quot;source&quot;</tspan>: &quot;forecast&quot;,</text>
          <path d="M34 122H216V141H34Z" fill="#a95e58" fillOpacity=".15" />
          <text x="41" y="135" fill="#d49a93">− <tspan className="amazon-artifact-key">&quot;version&quot;</tspan>: &quot;v041&quot;,</text>
          <path className="amazon-artifact-change" d="M34 142H216V161H34Z" fill="#dba45e" fillOpacity=".15" />
          <text x="41" y="155" fill="#f0c388">+ <tspan className="amazon-artifact-key">&quot;version&quot;</tspan>: &quot;v042&quot;,</text>
          <text x="52" y="175"><tspan className="amazon-artifact-key">&quot;refresh&quot;</tspan>: <tspan fill="#b8b1dd">true</tspan></text>
          <text x="41" y="195">{"}"}</text>
        </g>
        <text x="41" y="218" className="amazon-artifact-small">Sample configuration</text>
        <g fill="none">
          <path d="M216 152H239V73H369M269 73V214M319 73V214M369 73V191" stroke="#647c8c" strokeOpacity=".42" />
          <path className="amazon-artifact-trunk" d="M216 152H239V73H369" pathLength="100" stroke="#edb66b" strokeWidth="1.4" />
          {consumers.map(({ x, y, index }) => <g key={index} style={{ "--consumer": index } as CSSProperties}>
            <path className="amazon-artifact-branch" d={`M${x} 73V${y}h-8`} pathLength="100" stroke="#d9ac75" strokeWidth="1.1" />
            <rect className="amazon-artifact-consumer" x={x - 12} y={y - 6} width="25" height="13" rx="1" fill="#192e3f" stroke="#547080" strokeWidth=".65" />
            <text x={x + .5} y={y + 3} textAnchor="middle" className="amazon-artifact-node-id">{String(index + 1).padStart(2, "0")}</text>
          </g>)}
        </g>
        <text x="252" y="218" className="amazon-artifact-small">17 packages / services</text>
        <g className="amazon-artifact-deployment">
          <text x="18" y="258">Lambda</text><path d="M68 254H88m-4-3 4 3-4 3" />
          <text x="98" y="258">S3</text><path d="M120 254H140m-4-3 4 3-4 3" />
          <text x="150" y="258">Internal APIs</text>
        </g>
      </svg>
      <span className="amazon-artifact-caption">Reconstructed workflow</span>
    </div>
  );
}
