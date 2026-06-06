import { SectionHead } from "./SectionHead";
import { ContactForm } from "@/components/contact/ContactForm";
import { School } from "lucide-react";
import { ArrowUpRight, GitHub, LinkedIn, Scholar } from "@/components/icons/Icons";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section className="v2-section" id="contact">
      <SectionHead
        eyebrow="Contact"
        title="Let's talk"
        sub="Open to internships, collaboration, or a quick coffee chat."
      />
      <div className="v2-contact">
        <ScrollReveal variant="panel">
          <ContactForm />
        </ScrollReveal>
        <aside className="v2-contact-side">
          <ScrollReveal
            as="a"
            href={`mailto:${site.email}`}
            className="v2-contact-direct"
            delay={0.06}
            variant="panel"
          >
            <span className="v2-mono">Email me directly</span>
            <span className="v2-contact-direct-v">{site.email}</span>
          </ScrollReveal>
          <ScrollReveal className="v2-contact-links" delay={0.1} variant="panel">
            <a
              href={site.socials.github}
              className="v2-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub /> GitHub
              <ArrowUpRight className="v2-contact-link-ext" />
            </a>
            <a
              href={site.socials.linkedin}
              className="v2-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedIn /> LinkedIn
              <ArrowUpRight className="v2-contact-link-ext" />
            </a>
            <a
              href={site.socials.scholar}
              className="v2-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Scholar /> Google Scholar
              <ArrowUpRight className="v2-contact-link-ext" />
            </a>
            <a
              href={site.socials.columbiaEngineering}
              className="v2-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <School size={17} strokeWidth={2} aria-hidden /> Columbia Engineering
              <ArrowUpRight className="v2-contact-link-ext" />
            </a>
          </ScrollReveal>
          <ScrollReveal className="v2-contact-loc" delay={0.14} variant="panel">
            <span className="v2-mono">Based in</span>
            <span className="v2-contact-loc-v">{site.location}</span>
            <span className="v2-mono v2-mono--dim">
              Open to onsite, hybrid, or remote
            </span>
          </ScrollReveal>
        </aside>
      </div>
    </section>
  );
}
