import Image from "next/image";
import { featuredProjects, otherWork } from "@/data/portfolio";

export function Projects() {
  return (
    <>
      <section className="work-section" id="work">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Selected work</p>
          <h2>Four things worth opening.</h2>
        </div>

        <div className="project-list">
          {featuredProjects.map((project, index) => (
            <article
              className="project-chapter"
              key={project.name}
              data-reveal
            >
              <div className="project-copy">
                <div className="project-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.eyebrow}</span>
                  <span>{project.date}</span>
                </div>

                <h3>{project.name}</h3>
                <p className="project-summary">{project.summary}</p>

                <ul className="project-metrics" aria-label={`${project.name} metrics`}>
                  {project.metrics.map((metric) => (
                    <li key={metric}>{metric}</li>
                  ))}
                </ul>

                <p className="project-stack">{project.stack}</p>

                {(project.href || project.secondaryHref) && (
                  <div className="project-links">
                    {project.href && project.hrefLabel ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link text-link-primary"
                      >
                        {project.hrefLabel} <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                    {project.secondaryHref && project.secondaryLabel ? (
                      <a
                        href={project.secondaryHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link"
                      >
                        {project.secondaryLabel} <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                )}
              </div>

              <div
                className={`project-visual project-visual-${project.visual.surface ?? "dark"}`}
              >
                <Image
                  src={project.visual.src}
                  alt={project.visual.alt}
                  width={project.visual.width}
                  height={project.visual.height}
                  sizes="(max-width: 900px) 100vw, 46vw"
                  className={
                    project.visual.fit === "contain"
                      ? "project-image project-image-contain"
                      : "project-image"
                  }
                />
                <span className="project-visual-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="research-section" id="research">
        <div className="section-heading section-heading-compact" data-reveal>
          <p className="eyebrow">Research + recognition</p>
          <h2>The rest of the signal.</h2>
        </div>

        <div className="research-list">
          {otherWork.map((item) => (
            <article className="research-row" key={item.title} data-reveal>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <span>{item.meta}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
