import { SectionHead } from "./SectionHead";

const skills = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "C++", "Java", "Go", "SQL"],
  },
  {
    label: "ML / Data",
    items: [
      "PyTorch",
      "LightGBM",
      "XGBoost",
      "Scikit-learn",
      "DuckDB",
      "Pandas",
      "Postgres",
    ],
  },
  {
    label: "Systems",
    items: ["Next.js", "FastAPI", "Node.js", "REST APIs", "Redis"],
  },
  {
    label: "Cloud / Infra",
    items: [
      "AWS (EC2, S3)",
      "Docker",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "Bash / Linux",
    ],
  },
];

export function About() {
  return (
    <section className="v2-section">
      <SectionHead eyebrow="About" title="A bit about me" />
      <div className="v2-about">
        <div className="v2-about-copy">
          <p>
            I&rsquo;m a Computer Science student at <b>Columbia</b>, focused on{" "}
            <b>machine learning</b>, <b>quantitative finance</b>, and the
            systems that hold them up. I like problems where the math, the
            model, and the infra all have to agree.
          </p>
          <p>
            Right now I&rsquo;m building <b>Quantiv</b> &mdash; an
            options-implied earnings-move platform pairing IV / straddle
            baselines with <b>LightGBM</b> forecasts on historical Greeks and
            volatility. Datasets and scores refresh daily; the goal is
            calibrated forecasts and reproducible pipelines at billion-row
            scale, not millisecond quotes.
          </p>
          <p>
            Before that I published single-author at the <b>IEEE ITSC</b> on
            graph-network traffic forecasting (24% RMSE win over STGCN), earned{" "}
            <b>USACO Platinum</b> with a perfect Gold score, and built a CFD +
            neural-net F1 wing optimizer that won gold at the Canada-Wide
            Science Fair.
          </p>
        </div>
        <div className="v2-about-side">
          <div className="v2-skills-card">
            <div className="v2-mono v2-mono--accent">Toolbox</div>
            <div className="v2-skills">
              {skills.map((g) => (
                <div key={g.label} className="v2-skill-group">
                  <span className="v2-skill-label">{g.label}</span>
                  <div className="v2-skill-chips">
                    {g.items.map((s) => (
                      <span key={s} className="v2-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
