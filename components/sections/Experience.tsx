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
  links?: { label: string; href: string }[];
  logo?: {
    src: string;
    alt: string;
    variant?: "wide" | "square";
    tone?: "dark" | "light";
  };
};

const items: Stint[] = [
  {
    role: "Founder and Lead Software Engineer",
    org: "Quantiv - Options Trading Data Platform",
    loc: "New York, NY, USA",
    dates: "Jul 2025 - Present",
    summary:
      "Founder and lead engineer of an options analytics platform for earnings-move research.",
    bullets: [
      "Built a Next.js + FastAPI options analytics platform to predict implied earnings moves for 50-100 tickers weekly, combining mathematical IV models with ML (XGBoost) on historical Greeks and volatility.",
      "Scaled infrastructure with Docker containerization for faster deployment and Redis caching to reduce query latency to under 100ms.",
      "Engineered a data pipeline (DuckDB + Parquet) to process 1B+ option chain and volatility history records.",
      "Reduced data sync time by ~90% through atomic directory swap and rsync staging, ensuring zero-downtime updates of large option chain datasets on AWS Elastic Compute Cloud (EC2).",
    ],
    tags: ["FastAPI", "SQL", "AWS EC2", "Redis", "Docker"],
    logo: {
      src: "/images/quantiv/quantiv-color-banner.png",
      alt: "Quantiv logo",
      variant: "wide",
      tone: "dark",
    },
  },
  {
    role: "Machine Learning Lead & Winner",
    org: "Google at LA Hacks (University of California - Los Angeles)",
    loc: "Los Angeles, CA, USA",
    dates: "Apr 2025",
    summary:
      "Led a team building a CV + voice-first app for wildfire insurance claims that won three LA Hacks awards.",
    bullets: [
      "Led team to develop Embers, a React + Python/Flask Computer Vision app achieving 90%+ detection accuracy in auto-inventorying household items from 30-second videos, streamlining insurance claims for wildfire survivors.",
      "Integrated Google Gemini, ElevenLabs, & OpenAI Whisper APIs into an intelligent voice-first chatbot assistant, enabling personalized asset valuation and reducing manual claim documentation time by an estimated 50%.",
      "Placed as Top 5 Finalist out of 172 teams; Won Best Use of Google Gemini API and Best Financial Tech Project.",
    ],
    tags: ["React", "Flask", "Python", "TypeScript", "APIs", "Supabase"],
    links: [
      {
        label: "Embers' Devpost",
        href: "https://devpost.com/software/insurefire",
      },
    ],
    logo: {
      src: "/images/embers/la-hacks-2025.png",
      alt: "LA Hacks 2025 logo",
      variant: "wide",
      tone: "dark",
    },
  },
  {
    role: "Research Software Engineer, Single-Author Deep Learning Publication",
    org: "IEEE Intelligent Transportation Systems Conference",
    loc: "Bilbao, Biscay, Spain",
    dates: "Sep 2022 - Oct 2023",
    summary:
      "Independent research on graph-network traffic forecasting, published single-author at IEEE ITSC 2023.",
    bullets: [
      "Engineered GC-INF, a hybrid 4-layer Graph ConvNet + Informer transformer, that learns spatial-temporal patterns in road-graph data to predict intersection turning ratios for adaptive signal control, delivered as clean PyTorch code.",
      "Built full ML pipeline with Chebyshev graph convolutions, ProbSparse attention, Adam optimizer + Cosine decay.",
      "Cut 15-min turning-ratio forecast error by 24% RMSE compared to STGCN (IJCAI '17), a state-of-the-art model.",
      "Single-author paper and session chair at IEEE ITSC 2023; selected as Team Canada-ISEF Finalist (Top 30 Canada).",
    ],
    tags: ["Python (Scikit-learn)", "PyTorch", "Data pipelines"],
    logo: {
      src: "/images/gc-inf/ieee-itsc-2023.jpg",
      alt: "IEEE ITSC 2023 Bilbao logo",
    },
  },
  {
    role: "Operations Research and Machine Learning Research Intern",
    org: "University of Florida",
    loc: "Gainesville, FL, USA",
    dates: "Jun - Jul 2023",
    summary:
      "OR + ML research accelerating large-scale Vehicle Routing Problem (VRP) solvers; awarded Best Paper at SSTP.",
    bullets: [
      "Improved a VRP solver with ML and data-mining patterns, reducing compute time on TB-scale datasets by 15%.",
      "Developed a Java-based visualization tool for route solutions, enabling interpretable insights for researchers.",
      "Analyzed patterns between dual values and variables in Column Generation-based solutions using simulations on the UF Supercomputer (HiPerGator).",
      "Won the Best Paper Award at the Student Science Training Program (SSTP, less than 10% acceptance rate).",
    ],
    tags: ["C++", "CMake", "SLURM batch scripts", "Java", "JavaFX"],
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
                  className={`v2-exp-logo ${
                    active.logo.variant === "wide" ? "v2-exp-logo--wide" : ""
                  } ${
                    active.logo.tone === "dark" ? "v2-exp-logo--dark" : ""
                  }`}
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

          {active.links && active.links.length > 0 && (
            <div className="v2-work-links">
              {active.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v2-proj-link"
                >
                  <span className="v2-proj-link-text">{link.label}</span>
                  <span className="v2-proj-link-arrow" aria-hidden>
                    →
                  </span>
                </a>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
