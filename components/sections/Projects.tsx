"use client";

import { useState } from "react";
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
      "Full-stack platform for predicting implied earnings moves across active option chains.",
    impact:
      "Built the data, ML, and product layer for a production options workflow with low-latency querying.",
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
    title: "Need for Speed",
    category: "CFD + ML aerodynamics research",
    dates: "2021 - 2022",
    summary:
      "Machine-learning workflow for modeling and improving Formula 1 race-car aerodynamic behavior.",
    impact:
      "National science fair winning research connecting simulation, ML, and performance engineering.",
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
      "C++ Capacitated Vehicle Routing Problem solver accelerated with ML and data-mining patterns.",
    impact:
      "Improved solver performance for large-scale optimization research on high-performance compute.",
    metrics: [
      { value: "15%", label: "compute reduction" },
      { value: "34k", label: "cluster cores" },
      { value: "TB", label: "data scale" },
    ],
    tags: ["C++", "CMake", "SLURM", "Java", "JavaFX"],
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
        sub="A concise view of the systems, research, and tooling with the most signal."
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
