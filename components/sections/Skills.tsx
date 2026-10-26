const skillGroups = [
  {
    label: "Languages",
    skills: ["Python", "C++", "TypeScript", "SQL", "Java", "Go", "JavaScript", "C", "Bash"],
  },
  {
    label: "Machine Learning",
    skills: [
      "PyTorch",
      "Hugging Face Transformers",
      "CUDA",
      "JAX",
      "scikit-learn",
      "NumPy",
      "Pandas",
      "LightGBM",
      "XGBoost",
      "SciPy",
    ],
  },
  {
    label: "ML Methods",
    skills: [
      "Inference Optimization",
      "Model & LLM Evaluation",
      "Retrieval-Augmented Generation",
      "Information Retrieval",
      "Embeddings",
      "GPU Profiling",
      "Activation Probing",
      "Computer Vision (YOLOv11)",
      "Feature Engineering",
      "Walk-Forward Validation",
      "Quantile Regression",
      "Backtesting",
      "Options Pricing",
    ],
  },
  {
    label: "Backend + Data",
    skills: [
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "pgvector",
      "DuckDB",
      "Parquet",
      "Flask",
      "Supabase",
    ],
  },
  {
    label: "Systems + Cloud",
    skills: [
      "Linux",
      "Docker",
      "Distributed Systems",
      "AWS (Lambda, S3, EC2, CDK)",
      "Operating Systems",
    ],
  },
  {
    label: "Web + Tools",
    skills: [
      "React",
      "Next.js",
      "Git",
      "CI/CD (GitHub Actions)",
      "pytest",
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
        <h2 className="section-kicker" data-reveal>Skills</h2>
        <div className="skills-field" data-reveal>
          {skillGroups.map((group) => (
            <div className="skill-row" key={group.label}>
              <span className="skill-group-label">{group.label}</span>
              <div className="skill-items">
                {group.skills.map((skill) => (
                  <span
                    className="skill-item"
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
