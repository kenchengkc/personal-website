"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

function ConfigVisual() {
  return (
    <svg viewBox="0 0 320 190" role="img" aria-label="Version-controlled JSON configuration">
      <path className="amazon-file-outline" d="M69 18H233L251 36V172H69Z M233 18V36H251" />
      <text x="85" y="44" className="amazon-file-name">config.json</text>
      <path className="amazon-rule" d="M85 56H235" />
      <g className="amazon-code">
        <text x="85" y="78">{'{'}</text>
        <text x="98" y="99">model</text><path className="amazon-code-value" d="M170 95H222" />
        <text x="98" y="120">inputs</text><path className="amazon-code-value" d="M170 116H211" />
        <text x="98" y="141">overrides</text><path className="amazon-code-value" d="M170 137H224" />
        <text x="85" y="160">{'}'}</text>
      </g>
      <path className="amazon-config-edit" d="M170 116H223" />
      <circle className="amazon-commit" cx="233" cy="44" r="3" />
    </svg>
  );
}

const DEPENDENCY_PATHS = [
  "M38 95C68 95 72 52 108 52",
  "M38 95C68 95 72 138 108 138",
  "M108 52C140 52 143 95 177 95",
  "M108 138C140 138 143 95 177 95",
  "M177 95C210 95 215 40 264 40",
  "M177 95H264",
  "M177 95C210 95 215 150 264 150",
];
const DEPENDENCY_NODES = [[38, 95], [108, 52], [108, 138], [177, 95], [264, 40], [264, 95], [264, 150]];

function DependencyVisual() {
  return (
    <svg viewBox="0 0 320 190" role="img" aria-label="Dependencies traced from model outputs to downstream configurations">
      {DEPENDENCY_PATHS.map((path, index) => (
        <g key={path}>
          <path d={path} className="amazon-dependency-path" />
          <path d={path} pathLength="1" className="amazon-dependency-signal" style={{ "--delay": `${index < 2 ? 0 : index < 4 ? 1.2 : 2.4}s` } as CSSProperties} />
        </g>
      ))}
      {DEPENDENCY_NODES.map(([x, y], index) => (
        <g key={`${x}-${y}`}>
          <circle className="amazon-node" cx={x} cy={y} r={index === 3 ? 6 : 4} />
          <circle className="amazon-node-arrival" cx={x} cy={y} r={index === 3 ? 6 : 4}
            style={{ "--delay": `${index === 0 ? 0 : index < 3 ? 1.2 : index === 3 ? 2.4 : 3.6}s` } as CSSProperties} />
        </g>
      ))}
      <text x="38" y="179" textAnchor="middle">models</text>
      <text x="264" y="179" textAnchor="middle">configs</text>
    </svg>
  );
}

function DeliveryVisual() {
  return (
    <svg viewBox="0 0 320 190" role="img" aria-label="Configuration delivery through Lambda, S3, and Coral APIs">
      <path className="amazon-delivery-rail" d="M58 88H142M178 88H262" />
      <path className="amazon-delivery-signal amazon-delivery-first" d="M58 88H142" pathLength="1" />
      <path className="amazon-delivery-signal amazon-delivery-second" d="M178 88H262" pathLength="1" />
      <g className="amazon-service-mark">
        <path d="M33 75H40L55 101 M43 80L32 101" />
        <ellipse cx="160" cy="75" rx="17" ry="6" />
        <path d="M143 75V99C143 107 177 107 177 99V75 M143 87C143 95 177 95 177 87" />
        <path d="M273 78L263 88L273 98 M289 78L299 88L289 98 M284 74L278 102" />
      </g>
      <text x="43" y="132" textAnchor="middle">Lambda</text>
      <text x="160" y="132" textAnchor="middle">S3</text>
      <text x="281" y="132" textAnchor="middle">Coral APIs</text>
    </svg>
  );
}

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
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const running = playing && inView && tabVisible && !reducedMotion;

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.2), { threshold: 0.2 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="project-demo amazon-demo" role="region" aria-label="Amazon configuration infrastructure" data-running={running}>
      <div className="demo-topline">
        <span>Amazon SCOT · configuration infrastructure</span>
        {!reducedMotion && (
          <button className="amazon-motion-control" type="button" onClick={() => setPlaying(value => !value)}
            aria-label={playing ? "Pause animation" : "Play animation"}>
            {playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
          </button>
        )}
      </div>
      <div className="amazon-panels">
        <article>
          <div className="amazon-diagram"><ConfigVisual /></div>
          <span>Configuration</span>
          <h4>Version-controlled JSON</h4>
        </article>
        <article>
          <div className="amazon-diagram"><DependencyVisual /></div>
          <span>Dependencies</span>
          <h4>Trace model outputs to configs</h4>
        </article>
        <article>
          <div className="amazon-diagram"><DeliveryVisual /></div>
          <span>Distribution</span>
          <h4>Deliver across planning lanes</h4>
        </article>
      </div>
    </div>
  );
}
