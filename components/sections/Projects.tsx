import { SectionHead } from "./SectionHead";
import { Arrow } from "@/components/icons/Icons";

type Project = {
  title: string;
  sub: string;
  dates: string;
  desc: string;
  tags: string[];
  stat: { v: string; l: string };
  stat2: { v: string; l: string };
  href?: string;
  featured?: boolean;
};

const projects: Project[] = [
  {
    title: "Quantiv",
    sub: "Options trading data platform — ML for volatility",
    dates: "Jul 2025 — Present",
    desc: "A Next.js + FastAPI platform that predicts implied earnings moves for 50–100 tickers weekly. IV models combined with XGBoost on historical Greeks; DuckDB + Parquet pipeline over 1B+ records.",
    tags: ["Next.js", "FastAPI", "XGBoost", "DuckDB", "AWS EC2", "Redis"],
    stat: { v: "1B+", l: "records" },
    stat2: { v: "100ms", l: "p95 latency" },
    href: "https://github.com/kenchengkc/quantiv",
    featured: true,
  },
  {
    title: "GC-INF",
    sub: "Deep learning traffic forecasting",
    dates: "2022 — 2023",
    desc: "Hybrid Graph ConvNet + Informer for adaptive signal control. 24% RMSE improvement over prior SOTA on intersection turning ratios. Published in IEEE ITSC 2023 (single-author).",
    tags: ["PyTorch", "Graph NN", "Informer", "IEEE"],
    stat: { v: "24%", l: "RMSE Δ" },
    stat2: { v: "IEEE", l: "published" },
    href: "https://ieeexplore.ieee.org/",
  },
  {
    title: "VRP Solver",
    sub: "Research with Dr. Yu Yang, U. Florida",
    dates: "Summer 2023",
    desc: "C++ Vehicle Routing Problem solver augmented with ML-driven branch-and-cut. 15% compute-time reduction on TB-scale datasets. JavaFX visualization for OR researchers.",
    tags: ["C++", "SLURM", "Java", "JavaFX"],
    stat: { v: "15%", l: "compute Δ" },
    stat2: { v: "TB", l: "scale" },
  },
];

export function Projects() {
  return (
    <section className="v2-section" id="projects">
      <SectionHead
        eyebrow="Projects"
        title="Selected work"
        sub="Things I've built and shipped — most are open source."
      />
      <div className="v2-proj-list">
        {projects.map((p, i) => (
          <article
            key={p.title}
            className={`v2-proj ${p.featured ? "v2-proj--featured" : ""}`}
          >
            <div className="v2-proj-meta">
              <span className="v2-mono v2-mono--accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="v2-mono">{p.dates}</span>
            </div>
            <div className="v2-proj-main">
              <h3 className="v2-proj-title">{p.title}</h3>
              <div className="v2-proj-sub">{p.sub}</div>
              <p className="v2-proj-desc">{p.desc}</p>
              <div className="v2-chips">
                {p.tags.map((t) => (
                  <span key={t} className="v2-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="v2-proj-side">
              <div className="v2-proj-stat">
                <div className="v2-proj-stat-v">{p.stat.v}</div>
                <div className="v2-proj-stat-l">{p.stat.l}</div>
              </div>
              <div className="v2-proj-stat">
                <div className="v2-proj-stat-v">{p.stat2.v}</div>
                <div className="v2-proj-stat-l">{p.stat2.l}</div>
              </div>
              {p.href && (
                <a
                  className="v2-proj-link"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View case study <Arrow size={12} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
