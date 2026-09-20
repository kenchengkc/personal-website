import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      className="hero"
      id="home"
      data-scroll-section
      data-scroll-label="INTRO"
    >
      <div className="hero-identity" data-reveal>
        <div className="hero-avatar" aria-hidden="true">KC</div>
        <strong>Ken Cheng</strong>
        <span>Computer Science · Columbia University · New York</span>
      </div>

      <div className="scroll-prompt" data-reveal>
        <span>SCROLL</span>
        <i />
      </div>

      <div className="hero-copy" data-reveal>
        <h1>Software, machine learning, and quantitative systems.</h1>
        <p>
          I build products and infrastructure where models, data, and
          engineering all have to work together.
        </p>
      </div>

      <div className="hero-links" data-reveal>
        <a href={site.resumePath} target="_blank" rel="noopener noreferrer">
          Resume ↗
        </a>
        <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
      </div>
    </section>
  );
}
