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
  sub: string;
  dates: string;
  desc: string;
  tags: string[];
  stat: { v: string; l: string };
  stat2: { v: string; l: string };
  links?: ProjectLink[];
  featured?: boolean;
};

const projects: Project[] = [
  {
    title: "Quantiv",
    sub: "Options trading data platform, ML for volatility",
    dates: "Jul 2025 - Present",
    desc: "A Next.js + FastAPI platform that predicts implied earnings moves for 50-100 tickers weekly. IV models combined with XGBoost on historical Greeks; DuckDB + Parquet pipeline over 1B+ records.",
    tags: [
      "Next.js",
      "FastAPI",
      "XGBoost",
      "DuckDB",
      "Postgres",
      "AWS EC2",
      "Redis",
      "Docker",
    ],
    stat: { v: "1B+", l: "records" },
    stat2: { v: "100ms", l: "p95 latency" },
    links: [{ label: "Visit usequantiv.com", href: site.links.quantiv }],
    featured: true,
  },
  {
    title: "Need for Speed",
    sub: "F1 aerodynamics: a novel CFD + ML method",
    dates: "2021 - 2022",
    desc: "Computational fluid dynamics combined with machine learning to model and enhance Formula 1 race-car aerodynamics. Won the Canada-Wide Science Fair national competition in 2022 and was published on ResearchGate.",
    tags: ["CFD", "Machine Learning", "Aerodynamics", "Python"],
    stat: { v: "CWSF", l: "national champion '22" },
    stat2: { v: "F1", l: "aerodynamics" },
    links: [{ label: "Read paper", href: site.links.f1cfd }],
    featured: true,
  },
  {
    title: "GC-INF",
    sub: "Deep learning traffic forecasting",
    dates: "2022 - 2023",
    desc: "Hybrid Graph ConvNet + Informer for adaptive signal control. 24% RMSE improvement over prior SOTA on intersection turning ratios. Published as single-author at IEEE ITSC 2023, where I also served as session chair for Simulation and Control.",
    tags: ["PyTorch", "Graph NN", "Informer", "IEEE"],
    stat: { v: "24%", l: "RMSE Δ" },
    stat2: { v: "IEEE", l: "published" },
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
    sub: "Research with Dr. Yu Yang, U. Florida",
    dates: "Jun - Jul 2023",
    desc: "Capacitated Vehicle Routing Problem solver in C++ augmented with ML and data-mining patterns. 15% compute-time reduction on TB-scale datasets, validated on the 34k-core UF HiPerGator supercomputer via SLURM batch jobs. JavaFX visualization for OR researchers.",
    tags: ["C++", "CMake", "SLURM", "Java", "JavaFX"],
    stat: { v: "15%", l: "compute Δ" },
    stat2: { v: "34k", l: "HiPerGator cores" },
  },
];

export function Projects() {
  return (
    <section className="v2-section" id="projects">
      <SectionHead
        eyebrow="Projects"
        title="Selected work"
        sub="Things I've built and shipped - most are open source."
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
              {p.links && p.links.length > 0 && (
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      className="v2-proj-link"
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={l.download}
                      style={{ marginTop: 0 }}
                    >
                      {l.label} <Arrow size={12} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
