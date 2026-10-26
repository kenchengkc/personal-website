"use client";

import { useId } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";
import { ArtworkWindow } from "./ArtworkWindow";

const steps = [
  { label: "Detect", caption: "Identify the refrigerator in the camera frame." },
  { label: "Track", caption: "Keep the same object and ID across observations." },
  { label: "Save", caption: "Place the tracked refrigerator in the inventory." },
] as const;

function EmbersFlow({ id, stage }: { id: string; stage: number }) {
  const inventory = stage === 2;
  return <svg viewBox="0 0 400 289.0625" role="img" aria-label={inventory
    ? "Actual Embers saved inventory dashboard. The tracked refrigerator lands in the Mini Fridge tile."
    : "Embers real detection frame with illustrative tracking. Refrigerator track 4 persists across observations and becomes one inventory record."}>
    <defs>
      <clipPath id={`${id}-camera`}><rect y="43" width="400" height="201.5625" /></clipPath>
      <clipPath id={`${id}-inventory-tile`}><rect x="136.7" y="125.8" width="128.5" height="92" rx="3" /></clipPath>
      <clipPath id={`${id}-object`}><rect className="eflow-object-crop" width="69" height="106.6" rx="2" /></clipPath>
    </defs>
    <g className="eflow-detection-view" aria-hidden={inventory}>
      <image href="/media/embers-yolo-live-detection.png" y="43" width="400" height="201.5625" />
      <g clipPath={`url(#${id}-camera)`}>
        <rect y="43" width="400" height="201.5625" fill="#0b1b1b" opacity=".1" />
        <path className="eflow-scan" d="M0 43V245" />
      </g>
      <rect className="eflow-track" x="257" y="106.3" width="69" height="106.6" rx="2" />
      <path className="eflow-corners" d="M257 120V106.3H271M312 106.3H326V120M326 199V212.9H312M271 212.9H257V199" />
      <g className="eflow-observations"><circle cx="276" cy="258" r="2" /><circle cx="288" cy="258" r="2" /><circle cx="300" cy="258" r="2" /><circle cx="312" cy="258" r="2" /></g>
    </g>
    <g className="eflow-inventory-view" aria-hidden={!inventory}>
      <image href="/media/embers-inventory-dashboard.png" width="400" height="289.0625" />
      <g clipPath={`url(#${id}-inventory-tile)`}>
        <rect className="eflow-slot-mask" x="136.7" y="125.8" width="128.5" height="92" fill="#f6f8fa" />
      </g>
    </g>
    {/* This object stays mounted while the real product screens switch behind it. */}
    <g className="eflow-object" data-flow-id="embers-gallery-track">
      <g className="eflow-captured-image">
        <g clipPath={`url(#${id}-object)`}>
          <image className="eflow-captured-source" href="/media/embers-yolo-live-detection.png" x="-256.5" y="-63.2" width="399.2" height="201.2" />
        </g>
      </g>
      <rect className="eflow-object-border" width="69" height="106.6" rx="2" />
      <g className="eflow-id">
        <rect x="0" y="-20" width="40" height="17" rx="3" />
        <text x="20" y="-8" textAnchor="middle">ID 04</text>
      </g>
    </g>
    <rect className="eflow-saved-outline" x="136.7" y="125.8" width="128.5" height="92" rx="3" />
  </svg>;
}

export function ProductFlowArtwork({ kind }: { kind: "embers" }) {
  const id = useId().replace(/:/g, "");
  return <ArtworkWindow name="Embers" title="Embers">
    <div className={`product-flow-artwork product-flow-${kind}`}>
      <AnimatedArtwork label="Embers animated workflow" steps={steps} duration={3200}>
        {stage => <div className="product-flow-scene" data-flow-stage={stage} data-inventory={stage === 2}>
          <EmbersFlow id={id} stage={stage} />
          <span className="eflow-source-note">Product screens · Illustrated tracking</span>
        </div>}
      </AnimatedArtwork>
    </div>
  </ArtworkWindow>;
}
