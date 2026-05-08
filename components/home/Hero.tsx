import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Download,
  Mail,
} from "lucide-react";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative">
      <p className="telemetry-accent">GRID POSITION 01 · DRIVER PROFILE</p>

      <h1 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95]">
        KEN
        <br />
        <span className="relative inline-block">
          CHENG
          <span className="absolute -bottom-2 left-0 h-2 w-full bg-accent" />
        </span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg md:text-xl text-muted leading-relaxed">
        CS undergrad at <span className="text-white">Columbia University</span>{" "}
        (Egleston Scholar, Top 1% of Class). I build at the intersection of
        machine learning, quantitative finance, and systems engineering.
        IEEE-published, USACO Platinum, hackathon winner. Off-hours: F1.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/projects" className="btn btn-primary">
          VIEW PROJECTS <ArrowRight size={14} />
        </Link>
        <Link href="/experience" className="btn">
          EXPERIENCE
        </Link>
        <a
          href={site.resumePath}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          <Download size={14} /> RESUME
        </a>
      </div>

      <div className="mt-8 flex items-center gap-4 text-muted">
        <a
          href={site.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-accent transition-colors"
        >
          <Code2 size={18} />
        </a>
        <a
          href={site.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-accent transition-colors"
        >
          <BriefcaseBusiness size={18} />
        </a>
        <a
          href={`mailto:${site.email}`}
          aria-label="Email"
          className="hover:text-accent transition-colors"
        >
          <Mail size={18} />
        </a>
        <span className="telemetry ml-2">{site.location.toUpperCase()}</span>
      </div>
    </section>
  );
}
