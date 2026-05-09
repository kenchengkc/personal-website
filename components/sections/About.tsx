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
            I&rsquo;m a Computer Science student at Columbia, focused on{" "}
            <b>machine learning</b>, <b>quantitative finance</b>, and the
            systems that hold them up. I like the kind of problems where the
            math, the model, and the infra all have to agree.
          </p>
          <p>
            Right now I&rsquo;m building <b>Quantiv</b>—an options analytics
            platform that combines implied-volatility models with XGBoost on
            historical Greeks to forecast earnings moves. Data and forecasts
            refresh on a daily cadence, with the stack aimed at accuracy and
            scale rather than live intraday latency. Before that, I
            published in the IEEE Intelligent Transportation Systems Conference
            on graph-network traffic forecasting, and
            earned USACO Platinum with a perfect score.
          </p>
          <p>
            When I&rsquo;m not coding, you&rsquo;ll find me watching Formula 1
            - which, if you couldn&rsquo;t tell, inspired the look of this
            site.
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
