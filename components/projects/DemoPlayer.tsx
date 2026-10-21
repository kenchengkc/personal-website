"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

type Stage = { label: string; detail: string };

export function DemoPlayer({ className, label, eyebrow, title, stages, note, duration = 3200, children }: {
  className: string;
  label: string;
  eyebrow: string;
  title: string;
  stages: readonly Stage[];
  note: string;
  duration?: number;
  children: (state: { stage: number; reducedMotion: boolean }) => ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [automaticStage, setAutomaticStage] = useState(0);
  const stage = selected ?? (reducedMotion ? stages.length - 1 : automaticStage);
  const running = playing && inView && tabVisible && !reducedMotion;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= 0.2);
    }, { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    // Hold the completed result longer so it can be read. No frame-rate state updates.
    const timer = window.setTimeout(() => {
      setSelected(null);
      setAutomaticStage((stage + 1) % stages.length);
    }, duration * (stage === stages.length - 1 ? 1.6 : 1));
    return () => window.clearTimeout(timer);
  }, [duration, running, stage, stages.length]);

  return (
    <div ref={root} className={`project-demo demo-player ${className}`} role="region" aria-label={label} data-running={running} data-stage={stage} data-inspecting={selected !== null && !playing}>
      <header className="demo-heading">
        <div><p className="demo-eyebrow">{eyebrow}</p><h4>{title}</h4></div>
        {!reducedMotion && <button className="demo-play-control" type="button" onClick={() => {
          if (!playing) { setAutomaticStage(stage); setSelected(null); }
          setPlaying(value => !value);
        }} aria-label={playing ? "Pause animation" : "Play animation"}>
          {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        </button>}
      </header>
      <div className="demo-content">{children({ stage, reducedMotion })}</div>
      <div className="demo-steps" role="group" aria-label="Animation steps">
        {stages.map((item, index) => <button key={item.label} type="button" aria-pressed={stage === index} onClick={() => { setSelected(index); setPlaying(false); }}>
          <span className="demo-step-number">{String(index + 1).padStart(2, "0")}</span>
          <span><strong>{item.label}</strong><small>{item.detail}</small></span>
        </button>)}
      </div>
      <div className="demo-footnote"><span>{note}</span><span>Select a step to inspect</span></div>
    </div>
  );
}
