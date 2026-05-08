"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionHead } from "./SectionHead";
import { CarTopDown } from "@/components/cars/CarTopDown";

type Stint = {
  role: string;
  org: string;
  loc: string;
  dates: string;
  summary: string;
  bullets: string[];
  tags: string[];
  links?: { label: string; href: string }[];
  logo?: {
    src: string;
    alt: string;
    variant?: "wide" | "square";
    tone?: "dark" | "light";
  };
};

const items: Stint[] = [
  {
    role: "Founder & Builder",
    org: "Quantiv",
    loc: "New York, NY",
    dates: "Jul 2025 - Present",
    summary:
      "Founded a platform for earnings-move research, volatility modeling, and option-chain analytics.",
    bullets: [
      "Own product, data infrastructure, ML workflow, and frontend end to end.",
      "Turned a personal quant research stack into a reusable, production-grade platform.",
    ],
    tags: ["Founder", "Product", "ML", "Data Infra", "Options"],
    logo: {
      src: "/images/quantiv/quantiv-color-banner.png",
      alt: "Quantiv logo",
      variant: "wide",
      tone: "dark",
    },
  },
  {
    role: "Machine Learning Lead - Hackathon Winner",
    org: "Embers · LA Hacks",
    loc: "UCLA",
    dates: "Apr 2025",
    summary:
      "Led a 4-person team building a CV app for wildfire insurance claims; auto-inventories items from a 30-second video.",
    bullets: [
      "Top 5 of 172 teams · Best Use of Google Gemini API · Best FinTech Project.",
      "90%+ detection accuracy; voice-first chatbot via Gemini, ElevenLabs, OpenAI Whisper.",
    ],
    tags: ["React", "Flask", "Python", "Supabase"],
    links: [
      {
        label: "Devpost: InsureFire",
        href: "https://devpost.com/software/insurefire",
      },
    ],
    logo: {
      src: "/images/embers/la-hacks-2025.png",
      alt: "LA Hacks 2025 logo",
      variant: "wide",
      tone: "dark",
    },
  },
  {
    role: "Independent Researcher - IEEE Intelligent Transportation Systems Conference 2023",
    org: "GC-INF Traffic Forecasting",
    loc: "Pre-Columbia · High school research",
    dates: "Sep 2022 - Oct 2023",
    summary:
      "Built GC-INF independently in high school and published it single-author in IEEE ITSC 2023.",
    bullets: [
      "Session chair for Simulation and Control at the conference in Bilbao.",
      "ISEF Top 30 finalist recognition for the broader research track.",
    ],
    tags: ["IEEE ITSC", "Single Author", "High School Research"],
    logo: {
      src: "/images/gc-inf/ieee-itsc-2023.jpg",
      alt: "IEEE ITSC 2023 Bilbao logo",
    },
  },
  {
    role: "Vehicle Routing Research Assistant",
    org: "UF ISE · Center for Applied Optimization",
    loc: "Gainesville, FL",
    dates: "Jun - Jul 2023",
    summary:
      "Accelerated a C++ Capacitated VRP solver with ML and data-mining heuristics.",
    bullets: [
      "Cut compute time 15% on TB-scale routing datasets.",
      "Scaled out on the 34k-core UF HiPerGator cluster via SLURM batch jobs.",
      "Shipped a JavaFX visualization tool for the OR research group.",
    ],
    tags: ["UF ISE", "CAO", "C++", "SLURM", "JavaFX"],
    logo: {
      src: "/images/vrp/uf-ise.jpg",
      alt: "UF ISE logo",
    },
  },
];

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <section className="v2-section" id="experience">
      <SectionHead
        eyebrow="Experience"
        title="Where I've worked"
        sub="Roles, research venues, and builders I have been part of."
      />

      <div className="v2-work">
        <div
          className="v2-work-list v2-exp-tablist"
          aria-label="Experience selector"
        >
          {items.map((it, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={it.org}
                type="button"
                className={`v2-work-tab v2-exp-tab ${
                  isActive ? "v2-work-tab--active" : ""
                }`}
                onClick={() => setActiveIndex(i)}
                aria-pressed={isActive}
              >
                <span className="v2-exp-tab-marker" aria-hidden>
                  {isActive ? (
                    <span className="v2-exp-tab-car">
                      <CarTopDown fill="var(--color-accent)" />
                    </span>
                  ) : (
                    <span className="v2-exp-tab-dot" />
                  )}
                </span>
                <span className="v2-work-tab-copy">
                  <span className="v2-work-tab-title">{it.role}</span>
                  <span className="v2-work-tab-sub">{it.org}</span>
                </span>
                <span className="v2-work-tab-date">{it.dates}</span>
              </button>
            );
          })}
        </div>

        <article className="v2-work-panel" key={active.org}>
          <div className="v2-work-panel-head">
            <div>
              <p className="v2-mono v2-mono--accent">{active.loc}</p>
              <h3 className="v2-work-title">{active.role}</h3>
              <p
                className="v2-mono"
                style={{ marginTop: 6, color: "var(--color-text-dim)" }}
              >
                {active.org}
              </p>
            </div>
            <div className="v2-work-panel-aside">
              {active.logo && (
                <Image
                  src={active.logo.src}
                  alt={active.logo.alt}
                  width={128}
                  height={128}
                  className={`v2-exp-logo ${
                    active.logo.variant === "wide" ? "v2-exp-logo--wide" : ""
                  } ${
                    active.logo.tone === "dark" ? "v2-exp-logo--dark" : ""
                  }`}
                />
              )}
              <span className="v2-work-date">{active.dates}</span>
            </div>
          </div>

          <p className="v2-work-summary">{active.summary}</p>

          <ul className="v2-exp-bullets">
            {active.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <div className="v2-chips">
            {active.tags.map((t) => (
              <span key={t} className="v2-chip">
                {t}
              </span>
            ))}
          </div>

          {active.links && active.links.length > 0 && (
            <div className="v2-work-links">
              {active.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v2-proj-link"
                >
                  {link.label} →
                </a>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
