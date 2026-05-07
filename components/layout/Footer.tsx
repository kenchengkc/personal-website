import { BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="telemetry-accent">END OF RACE</p>
          <p className="mt-2 font-mono text-sm">
            © {new Date().getFullYear()} {site.name} · Built with Next.js
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            aria-label="GitHub"
          >
            <Code2 size={14} /> GITHUB
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            aria-label="LinkedIn"
          >
            <BriefcaseBusiness size={14} /> LINKEDIN
          </a>
          <a
            href={`mailto:${site.email}`}
            className="btn"
            aria-label="Email"
          >
            <Mail size={14} /> EMAIL
          </a>
        </div>
      </div>
    </footer>
  );
}
