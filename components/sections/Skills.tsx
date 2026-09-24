const skillGroups = [
  {
    label: "Languages",
    skills: ["Python", "C++", "TypeScript", "Java", "JavaScript", "SQL", "Bash"],
  },
  {
    label: "ML + NLP",
    skills: [
      "PyTorch",
      "Hugging Face Transformers",
      "scikit-learn",
      "LLM Evaluation",
      "Information Retrieval",
      "RAG",
      "Embeddings",
      "Computer Vision",
      "LightGBM",
      "XGBoost",
      "YOLOv11",
    ],
  },
  {
    label: "Data + Systems",
    skills: [
      "Pandas",
      "NumPy",
      "SciPy",
      "PostgreSQL",
      "pgvector",
      "DuckDB",
      "Parquet",
      "Redis",
      "FastAPI",
      "Docker",
      "Git",
      "Linux",
    ],
  },
  {
    label: "Cloud + Product",
    skills: [
      "AWS Lambda",
      "S3",
      "CDK",
      "React",
      "Next.js",
      "Flask",
      "Supabase",
      "GitHub Actions",
      "CI/CD",
    ],
  },
  {
    label: "Methods",
    skills: [
      "Feature Engineering",
      "Model Evaluation",
      "Walk-Forward Validation",
      "Quantile Regression",
      "Activation Probing",
      "Options Pricing",
      "Backtesting",
    ],
  },
] as const;

export function Skills() {
  return (
    <section
      className="narrative-section skills-section"
      id="skills"
      data-scroll-section
      data-scroll-label="SKILLS"
    >
      <div className="reading-column">
        <div className="skills-heading" data-reveal>
          <div>
            <p className="section-kicker">Skills</p>
            <h2>From models to production.</h2>
          </div>
          <p>
            ML, retrieval, data infrastructure, and the systems needed to ship them.
          </p>
        </div>
      </div>

      <div className="reading-column">
        <div className="skills-field" data-reveal>
          {skillGroups.map((group, groupIndex) => (
            <div className="skill-row" key={group.label}>
              <span className="skill-group-label">{group.label}</span>
              <div className="skill-items">
                {group.skills.map((skill, index) => (
                  <span
                    className={`skill-item skill-motion-${(index + groupIndex) % 3}`}
                    key={skill}
                  >
                    <i aria-hidden="true" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
