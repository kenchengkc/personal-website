"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

export function AnimatedArtwork({ label, steps, duration = 3400, playground, children }: {
  label: string;
  steps: readonly { label: string; caption: string }[];
  duration?: number;
  playground?: (stage: number) => ReactNode;
  children: (stage: number) => ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const inspectionFrame = useRef(0);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [automatic, setAutomatic] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const stage = selected ?? (reducedMotion ? steps.length - 1 : automatic);
  const running = inView && visible && playing && !reducedMotion;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= .25), { threshold: .25 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setSelected(null);
      setAutomatic((stage + 1) % steps.length);
    }, duration * (stage === steps.length - 1 ? 1.4 : 1));
    return () => window.clearTimeout(timer);
  }, [duration, running, stage, steps.length]);

  useEffect(() => {
    const updateTransitions = () => root.current?.getAnimations({ subtree: true }).forEach(animation => {
      if (!(animation instanceof CSSTransition)) return;
      if (selected !== null && !playing) animation.finish();
      else if (running) animation.play();
      else animation.pause();
    });
    if (!running) updateTransitions();
    const frame = requestAnimationFrame(updateTransitions);
    return () => cancelAnimationFrame(frame);
  }, [running, selected, playing, stage]);

  useEffect(() => () => cancelAnimationFrame(inspectionFrame.current), []);

  function inspect() {
    setSelected(stage);
    setPlaying(false);
    // A second option change can keep the same phase and pause state. Settle
    // its new transitions after React commits that change as well.
    cancelAnimationFrame(inspectionFrame.current);
    inspectionFrame.current = requestAnimationFrame(() => {
      if (root.current?.dataset.running !== "false") return;
      root.current.getAnimations({ subtree: true }).forEach(animation => {
        if (animation instanceof CSSTransition) animation.finish();
      });
    });
  }

  return <div ref={root} className={`animated-artwork${playground ? " has-playground" : ""}`} role="figure" aria-label={label} data-stage={stage} data-running={running}>
    <div className="animated-artwork-scene">{children(stage)}</div>
    <div className="animated-artwork-footer">
      <p>{steps[stage].caption}</p>
      {playground && <div className="animated-artwork-playground" onFocusCapture={inspect} onClickCapture={inspect} onChangeCapture={inspect}>{playground(stage)}</div>}
      <div className="animated-artwork-controls">
        <div role="group" aria-label="Animation steps">{steps.map((step, index) => <button key={step.label} type="button" aria-pressed={stage === index} onClick={() => { setSelected(index); setPlaying(false); }}>{step.label}</button>)}</div>
        {!reducedMotion && <button type="button" className="animated-artwork-play" aria-label={playing ? "Pause animation" : "Play animation"} onClick={() => {
          if (!playing) { setAutomatic(stage); setSelected(null); }
          setPlaying(value => !value);
        }}>{playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}</button>}
      </div>
    </div>
  </div>;
}
