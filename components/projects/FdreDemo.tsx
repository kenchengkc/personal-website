"use client";

import { useState } from "react";
import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Availability", detail: "SEC availability timestamps filter both searches before ranking." },
  { label: "Hybrid Search", detail: "Keyword and vector hits merge by chunk ID; normalized scores combine." },
  { label: "Evidence", detail: "Evidence gates run before generation; citations must match retrieved text." },
];

const FILINGS = [
  { id: "A", date: "31 Jan", left: 15, eligible: true },
  { id: "B", date: "14 Mar", left: 52, eligible: false },
  { id: "C", date: "18 Apr", left: 82, eligible: false },
];

function CheckMark() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Availability({ later, setLater }: { later: boolean; setLater: (value: boolean) => void }) {
  return <div className="fdre-availability" data-later={later}>
    <div className="fdre-mechanism-heading"><h4>Available when?</h4><div className="fdre-example-switch" role="group" aria-label="Example as-of date">
      <button type="button" data-demo-interaction aria-pressed={!later} onClick={() => setLater(false)}>01 Mar</button>
      <button type="button" data-demo-interaction aria-pressed={later} onClick={() => setLater(true)}>01 May</button>
    </div></div>
    <div className="fdre-availability-rule"><span>available_at</span><b>≤</b><span>as_of</span></div>
    <div className="fdre-calendar-track" aria-label={`As of ${later ? "1 May, all three filings are available" : "1 March, only filing A is available"}`}>
      <div className="fdre-timeline-rail" />
      <div className="fdre-date-boundary"><span>as_of</span><i /></div>
      {FILINGS.map(filing => <div className="fdre-filing-event" data-eligible={later || filing.eligible} style={{ left: `${filing.left}%` }} key={filing.id}>
        <div className="fdre-event-sheet"><span>{filing.id}</span><i /><i /><i /></div>
        <div className="fdre-event-dot" />
        <time>{filing.date}</time>
        <small>{later || filing.eligible ? "Available" : "Excluded"}</small>
      </div>)}
    </div>
    <div className="fdre-eligible-flow">
      <div className="fdre-eligible-set"><span>Eligible filings</span><strong>{later ? "A · B · C" : "A"}</strong></div>
      <svg className="fdre-filter-branches" viewBox="0 0 400 45" preserveAspectRatio="none" aria-hidden="true"><path d="M200 0V12Q200 22 190 22H85Q75 22 75 32V45M200 12Q200 22 210 22H315Q325 22 325 32V45" /><path className="fdre-filter-hit" d="M200 0V12Q200 22 190 22H85Q75 22 75 32V45" pathLength="1"/><path className="fdre-filter-hit" d="M200 0V12Q200 22 210 22H315Q325 22 325 32V45" pathLength="1"/></svg>
      <div className="fdre-index-destinations"><span><i />Full-text search</span><span><i />Vector search</span></div>
    </div>
  </div>;
}

function ChunkId({ id, future = false, later = false }: { id: string; future?: boolean; later?: boolean }) {
  return <span className={`fdre-chunk-id${id === "12" ? " fdre-shared-id" : ""}`} data-excluded={future && !later}>{future && !later ? "—" : id}</span>;
}

function HybridSearch({ later }: { later: boolean }) {
  return <div className="fdre-hybrid">
    <div className="fdre-mechanism-heading"><h4>Two indexes. One result set.</h4><span className="fdre-mini-note">as_of · {later ? "01 May" : "01 Mar"}</span></div>
    <div className="fdre-query-line"><span>AAPL</span><strong>“supply-chain risk”</strong></div>
    <svg className="fdre-query-branches" viewBox="0 0 400 35" preserveAspectRatio="none" aria-hidden="true"><path d="M200 0V8Q200 17 190 17H95Q85 17 85 27V35M200 8Q200 17 210 17H305Q315 17 315 27V35" /></svg>
    <div className="fdre-ranker-grid">
      <div className="fdre-ranker fdre-lexical-ranker"><h5>PostgreSQL</h5><span>Full-text · GIN index</span><div className="fdre-chunk-row"><ChunkId id="12" /><ChunkId id="31" /><ChunkId id="57" future later={later} /></div><small>Keyword relevance</small></div>
      <div className="fdre-ranker fdre-vector-ranker"><h5>pgvector</h5><span>512 dimensions · HNSW</span><div className="fdre-chunk-row"><ChunkId id="57" future later={later} /><ChunkId id="12" /><ChunkId id="84" future later={later} /></div><small>Cosine similarity</small></div>
    </div>
    <svg className="fdre-fusion-routes" viewBox="0 0 400 58" preserveAspectRatio="none" aria-hidden="true"><path d="M90 0V10C90 45 200 15 200 58M310 0V10C310 45 200 15 200 58" /><path className="fdre-moving-hit" d="M90 0V10C90 45 200 15 200 58" pathLength="1" /><path className="fdre-moving-hit fdre-moving-hit-second" d="M310 0V10C310 45 200 15 200 58" pathLength="1" /></svg>
    <div className="fdre-fusion-label"><strong>Normalize + combine</strong><span>½ keyword + ½ vector</span><span>Merge identical chunk IDs</span></div>
    <div className="fdre-merged-chunks"><ChunkId id="12" />{later && <ChunkId id="57" />}<ChunkId id="31" />{later && <ChunkId id="84" />}</div>
    <div className="fdre-fusion-foot"><span>12 + 12 → 12</span><span>{later ? "4" : "2"} unique passages</span></div>
  </div>;
}

function Evidence({ forecast, setForecast }: { forecast: boolean; setForecast: (value: boolean) => void }) {
  return <div className="fdre-evidence" data-forecast={forecast}>
    <div className="fdre-mechanism-heading"><h4>Answer, or abstain.</h4><div className="fdre-example-switch" role="group" aria-label="Example question type">
      <button type="button" data-demo-interaction aria-pressed={!forecast} onClick={() => setForecast(false)}>Filing risk</button>
      <button type="button" data-demo-interaction aria-pressed={forecast} onClick={() => setForecast(true)}>Price forecast</button>
    </div></div>
    <div className="fdre-evidence-question">{forecast ? "Predict next month’s stock price." : "What risks does the filing describe?"}</div>
    <div className="fdre-evidence-route">
      <div className="fdre-evidence-source"><div><span>Retrieved passage</span><strong>12</strong></div><p>“Supply-chain changes require time and resources.”</p><small>Filing A · source text</small></div>
      <div className="fdre-evidence-gate"><div className="fdre-gate-rail" /><div className="fdre-gate-shape"><span /></div><strong>Evidence gate</strong><small>{forecast ? "Forecast request" : "Support available"}</small><div className="fdre-gate-rail" /></div>
      <div className="fdre-outcome">
        <div className="fdre-supported-outcome" aria-hidden={forecast}><span className="fdre-output-label">Generated claim</span><p>Changes need time and resources.<sup>[12]</sup></p><div className="fdre-citation-check"><CheckMark /><span>Cited ID was retrieved</span></div><div className="fdre-citation-check"><CheckMark /><span>Quote overlap ≥ 0.60</span></div></div>
        <div className="fdre-abstain-outcome" aria-hidden={!forecast}><span className="fdre-abstain-symbol" aria-hidden="true">∅</span><strong>Abstain</strong><span>Unsupported forecast</span><small>Generation skipped</small></div>
      </div>
    </div>
    <div className="fdre-evidence-foot"><span>{forecast ? "No answer or citations returned" : "Citation [12] retains the passage and filing metadata"}</span></div>
  </div>;
}

export function FdreDemo() {
  const [later, setLater] = useState(false);
  const [forecast, setForecast] = useState(false);
  return <DemoPlayer className="fdre-demo" label="Financial Document Retrieval Engine search demonstration" eyebrow="FDRE" title="Point-in-time retrieval and evidence checks" stages={STAGES} note="Illustrative example" duration={4500}>
    {({ stage }) => <div className="fdre-technical-artwork" data-stage={stage}>
      <div className="fdre-example-label"><span>FDRE / Under the hood</span><span>Illustrative example</span></div>
      <div className="fdre-mechanism-scenes">
        <div className="fdre-stage-view" data-active={stage === 0} aria-hidden={stage !== 0} inert={stage !== 0}><Availability later={later} setLater={setLater} /></div>
        <div className="fdre-stage-view" data-active={stage === 1} aria-hidden={stage !== 1} inert={stage !== 1}><HybridSearch later={later} /></div>
        <div className="fdre-stage-view" data-active={stage === 2} aria-hidden={stage !== 2} inert={stage !== 2}><Evidence forecast={forecast} setForecast={setForecast} /></div>
      </div>
    </div>}
  </DemoPlayer>;
}
