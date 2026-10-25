"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/icons/Icons";

const figures = {
  speed: {
    title: "A Need for Speed",
    source: "https://drpress.org/ojs/index.php/HSET/article/view/8388",
    views: [
      { name: "CAD model", src: "/media/research/f1-optimized-cad.png", width: 591, height: 413, alt: "Published SolidWorks model of the Formula 1 car with the optimized rear wing", caption: "SolidWorks · Optimized rear wing" },
      { name: "CFD results", src: "/media/research/f1-cfd-comparison.png", width: 1049, height: 655, alt: "Figure 17 from the paper: ANSYS Fluent velocity and pressure comparisons with and without the optimized rear wing at 33 metres per second", caption: "ANSYS Fluent · 33 m/s" },
    ],
  },
  wasserstein: {
    title: "Wasserstein Regimes",
    source: "https://wasserstein-regimes.vercel.app",
    views: [
      { name: "Validation", src: "/media/research/wasserstein-joint-validation.png", width: 1800, height: 1200, alt: "Published joint-regime validation plots showing resampling stability, optimizer sensitivity, novelty flags, and synthetic rare-correlation controls; no predictive claim", caption: "Published validation figures" },
      { name: "Cross-asset", src: "/media/research/wasserstein-cross-asset-comparison.png", width: 1760, height: 720, alt: "Published QQQ, TLT, GLD, and HYG results: scale dominates raw regimes while shape-only stability varies", caption: "QQQ · TLT · GLD · HYG" },
    ],
  },
} as const;

export function ResearchFigure({ kind }: { kind: keyof typeof figures }) {
  const [view, setView] = useState(0);
  const [enlarged, setEnlarged] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const entry = figures[kind];
  const figure = entry.views[view];
  return (
    <div className={`research-figure research-figure-${kind}`}>
      <div className="artifact-view-controls" role="group" aria-label={`${entry.title} figure`}>
        {entry.views.map((item, index) => <button key={item.name} type="button" aria-pressed={view === index} onClick={() => setView(index)}>{item.name}</button>)}
      </div>
      <button type="button" className="research-figure-image" onClick={() => { setEnlarged(true); dialog.current?.showModal(); }} aria-label={`Enlarge ${figure.name} figure`}>
        <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} sizes="(max-width: 700px) 90vw, 480px" />
        <span className="figure-enlarge" aria-hidden="true"><ArrowUpRight /></span>
      </button>
      <div className="research-figure-caption"><span>{figure.caption}</span><a href={entry.source} target="_blank" rel="noopener noreferrer">Source</a></div>
      <dialog ref={dialog} className="artifact-dialog" aria-labelledby={titleId} onClose={() => setEnlarged(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="artifact-dialog-toolbar"><h3 id={titleId}>{entry.title} · {figure.name}</h3><button type="button" onClick={() => dialog.current?.close()}>Close</button></div>
        {enlarged && <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} sizes="90vw" />}
        <p>{figure.caption} <a href={entry.source} target="_blank" rel="noopener noreferrer">View original source</a></p>
      </dialog>
    </div>
  );
}

// Exact allocation from the public seed-17 noisy_quadratic experiment.
// Candidate 00 received 27 replications; the other 15 stopped after 3.
export function AsterArtwork() {
  const [raced, setRaced] = useState(true);
  return (
    <div className="aster-artifact">
      <div className="aster-artifact-heading"><span>aster-hpo</span><strong>{raced ? 72 : 432}<small> evaluations</small></strong></div>
      <div className="artifact-view-controls" role="group" aria-label="Aster allocation strategy">
        <button type="button" aria-pressed={!raced} onClick={() => setRaced(false)}>Full budget</button>
        <button type="button" aria-pressed={raced} onClick={() => setRaced(true)}>Replication race</button>
      </div>
      <div className="aster-allocation" role="img" aria-label={`${raced ? "Replication race uses 72 evaluations: candidate 00 receives 27, the other 15 receive 3 each" : "Full budget uses 432 evaluations: all 16 candidates receive 27 each"}. Both select candidate 00 in this synthetic experiment.`}>
        <div className="aster-grid-scale"><span>ID</span><span>1</span><span>9</span><span>18</span><span>27</span></div>
        {Array.from({ length: 16 }, (_, index) => <div key={index} className={`aster-trial${index === 0 ? " is-selected" : ""}`}>
          <span>{String(index).padStart(2, "0")}</span>
          <div className="aster-replications"><div className="aster-spent" style={{ width: raced && index !== 0 ? "11.111111%" : "100%" }} /></div>
        </div>)}
      </div>
      <div className="aster-artifact-footer"><span>Selected: 00 · x = 0.08794</span><span>One synthetic run · Seed 17</span></div>
    </div>
  );
}
