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
  metrics: { value: string; label: string; tone?: "gold" | "platinum" }[];
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
  media?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  };
};

const projects: Project[] = [
  {
    title: "Quantiv",
    category: "Earnings · options-implied analytics",
    dates: "Jul 2025 - Present",
    summary:
      "Founder-built research stack for options-implied expected moves around earnings—dashboard, scoring pipeline, and GBDT models over institution-scale history.",
    impact:
      "End-to-end workflow from Parquet/DuckDB analytics to LightGBM forecasts and static JSON served by Next.js—accuracy and reproducible daily releases matter more than quote latency.",
    brand: {
      label: "Quantiv",
      detail: "Quantiv",
      meta: "usequantiv.com",
      logo: {
        src: "/images/quantiv/quantiv-icon.png",
        alt: "Quantiv app icon",
      },
    },
    metrics: [
      { value: "1B+", label: "option records" },
      { value: "Daily", label: "model & data refresh" },
      { value: "50-100", label: "tickers weekly" },
    ],
    tags: [
      "Next.js",
      "FastAPI",
      "LightGBM",
      "DuckDB",
      "Parquet",
      "AWS EC2",
      "Redis",
    ],
    details: [
      "LightGBM forecasting layered on options-implied baselines (IV surface, straddle-implied moves, Greek and vol features).",
      "DuckDB + Parquet over full option-chain and volatility history; scoring jobs feed versioned artifacts for the web client.",
      "Atomic dataset swaps on EC2 with rsync staging so large chain refreshes ship without downtime.",
    ],
    links: [{ label: "Visit usequantiv.com", href: site.links.quantiv }],
  },
  {
    title: "USACO Platinum",
    category: "Competitive programming · USA Computing Olympiad",
    dates: "Dec 2023",
    summary:
      "Qualified for Platinum, the highest division of the United States' informatics olympiad.",
    impact:
      "Perfect 1000 / 1000 in the December 2023 Gold Division contest.",
    award: {
      label: "Gold → Platinum, perfect score",
      detail: "USA Computing Olympiad",
    },
    metrics: [
      { value: "1000 / 1000", label: "Gold Division" },
      { value: "Top 1%", label: "national rank" },
      { value: "Platinum", label: "qualifier", tone: "platinum" },
    ],
    tags: ["C++", "Advanced Data Structures and Algorithms", "gdb"],
    details: [
      "Competition-grade C++ across graphs, DP, segment trees, and computational geometry.",
      "gdb profiling to chase down edge cases under tight memory and runtime budgets.",
      "Platinum is the top of the four-division ladder; Bronze → Silver → Gold → Platinum.",
    ],
  },
  {
    title: "Need for Speed",
    category: "F1 aerodynamics surrogate model · CFD + ML",
    dates: "2021 - 2022",
    summary:
      "MATLAB neural-net surrogate that replaces full CFD iteration with sub-second pressure-map predictions.",
    impact:
      "100x faster iteration; 43% drag reduction in simulation; gold at the Canada-Wide Science Fair.",
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
      { value: "100x", label: "CFD iteration" },
      { value: "43%", label: "drag reduction" },
      { value: "Gold", label: "CWSF '22", tone: "gold" },
    ],
    tags: ["MATLAB", "Deep Learning Toolbox", "Feedforward", "trainlm"],
    details: [
      "MATLAB backpropagation feed-forward network trained to generate predicted pressure maps.",
      "Embedded the ANN in an end-to-end aero-analytics stack to drive wing geometry choices.",
      "Single-author publication in Highlights in Science Engineering and Technology.",
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
      "24% RMSE improvement over the prior state-of-the-art on intersection turning ratios.",
    brand: {
      label: "IEEE",
      detail: "IEEE Intelligent Transportation Systems Conference 2023",
      meta: "Peer-reviewed research venue",
    },
    metrics: [
      { value: "24%", label: "RMSE improvement" },
      { value: "IEEE", label: "published" },
      { value: "1st", label: "single author" },
    ],
    tags: ["PyTorch", "Graph NN", "Informer", "IEEE"],
    details: [
      "Chebyshev graph convolutions on the road network feed Informer's ProbSparse attention.",
      "Adam optimizer with cosine decay; trained from raw turning-ratio time series.",
      "Single-author paper; session chair for Simulation and Control at the conference.",
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
    category: "Operations research · UF Center for Applied Optimization",
    dates: "Jun - Jul 2023",
    summary:
      "Mined patterns from past Capacitated Vehicle Routing Problem (CVRP) solutions to teach a C++ solver which branches to prune.",
    impact:
      "15% faster on TB-scale instances of an NP-hard problem; Best Paper at SSTP (<10% acceptance).",
    award: {
      label: "Best Paper Award",
      detail: "Student Science Training Program",
    },
    brand: {
      label: "UF",
      detail: "University of Florida",
      meta: "Center for Applied Optimization",
      logo: {
        src: "/images/vrp/uf-ise.jpg",
        alt: "University of Florida logo",
      },
    },
    metrics: [
      { value: "15%", label: "faster" },
      { value: "TB", label: "instance scale" },
      { value: "<10%", label: "SSTP acceptance" },
    ],
    tags: ["C++", "CMake", "SLURM batch scripts", "Java", "JavaFX"],
    details: [
      "Trained ML on dual-value and variable patterns from Column Generation pricing problems to recognize unproductive branches early.",
      "Scaled experiments out across SLURM batch jobs on the 34k-core UF HiPerGator supercomputer.",
      "Built a JavaFX route-visualization tool so OR researchers could step through the solver's decisions interactively (screenshot below).",
    ],
    media: {
      src: "/media/cvrp-visualizer.png",
      alt: "CVRP solver JavaFX visualizer showing routes and exploration controls",
      width: 1696,
      height: 1800,
      caption: "Solution exploration visualizer",
    },
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
                <span
                  className={[
                    "v2-work-metric-v",
                    metric.tone === "gold" && "v2-work-metric-v--gold",
                    metric.tone === "platinum" && "v2-work-metric-v--platinum",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {metric.value}
                </span>
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

          {active.media && (
            <figure className="v2-work-media">
              <Image
                src={active.media.src}
                alt={active.media.alt}
                width={active.media.width}
                height={active.media.height}
                sizes="(max-width: 900px) 100vw, 820px"
                className="v2-work-media-img"
              />
              {active.media.caption && (
                <figcaption>{active.media.caption}</figcaption>
              )}
            </figure>
          )}

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
                  <span className="v2-proj-link-text">{link.label}</span>
                  <Arrow size={12} />
                </a>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
