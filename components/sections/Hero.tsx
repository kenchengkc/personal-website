import Image from "next/image";
import { FileText, Github, Linkedin } from "lucide-react";
import { BinaryRainArtwork } from "@/components/hero/BinaryRainArtwork";
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
        <Image
          src="/images/profile-photo.jpg"
          alt="Ken Cheng"
          width={192}
          height={192}
          className="hero-avatar"
          priority
        />
        <strong>Ken Cheng</strong>
        <span>Columbia CS · Quantiv founder · New York</span>
      </div>

      <div className="scroll-prompt" data-reveal>
        <span>SCROLL</span>
        <i />
      </div>

      <div className="hero-copy" data-reveal>
        <h1>ML systems for markets, forecasting, and financial research.</h1>
        <p>
          I build production systems: expected-move models, SEC retrieval,
          and long-term forecasting infrastructure.
        </p>
        <div className="hero-proof" aria-label="Selected credentials">
          <span>Amazon SCOT SDE intern</span>
          <i />
          <span>IEEE published</span>
          <i />
          <span className="hero-platinum">USACO Platinum · Top 1% nationally</span>
        </div>
      </div>

      <div className="hero-links" data-reveal>
        <a className="icon-link" href={site.resumePath} target="_blank" rel="noopener noreferrer">
          <FileText aria-hidden="true" />
          <span>Resume ↗</span>
        </a>
        <a className="icon-link" href={site.socials.github} target="_blank" rel="noopener noreferrer">
          <Github aria-hidden="true" />
          <span>GitHub ↗</span>
        </a>
        <a className="icon-link" href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin aria-hidden="true" />
          <span>LinkedIn ↗</span>
        </a>
      </div>

      <BinaryRainArtwork />
    </section>
  );
}
