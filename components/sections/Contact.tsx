import { GitHub, LinkedIn, Scholar } from "@/components/icons/Icons";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section
      className="contact-section"
      id="contact"
      data-scroll-section
      data-scroll-label="CONTACT"
    >
      <div className="reading-column">
        <p className="section-kicker" data-reveal>Contact</p>
        <h2 data-reveal>Let&apos;s talk.</h2>

        <a className="contact-email" href={`mailto:${site.email}`} data-reveal>
          {site.email} ↗
        </a>

        <div className="contact-links" data-reveal>
          <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
            <GitHub />
            <span>GitHub</span>
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedIn />
            <span>LinkedIn</span>
          </a>
          <a href={site.socials.scholar} target="_blank" rel="noopener noreferrer">
            <Scholar />
            <span>Scholar</span>
          </a>
          <a
            href={site.socials.columbiaEngineering}
            target="_blank"
            rel="noopener noreferrer"
          >
            Columbia
          </a>
        </div>
      </div>
    </section>
  );
}
