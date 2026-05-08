import { SectionHead } from "./SectionHead";

const items = [
  {
    role: "Quantitative Research — Independent",
    org: "Quantiv",
    loc: "New York, NY",
    dates: "Jul 2025 — Present",
    summary:
      "Building an options analytics platform end to end — ML, data, and frontend.",
    bullets: [
      "Next.js + FastAPI predicting implied earnings moves for 50–100 tickers weekly.",
      "XGBoost on historical Greeks + IV; DuckDB pipeline over 1B+ option chain records.",
      "Atomic-swap rsync staging on AWS EC2 — zero-downtime data updates.",
    ],
    tags: ["XGBoost", "FastAPI", "DuckDB", "AWS", "Redis"],
  },
  {
    role: "Machine Learning Lead — Hackathon Winner",
    org: "Embers · LA Hacks",
    loc: "UCLA",
    dates: "Apr 2025",
    summary:
      "CV app for wildfire insurance claims; auto-inventories items from a 30-second video.",
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
    dates: "Sep 2022 — Oct 2023",
    summary: "GC-INF — graph ConvNet + Informer for adaptive traffic signal control.",
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
    dates: "Jun — Aug 2023",
    summary:
      "C++ Vehicle Routing Problem solver with ML-driven branch-and-cut acceleration.",
    bullets: [
      "15% compute-time reduction on TB-scale datasets.",
      "JavaFX visualization tool for OR researchers.",
    ],
    tags: ["C++", "SLURM", "Java", "JavaFX"],
  },
];

export function Experience() {
  return (
    <section className="v2-section" id="experience">
      <SectionHead
        eyebrow="Experience"
        title="Where I've worked"
        sub="Research, hackathons, and what I'm building now."
      />
      <div className="v2-exp-list">
        {items.map((it, i) => (
          <div key={it.org} className="v2-exp-item">
            <div className="v2-exp-rail">
              <span
                className="v2-exp-rail-dot"
                style={{
                  background: i === 0 ? "var(--color-accent)" : "#3a3a3e",
                  boxShadow:
                    i === 0 ? "0 0 14px var(--color-accent)" : "none",
                }}
              />
              {i < items.length - 1 && <span className="v2-exp-rail-line" />}
            </div>
            <div className="v2-exp-body">
              <div className="v2-exp-head">
                <div>
                  <h3 className="v2-exp-role">{it.role}</h3>
                  <div className="v2-exp-org">
                    {it.org} · <span>{it.loc}</span>
                  </div>
                </div>
                <span className="v2-exp-dates">{it.dates}</span>
              </div>
              <p className="v2-exp-summary">{it.summary}</p>
              <ul className="v2-exp-bullets">
                {it.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="v2-chips">
                {it.tags.map((t) => (
                  <span key={t} className="v2-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
