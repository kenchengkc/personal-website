import { ExternalLink, Trophy } from "lucide-react";
import { Tag } from "@/components/common/Tag";
import { SmartImage } from "@/components/common/SmartImage";
import type { Experience } from "@/content/experience";

export function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <article className="card-base overflow-hidden">
      <SmartImage src={exp.image} alt={exp.imageAlt} label={`${exp.org.toUpperCase()} / IMAGE PENDING`} />

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div>
            <p className="telemetry-accent">{exp.dates}</p>
            <h3 className="mt-2 text-2xl md:text-3xl font-bold">{exp.role}</h3>
            <p className="mt-1 text-muted">
              {exp.org} · {exp.location}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {exp.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <ul className="mt-6 space-y-3">
          {exp.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed text-white/80"
            >
              <span className="text-accent mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {exp.awards && exp.awards.length > 0 && (
          <div className="mt-6 border-t border-[var(--color-border)] pt-5">
            <p className="telemetry mb-3">PODIUM</p>
            <ul className="space-y-2">
              {exp.awards.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2 text-sm text-white/90"
                >
                  <Trophy size={14} className="text-accent shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {exp.links && exp.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {exp.links.map((l) => (
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
