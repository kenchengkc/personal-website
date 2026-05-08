"use client";

import { useState } from "react";
import Image from "next/image";
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
  logo?: {
    src: string;
    alt: string;
  };
};

const items: Stint[] = [
  {
    role: "Founder & Builder - Options Analytics Platform",
    org: "Quantiv",
    loc: "New York, NY",
    dates: "Jul 2025 - Present",
    summary:
      "Founded and building a platform for earnings-move research, volatility modeling, and option-chain analytics.",
    bullets: [
      "Own the product direction, data infrastructure, ML workflow, and frontend experience.",
      "Turning a personal quant research stack into a reusable platform for faster options research.",
      "Building toward a workflow that makes volatility research more accessible and operational.",
    ],
    tags: ["Founder", "Product", "ML", "Data Infra", "Options"],
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
    role: "Independent Researcher - IEEE ITSC 2023",
    org: "GC-INF Traffic Forecasting",
    loc: "Pre-Columbia · High school research",
    dates: "Sep 2022 - Oct 2023",
    summary:
      "Completed GC-INF before Columbia, then published the work as a single-author IEEE ITSC 2023 paper.",
    bullets: [
      "Developed the model and paper independently while in high school.",
      "Presented at IEEE ITSC 2023 and served as a session chair for Simulation and Control.",
      "ISEF Top 30 finalist recognition for the broader research track.",
    ],
    tags: ["IEEE ITSC", "Single Author", "High School Research"],
    logo: {
      src: "/images/gc-inf/ieee-itsc-2023.jpg",
      alt: "IEEE ITSC 2023 Bilbao logo",
    },
  },
  {
    role: "Vehicle Routing Research Assistant",
    org: "UF ISE · Center for Applied Optimization",
    loc: "Gainesville, FL",
    dates: "Jun - Jul 2023",
    summary:
      "Worked with UF ISE and the Center for Applied Optimization on a C++ CVRP solver accelerated with ML and data-mining patterns.",
    bullets: [
      "15% compute-time reduction on TB-scale datasets.",
      "Validated scalability on the 34k-core UF HiPerGator cluster via SLURM batch jobs.",
      "JavaFX visualization tool for OR researchers.",
    ],
    tags: ["UF ISE", "CAO", "C++", "SLURM", "JavaFX"],
    logo: {
      src: "/images/vrp/uf-ise.jpg",
      alt: "UF ISE logo",
    },
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
        sub="Roles, research venues, and builders I have been part of."
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
            <div className="v2-work-panel-aside">
              {active.logo && (
                <Image
                  src={active.logo.src}
                  alt={active.logo.alt}
                  width={128}
                  height={128}
                  className="v2-exp-logo"
                />
              )}
              <span className="v2-work-date">{active.dates}</span>
            </div>
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
