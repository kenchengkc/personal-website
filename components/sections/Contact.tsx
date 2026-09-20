import { site } from "@/lib/site";

export function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div data-reveal>
        <span className="section-number">05</span>
        <h2>Contact</h2>
        <a className="contact-email" href={`mailto:${site.email}`}>
          {site.email}
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="contact-links" data-reveal>
        <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={site.socials.scholar} target="_blank" rel="noopener noreferrer">
          Scholar
        </a>
        <a
          href={site.socials.columbiaEngineering}
          target="_blank"
          rel="noopener noreferrer"
        >
          Columbia
        </a>
      </div>
    </section>
  );
}
