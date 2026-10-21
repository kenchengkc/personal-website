"use client";

import { Check, FileText, Search } from "lucide-react";
import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Search", detail: "Find filing passages" },
  { label: "Rank", detail: "Bring the evidence forward" },
  { label: "Verify", detail: "Keep the source attached" },
];

const PASSAGES = [
  {
    section: "Item 1A",
    title: "Risk Factors",
    text: "Changes to the supply chain involve significant risks and uncertainties.",
  },
  {
    section: "Item 1",
    title: "Business",
    text: "Manufacturing partners and component supply.",
  },
  {
    section: "Item 7",
    title: "Management Discussion",
    text: "Operating results and business conditions.",
  },
];

export function FdreDemo() {
  return (
    <DemoPlayer
      className="fdre-demo"
      label="Financial Document Retrieval Engine search demonstration"
      eyebrow="FDRE / Research Console"
      title="From question to cited evidence"
      stages={STAGES}
      note="Illustrative query"
      duration={3200}
    >
      {({ stage }) => (
        <div className="fdre-console" data-stage={stage}>
          <div className="fdre-question">
            <div className="fdre-question-label"><Search size={13} aria-hidden="true" /> Search SEC filings</div>
            <p>How does Apple describe supply-chain risk?</p>
            <div className="fdre-scope">
              <span>AAPL</span><span>Form 10-K</span><span>Filing text</span>
            </div>
            <div className="fdre-search-track" aria-hidden="true"><i /></div>
          </div>

          <div className="fdre-evidence-grid">
            <div className="fdre-passages">
              <div className="fdre-pane-label">
                <span>{stage === 0 ? "Candidate passages" : "Ranked passages"}</span>
                <span>03</span>
              </div>
              <ol className="fdre-passage-list" aria-label="Example filing passages">
                {PASSAGES.map((passage, index) => (
                  <li className={index === 0 ? "fdre-passage fdre-primary-passage" : "fdre-passage"} key={passage.section}>
                    <span className="fdre-passage-rank">{stage === 0 ? "—" : String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="fdre-passage-heading"><strong>{passage.title}</strong><span>{passage.section}</span></div>
                      <p>{passage.text}</p>
                    </div>
                    {index === 0 && <span className="fdre-selection-mark" aria-hidden="true" />}
                  </li>
                ))}
              </ol>
              <div className="fdre-search-method"><span /> Keyword + vector retrieval</div>
            </div>

            <article className="fdre-source-document" aria-label="Example source passage">
              <div className="fdre-source-head">
                <FileText size={15} strokeWidth={1.5} aria-hidden="true" />
                <span>Source passage</span>
                <span className="fdre-reference-number">01</span>
              </div>
              <div className="fdre-source-identity"><strong>AAPL</strong><span>Form 10-K</span></div>
              <h4>Item 1A. Risk Factors</h4>
              <p className="fdre-source-excerpt">
                Changes or additions to the Company’s <mark>supply chain</mark> require considerable <mark>time and resources</mark> and involve <mark>significant risks and uncertainties</mark>.
              </p>
              <div className="fdre-source-foot"><span>2025-10-31</span><span>Source retained <Check size={11} aria-hidden="true" /></span></div>
            </article>
          </div>

          <div className="fdre-answer">
            <div className="fdre-answer-gutter" aria-hidden="true"><span /><Check size={13} /></div>
            <div className="fdre-answer-copy">
              <div className="fdre-answer-heading"><strong>Cited answer</strong><span>{stage === 2 ? "Source linked" : "Checking evidence"}</span></div>
              <p>Apple describes supply-chain changes as resource-intensive and subject to significant risks and uncertainties.<sup>01</sup></p>
              <div className="fdre-citation"><FileText size={12} aria-hidden="true" /><span>AAPL · 10-K · Item 1A</span><span className="fdre-citation-rule" /><span>Evidence 01</span></div>
            </div>
          </div>
        </div>
      )}
    </DemoPlayer>
  );
}
