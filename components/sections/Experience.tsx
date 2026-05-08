"use client";

import { useState } from "react";
import { SectionHead } from "./SectionHead";
import { CarTopDown } from "@/components/cars/CarTopDown";

type Stint = {
  role: string;
  org: string;
  loc: string;
  dates: string;
  summary: string;
  bullets: string[];
  tags: string[];
};

const items: Stint[] = [
  {
    role: "Quantitative Research - Independent",
    org: "Quantiv",
    loc: "New York, NY",
    dates: "Jul 2025 - Present",
    summary:
      "Building an options analytics platform end to end - ML, data, and frontend.",
    bullets: [
      "Next.js + FastAPI predicting implied earnings moves for 50-100 tickers weekly.",
      "XGBoost on historical Greeks + IV; DuckDB pipeline over 1B+ option chain records.",
      "Atomic-swap rsync staging on AWS EC2 - zero-downtime data updates.",
    ],
    tags: ["XGBoost", "FastAPI", "DuckDB", "AWS", "Redis"],
  },
  {
    role: "Machine Learning Lead - Hackathon Winner",
    org: "Embers · LA Hacks",
    loc: "UCLA",
    dates: "Apr 2025",
    summary:
      "Led a 4-person team building a CV app for wildfire insurance claims; auto-inventories items from a 30-second video.",
    bullets: [
      "Top 5 of 172 teams · Best Use of Google Gemini API · Best FinTech Project.",
      "90%+ detection accuracy; voice-first chatbot via Gemini, ElevenLabs, OpenAI Whisper.",
    ],
    tags: ["React", "Flask", "Python", "Supabase"],
  },
  {
    role: "Undergraduate Researcher",
    org: "Columbia · IEEE ITSC",
    loc: "New York, NY",
    dates: "Sep 2022 - Oct 2023",
    summary:
      "GC-INF - graph ConvNet + Informer for adaptive traffic signal control.",
    bullets: [
      "24% RMSE improvement over prior SOTA on intersection turning ratios.",
      "Single-author IEEE ITSC 2023 publication; session chair. ISEF Top 30.",
    ],
    tags: ["PyTorch", "Graph NN", "Informer"],
  },
  {
    role: "Research Assistant",
    org: "University of Florida · Dr. Yu Yang",
    loc: "Gainesville, FL",
    dates: "Jun - Jul 2023",
    summary:
      "Capacitated VRP solver in C++ accelerated with ML and data-mining patterns.",
    bullets: [
      "15% compute-time reduction on TB-scale datasets.",
      "Validated scalability on the 34k-core UF HiPerGator cluster via SLURM batch jobs.",
      "JavaFX visualization tool for OR researchers.",
    ],
    tags: ["C++", "CMake", "SLURM", "Java", "JavaFX"],
  },
];

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <section className="v2-section" id="experience">
      <SectionHead
        eyebrow="Experience"
        title="Where I've worked"
        sub="Research, hackathons, and what I'm building now. Click any stint to dig in."
      />

      <div className="v2-work">
        <div
          className="v2-work-list v2-exp-tablist"
          aria-label="Experience selector"
        >
          {items.map((it, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={it.org}
                type="button"
                className={`v2-work-tab v2-exp-tab ${
                  isActive ? "v2-work-tab--active" : ""
                }`}
                onClick={() => setActiveIndex(i)}
                aria-pressed={isActive}
              >
                <span className="v2-exp-tab-marker" aria-hidden>
                  {isActive ? (
                    <span className="v2-exp-tab-car">
                      <CarTopDown fill="var(--color-accent)" />
                    </span>
                  ) : (
                    <span className="v2-exp-tab-dot" />
                  )}
                </span>
                <span className="v2-work-tab-copy">
                  <span className="v2-work-tab-title">{it.role}</span>
                  <span className="v2-work-tab-sub">{it.org}</span>
                </span>
                <span className="v2-work-tab-date">{it.dates}</span>
              </button>
            );
          })}
        </div>

        <article className="v2-work-panel" key={active.org}>
          <div className="v2-work-panel-head">
            <div>
              <p className="v2-mono v2-mono--accent">{active.loc}</p>
              <h3 className="v2-work-title">{active.role}</h3>
              <p
                className="v2-mono"
                style={{ marginTop: 6, color: "var(--color-text-dim)" }}
              >
                {active.org}
              </p>
            </div>
            <span className="v2-work-date">{active.dates}</span>
          </div>

          <p className="v2-work-summary">{active.summary}</p>

          <ul className="v2-exp-bullets">
            {active.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <div className="v2-chips">
            {active.tags.map((t) => (
              <span key={t} className="v2-chip">
                {t}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
