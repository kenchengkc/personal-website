import { ExternalLink, Sparkles } from "lucide-react";
import { Tag } from "@/components/common/Tag";
import { SmartImage } from "@/components/common/SmartImage";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card-base overflow-hidden flex flex-col">
      <SmartImage
        src={project.image}
        alt={project.imageAlt}
        label={`${project.title.toUpperCase()} / IMAGE PENDING`}
      />

      <div className="p-6 md:p-8 flex flex-col gap-5 grow">
        <div>
          <p className="telemetry-accent">{project.dates}</p>
          <h3 className="mt-2 text-2xl font-bold">{project.title}</h3>
          <p className="mt-1 text-muted text-sm">{project.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <ul className="space-y-3 grow">
          {project.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed text-white/80"
            >
              <span className="text-accent mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {project.callout && (
          <div className="border-l-2 border-accent pl-4 py-1 flex items-start gap-2">
            <Sparkles size={14} className="text-accent shrink-0 mt-1" />
            <p className="text-sm text-white/90">{project.callout}</p>
          </div>
        )}

        {project.links && project.links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                {l.label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
