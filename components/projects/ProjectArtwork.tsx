"use client";

import Image from "next/image";
import { useState } from "react";
import { AmazonArtwork } from "./AmazonArtwork";
import { ModelArtwork } from "./ModelArtwork";
import { AsterArtwork, ResearchFigure } from "./ResearchArtwork";

export type ArtworkKind =
  | "amazon" | "quantiv" | "fdre" | "embers"
  | "cml" | "wasserstein" | "aster" | "gcinf"
  | "usaco" | "speed" | "cvrp" | "egleston";

const imageSizes = "(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 44vw, 480px";
const playbackLabels: Partial<Record<ArtworkKind, string>> = { amazon: "Trace a change" };

function UsacoArtwork() {
  return (
    <>
      <Image className="artwork-usaco-logo" src="/images/usaco/usaco-logo.png" alt="USA Computing Olympiad" width={900} height={130} sizes="120px" />
      <div className="artwork-score">1000<span>/1000</span><small>Gold division score</small></div>
      <div className="artwork-division">Gold → Platinum</div>
    </>
  );
}

export function ProjectArtwork({ kind }: { kind: ArtworkKind }) {
  const [playback, setPlayback] = useState(0);
  const [inventory, setInventory] = useState(false);
  const playLabel = playbackLabels[kind];

  function content() {
    switch (kind) {
      case "amazon": return <AmazonArtwork played={playback > 0} />;
      case "quantiv": return <>
        <span className="artwork-brand">Quantiv</span>
        <Image className="artwork-screen" src="/media/quantiv-earnings-calendar.png" alt="Quantiv earnings calendar with company reports and forecast ranges" width={1280} height={577} sizes={imageSizes} />
        <span className="artwork-note">Live product</span>
      </>;
      case "fdre": return <Image className="artwork-screen" src="/media/fdre-research-answer.png" alt="Financial research answer with a verified citation and the original SEC filing passage" width={1427} height={871} sizes={imageSizes} />;
      case "embers": return <>
        <Image src={inventory ? "/media/embers-inventory-dashboard.png" : "/media/embers-yolo-live-detection.png"} alt={inventory ? "Embers inventory populated with detected objects and replacement values" : "Embers identifying objects in a real camera frame"} fill sizes={imageSizes} />
        <span className="artwork-photo-note" aria-live="polite">{inventory ? "Saved inventory" : "Object detection"}</span>
      </>;
      case "cml": return <ModelArtwork />;
      case "wasserstein": return <ResearchFigure kind="wasserstein" />;
      case "aster": return <AsterArtwork />;
      case "gcinf": return <>
        <Image src="/images/gc-inf/ieeeconf.png" alt="Ken Cheng presenting his traffic forecasting research at IEEE ITSC 2023" fill sizes={imageSizes} />
        <span className="artwork-photo-note">IEEE ITSC · 2023</span>
      </>;
      case "usaco": return <UsacoArtwork />;
      case "speed": return <ResearchFigure kind="speed" />;
      case "cvrp": return <Image src="/media/cvrp-visualizer.png" alt="Vehicle routing problem visualizer with optimized routes" fill sizes={imageSizes} />;
      case "egleston": return <>
        <Image src="/images/butler-library.jpg" alt="Butler Library on Columbia University’s campus" fill sizes={imageSizes} />
        <span className="artwork-photo-note">Columbia University</span>
      </>;
    }
  }

  return (
    <div className={`project-artwork artwork-${kind}`} data-artwork={kind}>
      <div key={playback} className={`artwork-content${playback ? " has-played" : ""}`}>{content()}</div>
      {playLabel && <button type="button" className="artwork-action artwork-replay" onClick={() => setPlayback(value => value + 1)}>{playLabel}</button>}
      {kind === "embers" && <button type="button" className="artwork-action" onClick={() => setInventory(value => !value)}>{inventory ? "View detection" : "View inventory"}</button>}
    </div>
  );
}
