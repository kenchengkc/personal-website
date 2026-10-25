"use client";

import { useId, useState, type CSSProperties } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";

type Product = "quantiv" | "fdre" | "embers";
const QUANTILES = [{ move: 2, p: .1 }, { move: 3.2, p: .25 }, { move: 4.8, p: .5 }, { move: 6.4, p: .75 }, { move: 8.5, p: .9 }];
const plotX = (move: number) => 207 + move / 12 * 170;
const plotY = (probability: number) => 148 - probability * 78;
const cdf = QUANTILES.map((point, index) => `${index ? "L" : "M"}${plotX(point.move)} ${plotY(point.p)}`).join(" ");

// The original playground's piecewise interpolation, with the same example quantiles.
function probabilityAbove(threshold: number) {
  if (threshold > QUANTILES.at(-1)!.move) return { value: 10, bounded: true };
  const upperIndex = QUANTILES.findIndex(point => point.move >= threshold);
  if (upperIndex <= 0) return { value: 90, bounded: threshold < QUANTILES[0].move };
  const lower = QUANTILES[upperIndex - 1], upper = QUANTILES[upperIndex];
  return { value: 100 * (1 - lower.p - (upper.p - lower.p) * (threshold - lower.move) / (upper.move - lower.move)), bounded: false };
}

const STEPS = {
  quantiv: [
    { label: "Ingest", caption: "An earnings event joins historical records and model features." },
    { label: "Estimate", caption: "Model quantiles estimate the chance of exceeding a chosen move." },
    { label: "Validate", caption: "Expanding training windows precede unseen tests, separated by five days." },
    { label: "Serve", caption: "The model bundle must pass verification before it can replace the active model." },
  ],
  fdre: [
    { label: "Filter", caption: "Only filings available by the requested date enter either search." },
    { label: "Retrieve", caption: "Keyword and vector searches retrieve the same passage; duplicate IDs merge." },
    { label: "Cite", caption: "Supported answers keep their source citation. Unsupported requests stop before generation." },
  ],
  embers: [
    { label: "Detect", caption: "A real camera frame supplies object detections to the inventory pipeline." },
    { label: "Track", caption: "Repeated observations retain one track ID instead of creating duplicate items." },
    { label: "Save", caption: "The same tracked object becomes one saved inventory record." },
  ],
} as const;

function QuantivFlow({ stage, id, threshold, fold, corrupt }: { stage: number; id: string; threshold: number; fold: number; corrupt: boolean }) {
  const probability = probabilityAbove(threshold);
  const foldY = 181 + fold * 11;
  const bundlePath = `M39 102H174V132H275V${foldY}H218H138V230H50V247H365`;
  const label = `${probability.bounded ? "≤ " : ""}${probability.value.toFixed(probability.bounded ? 0 : 1)}%`;
  return <svg viewBox="0 0 400 280" role="img" aria-label={`Illustrative Quantiv workflow: ${label} of moves exceed ${threshold}%. The market reference stays at 6%. Fold ${fold + 1} is selected, with a five-day purge. ${corrupt ? "SHA-256 mismatch: previous model retained." : "A verified bundle activates model v2."}`}>
    <defs><linearGradient id={`${id}-forecast`} x2="0" y2="1"><stop stopColor="#5fb3eb" stopOpacity=".32" /><stop offset="1" stopColor="#5fb3eb" stopOpacity="0" /></linearGradient></defs>
    <text x="18" y="23" className="product-flow-brand">Quantiv</text><text x="382" y="23" textAnchor="end" className="product-flow-note">Illustrative values</text>
    <path d="M18 34H382" className="product-flow-divider" />
    <g className="qflow-records"><text x="22" y="57">Earnings event</text><text x="154" y="57" textAnchor="end">Features</text>
      {[0, 1, 2, 3, 4].map(index => <g key={index} opacity={index === 2 ? 1 : .28}><path d={`M22 ${71 + index * 18}H154`} className="product-flow-divider" /><text x="23" y={67 + index * 18}>event_{String(index + 22).padStart(2, "0")}</text>{[0, 1, 2, 3].map(cell => <rect key={cell} x={107 + cell * 12} y={60 + index * 18} width="7" height="6" fill={cell % 2 ? "#7aaec2" : "#a0b1cd"} />)}</g>)}
    </g>
    <path d="M155 102H174V77H198" className="product-flow-route" /><path d="M155 102H174V77H198" className="qflow-feed" pathLength="100" />
    <text x="207" y="56" className="product-flow-small">Cumulative model probability</text>
    {[.1, .5, .9].map(p => <g key={p}><path d={`M207 ${plotY(p)}H377`} className="qflow-grid" /><text x="203" y={plotY(p)+2} textAnchor="end" className="product-flow-tiny">{p*100}%</text></g>)}
    <path d="M207 148H377" className="product-flow-axis" /><text x="207" y="162" className="product-flow-small">0%</text><text x="292" y="162" className="product-flow-small">6%</text><text x="377" y="162" textAnchor="end" className="product-flow-small">12%</text>
    <path className="qflow-distribution-fill" d={`${cdf}V148H${plotX(2)}Z`} fill={`url(#${id}-forecast)`} />
    <path className="qflow-distribution" pathLength="100" d={cdf} />
    {QUANTILES.map(q=><circle key={q.p} cx={plotX(q.move)} cy={plotY(q.p)} r="2" className="qflow-quantile-point" />)}
    <path d="M292 69V148" className="qflow-market-line" /><path d="M292 144l4 4-4 4-4-4Z" fill="#d6bb8d" />
    <text x="299" y="70" className="qflow-market-label">Market</text>
    <g className="qflow-threshold" style={{ transform: `translateX(${plotX(threshold)}px)` }}><path d="M0 77V148" /><circle cy={plotY(1-probability.value/100)} r="3" opacity={probability.bounded ? 0 : 1} /></g>
    <g className="qflow-validation"><text x="22" y="184" className="product-flow-small">Walk-forward validation</text>{[0, 1, 2, 3].map(index => <g key={index} className={`qflow-fold qflow-fold-${index}`} data-active={index===fold}><rect x="148" y={178 + index * 11} width={50 + index * 36} height="7" className="qflow-train" /><rect x={198 + index * 36} y={178 + index * 11} width="3" height="7" className="qflow-purge" /><rect x={201 + index * 36} y={178 + index * 11} width="36" height="7" className="qflow-test" /></g>)}<text x="22" y="202" className="product-flow-small">Past → unseen test</text></g>
    <g className="qflow-serving"><path d={`M218 ${foldY}H138V230H50V247H365`} className="product-flow-route" /><text x="22" y="233" className="product-flow-small">Signed model</text>{[{x:113,label:"Signature"},{x:210,label:"SHA-256"},{x:309,label:"Load"}].map(check=><g key={check.label}><circle cx={check.x} cy="247" r="4" className={corrupt&&check.label==='SHA-256'?"qflow-rejected":"qflow-checkpoint"} /><text x={check.x} y="265" textAnchor="middle" className="product-flow-small">{check.label}</text></g>)}<circle cx="365" cy="247" r="5" className={stage===3&&!corrupt?"qflow-active-model":"qflow-previous-model"} /><text x="382" y="265" textAnchor="end" className="product-flow-small">{stage===3&&!corrupt?"v2":"v1"}</text></g>
    <g className="qflow-event" data-flow-id="quantiv-gallery-event" style={{ offsetPath: `path("${bundlePath}")`, "--fold-distance": `${191 + foldY}px`, "--serve-distance": corrupt ? "766px" : "921px" } as CSSProperties}><rect x="-14" y="-8" width="28" height="16" rx="2" /><text y="3" textAnchor="middle">{stage===3?"v2":"E24"}</text></g>
  </svg>;
}

function FdreFlow({ later, forecast }: { later: boolean; forecast: boolean }) {
  return <svg viewBox="0 0 400 244" role="img" aria-label={`Illustrative FDRE flow. As of ${later?"1 May, filings A, B and C are available":"1 March, only filing A is available"}. Both searches produce ${later?"four":"two"} unique passages after duplicate IDs merge. ${forecast?"Unsupported price forecast: generation skipped, no answer or citations.":"Answer supported by passage 12; retrieved ID and source text are checked."}`}>
    <text x="18" y="23" className="product-flow-brand">FDRE</text><text x="382" y="23" textAnchor="end" className="product-flow-note">Illustrative example</text><path d="M18 34H382" className="product-flow-divider" />
    <text x="22" y="54" className="fflow-query">{forecast?"Predict next month’s stock price.":"What risks does the filing describe?"}</text>
    <text x="22" y="74" className="product-flow-small">available_at ≤ as_of</text><path d="M174 70H378" className="product-flow-route" />
    {[{id:"A",date:"31 Jan",x:192},{id:"B",date:"14 Mar",x:272},{id:"C",date:"18 Apr",x:352}].map((filing,index)=><g key={filing.id} className={later||index===0?"fflow-eligible":"fflow-excluded"} data-filing={filing.id} data-eligible={later||index===0}><path d={`M${filing.x} 64v12`} stroke="currentColor" /><circle cx={filing.x} cy="70" r="2" fill="currentColor" /><text x={filing.x} y="61" textAnchor="middle" className="product-flow-tiny">{filing.id} · {filing.date}</text></g>)}
    <path d={`M${later?378:223} 57V81`} className="fflow-date-cutoff" />
    <path d="M200 80V91H83V114M200 91H316V114M83 147V165Q83 176 100 176H200M316 147V165Q316 176 299 176H200V204" className="product-flow-route" />
    <path d="M200 80V91H83V114M200 91H316V114" pathLength="100" className="fflow-query-pulse" />
    <text x="24" y="107" className="fflow-index-label">Full-text search</text><text x="252" y="107" className="fflow-index-label">Vector search</text>
    {[["12","31","57"],["12","57","84"]].map((hits,group)=><g key={group} data-search={group===0?"keyword":"vector"}>{hits.map((hit,index)=><g key={hit} className="fflow-hit" data-excluded={!later&&Number(hit)>31} transform={`translate(${(group?252:24)+index*39} 122)`}><rect width="32" height="19" rx="1"/><text x="16" y="13" textAnchor="middle">{!later&&Number(hit)>31?"—":hit}</text></g>)}</g>)}
    <path d="M83 147V165Q83 176 100 176H200M316 147V165Q316 176 299 176H200V204" pathLength="100" className="fflow-retrieval-pulse" />
    <text x="200" y="165" textAnchor="middle" className="product-flow-small">{later?"4":"2"} unique passages · Merge IDs</text>
    <path d="M24 194H376" className="product-flow-divider" /><text x="24" y="210" className="product-flow-small">{forecast?"Evidence gate → abstain":"Source passage → answer"}</text>
    <text x="24" y="230" className="fflow-answer">{forecast?"Generation skipped":"Changes need time and resources."}</text>
    <g className="fflow-passage" data-flow-id="fdre-gallery-passage"><rect x="-15" y="-9" width="30" height="18" rx="2" /><text textAnchor="middle" y="3">12</text></g>
    <g className="fflow-duplicate"><rect x="-15" y="-9" width="30" height="18" rx="2" /><text textAnchor="middle" y="3">12</text></g>
    <g className="fflow-source-check"><path d="m294 208 3 3 6-7" /><text x="311" y="211">Source checked</text></g>
    <text x="375" y="229" textAnchor="end" className="fflow-abstention">No citations</text>
  </svg>;
}

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

export function ProductFlowArtwork({ kind }: { kind: Product }) {
  const id = useId().replace(/:/g, "");
  const [threshold, setThreshold] = useState(6);
  const [fold, setFold] = useState(2);
  const [corrupt, setCorrupt] = useState(false);
  const [later, setLater] = useState(false);
  const [forecast, setForecast] = useState(false);
  const [inventory, setInventory] = useState(false);
  const probability = probabilityAbove(threshold);
  const probabilityLabel = `${probability.bounded?"≤ ":""}${probability.value.toFixed(probability.bounded?0:1)}%`;

  function playground(stage: number) {
    if (kind === "fdre") return <div className="product-playground">
      <div className="product-playground-row"><span>As of</span><div role="group" aria-label="Example as-of date">{[false,true].map(value=><button key={String(value)} type="button" aria-pressed={later===value} onClick={()=>setLater(value)}>{value?"01 May":"01 Mar"}</button>)}</div><output>{later?"A · B · C":"A"} eligible</output></div>
      <div className="product-playground-row"><span>Question</span><div role="group" aria-label="Example question type">{[false,true].map(value=><button key={String(value)} type="button" aria-pressed={forecast===value} onClick={()=>setForecast(value)}>{value?"Price forecast":"Filing risk"}</button>)}</div></div>
    </div>;
    if (kind === "embers") return <div className="product-playground"><div className="product-playground-row"><span>View</span><div role="group" aria-label="Product views">{[false,true].map(value=><button key={String(value)} type="button" aria-pressed={inventory===value} onClick={()=>setInventory(value)}>{value?"Inventory":"Detection"}</button>)}</div></div><div className="product-playground-result">{inventory?"Inspect the real saved inventory.":"Follow ID 04 from detection to its saved record."}</div></div>;
    return <div className="product-playground">
      {stage<2?<><div className="product-playground-row"><span>Move</span><div role="group" aria-label="Forecast comparison threshold">{[3,6,10].map(value=><button key={value} type="button" aria-label={`Compare a ${value}% market move`} aria-pressed={threshold===value} onClick={()=>setThreshold(value)}>{value}%</button>)}</div><output className="qflow-probability">{probabilityLabel} above {threshold}%</output></div><div className="product-playground-result">{probability.bounded?"Tail bound beyond the model’s P90 quantile.":"Model estimate; the market reference remains at 6%."}</div></>:stage===2?<><div className="product-playground-row"><span>Fold</span><div role="group" aria-label="Validation fold">{[0,1,2,3].map(value=><button key={value} type="button" aria-label={`Inspect fold ${value+1}`} aria-pressed={fold===value} onClick={()=>setFold(value)}>{value+1}</button>)}</div></div><div className="product-playground-result">Fold {fold+1} · Five-day purge before a 60-day test window.</div></>:<><div className="product-playground-row"><span>Bundle</span><div role="group" aria-label="Model bundle">{[false,true].map(value=><button key={String(value)} type="button" aria-pressed={corrupt===value} onClick={()=>setCorrupt(value)}>{value?"Corrupt":"Verified"}</button>)}</div></div><output className="product-playground-result qflow-serve-result">{corrupt?"SHA-256 mismatch · Previous model v1 retained":"Signature + digest + load passed · Model v2 active"}</output></>}
    </div>;
  }

  return <div className={`product-flow-artwork product-flow-${kind}`}><AnimatedArtwork label={`${kind === "fdre" ? "Financial Document Retrieval Engine" : kind === "quantiv" ? "Quantiv" : "Embers"} animated workflow`} steps={STEPS[kind]} duration={3800} playground={playground}>{stage => <div className="product-flow-scene" data-flow-stage={stage} data-forecast={forecast} data-later={later} data-inventory={inventory} data-corrupt={corrupt}>{kind === "quantiv" ? <QuantivFlow stage={stage} id={id} threshold={threshold} fold={fold} corrupt={corrupt} /> : kind === "fdre" ? <FdreFlow later={later} forecast={forecast} /> : <EmbersFlow id={id} inventory={inventory} />}</div>}</AnimatedArtwork></div>;
}
