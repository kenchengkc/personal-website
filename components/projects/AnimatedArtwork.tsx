"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

export function AnimatedArtwork({ label, steps, duration = 3400, cycleSteps = true, timeline, playground, onReplay, children }: {
  label: string;
  steps: readonly { label: string; caption: string }[];
  duration?: number;
  cycleSteps?: boolean;
  /** Frames start at zero and advance in milliseconds. Playback holds on the last frame. */
  timeline?: readonly { stage: number; at: number }[];
  playground?: (stage: number) => ReactNode;
  onReplay?: () => void;
  children: (stage: number, frame: number, pause: () => void) => ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const inspectionFrame = useRef(0);
  const elapsed = useRef(0);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [automatic, setAutomatic] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const frames = timeline?.length ? timeline : undefined;
  const automaticStage = frames ? frames[automatic].stage : automatic;
  const stage = selected ?? (reducedMotion ? steps.length - 1 : automaticStage);
  const frame = frames && (selected !== null || reducedMotion)
    ? frames.findLastIndex(tick => tick.stage === stage)
    : automatic;
  const finished = frames !== undefined && frame === frames.length - 1;
  const running = inView && visible && playing && !reducedMotion && !finished;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= .25), { threshold: .25 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || !cycleSteps || frames) return;
    const timer = window.setTimeout(() => {
      setSelected(null);
      setAutomatic((stage + 1) % steps.length);
    }, duration * (stage === steps.length - 1 ? 1.4 : 1));
    return () => window.clearTimeout(timer);
  }, [duration, cycleSteps, running, stage, steps.length, frames]);

  useEffect(() => {
    if (!frames || !running) return;
    const startedAt = performance.now() - elapsed.current;
    const advance = () => {
      const time = performance.now() - startedAt;
      const index = frames.findLastIndex(tick => tick.at <= time);
      setAutomatic(index);
      const next = frames[index + 1];
      if (next) timer = window.setTimeout(advance, Math.ceil(next.at - time));
    };
    let timer = window.setTimeout(advance, 0);
    return () => {
      window.clearTimeout(timer);
      elapsed.current = performance.now() - startedAt;
    };
  }, [frames, running]);

  useEffect(() => {
    const updateTransitions = () => root.current?.getAnimations({ subtree: true }).forEach(animation => {
      if (!(animation instanceof CSSTransition)) return;
      if ((selected !== null && !playing) || finished) animation.finish();
      else if (running) animation.play();
      else animation.pause();
    });
    if (!running) updateTransitions();
    const frame = requestAnimationFrame(updateTransitions);
    return () => cancelAnimationFrame(frame);
  }, [running, selected, playing, stage, finished]);

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

  function togglePlayback() {
    if (finished) {
      onReplay?.();
      elapsed.current = 0;
      setAutomatic(0);
      setSelected(null);
      setPlaying(true);
      return;
    }
    if (!playing) {
      if (frames && selected !== null) elapsed.current = frames[frame].at;
      setAutomatic(frames ? frame : stage);
      setSelected(null);
    }
    setPlaying(value => !value);
  }

  const PlaybackIcon = finished ? RotateCcw : playing ? Pause : Play;
  const playbackLabel = finished ? "Replay animation" : playing ? "Pause animation" : "Play animation";

  return <div ref={root} className={`animated-artwork${playground ? " has-playground" : ""}`} role="figure" aria-label={label}
    data-stage={stage} data-running={running} data-motion-active={inView && visible && !reducedMotion}>
    <div className="animated-artwork-scene">{children(stage, frames ? frame : stage, () => setPlaying(false))}</div>
    <div className="animated-artwork-footer">
      <p>{steps[stage].caption}</p>
      {playground && <div className="animated-artwork-playground" onFocusCapture={inspect} onClickCapture={inspect} onChangeCapture={inspect}>{playground(stage)}</div>}
      <div className="animated-artwork-controls">
        <div role="group" aria-label="Animation steps">{steps.map((step, index) => <button key={step.label} type="button" aria-pressed={stage === index} onClick={() => { setSelected(index); setPlaying(false); }}>{step.label}</button>)}</div>
        {!reducedMotion && <button type="button" className="animated-artwork-play" aria-label={playbackLabel} onClick={togglePlayback}><PlaybackIcon size={13} aria-hidden="true" /></button>}
      </div>
    </div>
  </div>;
}
