import Image from "next/image";
import { BinaryRainArtwork } from "@/components/hero/BinaryRainArtwork";
import { ArrowUpRight, GitHub, LinkedIn, Resume, Scholar } from "@/components/icons/Icons";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      className="hero"
      id="home"
      data-scroll-section
      data-scroll-label="INTRO"
    >
      <div className="hero-identity">
        <Image
          src="/images/profile-photo.jpg"
          alt="Ken Cheng"
          width={192}
          height={192}
          className="hero-avatar"
          priority
        />
        <strong>Ken Cheng</strong>
        <span>Columbia Computer Science · Class of 2028</span>
      </div>

      <div className="scroll-prompt">
        <span>SCROLL</span>
        <i />
      </div>

      <div className="hero-copy">
        <h1>Software engineering and machine learning research.</h1>
        <p>
          I build earnings forecasts and financial search systems, and study
          deceptive communication in language models at Columbia’s Creative
          Machines Lab.
        </p>
        <div className="hero-proof" aria-label="Selected credentials">
          <span>Former Amazon Software Development Engineer Intern</span>
          <i />
          <span>IEEE Sole Author</span>
          <i />
          <span className="hero-platinum">USACO Platinum · 1000/1000 Gold</span>
        </div>
      </div>

      <div className="hero-links" aria-label="Profile links">
        <a href={site.resumePath} target="_blank" rel="noopener noreferrer">
          <Resume />
          <span>Resume</span>
          <ArrowUpRight />
        </a>
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
          <span>Google Scholar</span>
          <ArrowUpRight />
        </a>
      </div>

      <BinaryRainArtwork />
    </section>
  );
}
