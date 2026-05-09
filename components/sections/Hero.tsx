"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
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
  /** Must live in React state so re-renders don't reset data-wheel-spin from JSX. */
  const [wheelSpin, setWheelSpin] = useState(false);
  const [wheelSpinDir, setWheelSpinDir] = useState<"forward" | "reverse">(
    "forward",
  );
  const lastProgressRef = useRef(0);
  const spinDirRef = useRef<"forward" | "reverse">("forward");

  useEffect(() => {
    function updateHeroCar() {
      const hero = heroRef.current;
      const track = hero?.querySelector<HTMLElement>(".v2-hero-track");
      const car = hero?.querySelector<HTMLElement>(".v2-hero-track-car");

      if (!hero || !track || !car) {
        return;
      }

      const rect = hero.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(340, window.innerHeight * 0.8)),
      );
      /** Spin for the whole horizontal run: after first movement until the car reaches the far side (scroll up or down). */
      const inMotion = progress > 0 && progress < 1;
      setWheelSpin(inMotion);

      if (inMotion) {
        const prev = lastProgressRef.current;
        if (progress > prev && spinDirRef.current !== "forward") {
          spinDirRef.current = "forward";
          setWheelSpinDir("forward");
        } else if (progress < prev && spinDirRef.current !== "reverse") {
          spinDirRef.current = "reverse";
          setWheelSpinDir("reverse");
        }
      }
      lastProgressRef.current = progress;

      const carWidth = car.getBoundingClientRect().width;
      const travel = Math.max(0, track.clientWidth - carWidth - 56);

      hero.style.setProperty("--hero-car-x", `${-travel * progress}px`);
      hero.style.setProperty(
        "--hero-wheel-state",
        inMotion ? "running" : "paused",
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
    <section
      className="v2-hero"
      id="home"
      ref={heroRef}
      data-wheel-spin={wheelSpin ? "1" : "0"}
      data-wheel-spin-dir={wheelSpinDir}
    >
      <div className="v2-hero-bg" aria-hidden />

      <div className="v2-hero-copy">
        <div className="v2-eyebrow">
          <span className="v2-eyebrow-dot" />
          Available for Summer 2027 internships
        </div>

        <h1 className="v2-hero-title">
          Hi, I&rsquo;m Ken - <br />
          I build{" "}
          <em style={{ color: "var(--color-accent-text)" }}>rigorous</em>{" "}
          systems for <br />
          machine learning and quant.
        </h1>

        <p className="v2-hero-sub">
          CS undergrad at <strong>Columbia</strong> (Egleston Scholar,{" "}
          <strong>top 1% of class</strong>, GPA 3.7).{" "}
          <strong>IEEE-published</strong> in deep learning,{" "}
          <strong>USACO Platinum perfect score</strong>, and currently
          shipping <strong>Quantiv</strong>: options-implied earnings analytics
          and LightGBM forecasts over <strong>billion-row</strong> chain and
          vol history. Fluent in{" "}
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
            <em>Columbia University</em>
            <b>B.S. Computer Science</b>
            <small>Statistics minor · GPA 3.7 · Expected May 2028</small>
          </span>
          <span>
            <em>Coursework</em>
            <b>
              Data Structures and Algorithms · Artificial Intelligence · Advanced
              Programming in C
            </b>
            <small>
              Linear Algebra · Probability Theory · Linear Regression ·
              Multivariable Calculus
            </small>
          </span>
          <span>
            <em>Based in</em>
            <b>{site.location}</b>
            <small>Open to internships, research, and builder teams</small>
          </span>
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
        <div className="v2-hero-track-streaks">
          <span className="v2-streak v2-streak--1" />
          <span className="v2-streak v2-streak--2" />
          <span className="v2-streak v2-streak--3" />
          <span className="v2-streak v2-streak--4" />
          <span className="v2-streak v2-streak--5" />
        </div>
        <CarSilhouette
          className="v2-hero-track-car"
          fill="var(--color-text)"
        />
        <div className="v2-hero-track-ground" />
      </div>

      <dl className="v2-hero-spec">
        <div className="v2-hero-spec-row">
          <dt className="v2-mono">CURRENT</dt>
          <dd>Quantiv · earnings expected-move analytics</dd>
        </div>
        <div className="v2-hero-spec-row">
          <dt className="v2-mono">STACK</dt>
          <dd>Next.js · FastAPI · DuckDB · LightGBM</dd>
        </div>
        <div className="v2-hero-spec-row">
          <dt className="v2-mono">DATA</dt>
          <dd>1B+ records · daily refresh</dd>
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
          aria-label="LinkedIn profile"
        >
          <LinkedIn /> /in/kenchengkc
        </Link>
        <Link
          href={site.socials.scholar}
          className="v2-social"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google Scholar - Ken Cheng"
        >
          <Scholar /> Google Scholar · Ken Cheng
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
