const skillGroups = [
  {
    label: "Languages",
    skills: ["Python", "C++", "TypeScript", "R"],
  },
  {
    label: "ML + Data",
    skills: ["PyTorch", "LightGBM", "DuckDB", "PostgreSQL", "pgvector"],
  },
  {
    label: "Systems + Web",
    skills: ["Next.js", "FastAPI", "Redis", "AWS Lambda", "S3", "Glue", "CDK"],
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
          <p className="section-kicker">Skills</p>
          <p>Tools I reach for across ML, quantitative systems, and product engineering.</p>
        </div>

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
