import { BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata = {
  title: "Contact - Ken Cheng",
};

export default function ContactPage() {
  return (
    <>
      <SectionHeader
        lap={5}
        sector={1}
        title="Contact"
        subtitle="Open radio for recruiting, collaboration, research, and engineering conversations."
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <ContactForm />

        <aside className="grid content-start gap-4">
          <div className="card-base p-6">
            <p className="telemetry-accent">RADIO CHANNELS</p>
            <div className="mt-5 grid gap-3">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 border-b border-[var(--color-border)] py-3 text-sm text-white/80 transition-colors hover:text-accent"
              >
                <Mail size={16} className="shrink-0" />
                {site.email}
              </a>
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border-b border-[var(--color-border)] py-3 text-sm text-white/80 transition-colors hover:text-accent"
              >
                <Code2 size={16} className="shrink-0" />
                github.com/kenchengkc
              </a>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-3 text-sm text-white/80 transition-colors hover:text-accent"
              >
                <BriefcaseBusiness size={16} className="shrink-0" />
                linkedin.com/in/kenchengkc
              </a>
            </div>
          </div>

          <div className="card-base p-6">
            <p className="telemetry-accent">BASE</p>
            <p className="mt-3 text-2xl font-bold">{site.location}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Columbia CS, ML systems, quantitative finance, and production
              tooling.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
