"use client";

import { useState } from "react";
import Image from "next/image";
import { Medal } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Arrow } from "@/components/icons/Icons";
import { site } from "@/lib/site";

type ProjectLink = {
  label: string;
  href: string;
  download?: boolean;
};

type Project = {
  title: string;
  category: string;
  dates: string;
  summary: string;
  impact: string;
  metrics: { value: string; label: string }[];
  award?: { label: string; detail: string };
  brand?: {
    label: string;
    detail: string;
    meta: string;
    logo?: {
      src: string;
      alt: string;
      variant?: "wide" | "square";
      width?: number;
      height?: number;
    };
  };
  tags: string[];
  details: string[];
  links?: ProjectLink[];
};

const projects: Project[] = [
  {
    title: "Quantiv",
    category: "Options analytics platform",
    dates: "Jul 2025 - Present",
    summary:
      "Founder-built platform for earnings-move research across active option chains.",
    impact:
      "Combines market data engineering, ML volatility signals, and a usable research interface for options workflows.",
    brand: {
      label: "Quantiv",
      detail: "Quantiv",
      meta: "Founder-built options platform",
      logo: {
        src: "/images/quantiv/quantiv-icon.png",
        alt: "Quantiv app icon",
      },
    },
    metrics: [
      { value: "1B+", label: "option records" },
      { value: "100ms", label: "query latency" },
      { value: "50-100", label: "tickers weekly" },
    ],
    tags: ["Next.js", "FastAPI", "XGBoost", "DuckDB", "AWS EC2", "Redis"],
    details: [
      "Combined IV models with XGBoost on historical Greeks and volatility signals.",
      "Built DuckDB + Parquet pipelines for option chain and volatility history records.",
      "Reduced sync downtime with atomic directory swaps and rsync staging on AWS EC2.",
    ],
    links: [{ label: "Visit usequantiv.com", href: site.links.quantiv }],
  },
  {
    title: "USACO Platinum",
    category: "Competitive programming · USA Computing Olympiad",
    dates: "Dec 2023",
    summary:
      "Placed in the top 1% at the most prestigious informatics competition in the United States.",
    impact:
      "Scored a perfect 1000 / 1000 in the December 2023 USACO Gold Division Contest, qualifying for the Platinum division.",
    award: {
      label: "Perfect Score · Gold → Platinum",
      detail: "USA Computing Olympiad",
    },
    metrics: [
      { value: "1000 / 1000", label: "Gold Division" },
      { value: "Top 1%", label: "national rank" },
      { value: "Platinum", label: "qualifier" },
    ],
    tags: ["C++", "Advanced DSA", "Algorithms", "gdb"],
    details: [
      "Solved every problem in the December 2023 USACO Gold Division Contest with a perfect 1000 / 1000.",
      "Top 1% nationally in the United States' most prestigious informatics olympiad.",
      "Wrote and debugged advanced data-structure and algorithm solutions in C++ under timed-contest constraints.",
    ],
  },
  {
    title: "Need for Speed",
    category: "CFD + ML aerodynamics research",
    dates: "2021 - 2022",
    summary:
      "Machine-learning workflow for modeling and improving Formula 1 race-car aerodynamic behavior.",
    impact:
      "National science fair winning research connecting simulation, ML, and performance engineering.",
    award: {
      label: "Gold Medal",
      detail: "Canada Wide Science Fair",
    },
    brand: {
      label: "CWSF",
      detail: "Canada-Wide Science Fair",
      meta: "National champion · 2022",
      logo: {
        src: "/images/cwsf/cwsf-logo.png",
        alt: "Canada-Wide Science Fair (CWSF / ESPC) logo",
        variant: "wide",
        width: 632,
        height: 200,
      },
    },
    metrics: [
      { value: "CWSF", label: "national champion" },
      { value: "2022", label: "award year" },
      { value: "F1", label: "aero domain" },
    ],
    tags: ["CFD", "Machine Learning", "Aerodynamics", "Python"],
    details: [
      "Combined computational fluid dynamics outputs with machine-learning modeling.",
      "Focused on performance characteristics relevant to open-wheel racing aerodynamics.",
      "Published the research on ResearchGate after the national competition.",
    ],
    links: [{ label: "Read paper", href: site.links.f1cfd }],
  },
  {
    title: "GC-INF",
    category: "Deep learning traffic forecasting",
    dates: "2022 - 2023",
    summary:
      "Hybrid Graph ConvNet + Informer model for adaptive traffic signal control.",
    impact:
      "Single-author IEEE ITSC publication with a measurable forecasting improvement over prior models.",
    brand: {
      label: "IEEE",
      detail: "ITSC 2023 publication",
      meta: "Peer-reviewed research venue",
    },
    metrics: [
      { value: "24%", label: "RMSE improvement" },
      { value: "IEEE", label: "published" },
      { value: "1st", label: "single author" },
    ],
    tags: ["PyTorch", "Graph NN", "Informer", "IEEE"],
    details: [
      "Forecasted intersection turning ratios using Chebyshev graph convolutions and Informer attention.",
      "Improved RMSE by 24% over prior state-of-the-art traffic forecasting models.",
      "Presented at IEEE ITSC 2023 and served as session chair for Simulation and Control.",
    ],
    links: [
      { label: "Read paper", href: site.links.gcinf },
      {
        label: "Chair certificate",
        href: "/credentials/itsc-2023-chair-certificate.pdf",
        download: true,
      },
    ],
  },
  {
    title: "CVRP Solver",
    category: "Optimization research tooling",
    dates: "Jun - Jul 2023",
    summary:
      "UF ISE and CAO research project building a C++ Capacitated Vehicle Routing Problem solver.",
    impact:
      "Improved solver performance for large-scale optimization research at the Center for Applied Optimization.",
    brand: {
      label: "UF ISE",
      detail: "Center for Applied Optimization",
      meta: "University of Florida research",
      logo: {
        src: "/images/vrp/uf-ise.jpg",
        alt: "UF ISE logo",
      },
    },
    metrics: [
      { value: "15%", label: "compute reduction" },
      { value: "34k", label: "cluster cores" },
      { value: "TB", label: "data scale" },
    ],
    tags: ["C++", "CMake", "SLURM", "UF ISE", "CAO"],
    details: [
      "Integrated ML-driven pruning and data-mining patterns into a C++ VRP solver.",
      "Validated scalability on the 34k-core UF HiPerGator cluster via SLURM jobs.",
      "Built a JavaFX visualization tool so researchers could inspect route solutions.",
    ],
  },
];

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];

  return (
    <section className="v2-section" id="projects">
      <SectionHead
        eyebrow="Projects"
        title="Selected work"
        sub="Project artifacts, papers, and platforms with the technical details kept here."
      />

      <div className="v2-work">
        <div className="v2-work-list" aria-label="Project selector">
          {projects.map((project, index) => (
            <button
              key={project.title}
              type="button"
              className={`v2-work-tab ${
                index === activeIndex ? "v2-work-tab--active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
            >
              <span className="v2-work-tab-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="v2-work-tab-copy">
                <span className="v2-work-tab-title">{project.title}</span>
                <span className="v2-work-tab-sub">{project.category}</span>
              </span>
              <span className="v2-work-tab-date">{project.dates}</span>
            </button>
          ))}
        </div>

        <article className="v2-work-panel" key={active.title}>
          <div className="v2-work-panel-head">
            <div>
              <p className="v2-mono v2-mono--accent">{active.category}</p>
              <h3 className="v2-work-title">{active.title}</h3>
            </div>
            <span className="v2-work-date">{active.dates}</span>
          </div>

          <p className="v2-work-summary">{active.summary}</p>
          {active.brand && (
            <div className="v2-work-brand" aria-label={active.brand.detail}>
              {active.brand.logo ? (
                <Image
                  src={active.brand.logo.src}
                  alt={active.brand.logo.alt}
                  width={active.brand.logo.width ?? 92}
                  height={active.brand.logo.height ?? 92}
                  className={`v2-work-brand-logo ${
                    active.brand.logo.variant === "wide"
                      ? "v2-work-brand-logo--wide"
                      : ""
                  }`}
                />
              ) : (
                <span className="v2-ieee-wordmark">{active.brand.label}</span>
              )}
              <span>
                <b>{active.brand.detail}</b>
                <small>{active.brand.meta}</small>
              </span>
            </div>
          )}
          {active.award && (
            <div className="v2-work-award" aria-label={active.award.label}>
              <Medal size={22} strokeWidth={2.2} />
              <span>
                <b>{active.award.label}</b>
                <small>{active.award.detail}</small>
              </span>
            </div>
          )}
          <p className="v2-work-impact">{active.impact}</p>

          <div className="v2-work-metrics">
            {active.metrics.map((metric) => (
              <div key={metric.label} className="v2-work-metric">
                <span className="v2-work-metric-v">{metric.value}</span>
                <span className="v2-work-metric-l">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="v2-chips">
            {active.tags.map((tag) => (
              <span key={tag} className="v2-chip">
                {tag}
              </span>
            ))}
          </div>

          <details className="v2-work-details">
            <summary>Implementation notes</summary>
            <ul>
              {active.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </details>

          {active.links && active.links.length > 0 && (
            <div className="v2-work-links">
              {active.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={link.download}
                  className="v2-proj-link"
                >
                  {link.label} <Arrow size={12} />
                </a>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
