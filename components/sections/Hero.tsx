import Link from "next/link";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy" data-reveal>
        <p className="eyebrow">Computer Science, Columbia University</p>

        <h1>
          I build systems for{" "}
          <span>machine learning, quant, and infrastructure.</span>
        </h1>

        <p className="hero-summary">
          Previously Amazon SCOT. Building Quantiv and FDRE.
        </p>

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
      </div>

      <div className="hero-proof" data-reveal>
        <span>Egleston Scholar</span>
        <span>IEEE published</span>
        <span>USACO Platinum</span>
        <span>New York</span>
      </div>

      <a className="scroll-cue" href="#work">
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
