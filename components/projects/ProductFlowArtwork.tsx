"use client";

import { useId, useState } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";

const steps = [
  { label: "Detect", caption: "A real camera frame supplies object detections to the inventory pipeline." },
  { label: "Track", caption: "Repeated observations retain one track ID instead of creating duplicate items." },
  { label: "Save", caption: "The same tracked object becomes one saved inventory record." },
] as const;

function EmbersFlow({ id, inventory }: { id: string; inventory: boolean }) {
  return <svg viewBox="0 0 400 244" role="img" aria-label={inventory?"Actual Embers saved inventory dashboard with detected household items and replacement values":"Embers real detection frame with an illustrative tracking workflow. Refrigerator track 4 persists across observations and becomes one inventory record."}>
    <defs><clipPath id={`${id}-camera`}><rect x="16" y="42" width="368" height="184" rx="2" /></clipPath></defs>
    <text x="18" y="23" className="product-flow-brand">Embers</text><text x="382" y="23" textAnchor="end" className="product-flow-note">{inventory?"Actual product inventory":"Product frame · Illustrated tracking"}</text>
    <g className="eflow-detection-view"><g clipPath={`url(#${id}-camera)`}><image href="/media/embers-yolo-live-detection.png" x="16" y="42" width="368" height="184" /><rect x="16" y="42" width="368" height="184" fill="#0b1b1b" opacity=".18" /><path className="eflow-scan" d="M16 42V226" /></g>
      <rect className="eflow-track" x="253" y="100" width="63" height="98" rx="2" /><path className="eflow-corners" d="M253 114V100H267M302 100H316V114M316 184V198H302M267 198H253V184" />
      <path className="eflow-record-route" d="M285 98V158Q285 181 258 181H205" pathLength="100" />
      <g className="eflow-observations"><circle cx="263" cy="213" r="2" /><circle cx="276" cy="213" r="2" /><circle cx="289" cy="213" r="2" /><path d="M265 213H287" /></g>
      <g className="eflow-inventory"><rect x="24" y="163" width="187" height="53" rx="3" /><text x="36" y="181" className="eflow-item">Refrigerator</text><text x="36" y="201" className="product-flow-small">1 item · Inventory record</text><path d="m185 197 3 3 7-7" /></g>
      <g className="eflow-id" data-flow-id="embers-gallery-track"><rect x="-20" y="-9" width="40" height="18" rx="2" /><text textAnchor="middle" y="3">ID 04</text></g>
    </g>
    <g className="eflow-inventory-view"><image href="/media/embers-inventory-dashboard.png" x="16" y="42" width="368" height="184" /></g>
    <text x="16" y="239" className="product-flow-note">{inventory?"Saved objects and replacement values":"Detect → deduplicate → save"}</text>
  </svg>;
}

export function ProductFlowArtwork({ kind }: { kind: "embers" }) {
  const id = useId().replace(/:/g, "");
  const [inventory, setInventory] = useState(false);

  return (
    <div className={`product-flow-artwork product-flow-${kind}`}>
      <AnimatedArtwork
        label="Embers animated workflow"
        steps={steps}
        duration={3800}
        playground={() => (
          <div className="product-playground">
            <div className="product-playground-row">
              <span>View</span>
              <div role="group" aria-label="Product views">
                {[false, true].map(value => (
                  <button key={String(value)} type="button" aria-pressed={inventory === value} onClick={() => setInventory(value)}>
                    {value ? "Inventory" : "Detection"}
                  </button>
                ))}
              </div>
            </div>
            <div className="product-playground-result">
              {inventory ? "Inspect the real saved inventory." : "Follow ID 04 from detection to its saved record."}
            </div>
          </div>
        )}
      >
        {stage => (
          <div className="product-flow-scene" data-flow-stage={stage} data-inventory={inventory}>
            <EmbersFlow id={id} inventory={inventory} />
          </div>
        )}
      </AnimatedArtwork>
    </div>
  );
}
