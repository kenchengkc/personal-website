"use client";

import Image from "next/image";
import { useState } from "react";

const FRAMES = [
  { src: "/media/embers-yolo-live-detection.png", alt: "Embers identifying chairs, a couch, and a refrigerator in a room walkthrough", label: "Detect", heading: "A room becomes a set of objects.", detail: "YOLO tracks household items across video frames.", tags: ["Walkthrough video", "Object detection", "Cross-frame tracking"] },
  { src: "/media/embers-inventory-dashboard.png", alt: "Embers inventory dashboard with detected household items and replacement values", label: "Inventory", heading: "One inventory, without repeat items.", detail: "Detections become a searchable inventory with replacement values.", tags: ["Deduplicated items", "Replacement values", "Voice search"] },
] as const;

export function EmbersDemo() {
  const [selected, setSelected] = useState(0);
  const current = FRAMES[selected];
  return <div className="project-demo embers-demo" role="region" aria-label="Embers product walkthrough">
    <header className="demo-heading"><div><p className="demo-eyebrow">Embers / Video to Inventory</p><h4>From a walkthrough to what you own.</h4></div></header>
    <div className="embers-workspace">
      <div className="embers-frame-bar"><span><i /> Product capture</span><div role="group" aria-label="Product views">{FRAMES.map((frame, index) => <button key={frame.label} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index}>{String(index + 1).padStart(2, "0")} <strong>{frame.label}</strong></button>)}</div></div>
      <div className="embers-screen">{FRAMES.map((frame, index) => <div className="embers-image" key={frame.src} data-active={selected === index} aria-hidden={selected !== index}><Image src={frame.src} alt={frame.alt} fill sizes="(max-width: 720px) 92vw, 940px" /></div>)}</div>
      <div className="embers-explanation"><div><h5>{current.heading}</h5><p>{current.detail}</p></div><ol>{current.tags.map((tag, index) => <li key={index}><span>{String(index + 1).padStart(2, "0")}</span>{tag}</li>)}</ol></div>
    </div>
    <div className="demo-footnote"><span>Actual product screenshots</span><span>Select a view to explore</span></div>
  </div>;
}
