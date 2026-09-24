"use client";

import { ArrowRight, Check, Database, GitBranch, Layers3, Pause, Play, RotateCcw, Settings } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

const STAGES = [
  { id: "configure", label: "Configure", title: "Start with a planning change.", detail: "Forecast horizons, overrides, and data references enter one shared configuration.", duration: 3000 },
  { id: "validate", label: "Validate", title: "Give the change a shared version.", detail: "Validate the inputs and version the configuration before it reaches the forecast stack.", duration: 2600 },
  { id: "distribute", label: "Distribute", title: "One configuration. Seventeen consumers.", detail: "The shared configuration reaches the packages and services that depend on it.", duration: 3200 },
  { id: "forecast", label: "Forecast", title: "Keep the forecast stack aligned.", detail: "Shared inputs support MOSAIC revenue and inventory forecasts, used by a team of 13 engineers.", duration: 3200 },
] as const;

const INPUTS = [
  { icon: Settings, label: "Forecast horizon", key: "planning.horizon" },
  { icon: GitBranch, label: "Scenario overrides", key: "scenario.overrides" },
  { icon: Database, label: "Data references", key: "data.references" },
];

function subscribeMotion(notify: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}

export function AmazonDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<Animation | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [complete, setComplete] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [run, setRun] = useState(0);
  const stage = activeStage ?? (reducedMotion ? 3 : 0);
  const running = playing && inView && tabVisible && !reducedMotion && !complete;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.25), { threshold: 0.25 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // The compositor drives the progress bar; React only updates at stage boundaries.
  useEffect(() => {
    if (reducedMotion || !progressRef.current) return;
    const clock = progressRef.current.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: STAGES[stage].duration, fill: "forwards" },
    );
    clock.pause();
    clockRef.current = clock;
    clock.onfinish = () => {
      if (stage < STAGES.length - 1) setActiveStage(stage + 1);
      else {
        setComplete(true);
        setPlaying(false);
      }
    };
    return () => {
      clock.cancel();
      clockRef.current = null;
    };
  }, [stage, run, reducedMotion]);

  useEffect(() => {
    if (running) clockRef.current?.play();
    else clockRef.current?.pause();
  }, [running, stage, run]);

  const selectStage = (index: number) => {
    setActiveStage(index);
    setComplete(false);
    setPlaying(false);
    setInspecting(true);
    setRun((value) => value + 1);
  };

  const replay = () => {
    setActiveStage(0);
    setComplete(false);
    setPlaying(true);
    setInspecting(false);
    setRun((value) => value + 1);
  };

  return (
    <div ref={rootRef} className="project-demo amazon-demo" role="region" aria-label="Amazon configuration walkthrough"
      data-stage={STAGES[stage].id} data-running={running} data-complete={complete || reducedMotion} data-manual={inspecting}>
      <div className="demo-topline">
        <span>Amazon SCOT · Long-Term Planning</span>
        <span>Architecture walkthrough</span>
      </div>

      <div className="amazon-story-heading">
        <div>
          <p className="amazon-eyebrow">Shared configuration infrastructure</p>
          <h4>One change. <span>Seventeen consumers.</span></h4>
        </div>
        {!reducedMotion && (
          <div className="amazon-controls">
            <button type="button" onClick={complete ? replay : () => { setPlaying((value) => !value); setInspecting(false); }}
              aria-label={complete ? "Replay walkthrough" : playing ? "Pause walkthrough" : "Play walkthrough"}>
              {complete ? <RotateCcw size={14} /> : playing ? <Pause size={14} /> : <Play size={14} />}
              <span>{complete ? "Replay" : playing ? "Pause" : "Play"}</span>
            </button>
            {!complete && <button type="button" className="amazon-replay" onClick={replay} aria-label="Replay walkthrough"><RotateCcw size={14} /></button>}
          </div>
        )}
      </div>

      <div className="amazon-step-rail" aria-label="Walkthrough steps">
        {STAGES.map((item, index) => (
          <button type="button" key={item.id} onClick={() => selectStage(index)} aria-pressed={stage === index}>
            <span className="amazon-step-number">{index < stage ? <Check size={12} aria-hidden="true" /> : `0${index + 1}`}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="amazon-system" key={run}>
        <section className="amazon-inputs">
          <div className="amazon-node-heading"><span>01</span><h5>Planning inputs</h5></div>
          <div className="amazon-input-list">
            {INPUTS.map(({ icon: Icon, label, key }, index) => (
              <div className="amazon-input" key={key} style={{ "--input-index": index } as CSSProperties}>
                <Icon size={16} aria-hidden="true" />
                <div><strong>{label}</strong><code>{key}</code></div>
                <i aria-hidden="true" />
              </div>
            ))}
          </div>
          <p className="amazon-node-note">A common starting point</p>
        </section>

        <div className="amazon-connector amazon-connector-in" aria-hidden="true"><i /><ArrowRight size={13} /></div>

        <section className="amazon-config">
          <div className="amazon-node-heading"><span>02</span><h5>Shared configuration</h5></div>
          <div className="amazon-version">
            <div className="amazon-version-icon"><Layers3 size={28} strokeWidth={1.3} aria-hidden="true" /><i /></div>
            <span className="amazon-version-label">One version to build on</span>
            <div className="amazon-version-checks">
              <span><Check size={12} aria-hidden="true" />Validated</span>
              <span><GitBranch size={12} aria-hidden="true" />Versioned</span>
            </div>
          </div>
          <div className="amazon-service-tags" aria-label="Infrastructure"><span>Lambda</span><span>S3</span><span>CDK</span></div>
        </section>

        <div className="amazon-connector amazon-connector-out" aria-hidden="true"><i /><ArrowRight size={13} /></div>

        <section className="amazon-consumers">
          <div className="amazon-node-heading"><span>03</span><h5>Forecast stack</h5></div>
          <div className="amazon-service-grid" aria-label="17 packages and services">
            {Array.from({ length: 17 }, (_, index) => (
              <span key={index} style={{ "--service-index": index } as CSSProperties} aria-hidden="true"><i />{String(index + 1).padStart(2, "0")}</span>
            ))}
          </div>
          <div className="amazon-forecast">
            <div><strong>MOSAIC</strong><span>Revenue + inventory</span></div>
            <svg viewBox="0 0 200 48" fill="none" aria-hidden="true">
              <path className="amazon-chart-guide" d="M0 44H200M0 24H200M0 4H200" />
              <g className="amazon-chart-lines">
                <path className="amazon-chart-revenue" pathLength="1" d="M2 38L24 32L46 35L68 23L90 26L112 17L134 20L156 9L178 13L198 4" />
                <path className="amazon-chart-inventory" pathLength="1" d="M2 43L24 40L46 30L68 34L90 22L112 28L134 16L156 21L178 12L198 16" />
              </g>
            </svg>
            <small>Illustrative forecast</small>
          </div>
        </section>
      </div>

      <div className="amazon-story-caption">
        <span className="amazon-caption-index">0{stage + 1} / 04</span>
        <div className="amazon-caption-copy">
          {STAGES.map((item, index) => (
            <div key={item.id} aria-hidden={index !== stage}>
              <strong>{item.title}</strong><p>{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="amazon-stage-progress" aria-hidden="true"><div ref={progressRef} /></div>
      </div>
      <div className="amazon-impact"><span>Built for a team of <strong>13 engineers</strong></span><span><strong>~90%</strong> less manual comparison</span></div>
    </div>
  );
}
