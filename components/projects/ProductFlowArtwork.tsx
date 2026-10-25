"use client";

import { useId } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";

type Product = "quantiv" | "fdre" | "embers";
const STEPS = {
  quantiv: [
    { label: "Ingest", caption: "An earnings event joins historical records and model features." },
    { label: "Estimate", caption: "Quantile models place a forecast range beside the market-implied move." },
    { label: "Validate", caption: "Expanding training windows precede unseen tests, separated by five days." },
  ],
  fdre: [
    { label: "Filter", caption: "Only filings available by the requested date enter either search." },
    { label: "Retrieve", caption: "Keyword and vector searches retrieve the same passage; duplicate IDs merge." },
    { label: "Cite", caption: "The answer keeps passage 12 as its verified source citation." },
  ],
  embers: [
    { label: "Detect", caption: "A real camera frame supplies object detections to the inventory pipeline." },
    { label: "Track", caption: "Repeated observations retain one track ID instead of creating duplicate items." },
    { label: "Save", caption: "The same tracked object becomes one saved inventory record." },
  ],
} as const;

function QuantivFlow({ stage, id }: { stage: number; id: string }) {
  return <svg viewBox="0 0 400 244" role="img" aria-label="Illustrative Quantiv workflow. An earnings record feeds a quantile forecast, which is compared on the same axis to the market-implied move, with four purged walk-forward validation folds.">
    <defs><linearGradient id={`${id}-forecast`} x2="0" y2="1"><stop stopColor="#5fb3eb" stopOpacity=".32" /><stop offset="1" stopColor="#5fb3eb" stopOpacity="0" /></linearGradient></defs>
    <text x="18" y="23" className="product-flow-brand">Quantiv</text><text x="382" y="23" textAnchor="end" className="product-flow-note">Illustrative values</text>
    <path d="M18 34H382" className="product-flow-divider" />
    <g className="qflow-records"><text x="22" y="57">Earnings event</text><text x="154" y="57" textAnchor="end">Features</text>
      {[0, 1, 2, 3, 4].map(index => <g key={index} opacity={index === 2 ? 1 : .28}><path d={`M22 ${71 + index * 18}H154`} className="product-flow-divider" /><text x="23" y={67 + index * 18}>event_{String(index + 22).padStart(2, "0")}</text>{[0, 1, 2, 3].map(cell => <rect key={cell} x={107 + cell * 12} y={60 + index * 18} width="7" height="6" fill={cell % 2 ? "#7aaec2" : "#a0b1cd"} />)}</g>)}
    </g>
    <path d="M155 102H174V77H198" className="product-flow-route" /><path d="M155 102H174V77H198" className="qflow-feed" pathLength="100" />
    <text x="207" y="56" className="product-flow-small">Absolute earnings move</text>
    {[0, 1, 2].map(index => <path key={index} d={`M207 ${77 + index * 35}H377`} className="qflow-grid" />)}
    <path d="M207 148H377" className="product-flow-axis" /><text x="207" y="163" className="product-flow-small">0%</text><text x="292" y="163" className="product-flow-small">6%</text><text x="377" y="163" textAnchor="end" className="product-flow-small">12%</text>
    <path className="qflow-distribution-fill" d="M207 147C226 145 230 133 242 108S266 69 281 79 294 107 311 122 345 146 377 148V148Z" fill={`url(#${id}-forecast)`} />
    <path className="qflow-distribution" pathLength="100" d="M207 147C226 145 230 133 242 108S266 69 281 79 294 107 311 122 345 146 377 148" />
    <path d="M292 71V148" className="qflow-market-line" /><path d="M292 144l4 4-4 4-4-4Z" fill="#d6bb8d" />
    <text x="299" y="84" className="qflow-market-label">Market</text>
    <g className="qflow-range"><path d="M235 132H327M235 127V137M327 127V137" /><circle cx="275" cy="132" r="3" /></g>
    <g className="qflow-validation"><text x="22" y="184" className="product-flow-small">Walk-forward validation</text>{[0, 1, 2, 3].map(index => <g key={index} className={`qflow-fold qflow-fold-${index}`}><rect x="159" y={178 + index * 13} width={59 + index * 35} height="7" className="qflow-train" /><rect x={222 + index * 35} y={178 + index * 13} width="4" height="7" className="qflow-purge" /><rect x={229 + index * 35} y={178 + index * 13} width="31" height="7" className="qflow-test" /></g>)}<text x="22" y="202" className="product-flow-small">Past → unseen test</text></g>
    <g className="qflow-event" data-flow-id="quantiv-gallery-event"><rect x="-14" y="-8" width="28" height="16" rx="2" /><text y="3" textAnchor="middle">E24</text></g>
    <text x="382" y="236" textAnchor="end" className="product-flow-note">{stage === 0 ? "6 LightGBM models" : stage === 1 ? "Market and model remain separate" : "4 folds · 5-day purge"}</text>
  </svg>;
}

function FdreFlow() {
  return <svg viewBox="0 0 400 244" role="img" aria-label="Illustrative FDRE query flowing through date-filtered keyword and vector searches. Passage 12 persists through deduplication and into a source-checked citation.">
    <text x="18" y="23" className="product-flow-brand">FDRE</text><text x="382" y="23" textAnchor="end" className="product-flow-note">Illustrative query</text><path d="M18 34H382" className="product-flow-divider" />
    <text x="22" y="56" className="fflow-query">What risks does the filing describe?</text>
    <text x="22" y="73" className="product-flow-small">available_at ≤ as_of</text><path d="M165 69H378" className="product-flow-route" />
    {[0,1,2,3,4,5,6,7,8].map(index => <g key={index} className={index > 3 ? "fflow-excluded" : "fflow-eligible"}><path d={`M${174 + index * 24} 62v14`} stroke="currentColor" /><circle cx={174 + index * 24} cy="69" r="2" fill="currentColor" /></g>)}
    <path d="M200 80V91H83V114M200 91H316V114M83 147V165Q83 176 100 176H200M316 147V165Q316 176 299 176H200V204" className="product-flow-route" />
    <path d="M200 80V91H83V114M200 91H316V114" pathLength="100" className="fflow-query-pulse" />
    <text x="24" y="107" className="fflow-index-label">Full-text search</text><text x="252" y="107" className="fflow-index-label">Vector search</text>
    {[0,1,2,3].map(index => <g key={index}><path d={`M24 ${120+index*7}H147M252 ${120+index*7}H375`} className="fflow-index-rule" /><rect x={32+index*24} y="118" width="11" height="25" fill="#7eaf98" opacity=".1" /><rect x={263+index*24} y="118" width="11" height="25" fill="#9ab9ad" opacity=".1" /></g>)}
    <path d="M83 147V165Q83 176 100 176H200M316 147V165Q316 176 299 176H200V204" pathLength="100" className="fflow-retrieval-pulse" />
    <text x="200" y="167" textAnchor="middle" className="product-flow-small">Merge passage IDs</text>
    <path d="M24 194H376" className="product-flow-divider" /><text x="24" y="211" className="product-flow-small">Source passage → answer</text>
    <text x="24" y="230" className="fflow-answer">Changes need time and resources.</text>
    <g className="fflow-passage" data-flow-id="fdre-gallery-passage"><rect x="-15" y="-9" width="30" height="18" rx="2" /><text textAnchor="middle" y="3">12</text></g>
    <g className="fflow-duplicate"><rect x="-15" y="-9" width="30" height="18" rx="2" /><text textAnchor="middle" y="3">12</text></g>
    <g className="fflow-source-check"><path d="m294 208 3 3 6-7" /><text x="311" y="211">Source checked</text></g>
  </svg>;
}

function EmbersFlow({ id }: { id: string }) {
  return <svg viewBox="0 0 400 244" role="img" aria-label="Embers real detection frame with an illustrative animated tracking workflow. Refrigerator track 4 is retained across observations and becomes one inventory record.">
    <defs><clipPath id={`${id}-camera`}><rect x="16" y="42" width="368" height="184" rx="2" /></clipPath></defs>
    <text x="18" y="23" className="product-flow-brand">Embers</text><text x="382" y="23" textAnchor="end" className="product-flow-note">Product frame · Illustrated tracking</text>
    <g clipPath={`url(#${id}-camera)`}><image href="/media/embers-yolo-live-detection.png" x="16" y="42" width="368" height="184" /><rect x="16" y="42" width="368" height="184" fill="#0b1b1b" opacity=".18" /><path className="eflow-scan" d="M16 42V226" /></g>
    <rect className="eflow-track" x="253" y="100" width="63" height="98" rx="2" /><path className="eflow-corners" d="M253 114V100H267M302 100H316V114M316 184V198H302M267 198H253V184" />
    <path className="eflow-record-route" d="M285 98V158Q285 181 258 181H205" pathLength="100" />
    <g className="eflow-observations"><circle cx="263" cy="213" r="2" /><circle cx="276" cy="213" r="2" /><circle cx="289" cy="213" r="2" /><path d="M265 213H287" /></g>
    <g className="eflow-inventory"><rect x="24" y="163" width="187" height="53" rx="3" /><text x="36" y="181" className="eflow-item">Refrigerator</text><text x="36" y="201" className="product-flow-small">1 item · Inventory record</text><path d="m185 197 3 3 7-7" /></g>
    <g className="eflow-id" data-flow-id="embers-gallery-track"><rect x="-20" y="-9" width="40" height="18" rx="2" /><text textAnchor="middle" y="3">ID 04</text></g>
    <text x="16" y="239" className="product-flow-note">Detect → deduplicate → save</text>
  </svg>;
}

export function ProductFlowArtwork({ kind }: { kind: Product }) {
  const id = useId().replace(/:/g, "");
  return <div className={`product-flow-artwork product-flow-${kind}`}><AnimatedArtwork label={`${kind === "fdre" ? "Financial Document Retrieval Engine" : kind === "quantiv" ? "Quantiv" : "Embers"} animated workflow`} steps={STEPS[kind]} duration={3800}>{stage => <div className="product-flow-scene" data-flow-stage={stage}>{kind === "quantiv" ? <QuantivFlow stage={stage} id={id} /> : kind === "fdre" ? <FdreFlow /> : <EmbersFlow id={id} />}</div>}</AnimatedArtwork></div>;
}
