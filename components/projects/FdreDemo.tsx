"use client";

import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Extract", detail: "" },
  { label: "Retrieve", detail: "" },
  { label: "Cite", detail: "" },
];

function PaperLines({ accent = false }: { accent?: boolean }) {
  return <div className={`fdre-paper-lines${accent ? " fdre-lines-accent" : ""}`}><i /><i /><i /><i /></div>;
}

export function FdreDemo() {
  return (
    <DemoPlayer className="fdre-demo" label="Financial Document Retrieval Engine search demonstration" eyebrow="" title="" stages={STAGES} note="" duration={3200}>
      {({ stage }) => (
        <div className="motion-artwork fdre-artboard" data-stage={stage} role="img" aria-label="A filing separates into passages that travel into a source-linked excerpt.">
          <svg className="fdre-flight-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <g className="fdre-wide-trails">
              <path d="M30 42C47 21 49 21 69 43" />
              <path d="M30 49C46 38 52 59 69 49" />
              <path d="M30 57C44 77 56 77 69 56" />
              <path className="fdre-trail-current" pathLength="100" d="M30 49C46 38 52 59 69 49" />
            </g>
            <g className="fdre-narrow-trails">
              <path d="M32 36C30 57 49 46 65 69" />
              <path d="M42 35C63 40 40 58 65 70" />
              <path d="M48 31C77 35 82 49 73 66" />
              <path className="fdre-trail-current" pathLength="100" d="M42 35C63 40 40 58 65 70" />
            </g>
          </svg>
          <div className="fdre-filing-stack" aria-hidden="true">
            <div className="fdre-paper-shadow" />
            <div className="fdre-back-sheet fdre-back-sheet-far" />
            <div className="fdre-back-sheet fdre-back-sheet-near" />
            <div className="fdre-sheet fdre-filing-sheet">
              <div className="fdre-paper-masthead"><span>10-K</span><i /></div>
              <div className="fdre-paper-rule" />
              <PaperLines />
              <div className="fdre-extract-area"><PaperLines accent /><span className="fdre-paper-scan" /></div>
              <PaperLines />
              <div className="fdre-paper-folio"><i /><span>01</span></div>
            </div>
          </div>
          <div className="fdre-passage-fragments" aria-hidden="true">
            {[0, 1, 2].map(index => <div className={`fdre-flying-passage fdre-flying-passage-${index}`} key={index}><span /><i /><i /></div>)}
          </div>
          <div className="fdre-citation-stack" aria-hidden="true">
            <div className="fdre-paper-shadow" />
            <div className="fdre-citation-backing" />
            <div className="fdre-sheet fdre-citation-sheet">
              <div className="fdre-citation-masthead"><span>Source</span><strong>01</strong></div>
              <svg className="fdre-quote-mark" width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M0 9C0 3 3 0 9 0V3C6 3 4 5 4 8H9V18H0ZM13 9C13 3 16 0 22 0V3C19 3 17 5 17 8H22V18H13Z" fill="currentColor" /></svg>
              <div className="fdre-cited-passage fdre-cited-passage-0"><i /><i /></div>
              <div className="fdre-cited-passage fdre-cited-passage-1"><i /><i /></div>
              <div className="fdre-cited-passage fdre-cited-passage-2"><i /><i /></div>
              <div className="fdre-source-link"><span /><i /><i /></div>
            </div>
            <div className="fdre-verified-seal"><svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" /><path d="M10 16L14 20L22 12" pathLength="1" /></svg></div>
          </div>
        </div>
      )}
    </DemoPlayer>
  );
}
