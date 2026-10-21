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

  useEffect(() => {
    // CSS transitions also need to stop when a visitor pauses halfway through
    // a transformation. Direct step selection reveals its completed composition.
    const updateTransitions = () => {
      root.current?.getAnimations({ subtree: true }).forEach(animation => {
        if (selected !== null && !playing) {
          if (animation instanceof CSSTransition) animation.finish();
        } else if (animation instanceof CSSTransition) {
          if (running) animation.play();
          else animation.pause();
        }
      });
    };
    // A hidden tab may never deliver another frame. Stop immediately; only
    // defer starting so newly rendered transitions can first be discovered.
    if (!running) {
      updateTransitions();
      return;
    }
    const frame = requestAnimationFrame(updateTransitions);
    return () => cancelAnimationFrame(frame);
  }, [playing, running, selected, stage]);

  return (
    <div ref={root} className={`project-demo demo-player ${className}`} role="region" aria-label={label} data-running={running} data-stage={stage} data-inspecting={selected !== null && !playing}>
      <span className="sr-only">{[eyebrow, title, note].filter(Boolean).join(". ")}</span>
      <div className="demo-content" onFocus={event => {
        if (event.target.closest("[data-demo-interaction]")) {
          setSelected(stage);
          setPlaying(false);
        }
      }} onClick={event => {
        if ((event.target as HTMLElement).closest("[data-demo-interaction]")) {
          setSelected(stage);
          setPlaying(false);
        }
      }}>{children({ stage, reducedMotion })}</div>
      <p className="demo-caption">{stages[stage].detail}</p>
      <div className="demo-controls">
        <div className="demo-steps" role="group" aria-label="Animation steps">
          {stages.map((item, index) => <button key={item.label} type="button" aria-label={item.detail ? `${item.label}: ${item.detail}` : item.label} aria-pressed={stage === index} onClick={() => { setSelected(index); setPlaying(false); }}>
            {item.label}
          </button>)}
        </div>
        {!reducedMotion && <button className="demo-play-control" type="button" onClick={() => {
          if (!playing) { setAutomaticStage(stage); setSelected(null); }
          setPlaying(value => !value);
        }} aria-label={playing ? "Pause animation" : "Play animation"}>
          {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        </button>}
      </div>
    </div>
  );
}
