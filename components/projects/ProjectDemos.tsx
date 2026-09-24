"use client";

import Image from "next/image";
import { AmazonDemo } from "@/components/projects/AmazonDemo";
import {
  BarChart3,
  CheckCircle2,
  FileText,
  Search,
  TableProperties,
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { FeaturedProject } from "@/data/portfolio";

type DemoKind = FeaturedProject["demo"];

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function QuantivMarketVisual({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 360 180" role="img" aria-label="ATM straddle range centered on spot">
      <defs>
        <linearGradient id="quantiv-market-band" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--qv-blue-2)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--qv-blue-1)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <line x1="28" x2="332" y1="94" y2="94" className="qv-axis" />
      <rect x="92" y="78" width="176" height="32" rx="16" className="qv-band">
        {animated ? (
          <>
            <animate attributeName="x" values="92;84;92" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="width" values="176;192;176" dur="2.8s" repeatCount="indefinite" />
          </>
        ) : null}
      </rect>
      <line x1="180" x2="180" y1="52" y2="132" className="qv-spot-line" />
      <circle cx="180" cy="94" r="6" className="qv-spot-dot" />
      <circle cx="92" cy="94" r="5" className="qv-down">
        {animated ? <animate attributeName="r" values="4;7;4" dur="2.8s" repeatCount="indefinite" /> : null}
      </circle>
      <circle cx="268" cy="94" r="5" className="qv-up">
        {animated ? <animate attributeName="r" values="4;7;4" dur="2.8s" repeatCount="indefinite" /> : null}
      </circle>
      <text x="180" y="38" textAnchor="middle">SPOT</text>
      <text x="92" y="142" textAnchor="middle" className="qv-down-text">-6.0%</text>
      <text x="268" y="142" textAnchor="middle" className="qv-up-text">+6.0%</text>
      <text x="180" y="166" textAnchor="middle">ATM call + put</text>
    </svg>
  );
}

function QuantivHistoryVisual({ animated }: { animated: boolean }) {
  const events = [
    { x: 46, priced: 22, actual: -14 },
    { x: 84, priced: 24, actual: 31 },
    { x: 122, priced: 20, actual: 11 },
    { x: 160, priced: 26, actual: -34 },
    { x: 198, priced: 23, actual: 28 },
    { x: 236, priced: 27, actual: -19 },
    { x: 274, priced: 25, actual: 36 },
    { x: 312, priced: 28, actual: -23 },
  ];
  const y = (move: number) => 92 - move * 1.55;

  return (
    <svg viewBox="0 0 360 180" role="img" aria-label="Historical earnings moves versus priced ranges">
      <line x1="26" x2="334" y1="92" y2="92" className="qv-axis" />
      {events.map((event, index) => (
        <g key={event.x}>
          <rect
            x={event.x - 7}
            y={y(event.priced)}
            width="14"
            height={y(-event.priced) - y(event.priced)}
            rx="4"
            className="qv-history-band"
          />
          <circle
            cx={event.x}
            cy={y(event.actual)}
            r="4"
            className={event.actual >= 0 ? "qv-up" : "qv-down"}
          >
            {animated ? (
              <>
                <animate
                  attributeName="opacity"
                  values="0.2;1;1"
                  dur="2.4s"
                  begin={`${index * 0.18}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="1;5;4"
                  dur="1.2s"
                  begin={`${index * 0.18}s`}
                  repeatCount="indefinite"
                />
              </>
            ) : null}
          </circle>
        </g>
      ))}
      <text x="30" y="24">priced range</text>
      <text x="180" y="166" textAnchor="middle">each dot = one earnings reaction</text>
    </svg>
  );
}

function QuantivModelVisual({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 360 180" role="img" aria-label="LightGBM quantile range and straddle threshold">
      <rect x="42" y="70" width="276" height="42" rx="21" className="qv-model-outer" />
      <rect x="70" y="70" width="220" height="42" rx="21" className="qv-model-range">
        {animated ? <animate attributeName="width" values="196;220;196" dur="3s" repeatCount="indefinite" /> : null}
      </rect>
      <rect x="118" y="70" width="124" height="42" rx="21" className="qv-model-mid" />
      <line x1="180" x2="180" y1="55" y2="127" className="qv-model-median" />
      <line x1="232" x2="232" y1="48" y2="134" className="qv-model-straddle">
        {animated ? (
          <>
            <animate attributeName="x1" values="224;240;232" dur="3s" repeatCount="indefinite" />
            <animate attributeName="x2" values="224;240;232" dur="3s" repeatCount="indefinite" />
          </>
        ) : null}
      </line>
      <text x="70" y="54" textAnchor="middle">P10</text>
      <text x="180" y="44" textAnchor="middle">P50</text>
      <text x="290" y="54" textAnchor="middle">P90</text>
      <text x="232" y="151" textAnchor="middle">straddle</text>
      <text x="180" y="170" textAnchor="middle">range first · probability second</text>
    </svg>
  );
}

function QuantivDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const animated = !reducedMotion;

  const stories = [
    ["Market", "What is priced?", <QuantivMarketVisual key="market" animated={animated} />],
    ["History", "What actually happened?", <QuantivHistoryVisual key="history" animated={animated} />],
    ["Model", "What does the model expect?", <QuantivModelVisual key="model" animated={animated} />],
  ] as const;

  return (
    <div className="project-demo quantiv-demo" aria-label="Quantiv About page research loop">
      <div className="demo-topline">
        <span>Quantiv · research loop</span>
        <span>from /about</span>
      </div>
      <div className="qv-story-grid">
        {stories.map(([kicker, title, visual]) => (
          <article
            className={`qv-story qv-story-${kicker.toLowerCase()}`}
            key={kicker}
          >
            <div className="qv-visual">{visual}</div>
            <span>{kicker}</span>
            <h4>{title}</h4>
          </article>
        ))}
      </div>
    </div>
  );
}

const FDRE_STAGES = [
  { label: "Filing", detail: "Timestamped at the SEC", icon: FileText },
  { label: "Parse", detail: "Text · tables · XBRL", icon: TableProperties },
  { label: "Retrieve", detail: "Keyword + vector search", icon: Search },
  { label: "Verify", detail: "PIT + source checks", icon: CheckCircle2 },
  { label: "Research", detail: "Answers · panels · studies", icon: BarChart3 },
] as const;

function FdreFilingScene() {
  return (
    <div className="fdre-scene fdre-filing">
      <div className="fdre-document">
        <header><span>SEC 10-K</span><strong>AAPL</strong></header>
        <div>Item 1A · Risk Factors</div>
        <i /><i /><i /><i />
        <b className="fdre-scan-line" />
      </div>
      <div className="fdre-stamp">
        <small>available_at</small>
        <strong>2025-10-31 · 16:08:37</strong>
      </div>
    </div>
  );
}

function FdreParseScene() {
  return (
    <div className="fdre-scene fdre-parse">
      <div className="fdre-parse-source">
        <FileText size={24} aria-hidden="true" />
        <span>10-K</span>
      </div>
      <div className="fdre-parse-rail" aria-hidden="true"><i /><i /><i /></div>
      <div className="fdre-fragments">
        <div><strong>Risk Factors</strong><span>passages</span></div>
        <div><strong>Tables</strong><span>structure</span></div>
        <div><strong>XBRL</strong><span>facts</span></div>
      </div>
    </div>
  );
}

function FdreRetrieveScene() {
  return (
    <div className="fdre-scene fdre-retrieve">
      <div className="fdre-query-box"><Search size={15} aria-hidden="true" /><span>supply chain risk</span></div>
      <div className="fdre-result-stack">
        <div className="best"><span>AAPL · Item 1A</span><strong>0.820</strong></div>
        <div><span>AAPL · Business</span><strong>0.611</strong></div>
        <div><span>AAPL · MD&amp;A</span><strong>0.544</strong></div>
      </div>
      <div className="fdre-rank-pulse" aria-hidden="true" />
    </div>
  );
}

function FdreVerifyScene() {
  return (
    <div className="fdre-scene fdre-verify">
      <div className="fdre-source-card">
        <small>Retrieved source</small>
        <p>Changes to the supply chain require considerable time and resources...</p>
        <span>AAPL · 10-K · Item 1A</span>
      </div>
      <div className="fdre-verify-beam" aria-hidden="true"><i /></div>
      <div className="fdre-check-card">
        <CheckCircle2 size={27} aria-hidden="true" />
        <strong>Supported</strong>
        <span>source + time match</span>
      </div>
    </div>
  );
}

function FdreResearchScene() {
  return (
    <div className="fdre-scene fdre-research">
      <div className="fdre-output-card"><span>01</span><strong>Cited answer</strong><i /></div>
      <div className="fdre-output-card"><span>02</span><strong>Parquet panel</strong><div><i /><i /><i /></div></div>
      <div className="fdre-output-card"><span>03</span><strong>Event study</strong><div className="bars"><i /><i /><i /><i /></div></div>
      <small className="fdre-lineage">same source lineage</small>
    </div>
  );
}

const FDRE_SCENES = [
  FdreFilingScene,
  FdreParseScene,
  FdreRetrieveScene,
  FdreVerifyScene,
  FdreResearchScene,
] as const;

function FdreDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % FDRE_STAGES.length);
    }, 1900);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const ActiveScene = FDRE_SCENES[activeStage];

  return (
    <div className="project-demo fdre-demo" aria-label="Financial Document Retrieval Engine system flow">
      <div className="demo-topline">
        <span>Financial Document Retrieval Engine · from filing to evidence</span>
        <span>from /about</span>
      </div>
      <div className="fdre-stage-rail">
        {FDRE_STAGES.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <button
              type="button"
              className={index === activeStage ? "active" : undefined}
              onClick={() => setActiveStage(index)}
              aria-pressed={index === activeStage}
              key={stage.label}
            >
              <Icon size={15} aria-hidden="true" />
              <span><strong>{stage.label}</strong><small>{stage.detail}</small></span>
            </button>
          );
        })}
      </div>
      <div className="fdre-viewport" key={activeStage}>
        <ActiveScene />
      </div>
    </div>
  );
}

const EMBERS_GALLERY = [
  {
    src: "/media/embers-yolo-live-detection.png",
    alt: "Embers live object detection view identifying household items in a walkthrough video",
    label: "Live detection",
    detail: "YOLO tracking across walkthrough frames",
  },
  {
    src: "/media/embers-inventory-dashboard.png",
    alt: "Embers inventory dashboard showing detected household items and replacement values",
    label: "Inventory",
    detail: "Structured items and replacement values",
  },
] as const;

function EmbersDemo() {
  return (
    <div className="project-demo embers-demo" aria-label="Embers product screenshots">
      <div className="demo-topline">
        <span>Embers · product frames</span>
        <span>scroll / hover</span>
      </div>

      <div className="embers-gallery" role="region" aria-label="Embers screenshot gallery">
        <div className="embers-gallery-track">
          {EMBERS_GALLERY.map((frame, index) => (
            <figure className="embers-gallery-card" tabIndex={0} key={frame.src}>
              <div className="embers-gallery-image">
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  sizes="(max-width: 720px) 86vw, 760px"
                  priority={index === 0}
                />
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{frame.label}</strong>
                <small>{frame.detail}</small>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="embers-gallery-hint" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </div>
  );
}

export function ProjectDemo({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "amazon":
      return <AmazonDemo />;
    case "quantiv":
      return <QuantivDemo />;
    case "fdre":
      return <FdreDemo />;
    case "embers":
      return <EmbersDemo />;
  }
}
