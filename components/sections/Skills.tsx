const skillGroups = [
  {
    label: "Languages",
    skills: ["Python", "C++", "C", "Go", "TypeScript", "Java", "JavaScript", "SQL", "Bash"],
  },
  {
    label: "Machine Learning",
    skills: [
      "PyTorch",
      "JAX",
      "Hugging Face Transformers",
      "scikit-learn",
      "CUDA",
      "LLM Evaluation",
      "Information Retrieval",
      "Retrieval-Augmented Generation",
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
      "Linux",
      "Operating Systems",
      "Distributed Systems",
    ],
  },
  {
    label: "Cloud + Tools",
    skills: [
      "AWS Lambda",
      "S3",
      "AWS CDK",
      "React",
      "Next.js",
      "Flask",
      "Supabase",
      "GitHub Actions",
      "Git",
      "pytest",
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
      "GPU Profiling",
      "Inference Optimization",
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
        <h2 className="section-kicker" data-reveal>Skills</h2>
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
