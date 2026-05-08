"use client";

import { MouseEvent } from "react";
import Link from "next/link";
import { Arrow, Download, GitHub, LinkedIn, Mail } from "@/components/icons/Icons";
import { RacingCar } from "@/components/cars/RacingCar";
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
      <div className="v2-hero-grid">
        <div className="v2-hero-copy">
          <div className="v2-eyebrow">
            <span
              className="v2-eyebrow-dot"
              style={{ background: "var(--color-accent)" }}
            />
            Available for Summer 2027 internships
          </div>

          <h1 className="v2-hero-title">
            Hi, I&rsquo;m Ken — <br />
            I build{" "}
            <em style={{ color: "var(--color-accent)" }}>fast</em> systems for{" "}
            <br />
            machine learning &amp; quant.
          </h1>

          <p className="v2-hero-sub">
            CS undergrad at Columbia (Egleston Scholar, top 1% of class).
            IEEE-published in deep learning, USACO Platinum, and currently
            shipping an options analytics platform that processes a billion
            records.
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
              <b>Columbia University</b> · B.S. Computer Science · Stats minor ·
              Expected May 2028
            </span>
            <span>{site.location}</span>
          </div>
        </div>

        <div className="v2-hero-visual">
          <div className="v2-hero-card">
            <div className="v2-hero-card-head">
              <span className="v2-mono">Now driving</span>
              <span
                className="v2-pill"
                style={{
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                }}
              >
                ● Live
              </span>
            </div>
            <div className="v2-hero-car-wrap">
              <RacingCar livery="red" />
            </div>
            <div className="v2-hero-card-rows">
              <div className="v2-hero-card-row">
                <span>Currently</span>
                <b>Quantiv — options ML platform</b>
              </div>
              <div className="v2-hero-card-row">
                <span>Stack</span>
                <b>Next.js · FastAPI · DuckDB · XGBoost</b>
              </div>
              <div className="v2-hero-card-row">
                <span>Pace</span>
                <b>1B+ records · 100ms p95</b>
              </div>
            </div>
          </div>
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
            <a
              href={`mailto:${site.email}`}
              className="v2-social"
              aria-label="Email"
            >
              <Mail /> {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
