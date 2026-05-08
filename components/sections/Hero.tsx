"use client";

import { MouseEvent, useEffect, useRef } from "react";
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
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function updateHeroCar() {
      const hero = heroRef.current;
      const track = hero?.querySelector<HTMLElement>(".v2-hero-track");
      const car = hero?.querySelector<SVGSVGElement>(".v2-hero-track-car");

      if (!hero || !track || !car) {
        return;
      }

      const rect = hero.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(340, window.innerHeight * 0.8)),
      );
      const carWidth = car.getBoundingClientRect().width;
      const travel = Math.max(0, track.clientWidth - carWidth - 56);

      hero.style.setProperty("--hero-car-x", `${-travel * progress}px`);
      hero.style.setProperty(
        "--hero-wheel-state",
        progress > 0 && progress < 1 ? "running" : "paused",
      );
    }

    updateHeroCar();
    window.addEventListener("scroll", updateHeroCar, { passive: true });
    window.addEventListener("resize", updateHeroCar);

    return () => {
      window.removeEventListener("scroll", updateHeroCar);
      window.removeEventListener("resize", updateHeroCar);
    };
  }, []);

  function scrollTo(id: string) {
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
  }

  return (
    <section className="v2-hero" id="home" ref={heroRef}>
      <div className="v2-hero-bg" aria-hidden />

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
          <em style={{ color: "var(--color-accent-text)" }}>fast</em> systems for{" "}
          <br />
          machine learning &amp; quant.
        </h1>

        <p className="v2-hero-sub">
          CS undergrad at <strong>Columbia</strong> (Egleston Scholar,{" "}
          <strong>top 1% of class</strong>, GPA 3.7).{" "}
          <strong>IEEE-published</strong> in deep learning,{" "}
          <strong>USACO Platinum perfect score</strong>, and currently
          shipping an options analytics platform that models implied
          volatility across <strong>a billion records</strong>. Fluent in{" "}
          <strong>Python and C++</strong>; love tough puzzles.
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
          <span className="v2-mono v2-mono--accent">CURRENT FOCUS</span>
          <span
            className="v2-pill"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent-text)",
            }}
          >
            ● ACTIVE
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
