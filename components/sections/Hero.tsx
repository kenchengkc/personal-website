import Link from "next/link";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-top" data-reveal>
        <span>Columbia Computer Science</span>
        <span>New York</span>
      </div>

      <div className="hero-copy" data-reveal>
        <h1>Software, machine learning, and quantitative systems.</h1>
        <p>
          Previously Amazon SCOT. Building Quantiv and FDRE.
        </p>
      </div>

      <div className="hero-bottom" data-reveal>
        <div className="hero-actions">
          <Link href="#work">Selected work ↓</Link>
          <a href={site.resumePath} target="_blank" rel="noopener noreferrer">
            Resume ↗
          </a>
        </div>

        <p className="hero-proof">
          Egleston Scholar · IEEE published · USACO Platinum · Available Summer 2027
        </p>
      </div>
    </section>
  );
}
