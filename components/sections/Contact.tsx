import { SectionHead } from "./SectionHead";
import { ContactForm } from "@/components/contact/ContactForm";
import { School } from "lucide-react";
import { GitHub, LinkedIn, Scholar } from "@/components/icons/Icons";
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
        <ContactForm />
        <aside className="v2-contact-side">
          <a href={`mailto:${site.email}`} className="v2-contact-direct">
            <span className="v2-mono">Email me directly</span>
            <span className="v2-contact-direct-v">{site.email}</span>
          </a>
          <div className="v2-contact-links">
            <a
              href={site.socials.github}
              className="v2-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub /> GitHub
            </a>
            <a
              href={site.socials.linkedin}
              className="v2-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedIn /> LinkedIn
            </a>
            <a
              href={site.socials.scholar}
              className="v2-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Scholar /> Google Scholar
            </a>
            <a
              href={site.socials.columbiaEngineering}
              className="v2-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <School size={17} strokeWidth={2} aria-hidden /> Columbia Engineering
            </a>
          </div>
          <div className="v2-contact-loc">
            <span className="v2-mono">Based in</span>
            <span className="v2-contact-loc-v">{site.location}</span>
            <span className="v2-mono v2-mono--dim">
              Open to onsite, hybrid, or remote
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
