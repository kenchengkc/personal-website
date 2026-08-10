import { ScrollReveal } from "@/components/motion/ScrollReveal";
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
      "AWS (EC2, S3, Lambda, CDK)",
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
          <ScrollReveal as="p" delay={0.02}>
            I work on <b>machine learning</b>, <b>quantitative finance</b>, and
            the systems that hold them up. The problems I like are the ones
            where the math, the model, and the infra all have to agree.
          </ScrollReveal>
          <ScrollReveal as="p" delay={0.08}>
            At Amazon this summer I&rsquo;m on the Long-Term Planning and
            Forecasting team in Supply Chain Optimization Technologies (SCOT),
            building the centralized <b>Config package</b> that all 13 engineers
            use to drive <b>MOSAIC</b>, our long-term revenue and inventory
            forecasting platform.
          </ScrollReveal>
          <ScrollReveal as="p" delay={0.14}>
            Alongside that I build <b>Quantiv</b>, an options-implied earnings
            platform on <b>Vercel</b>: multi-week calendar, screener, symbol
            pages, and a <b>Clerk</b> watchlist over nightly JSON, with{" "}
            <b>LightGBM</b> scoring on <b>DuckDB</b> / Parquet and live quotes
            through <b>Upstash</b>. Before Columbia I published single-author at
            the <b>IEEE ITSC</b> on graph-network traffic forecasting (24% RMSE
            win over STGCN) and built a CFD + neural-net F1 wing optimizer.
          </ScrollReveal>
        </div>
        <div className="v2-about-side">
          <ScrollReveal className="v2-skills-card" variant="panel" delay={0.08}>
            <div className="v2-mono v2-mono--accent">Toolbox</div>
            <div className="v2-skills">
              {skills.map((g, index) => (
                <ScrollReveal
                  key={g.label}
                  className="v2-skill-group"
                  delay={0.14 + index * 0.05}
                  y={14}
                >
                  <span className="v2-skill-label">{g.label}</span>
                  <div className="v2-skill-chips">
                    {g.items.map((s) => (
                      <span key={s} className="v2-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
