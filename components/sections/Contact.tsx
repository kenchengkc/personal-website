import { LinkIcon } from "@/components/ui/LinkIcon";
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

        <a className="contact-email icon-link" href={`mailto:${site.email}`} data-reveal>
          <LinkIcon name="mail" />
          <span>{site.email} ↗</span>
        </a>

        <div className="contact-links" data-reveal>
          <a className="icon-link" href={site.socials.github} target="_blank" rel="noopener noreferrer">
            <LinkIcon name="github" />
            <span>GitHub</span>
          </a>
          <a className="icon-link" href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkIcon name="linkedin" />
            <span>LinkedIn</span>
          </a>
          <a className="icon-link" href={site.socials.scholar} target="_blank" rel="noopener noreferrer">
            <LinkIcon name="scholar" />
            <span>Scholar</span>
          </a>
          <a
            className="icon-link"
            href={site.socials.columbiaEngineering}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon name="columbia" />
            <span>Columbia</span>
          </a>
        </div>
      </div>
    </section>
  );
}
