"use client";

import Image from "next/image";
import { useState } from "react";

const FRAMES = [
  { src: "/media/embers-yolo-live-detection.png", alt: "Embers identifying chairs, a couch, and a refrigerator in a room walkthrough", label: "Detect" },
  { src: "/media/embers-inventory-dashboard.png", alt: "Embers inventory dashboard with detected household items and replacement values", label: "Inventory" },
] as const;

export function EmbersDemo() {
  const [selected, setSelected] = useState(0);
  return <div className="project-demo embers-demo" role="region" aria-label="Embers product walkthrough">
    <div className="embers-gallery">
      <div className="embers-screen">{FRAMES.map((frame, index) => <div className="embers-image" key={frame.src} data-active={selected === index} aria-hidden={selected !== index}><Image src={frame.src} alt={frame.alt} fill sizes="(max-width: 720px) 90vw, 900px" /></div>)}</div>
    </div>
    <div className="demo-controls"><div className="demo-steps" role="group" aria-label="Product views">{FRAMES.map((frame, index) => <button key={frame.label} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index}>{frame.label}</button>)}</div></div>
    <span className="sr-only">Actual product screenshots</span>
  </div>;
}
