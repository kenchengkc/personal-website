"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Trace", detail: "Shared inputs connect each research output to the configurations it affects." },
  { label: "Compare", detail: "The selected configuration retains both JSON versions for comparison." },
  { label: "Distribute", detail: "Version v042 moves through Lambda, S3, and internal APIs to the affected planning lanes." },
] as const;

type Point = readonly [number, number];
type Selection = "A" | "B";
type LayoutName = "wide" | "compact" | "narrow";
type Layout = {
  width: number;
  height: number;
  graph: readonly Point[];
  verticalGraph: boolean;
  previous: Point;
  comparison: Point;
  departure: Point;
  services: readonly Point[];
  lanes: readonly Point[];
  delivered: Point;
  traceScale: number;
  comparisonScale: number;
  deliveryScale: number;
};

// These illustrative relationships are unchanged when the artwork recomposes.
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

const LAYOUTS: Record<LayoutName, Layout> = {
  wide: {
    width: 900, height: 550,
    graph: [[73, 96], [73, 278], [235, 62], [235, 187], [235, 311], [435, 77], [435, 196], [435, 315]],
    verticalGraph: false,
    previous: [621, 152], comparison: [790, 152], departure: [82, 374],
    services: [[155, 430], [330, 430], [505, 430]],
    lanes: [[805, 366], [805, 437], [805, 508]], delivered: [645, 430],
    traceScale: .65, comparisonScale: 1, deliveryScale: .52,
  },
  compact: {
    width: 580, height: 560,
    graph: [[58, 82], [58, 235], [191, 57], [191, 164], [191, 270], [342, 70], [342, 177], [342, 284]],
    verticalGraph: false,
    previous: [491, 83], comparison: [491, 249], departure: [43, 370],
    services: [[80, 427], [212, 427], [344, 427]],
    lanes: [[510, 375], [510, 451], [510, 527]], delivered: [421, 451],
    traceScale: .65, comparisonScale: .88, deliveryScale: .44,
  },
  narrow: {
    width: 400, height: 742,
    graph: [[99, 47], [301, 47], [65, 151], [200, 151], [335, 151], [65, 272], [200, 272], [335, 272]],
    verticalGraph: true,
    previous: [105, 424], comparison: [290, 424], departure: [42, 527],
    services: [[70, 586], [200, 586], [330, 586]],
    lanes: [[70, 701], [200, 701], [330, 701]], delivered: [200, 645],
    traceScale: .6, comparisonScale: .93, deliveryScale: .44,
  },
};

function connection(from: Point, to: Point, vertical = false) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  return vertical
    ? `M${x1} ${y1}C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`
    : `M${x1} ${y1}C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;
}

function ConfigurationPaper({ prefix, version, current }: { prefix: string; version: string; current: boolean }) {
  return (
    <g className={current ? "amz-current-paper" : "amz-previous-paper"}>
      <path d="M-70-76H48L70-54V76H-70Z" transform="translate(-4 5)" fill="#091522" stroke="#304658" strokeWidth=".8" />
      <path d="M-70-76H48L70-54V76H-70Z" fill={`url(#${prefix}-paper)`} stroke={current ? "#e4ae63" : "#647d91"} />
      <path d="M48-76V-54H70" fill="#263c4f" stroke={current ? "#caa370" : "#647d91"} strokeWidth=".7" />
      <text x="-55" y="-48" className="amz-actor-filename">config-a.json</text>
      <text x="-55" y="-25" className="amz-actor-version">{version}</text>
      <path d="M-54-13H54" stroke="#a2b4c1" strokeOpacity=".18" />
      <g className="amz-paper-code">
        <text x="-55" y="8" className="amz-code-brace">{"{"}</text>
        <text x="-40" y="28" className="amz-code-key">&quot;input&quot;:</text>
        <path d="M-43 35H49V56H-43Z" fill={current ? "#e99a32" : "#91a7bb"} fillOpacity={current ? ".12" : ".06"} />
        <text x="-30" y="51" className="amz-code-value">&quot;{version}&quot;</text>
        <text x="-55" y="67" className="amz-code-brace">{"}"}</text>
      </g>
    </g>
  );
}

function SecondaryConfiguration({ name, active, prefix }: { name: string; active: boolean; prefix: string }) {
  return (
    <g className={`amz-secondary-config ${active ? "is-linked" : ""}`}>
      <path d="M-34-23H23L34-12V24H-34Z" fill={`url(#${prefix}-paper)`} stroke="currentColor" strokeWidth=".8" />
      <path d="M23-23V-12H34M-22-6H18M-22 2H10M-22 10H19" fill="none" stroke="currentColor" strokeWidth=".8" />
      <text x="0" y="42" textAnchor="middle" className="amz-config-label">{name}</text>
    </g>
  );
}

function DependencyMap({ selected, layout, prefix }: { selected: Selection; layout: Layout; prefix: string }) {
  const activeNodes = selected === "A" ? [0, 2, 3, 5, 6] : [1, 3, 4, 5, 6, 7];
  return (
    <g className="amz-dependency-map">
      {EDGES.map((edge, index) => {
        const path = connection(layout.graph[edge.from], layout.graph[edge.to], layout.verticalGraph);
        return (
          <g className={`amz-edge ${edge.outputs.includes(selected) ? "is-linked" : ""}`} key={`${edge.from}-${edge.to}`}>
            <path d={path} className="amz-edge-base" />
            <path d={path} pathLength="100" className={`amz-edge-signal amz-signal-${index % 3}`} />
          </g>
        );
      })}
      {(["A", "B"] as const).map((output, index) => {
        const [x, y] = layout.graph[index];
        return (
          <g transform={`translate(${x} ${y})`} className={`amz-output ${selected === output ? "is-linked" : ""}`} key={output}>
            <path d="M-29 4 0-11 29 4 0 19Z" fill="#0b1a29" stroke="currentColor" strokeWidth=".8" />
            <path d="M-29-3 0-18 29-3 0 12Z" fill={`url(#${prefix}-plane)`} stroke="currentColor" strokeWidth=".8" />
            <path d="M-16-3-7-8 0-4 8-12 17-7" className="amz-output-plot" />
            <text x="0" y="37" textAnchor="middle" className="amz-output-label">Output {output}</text>
          </g>
        );
      })}
      {["Input A", "Shared input", "Input B"].map((label, index) => {
        const [x, y] = layout.graph[index + 2];
        return (
          <g transform={`translate(${x} ${y})`} className={`amz-dependency ${activeNodes.includes(index + 2) ? "is-linked" : ""}`} key={label}>
            <path d="M-25-16H25V16H-25Z" fill={`url(#${prefix}-plane)`} stroke="currentColor" strokeWidth=".8" />
            <path d="M-13-5H13M-13 2H7M-13 8H10" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <text x="0" y="34" textAnchor="middle" className="amz-node-label">{label}</text>
            {index === 1 && <text x="0" y="49" textAnchor="middle" className="amz-shared-label">2 outputs · 2 configs</text>}
          </g>
        );
      })}
      <circle cx={layout.graph[5][0]} cy={layout.graph[5][1]} r="3" fill="#dca35c" className="amz-configuration-origin" />
      <text x={layout.graph[5][0]} y={layout.graph[5][1] + 62} textAnchor="middle" className="amz-config-label">Config A</text>
      {["config-b.json", "config-c.json"].map((file, index) => {
        const [x, y] = layout.graph[index + 6];
        return <g transform={`translate(${x} ${y})`} key={file}><SecondaryConfiguration name={file} active={activeNodes.includes(index + 6)} prefix={prefix} /></g>;
      })}
    </g>
  );
}

function Service({ kind, prefix }: { kind: "Lambda" | "S3" | "Internal APIs"; prefix: string }) {
  return (
    <g className="amz-service">
      <path d="M-25-24H18L26-16V25H-18L-25 18Z" transform="translate(0 4)" fill="#091725" stroke="#2e4659" strokeWidth=".7" />
      <path d="M-25-24H18L26-16V25H-18L-25 18Z" fill={`url(#${prefix}-service)`} stroke="#b8813c" strokeWidth=".8" />
      {kind === "Lambda" ? <path d="M-10-12H-3L10 16H16M-3-5-15 16M3 5-4 16" fill="none" stroke="#ffbb68" strokeWidth="2.2" /> : kind === "S3" ? <g fill="none" stroke="#ffbb68" strokeWidth="1.5"><ellipse cy="-10" rx="14" ry="4.5" /><path d="M-14-10-10 13Q0 19 10 13L14-10M-12-1Q0 5 12-1" /></g> : <path d="M-10-8-18 1-10 10M10-8 18 1 10 10M4-12-4 14" fill="none" stroke="#ffbb68" strokeWidth="1.7" />}
      <text x="0" y="-37" textAnchor="middle" className="amz-service-label">{kind}</text>
    </g>
  );
}

function ServiceMap({ selected, layout, prefix }: { selected: Selection; layout: Layout; prefix: string }) {
  const arrival = layout.delivered;
  return (
    <g className="amz-service-map">
      {layout.services.slice(0, -1).map((point, index) => <path key={index} d={connection(point, layout.services[index + 1])} className="amz-service-rail" />)}
      <path d={connection(layout.services[2], arrival, layout.verticalGraph)} className="amz-service-rail" />
      {layout.lanes.map((point, index) => {
        const active = index !== 2 || selected === "B";
        return <g className={`amz-lane-route ${active ? "is-linked" : ""}`} key={index}><path d={connection(arrival, point, layout.verticalGraph)} className="amz-edge-base" /><path d={connection(arrival, point, layout.verticalGraph)} className="amz-lane-packet" pathLength="100" /></g>;
      })}
      {(["Lambda", "S3", "Internal APIs"] as const).map((kind, index) => <g transform={`translate(${layout.services[index][0]} ${layout.services[index][1]})`} key={kind}><Service kind={kind} prefix={prefix} /></g>)}
      {(["A", "B", "C"] as const).map((lane, index) => {
        const [x, y] = layout.lanes[index];
        const active = index !== 2 || selected === "B";
        return (
          <g transform={`translate(${x} ${y})`} className={`amz-lane ${active ? "is-linked" : ""}`} key={lane}>
            <path d="M-35-22H35V24H-35Z" fill={`url(#${prefix}-paper)`} stroke="currentColor" strokeWidth=".8" />
            <text x="0" y="-4" textAnchor="middle" className="amz-lane-label">Lane {lane}</text>
            <text x="0" y="14" textAnchor="middle" className="amz-lane-version">{active ? "v042" : "—"}</text>
          </g>
        );
      })}
    </g>
  );
}

function layoutProperties(layout: Layout): CSSProperties {
  const points = {
    trace: layout.graph[5], compare: layout.comparison, previous: layout.previous,
    departure: layout.departure, lambda: layout.services[0], storage: layout.services[1],
    api: layout.services[2], delivered: layout.delivered,
  };
  const properties: Record<string, string | number> = {
    "--amz-trace-scale": layout.traceScale,
    "--amz-compare-scale": layout.comparisonScale,
    "--amz-delivery-scale": layout.deliveryScale,
  };
  Object.entries(points).forEach(([name, [x, y]]) => {
    properties[`--amz-${name}-x`] = `${x}px`;
    properties[`--amz-${name}-y`] = `${y}px`;
  });
  return properties as CSSProperties;
}

export function AmazonDemo() {
  const prefix = `amz${useId().replaceAll(":", "")}`;
  const container = useRef<HTMLDivElement>(null);
  const history = useRef<SVGPathElement>(null);
  const [layoutName, setLayoutName] = useState<LayoutName>("compact");
  const [selected, setSelected] = useState<Selection>("A");

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setLayoutName(width < 400 ? "narrow" : width < 720 ? "compact" : "wide");
    });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  const layout = LAYOUTS[layoutName];
  const historyPath = connection(layout.graph[5], layout.comparison, layout.verticalGraph);
  const [compareX, compareY] = layout.comparison;
  const [departX, departY] = layout.departure;
  const [lambdaX, lambdaY] = layout.services[0];
  const departurePath = `M${compareX} ${compareY}C${compareX} ${departY} ${departX} ${departY - 35} ${departX} ${departY}S${lambdaX} ${lambdaY - 25} ${lambdaX} ${lambdaY}`;
  const flowPath = [
    historyPath,
    departurePath,
    ...layout.services.slice(0, -1).map((point, index) => connection(point, layout.services[index + 1])),
    connection(layout.services[2], layout.delivered, layout.verticalGraph),
  ].map((path, index) => index === 0 ? path : path.slice(path.indexOf("C"))).join("");

  useLayoutEffect(() => {
    if (history.current) {
      container.current?.style.setProperty("--amz-compare-distance", `${history.current.getTotalLength()}px`);
    }
  }, [layout]);

  return (
    <DemoPlayer className="amazon-demo" label="Amazon configuration infrastructure" eyebrow="Amazon SCOT" title="Configuration dependencies and distribution" stages={STAGES} note="Illustrative nodes and values" duration={4200}>
      {({ stage }) => (
        <div ref={container} className="amz-explainer" data-stage={stage} data-layout={layoutName} style={layoutProperties(layout)}>
          <div className="amz-explainer-toolbar">
            <div className="amz-output-picker" role="group" aria-label="Research output to trace">
              {(["A", "B"] as const).map(output => <button key={output} type="button" data-demo-interaction aria-pressed={selected === output} onClick={() => setSelected(output)}>Output {output}</button>)}
            </div>
            <span className="amz-illustration-label">Illustrative nodes &amp; values</span>
          </div>
          <p className="amz-selection-summary">Output {selected} → {selected === "A" ? "2" : "3"} affected configurations</p>
          <div className="motion-artwork amz-artwork" style={{ aspectRatio: `${layout.width} / ${layout.height}` }}>
            <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="amz-art" role="img" aria-label={`Output ${selected} affects ${selected === "A" ? "two" : "three"} configurations through shared dependencies. The same config-a.json document is compared with v041, then carries v042 through Lambda, S3, and internal APIs to planning lanes.`}>
              <defs>
                <linearGradient id={`${prefix}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#263d50" /><stop offset=".5" stopColor="#14293d" /><stop offset="1" stopColor="#102033" /></linearGradient>
                <linearGradient id={`${prefix}-plane`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#344c60" /><stop offset="1" stopColor="#1a3045" /></linearGradient>
                <linearGradient id={`${prefix}-service`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#523b25" /><stop offset="1" stopColor="#25282b" /></linearGradient>
              </defs>
              <path ref={history} d={historyPath} className="amz-history-link" />
              <path d={departurePath} className="amz-departure-rail" />
              <DependencyMap selected={selected} layout={layout} prefix={prefix} />
              <ServiceMap selected={selected} layout={layout} prefix={prefix} />
              <g className="amz-previous-version"><ConfigurationPaper prefix={prefix} version="v041" current={false} /></g>
              <g data-flow-id="amazon-config" className="amz-config-actor" style={{ offsetPath: `path("${flowPath}")` }}><ConfigurationPaper prefix={prefix} version="v042" current /></g>
            </svg>
          </div>
        </div>
      )}
    </DemoPlayer>
  );
}
