import Image from "next/image";
import { Database } from "lucide-react";

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
      "Computer Vision",
      "Feature Engineering",
      "Walk-Forward Validation",
      "Backtesting",
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

const skillLogos: Record<string, string> = {
  Python: "python",
  "C++": "cplusplus",
  TypeScript: "typescript",
  Java: "java",
  Go: "go",
  JavaScript: "javascript",
  C: "c",
  Bash: "bash",
  PyTorch: "pytorch",
  "Hugging Face Transformers": "huggingface",
  CUDA: "nvidia",
  "scikit-learn": "scikitlearn",
  NumPy: "numpy",
  Pandas: "pandas",
  FastAPI: "fastapi",
  PostgreSQL: "postgresql",
  Redis: "redis",
  DuckDB: "duckdb",
  Flask: "flask",
  Supabase: "supabase",
  Linux: "linux",
  Docker: "docker",
  "AWS (Lambda, S3, EC2, CDK)": "amazonwebservices",
  React: "react",
  "Next.js": "nextjs",
  Git: "git",
  "CI/CD (GitHub Actions)": "githubactions",
  pytest: "pytest",
};

export function Skills() {
  return (
    <section
      className="narrative-section skills-section"
      id="skills"
      data-scroll-section
      data-scroll-label="SKILLS"
    >
      <div className="reading-column">
        <h2 className="section-kicker">Skills</h2>
        <div className="skills-field">
          {skillGroups.map((group) => (
            <div className="skill-row" key={group.label}>
              <span className="skill-group-label">{group.label}</span>
              <div className="skill-items">
                {group.skills.map((skill, index) => (
                  <span
                    className={`skill-item${index < 3 ? " skill-item-priority" : ""}`}
                    key={skill}
                  >
                    {skill === "SQL" && <Database className="skill-logo" size={20} strokeWidth={1.75} aria-hidden="true" />}
                    {skillLogos[skill] && <Image
                      className="skill-logo"
                      src={`/images/skills/${skillLogos[skill]}.svg`}
                      alt=""
                      aria-hidden="true"
                      width={20}
                      height={20}
                    />}
                    <span>{skill}</span>
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
