import { SectionHead } from "./SectionHead";
import { CarPhoto } from "@/components/cars/CarPhoto";

const skills = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "C++", "Java", "SQL"],
  },
  {
    label: "ML / Data",
    items: ["PyTorch", "XGBoost", "Scikit-learn", "DuckDB", "Pandas"],
  },
  {
    label: "Systems",
    items: ["Next.js", "FastAPI", "AWS", "Redis", "Docker"],
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
            Right now I&rsquo;m building <b>Quantiv</b> - an options analytics
            platform that combines implied-volatility models with XGBoost on
            historical Greeks to forecast earnings moves. Before that, I
            published in IEEE ITSC on graph-network traffic forecasting, and
            earned USACO Platinum with a perfect score.
          </p>
          <p>
            When I&rsquo;m not coding, you&rsquo;ll find me watching Formula 1
            - which, if you couldn&rsquo;t tell, inspired the look of this
            site.
          </p>

          <div className="v2-inspo">
            <figure className="v2-inspo-figure">
              <CarPhoto
                src="/images/cars/ferrari.jpg"
                alt="Modern Ferrari Formula 1 car at speed. Photo by Liauzh, CC BY-SA."
              />
              <figcaption className="v2-mono v2-mono--dim">
                Ferrari · modern era
              </figcaption>
            </figure>
            <figure className="v2-inspo-figure">
              <CarPhoto
                src="/images/cars/mclaren.jpg"
                alt="McLaren MP4/2C in Marlboro livery on display. Photo by Michael Barera, CC BY-SA 4.0."
              />
              <figcaption className="v2-mono v2-mono--dim">
                McLaren MP4/2C · 1986
              </figcaption>
            </figure>
          </div>
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
