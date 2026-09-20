import Link from "next/link";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-meta" data-reveal>
        <div>
          <span className="availability-dot" aria-hidden="true" />
          <span>Available Summer 2027</span>
        </div>
        <span>Columbia CS · New York</span>
        <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
      </div>

      <div className="hero-copy" data-reveal>
        <p className="eyebrow">Ken Cheng</p>
        <h1>
          I build rigorous systems for machine learning, quant, and infrastructure.
        </h1>
        <p className="hero-summary">
          Previously Amazon SCOT. Building Quantiv and FDRE.
        </p>
      </div>

      <div className="hero-bottom" data-reveal>
        <div className="hero-actions">
          <Link href="#work" className="text-link text-link-primary">
            Selected work <span aria-hidden="true">↓</span>
          </Link>
          <a
            href={site.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Resume <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="hero-proof">
          <span>Egleston Scholar</span>
          <span>IEEE published</span>
          <span>USACO Platinum</span>
        </div>
      </div>
    </section>
  );
}
