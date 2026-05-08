"use client";

import { MouseEvent } from "react";
import Link from "next/link";
import {
  Arrow,
  Download,
  GitHub,
  LinkedIn,
  Mail,
  Scholar,
} from "@/components/icons/Icons";
import { CarSilhouette } from "@/components/cars/CarSilhouette";
import { site } from "@/lib/site";

export function Hero() {
  function scrollTo(id: string) {
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
  }

  return (
    <section className="v2-hero" id="home">
      <div className="v2-hero-bg" aria-hidden>
        <CarSilhouette fill="var(--color-text)" />
      </div>

      <div className="v2-hero-copy">
        <div className="v2-eyebrow">
          <span
            className="v2-eyebrow-dot"
            style={{ background: "var(--color-accent)" }}
          />
          Available for Summer 2027 internships
        </div>

        <h1 className="v2-hero-title">
          Hi, I&rsquo;m Ken - <br />
          I build{" "}
          <em style={{ color: "var(--color-accent)" }}>fast</em> systems for{" "}
          <br />
          machine learning &amp; quant.
        </h1>

        <p className="v2-hero-sub">
          CS undergrad at Columbia (Egleston Scholar, top 1% of class, GPA
          3.7). IEEE-published in deep learning, USACO Platinum perfect
          score, and currently shipping an options analytics platform that
          models implied volatility across a billion records. Fluent in
          Python and C++; love tough puzzles.
        </p>

        <div className="v2-hero-actions">
          <button
            className="v2-btn v2-btn--primary"
            onClick={scrollTo("projects")}
          >
            See my work <Arrow />
          </button>
          <a
            className="v2-btn v2-btn--ghost"
            href={site.resumePath}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download /> Download résumé
          </a>
        </div>

        <div className="v2-hero-meta">
          <span>
            <b>Columbia University</b> · B.S. Computer Science · Stats minor
            · GPA 3.7 · Expected May 2028
          </span>
          <span>
            Coursework: DSA, Linear Algebra, Probability Theory, Linear
            Regression, Multivariable Calculus
          </span>
          <span>{site.location}</span>
        </div>
      </div>

      <div className="v2-hero-track" aria-hidden>
        <div className="v2-hero-track-tags">
          <span className="v2-mono v2-mono--accent">NOW DRIVING</span>
          <span
            className="v2-pill"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
          >
            ● LIVE
          </span>
        </div>
        <div className="v2-hero-track-line" />
        <CarSilhouette
          className="v2-hero-track-car"
          fill="var(--color-text)"
        />
      </div>

      <dl className="v2-hero-spec">
        <div className="v2-hero-spec-row">
          <dt className="v2-mono">CURRENT</dt>
          <dd>Quantiv - options ML platform</dd>
        </div>
        <div className="v2-hero-spec-row">
          <dt className="v2-mono">STACK</dt>
          <dd>Next.js · FastAPI · DuckDB · XGBoost</dd>
        </div>
        <div className="v2-hero-spec-row">
          <dt className="v2-mono">PACE</dt>
          <dd>1B+ records · 100ms p95</dd>
        </div>
      </dl>

      <div className="v2-hero-socials">
        <Link
          href={site.socials.github}
          className="v2-social"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GitHub /> github.com/kenchengkc
        </Link>
        <Link
          href={site.socials.linkedin}
          className="v2-social"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedIn /> linkedin.com/in/kenchengkc
        </Link>
        <Link
          href={site.socials.scholar}
          className="v2-social"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google Scholar"
        >
          <Scholar /> scholar.google.com/Ken Cheng
        </Link>
        <a
          href={`mailto:${site.email}`}
          className="v2-social"
          aria-label="Email"
        >
          <Mail /> {site.email}
        </a>
      </div>
    </section>
  );
}
