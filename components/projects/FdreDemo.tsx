"use client";

import { useState } from "react";
import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Availability", detail: "SEC availability timestamps filter both searches before ranking." },
  { label: "Hybrid Search", detail: "Both searches return passage 12. Duplicate IDs merge, and normalized scores receive equal weight." },
  { label: "Evidence", detail: "The evidence gate runs before generation; citations must reference retrieved IDs and match source text." },
];

const FILINGS = [
  { id: "A", date: "31 Jan", left: "18%", eligible: true },
  { id: "B", date: "14 Mar", left: "50%", eligible: false },
  { id: "C", date: "18 Apr", left: "82%", eligible: false },
];

function CheckMark() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ChunkId({ id, excluded = false }: { id: string; excluded?: boolean }) {
  return <span className="fdre-chunk-id" data-excluded={excluded}>{excluded ? "—" : id}</span>;
}

function FlowRoutes() {
  return <svg className="fdre-flow-routes" viewBox="0 0 500 630" preserveAspectRatio="none" aria-hidden="true">
    <path className="fdre-route-base" d="M90 111V145Q90 156 102 156H398Q410 156 410 170V232M90 145V244Q90 274 150 286L250 312M410 232V244Q410 274 350 286L250 312M250 328V455M250 478V554" />
    <path className="fdre-filter-flow" d="M90 111V145Q90 156 102 156H398Q410 156 410 170V232" pathLength="1" />
    <path className="fdre-retrieval-flow fdre-keyword-flow" d="M90 164V244Q90 274 150 286L250 312" pathLength="1" />
    <path className="fdre-retrieval-flow fdre-vector-flow" d="M410 164V244Q410 274 350 286L250 312" pathLength="1" />
    <path className="fdre-evidence-flow" d="M250 328V455M250 478V554" pathLength="1" />
  </svg>;
}

export function FdreDemo() {
  const [later, setLater] = useState(false);
  const [forecast, setForecast] = useState(false);

  return <DemoPlayer className="fdre-demo" label="Financial Document Retrieval Engine search demonstration" eyebrow="FDRE" title="Point-in-time retrieval and evidence checks" stages={STAGES} note="Illustrative example" duration={4500}>
    {({ stage }) => <div className="fdre-technical-artwork fdre-continuous" data-stage={stage} data-later={later} data-forecast={forecast}>
      <div className="fdre-example-label"><span>FDRE</span><span>Illustrative example</span></div>

      <div className="fdre-parameters">
        <div className="fdre-parameter"><span>As of</span><div className="fdre-example-switch" role="group" aria-label="Example as-of date">
          <button type="button" data-demo-interaction aria-pressed={!later} onClick={() => setLater(false)}>01 Mar</button>
          <button type="button" data-demo-interaction aria-pressed={later} onClick={() => setLater(true)}>01 May</button>
        </div></div>
        <div className="fdre-parameter"><span>Question</span><div className="fdre-example-switch" role="group" aria-label="Example question type">
          <button type="button" data-demo-interaction aria-pressed={!forecast} onClick={() => setForecast(false)}>Filing risk</button>
          <button type="button" data-demo-interaction aria-pressed={forecast} onClick={() => setForecast(true)}>Price forecast</button>
        </div></div>
      </div>

      <div className="fdre-request"><span>AAPL</span><p>{forecast ? "Predict next month’s stock price." : "What risks does the filing describe?"}</p></div>

      <div className="fdre-flow-scene" role="img" aria-label={`Illustrative retrieval flow. As of ${later ? "1 May, filings A, B and C are available" : "1 March, only filing A is available"}. PostgreSQL full-text search and 512-dimensional pgvector search return ${later ? "four" : "two"} unique passages after duplicate IDs merge, with equal weights for normalized keyword and vector scores. Passage 12 belongs to filing A. ${forecast ? "A price forecast is unsupported: the evidence gate skips generation and returns no answer or citations." : "The supported answer cites passage 12. Source checks require a retrieved citation ID and quote overlap of at least 0.60."}`}>
        <FlowRoutes />

        <div className="fdre-filing-timeline" aria-hidden="true">
          <span className="fdre-timeline-label">SEC availability</span>
          <div className="fdre-date-boundary"><span>as_of</span></div>
          {FILINGS.map(filing => <div className="fdre-filing-event" key={filing.id} style={{ left: filing.left }} data-eligible={later || filing.eligible}>
            <div className="fdre-filing-paper"><strong>{filing.id}</strong><i /><i /></div>
            <time>{filing.date}</time><small>{later || filing.eligible ? "Available" : "Excluded"}</small>
          </div>)}
        </div>

        <div className="fdre-availability-rule" aria-hidden="true"><span>available_at ≤ as_of</span><small>{later ? "A · B · C" : "A"} eligible</small></div>

        <div className="fdre-index fdre-index-keyword" aria-hidden="true"><strong>PostgreSQL</strong><span>Full-text · GIN</span><div className="fdre-index-hit-slot"><span /></div><div className="fdre-index-other-hits"><ChunkId id="31" /><ChunkId id="57" excluded={!later} /></div></div>
        <div className="fdre-index fdre-index-vector" aria-hidden="true"><strong>pgvector</strong><span>512 dimensions · HNSW</span><div className="fdre-index-hit-slot"><span /></div><div className="fdre-index-other-hits"><ChunkId id="57" excluded={!later} /><ChunkId id="84" excluded={!later} /></div></div>

        <div className="fdre-duplicate-y" aria-hidden="true"><div className="fdre-duplicate-x"><span className="fdre-duplicate-hit">12</span></div></div>

        <div className="fdre-merge" aria-hidden="true"><span className="fdre-merge-receiver" /><strong>Normalize + merge IDs</strong><span>½ keyword + ½ vector</span><div className="fdre-remaining-chunks"><ChunkId id="57" excluded={!later} /><ChunkId id="31" /><ChunkId id="84" excluded={!later} /><small>{later ? "4" : "2"} unique passages</small></div></div>

        <div className="fdre-source-context" aria-hidden="true"><span>Passage 12 · Filing A</span><p>“Supply-chain changes require time and resources.”</p></div>

        <div className="fdre-evidence-gate" aria-hidden="true"><div className="fdre-gate-mark"><span /></div><div><strong>Evidence gate</strong><span>{forecast ? "Unsupported forecast" : "Support available"}</span></div></div>

        <div className="fdre-answer" aria-hidden="true"><span>{forecast ? "Abstain" : "Generated claim"}</span><p>{forecast ? "Generation skipped" : "Changes need time and resources."}</p></div>

        <div className="fdre-passage-y"><div className="fdre-passage-x"><div className="fdre-passage-token" data-flow-id="fdre-passage" aria-hidden="true"><span className="fdre-source-badge">A</span><strong>{stage === 2 && !forecast ? "[12]" : "12"}</strong><i /></div></div></div>

        <div className="fdre-source-checks" aria-hidden="true"><span><CheckMark />Cited ID was retrieved</span><span><CheckMark />Quote overlap ≥ 0.60</span></div>
        <div className="fdre-abstention-note" aria-hidden="true">No answer or citations returned</div>
      </div>
    </div>}
  </DemoPlayer>;
}
