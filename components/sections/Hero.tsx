"use client";

import Image from "next/image";
import { MouseEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { School } from "lucide-react";
import {
  Arrow,
  Download,
  GitHub,
  LinkedIn,
  Mail,
  Scholar,
} from "@/components/icons/Icons";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { site } from "@/lib/site";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function updateHeroParallax() {
      const hero = heroRef.current;

      if (!hero) {
        return;
      }

      // Parallax: how far the hero has scrolled up past the viewport top.
      // CSS layers multiply this by their own (small) factor so the backdrop
      // drifts slower than the copy and the wordmark lifts gently.
      const scrolled = Math.max(0, -hero.getBoundingClientRect().top);
      hero.style.setProperty("--hero-shift", String(scrolled));
    }

    updateHeroParallax();
    window.addEventListener("scroll", updateHeroParallax, { passive: true });
    window.addEventListener("resize", updateHeroParallax);

    return () => {
      window.removeEventListener("scroll", updateHeroParallax);
      window.removeEventListener("resize", updateHeroParallax);
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
          <span className="v2-eyebrow-dot" />
          Available for Summer 2027 internships
        </div>

        <ScrollReveal as="h1" className="v2-hero-title" delay={0.05} y={20}>
          Hi, I&rsquo;m Ken{" "}
          <span className="v2-hero-dash" aria-hidden>
            &mdash;
          </span>
          <br />I build{" "}
          <em className="v2-hero-accent-word">rigorous</em>{" "}
          systems for <br />
          machine learning and quant.
        </ScrollReveal>

        <ScrollReveal as="p" className="v2-hero-sub" delay={0.09} y={22}>
          CS undergrad at <strong>Columbia</strong> (Egleston Scholar,{" "}
          <strong>top 1% of class</strong>, GPA 3.8).{" "}
          <strong>IEEE-published</strong> in deep learning,{" "}
          <strong>USACO Platinum perfect score</strong>, and currently a{" "}
          <strong>Software Development Engineer intern at Amazon</strong>.
          Fluent in <strong>Python and C++</strong>; love tough puzzles.
        </ScrollReveal>

        <ScrollReveal className="v2-hero-actions" delay={0.13} y={20}>
          <button
            className="v2-btn v2-btn--primary"
            onClick={scrollTo("projects")}
          >
            See my work <Arrow />
          </button>
          <a
            className="v2-btn v2-btn--ghost v2-btn-resume"
            href={site.resumePath}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download /> Download resume
          </a>
        </ScrollReveal>

        <div className="v2-hero-meta">
          <ScrollReveal as="span" delay={0.15} variant="panel" y={18}>
            <em>Columbia University</em>
            <b>B.S. Computer Science</b>
            <small>Statistics minor · GPA 3.8 · Expected May 2028</small>
          </ScrollReveal>
          <ScrollReveal as="span" delay={0.19} variant="panel" y={18}>
            <em>Coursework</em>
            <b>
              Data Structures and Algorithms · Artificial Intelligence · Advanced
              Programming in C
            </b>
            <small>
              Linear Algebra · Probability Theory · Linear Regression ·
              Multivariable Calculus
            </small>
          </ScrollReveal>
          <ScrollReveal as="span" delay={0.23} variant="panel" y={18}>
            <em>Based in</em>
            <b>{site.location}</b>
            <small>
              Open to internships, research, and builder teams, including roles
              outside the New York area.
            </small>
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal className="v2-hero-socials" delay={0.2} y={16}>
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
        <Link
          href={site.socials.columbiaEngineering}
          className="v2-social"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Columbia Engineering profile, Egleston Scholar"
        >
          <School size={16} strokeWidth={2} aria-hidden /> Columbia SEAS
        </Link>
        <a
          href={`mailto:${site.email}`}
          className="v2-social"
          aria-label="Email"
        >
          <Mail /> {site.email}
        </a>
      </ScrollReveal>

      <ScrollReveal className="v2-hero-wordmark" delay={0.24} variant="fade">
        <Image
          src="/images/logonamecolorbold.png"
          alt="Ken Cheng"
          width={1536}
          height={1024}
          className="v2-hero-wordmark-img"
          sizes="(max-width: 720px) 96vw, 1120px"
        />
      </ScrollReveal>
    </section>
  );
}
