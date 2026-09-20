import { ProjectDemo } from "@/components/projects/ProjectDemos";
import { featuredProjects, otherWork } from "@/data/portfolio";

export function Projects() {
  return (
    <>
      <section
        className="work-section"
        id="work"
        data-scroll-section
        data-scroll-label="WORK"
      >
        <div className="reading-column section-intro" data-reveal>
          <p className="section-kicker">Selected work</p>
          <h2>Things I have built.</h2>
          <p>
            A few projects where the implementation matters as much as the idea.
          </p>
        </div>

        <div className="project-list">
          {featuredProjects.map((project, index) => (
            <article
              className="project-chapter"
              key={project.name}
              data-scroll-section
              data-scroll-label={project.name.toUpperCase()}
            >
              <div className="project-copy reading-column" data-reveal>
                <div className="project-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.eyebrow}</span>
                  <span>{project.date}</span>
                </div>

                <h3>{project.name}</h3>
                <p className="project-summary">{project.summary}</p>

                <ul className="project-metrics" aria-label={`${project.name} metrics`}>
                  {project.metrics.map((metric) => {
                    const awardMetric = /award|top 5|gold|platinum/i.test(metric);
                    return (
                      <li className={awardMetric ? "is-award" : undefined} key={metric}>
                        {metric}
                      </li>
                    );
                  })}
                </ul>

                <p className="project-stack">{project.stack}</p>

                {(project.href || project.secondaryHref) && (
                  <div className="project-links">
                    {project.href && project.hrefLabel ? (
                      <a href={project.href} target="_blank" rel="noopener noreferrer">
                        {project.hrefLabel} ↗
                      </a>
                    ) : null}
                    {project.secondaryHref && project.secondaryLabel ? (
                      <a href={project.secondaryHref} target="_blank" rel="noopener noreferrer">
                        {project.secondaryLabel} ↗
                      </a>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="project-result" data-reveal>
                <div className="project-visual">
                  <ProjectDemo kind={project.demo} />
                </div>
                <p className="project-caption">
                  {project.name} · {project.eyebrow}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="narrative-section research-section"
        id="research"
        data-scroll-section
        data-scroll-label="RESEARCH"
      >
        <div className="reading-column">
          <p className="section-kicker" data-reveal>Research and other work</p>

          <div className="research-list">
            {otherWork.map((item) => {
              const isPlatinum = /platinum/i.test(`${item.title} ${item.meta}`);
              const isGoldAward = /gold|best paper|winner/i.test(`${item.title} ${item.meta}`);

              return (
                <article
                  className={isPlatinum ? "research-row is-platinum" : "research-row"}
                  key={item.title}
                  data-reveal
                >
                  <div>
                    <h3 className={isPlatinum ? "platinum-title" : undefined}>
                      {item.title}
                    </h3>
                    <span
                      className={
                        isPlatinum
                          ? "platinum-meta"
                          : isGoldAward
                            ? "award-meta"
                            : undefined
                      }
                    >
                      {item.meta}
                    </span>
                  </div>
                  <p>{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
