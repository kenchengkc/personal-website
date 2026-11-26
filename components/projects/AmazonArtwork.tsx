"use client";

import { ArrowDown } from "lucide-react";
import localFont from "next/font/local";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArtworkWindow } from "./ArtworkWindow";
import { ConfigurationDiff } from "./amazon/ConfigurationDiff";
import { ConfigurationRoutes } from "./amazon/ConfigurationRoutes";
import { buildRelease, clock, files, initialRun, routes, stageState, type FileId, type Frame, type Phase, type Value } from "./amazon/forecast";

const poppins = localFont({
  src: [
    { path: "./amazon/fonts/poppins-latin-400.woff2", weight: "400" },
    { path: "./amazon/fonts/poppins-latin-500.woff2", weight: "500" },
    { path: "./amazon/fonts/poppins-latin-600.woff2", weight: "600" },
  ],
  preload: false, display: "swap", variable: "--amazon-poppins",
});

const preferredFiles: FileId[] = ["input", "input", "window", "delivery"];
const configIds = Object.keys(files) as FileId[];
const headers: Record<Phase, string> = {
  draft: "Select a service to edit its files.", push: "Saving the revision", delivering: "Delivering the revision",
  arrival: "Preparing for the scheduled run", queued: "Waiting for the effective run", running: "Applying at stage start",
  complete: "Forecast published",
};

function observeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function observeTab(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

export function AmazonArtwork() {
  const root = useRef<HTMLDivElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const diffStart = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const [inView, setInView] = useState(false);
  const [showDiffArrow, setShowDiffArrow] = useState(false);
  const [author, setAuthor] = useState(2);
  const [id, setId] = useState<FileId>("window");
  const [lastRun, setLastRun] = useState(initialRun);
  const [ledger, setLedger] = useState<Record<FileId, { version: number; value: Value }>>(() => ({
    input: { version: 41, value: files.input.initial }, window: { version: 41, value: files.window.initial },
    delivery: { version: 41, value: files.delivery.initial },
  }));
  const [drafts, setDrafts] = useState<Record<FileId, Value | null>>({
    input: files.input.sample, window: files.window.sample, delivery: files.delivery.sample,
  });
  const [timeline, setTimeline] = useState<Frame[]>([]);
  const [index, setIndex] = useState(0);
  const [play, setPlay] = useState(false);
  const reduced = useSyncExternalStore(observeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const tabVisible = useSyncExternalStore(observeTab, () => !document.hidden, () => false);
  const elapsed = useRef({ frame: undefined as Frame | undefined, ms: 0 });

  const config = files[id];
  const base = ledger[id];
  const draft = drafts[id];
  const target = lastRun + 1;
  const frame = timeline[index];
  const phase = frame?.phase ?? "draft";
  const running = Boolean(frame && phase !== "complete" && play && inView && tabVisible && !reduced);
  const stages = routes.map((route, stage) => {
    const state = stageState(frame, config.readers.includes(stage), stage);
    return { state, version: state === "other" ? null : base.version + Number(state === "applied"), time: clock(target, route.minute) };
  });

  useEffect(() => {
    const viewport = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setNearby(true);
    });
    viewport.observe(root.current!);
    return () => viewport.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setShowDiffArrow(entry.intersectionRatio < 0.6);
    }, { root: pane.current, threshold: 0.6 });
    observer.observe(diffStart.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || !frame) return;
    if (elapsed.current.frame !== frame) elapsed.current = { frame, ms: 0 };
    const started = performance.now();
    const timer = window.setTimeout(() => setIndex(index + 1), Math.max(0, frame.duration - elapsed.current.ms));
    return () => {
      clearTimeout(timer);
      elapsed.current.ms += performance.now() - started;
    };
  }, [running, frame, index]);

  useEffect(() => {
    const viewport = pane.current;
    if (!viewport || frame?.stage === undefined || viewport.scrollHeight <= viewport.clientHeight) return;
    const lane = viewport.querySelector(`[data-consumer="${frame.stage}"]`);
    if (!lane) return;
    const row = lane.getBoundingClientRect();
    const bounds = viewport.getBoundingClientRect();
    if (row.bottom > bounds.bottom) viewport.scrollTop += row.bottom - bounds.bottom;
    else if (row.top < bounds.top) viewport.scrollTop += row.top - bounds.top;
  }, [frame]);

  function push() {
    if (frame || draft === null || draft === base.value) return;
    setTimeline(buildRelease(id, draft, author, lastRun, base.version));
    setIndex(0);
    setPlay(!reduced);
    pane.current?.scrollTo({ top: 0 });
  }

  function edit(stage: number) {
    if (frame) {
      if (phase !== "complete" || draft === null) return;
      setLedger({ ...ledger, [id]: { value: draft, version: base.version + 1 } });
      setLastRun(target);
      setTimeline([]);
      setIndex(0);
      setPlay(false);
    }
    if (stage !== author) setId(preferredFiles[stage]);
    setAuthor(stage);
  }

  function showDiff() {
    const viewport = pane.current;
    const diff = diffStart.current;
    if (!viewport || !diff) return;
    diff.focus({ preventScroll: true });
    viewport.scrollBy({ top: diff.getBoundingClientRect().top - viewport.getBoundingClientRect().top, behavior: reduced ? "instant" : "smooth" });
  }

  const message = frame?.caption ?? (draft === null ? "Enter a positive whole number to push this change."
    : draft === base.value ? "Change the value to create a new revision."
    : `Run ${lastRun} uses v${base.version}. The edit will take effect in run ${target}.`);
  return <ArtworkWindow name="Amazon" title="Forecast configuration">
    <div className={`amazon-artifact ${poppins.variable}`} ref={root} role="figure" aria-label="Amazon configuration infrastructure"
      data-nearby={nearby} data-phase={phase} data-running={running}>
      <div className="amazon-pane" ref={pane}>
        <div className="amazon-heading"><h3>Forecasting pipeline</h3><span>Example routes</span></div>
        <div className="amazon-hint">{headers[phase]}</div>
        <ConfigurationRoutes file={config.name} version={base.version + Number(Boolean(frame))} author={author}
          readers={config.readers} phase={phase} stages={stages} run={target} activeStage={frame?.stage ?? null}
          hopIndex={frame?.hop ?? null} onSelect={edit} />
        <div ref={diffStart} tabIndex={-1}>
          <ConfigurationDiff id={id} files={configIds.filter(item => files[item].readers.includes(author))} authorName={routes[author].name}
            original={base.value} value={draft} baseVersion={base.version} locked={Boolean(frame)}
            onFile={setId} onValue={value => setDrafts({ ...drafts, [id]: value })} />
        </div>
        {phase === "complete" && showDiffArrow && <button type="button" className="amazon-diff-arrow" aria-label="View configuration diff" onClick={showDiff}>
          <ArrowDown size={20} aria-hidden="true" />
        </button>}
      </div>
      <div className="amazon-toolbar"><span>Effective next run</span><div>
        {!frame && <button type="button" className="amazon-primary" onClick={push} disabled={draft === null || draft === base.value}>Click to push version {base.version + 1}</button>}
        {frame && phase !== "complete" && <>
          {!reduced && <button type="button" onClick={() => setPlay(!play)}>{play ? "Pause" : "Resume"}</button>}
          {(reduced || !play) && <button type="button" onClick={() => setIndex(index + 1)}>Next event</button>}
        </>}
        {phase === "complete" && <button type="button" className="amazon-primary" onClick={() => { edit(author); showDiff(); }}>Edit again</button>}
      </div></div>
      <div className="amazon-readout"><span>{frame?.clock ?? clock(lastRun, lastRun === initialRun ? 18 : 21)}</span><p role="status">{message}</p></div>
    </div>
  </ArtworkWindow>;
}
