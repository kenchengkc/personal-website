import { ArrowUpRight, GitHub, LinkedIn, Scholar } from "@/components/icons/Icons";
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
        <h2 className="section-kicker" data-reveal>Contact</h2>

        <p className="contact-interest" data-reveal>
          Seeking software engineering, quantitative development, and machine
          learning research internships.
        </p>

        <a className="contact-email" href={`mailto:${site.email}`} data-reveal>
          {site.email}<ArrowUpRight />
        </a>

        <div className="contact-links" data-reveal>
          <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
            <GitHub />
            <span>GitHub</span>
            <ArrowUpRight />
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedIn />
            <span>LinkedIn</span>
            <ArrowUpRight />
          </a>
          <a href={site.socials.scholar} target="_blank" rel="noopener noreferrer">
            <Scholar />
            <span>Scholar</span>
            <ArrowUpRight />
          </a>
          <a
            href={site.socials.columbiaEngineering}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Columbia</span>
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}
