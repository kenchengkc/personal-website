"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Medal } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Arrow } from "@/components/icons/Icons";
import { site } from "@/lib/site";

type ProjectLink = {
  label: string;
  href: string;
  download?: boolean;
};

type ProjectMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type Project = {
  title: string;
  category: string;
  dates: string;
  /** Former “Experience” row merged into this project */
  role?: { title: string; org: string; location: string };
  summary: string;
  impact: string;
  metrics: { value: string; label: string; tone?: "gold" | "platinum" }[];
  award?: { label: string; detail: string };
  brand?: {
    label: string;
    detail: string;
    meta: string;
    logo?: {
      src: string;
      alt: string;
      variant?: "wide" | "square";
      width?: number;
      height?: number;
    };
  };
  tags: string[];
  details: string[];
  links?: ProjectLink[];
  media?: ProjectMedia | ProjectMedia[];
};

const projects: Project[] = [
  {
    title: "Quantiv",
    category: "Earnings · options-implied analytics",
    dates: "Jul 2025 - Present",
    role: {
      title: "Founder and Lead Software Engineer",
      org: "Quantiv · Options-implied earnings analytics",
      location: "New York, NY, USA",
    },
    summary:
      "Founder and lead engineer on Quantiv: an earnings-calendar product for options-implied expected moves; Next.js and TypeScript on the web, Python FastAPI for scoring APIs, LightGBM plus DuckDB over billion-row Parquet at institution scale.",
    impact:
      "Parquet/DuckDB analytics through GBDT forecasts to versioned artifacts and the live client. Daily refreshes and reproducible pipelines matter more than quote latency.",
    brand: {
      label: "Quantiv",
      detail: "Quantiv",
      meta: "usequantiv.com",
      logo: {
        src: "/images/quantiv/quantiv-icon.png",
        alt: "Quantiv app icon",
      },
    },
    metrics: [
      { value: "1B+", label: "option records" },
      { value: "Daily", label: "model & data refresh" },
      { value: "50-100", label: "tickers weekly" },
    ],
    tags: [
      "TypeScript",
      "Next.js",
      "Python",
      "FastAPI",
      "LightGBM",
      "DuckDB",
      "Parquet",
      "Redis",
      "Docker",
      "AWS EC2",
    ],
    details: [
      "Shipped a Next.js + FastAPI product covering ~50–100 liquid names weekly: options-implied baselines plus multi-horizon LightGBM forecasts trained on historical Greeks, IV context, and volatility features.",
      "LightGBM on options-implied baselines: IV surface, straddle-implied moves, Greeks and vol-derived features.",
      "DuckDB over partitioned Parquet for full chain and volatility history; batch scoring writes versioned artifacts for the Next.js client.",
      "Production Docker on AWS EC2 with Redis for caching and sessions; reproducible daily scoring runs and atomic dataset releases instead of optimizing for quote latency.",
      "Cut large-dataset refresh overhead ~90% via atomic directory swaps and rsync staging on EC2 so revised chain snapshots publish without taking the app offline.",
    ],
    links: [{ label: "Visit usequantiv.com", href: site.links.quantiv }],
  },
  {
    title: "Embers",
    category: "LA Hacks · wildfire insurance + computer vision",
    dates: "Apr 2025",
    role: {
      title: "Machine Learning Lead and Winner",
      org: "Google at LA Hacks (University of California - Los Angeles)",
      location: "Los Angeles, CA, USA",
    },
    summary:
      "Embers: a React + Flask pipeline that walks a home with video, runs OpenCV + YOLOv11 detections, and turns them into an insurance-ready inventory with Gemini-grounded valuations and a voice assistant.",
    impact:
      "Top 5 finalist out of 172 teams; Best Use of Google Gemini API and Best Financial Tech Project, shipping a demoable dashboard plus live detection in a weekend.",
    brand: {
      label: "LA Hacks",
      detail: "Google at LA Hacks (UCLA)",
      meta: "172 teams",
      logo: {
        src: "/images/embers/la-hacks-2025.png",
        alt: "LA Hacks 2025 logo",
        variant: "wide",
      },
    },
    award: {
      label: "Gemini API · Best FinTech",
      detail: "LA Hacks 2025",
    },
    metrics: [
      { value: "Top 5", label: "of 172 teams" },
      { value: "90%+", label: "detection accuracy" },
      { value: "3", label: "hackathon awards" },
    ],
    tags: [
      "React",
      "Flask",
      "Python",
      "TypeScript",
      "OpenCV YOLOv11",
      "Google Gemini",
      "Whisper",
      "Supabase",
      "APIs",
    ],
    details: [
      "Led the team building Embers: a React + Flask computer vision app that hit 90%+ detection accuracy auto-inventorying household items from ~30s videos for wildfire insurance claims.",
      "YOLOv11 + OpenCV on walkthrough video to localize objects; crops feed Gemini for consistent labels and dollar estimates; dashboard totals insured value with per-item confidence (Flask + Supabase).",
      "Voice assistant: Whisper plus Gemini and ElevenLabs for hands-free asset valuation; estimated ~50% reduction in manual claim documentation time.",
      "Top 5 finalist out of 172 teams; Best Use of Google Gemini API and Best Financial Tech Project.",
    ],
    links: [
      { label: "Embers on Devpost", href: "https://devpost.com/software/insurefire" },
    ],
    media: [
      {
        src: "/media/embers-inventory-dashboard.png",
        alt: "Embers Your Inventory Results dashboard with total estimated value and grid of YOLO-identified household items",
        width: 1024,
        height: 740,
        caption:
          "Home property dashboard auto-built from detections: Gemini-assisted valuations and itemization on top of the YOLOv11 pipeline.",
      },
      {
        src: "/media/embers-yolo-live-detection.png",
        alt: "Split-screen webcam frames showing YOLO bounding boxes with object class, price, and confidence labels",
        width: 1024,
        height: 518,
        caption:
          "Live capture: OpenCV + YOLOv11 overlays with per-object confidence and estimated values during the walkthrough.",
      },
    ],
  },
  {
    title: "USACO Platinum",
    category: "Competitive programming · USA Computing Olympiad",
    dates: "Dec 2023",
    summary:
      "Qualified for Platinum, the highest division of the United States' informatics olympiad.",
    impact:
      "Perfect 1000 / 1000 in the December 2023 Gold Division contest.",
    award: {
      label: "Gold → Platinum, perfect score",
      detail: "USA Computing Olympiad",
    },
    metrics: [
      { value: "1000 / 1000", label: "Gold Division" },
      { value: "Top 1%", label: "national rank" },
      { value: "Platinum", label: "qualifier", tone: "platinum" },
    ],
    tags: ["C++", "Advanced Data Structures and Algorithms", "gdb"],
    details: [
      "Competition-grade C++ across graphs, DP, segment trees, and computational geometry.",
      "gdb profiling to chase down edge cases under tight memory and runtime budgets.",
      "Platinum is the top of the four-division ladder; Bronze → Silver → Gold → Platinum.",
    ],
  },
  {
    title: "GC-INF",
    category: "Deep learning traffic forecasting",
    dates: "2022 - 2023",
    role: {
      title: "Research Software Engineer, Single-Author Deep Learning Publication",
      org: "IEEE Intelligent Transportation Systems Conference",
      location: "Bilbao, Biscay, Spain",
    },
    summary:
      "Independent research on graph-network traffic forecasting: hybrid Graph ConvNet + Informer for adaptive signal control, published single-author at IEEE ITSC 2023.",
    impact:
      "24% RMSE improvement over the prior state-of-the-art on intersection turning ratios.",
    brand: {
      label: "IEEE",
      detail: "IEEE Intelligent Transportation Systems Conference 2023",
      meta: "Peer-reviewed research venue",
    },
    metrics: [
      { value: "24%", label: "RMSE improvement" },
      { value: "IEEE", label: "published" },
      { value: "1st", label: "single author" },
    ],
    tags: [
      "Python",
      "PyTorch",
      "Scikit-learn",
      "Graph Neural Network",
      "Informer (Transformer variant)",
      "IEEE",
      "Data Pipelines",
    ],
    details: [
      "Engineered GC-INF: a hybrid 4-layer Graph ConvNet + Informer that learns spatial-temporal patterns on road graphs to predict intersection turning ratios for adaptive control, in production-quality PyTorch.",
      "Chebyshev graph convolutions on the road network feed Informer's ProbSparse attention; Adam + cosine decay on raw turning-ratio series.",
      "Cut 15-minute turning-ratio forecast error by 24% RMSE vs STGCN (IJCAI '17).",
      "Single-author paper and session chair for Simulation and Control at IEEE ITSC 2023; Team Canada–ISEF finalist (top 30 Canada).",
    ],
    links: [
      { label: "Read paper", href: site.links.gcinf },
      {
        label: "Chair certificate",
        href: "/credentials/itsc-2023-chair-certificate.pdf",
        download: true,
      },
    ],
    media: {
      src: "/images/gc-inf/ieeeconf.png",
      alt: "Ken Cheng presenting at IEEE ITSC 2023 in Bilbao, Simulation and Control session co-chair",
      width: 960,
      height: 507,
      caption: "IEEE ITSC 2023: research presentation and session chair.",
    },
  },
  {
    title: "Need for Speed",
    category: "F1 aerodynamics surrogate model · CFD + ML",
    dates: "2021 - 2022",
    summary:
      "MATLAB neural-net surrogate that replaces full CFD iteration with sub-second pressure-map predictions.",
    impact:
      "100x faster iteration; 43% drag reduction in simulation; gold at the Canada-Wide Science Fair.",
    brand: {
      label: "CWSF",
      detail: "Canada-Wide Science Fair",
      meta: "National champion · 2022",
      logo: {
        src: "/images/cwsf/cwsf-logo.png",
        alt: "Canada-Wide Science Fair (CWSF / ESPC) logo",
        variant: "wide",
        width: 632,
        height: 200,
      },
    },
    metrics: [
      { value: "100x", label: "CFD iteration" },
      { value: "43%", label: "drag reduction" },
      { value: "Gold", label: "CWSF '22", tone: "gold" },
    ],
    tags: ["MATLAB", "Deep Learning Toolbox", "Feedforward", "trainlm"],
    details: [
      "MATLAB backpropagation feed-forward network trained to generate predicted pressure maps.",
      "Embedded the ANN in an end-to-end aero-analytics stack to drive wing geometry choices.",
      "Single-author publication in Highlights in Science Engineering and Technology.",
    ],
    links: [{ label: "Read paper", href: site.links.f1cfd }],
  },
  {
    title: "CVRP Solver",
    category: "Operations research · UF Center for Applied Optimization",
    dates: "Jun - Jul 2023",
    role: {
      title: "Operations Research and Machine Learning Research Intern",
      org: "University of Florida",
      location: "Gainesville, FL, USA",
    },
    summary:
      "OR + ML research accelerating large-scale Capacitated Vehicle Routing Problem solvers: mined Column Generation patterns to prune branches faster, with SLURM-scale experiments and a JavaFX explorer for researchers.",
    impact:
      "15% faster on TB-scale instances of an NP-hard problem; Best Paper at SSTP (<10% acceptance).",
    award: {
      label: "Best Paper Award",
      detail: "Student Science Training Program",
    },
    brand: {
      label: "UF",
      detail: "University of Florida",
      meta: "Center for Applied Optimization",
      logo: {
        src: "/images/vrp/uf-ise.jpg",
        alt: "University of Florida logo",
      },
    },
    metrics: [
      { value: "15%", label: "faster" },
      { value: "TB", label: "instance scale" },
      { value: "<10%", label: "SSTP acceptance" },
    ],
    tags: ["C++", "CMake", "SLURM", "Java", "JavaFX", "Python"],
    details: [
      "Trained ML on dual-value and variable patterns from Column Generation pricing problems to recognize unproductive branches early (15% faster on TB-scale instances).",
      "Ran simulations on the UF HiPerGator supercomputer (SLURM batch jobs across tens of thousands of cores).",
      "Built a JavaFX route-visualization tool so OR researchers could step through solver decisions interactively (screenshot below).",
      "Best Paper Award at SSTP (Student Science Training Program, under 10% acceptance).",
    ],
    media: {
      src: "/media/cvrp-visualizer.png",
      alt: "CVRP solver JavaFX visualizer showing routes and exploration controls",
      width: 1696,
      height: 1800,
      caption: "Solution exploration visualizer",
    },
  },
];

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const [glide, setGlide] = useState<{ y: number; h: number; ready: boolean }>({
    y: 0,
    h: 0,
    ready: false,
  });

  const measureGlide = useCallback(() => {
    const list = listRef.current;
    const btn = tabRefs.current.get(activeIndexRef.current);
    if (!list || !btn) return;
    const lr = list.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const y = br.top - lr.top;
    const h = br.height;
    setGlide((prev) => {
      if (
        prev.ready &&
        Math.abs(prev.y - y) < 0.5 &&
        Math.abs(prev.h - h) < 0.5
      ) {
        return prev;
      }
      return { y, h, ready: true };
    });
  }, []);

  useLayoutEffect(() => {
    measureGlide();
  }, [activeIndex, measureGlide]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => measureGlide());
    ro.observe(list);
    window.addEventListener("resize", measureGlide);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureGlide);
    };
  }, [measureGlide]);

  function setTabRef(index: number, el: HTMLButtonElement | null) {
    if (el) tabRefs.current.set(index, el);
    else tabRefs.current.delete(index);
  }

  const active = projects[activeIndex];
  const mediaList = active.media
    ? Array.isArray(active.media)
      ? active.media
      : [active.media]
    : [];

  return (
    <section className="v2-section" id="projects">
      <SectionHead
        eyebrow="Projects"
        title="What I've worked on"
        sub="Apps in production, papers that have been published internationally, and competitions I'm still proud of. Look here to see what I built, what I used, and what I learned."
      />

      <div className="v2-work">
        <div className="v2-work-list" ref={listRef} aria-label="Project selector">
          <span
            className="v2-work-list-glide"
            aria-hidden
            style={{
              opacity: glide.ready ? 1 : 0,
              top: glide.y,
              height: glide.h,
            }}
          />
          {projects.map((project, index) => (
            <button
              key={project.title}
              type="button"
              ref={(el) => setTabRef(index, el)}
              className={`v2-work-tab ${
                index === activeIndex ? "v2-work-tab--active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
            >
              <span className="v2-work-tab-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="v2-work-tab-copy">
                <span className="v2-work-tab-title">{project.title}</span>
                <span className="v2-work-tab-sub">{project.category}</span>
              </span>
              <span className="v2-work-tab-date">{project.dates}</span>
            </button>
          ))}
        </div>

        <article className="v2-work-panel" key={active.title}>
          <div className="v2-work-panel-head">
            <div>
              <p className="v2-mono v2-mono--accent">{active.category}</p>
              <h3 className="v2-work-title">{active.title}</h3>
            </div>
            <span className="v2-work-date">{active.dates}</span>
          </div>

          {(active.role || active.brand) && (
            <div
              className="v2-work-identity"
              aria-label={
                active.brand?.detail ?? active.role?.org ?? active.title
              }
            >
              {active.brand && (
                <div className="v2-work-identity-mark">
                  {active.brand.logo ? (
                    <Image
                      src={active.brand.logo.src}
                      alt={active.brand.logo.alt}
                      width={active.brand.logo.width ?? 92}
                      height={active.brand.logo.height ?? 92}
                      className={`v2-work-identity-logo ${
                        active.brand.logo.variant === "wide"
                          ? "v2-work-identity-logo--wide"
                          : ""
                      }`}
                    />
                  ) : (
                    <span className="v2-ieee-wordmark">
                      {active.brand.label}
                    </span>
                  )}
                </div>
              )}
              <div className="v2-work-identity-body">
                {active.role ? (
                  <>
                    <span className="v2-work-identity-title">
                      {active.role.title}
                    </span>
                    <span className="v2-work-identity-org">
                      {active.role.org}
                    </span>
                    <span className="v2-work-identity-meta">
                      {active.role.location}
                      {active.brand?.meta ? (
                        <>
                          {" · "}
                          {active.brand.meta === "usequantiv.com" ? (
                            <a
                              href={site.links.quantiv}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              usequantiv.com
                            </a>
                          ) : (
                            active.brand.meta
                          )}
                        </>
                      ) : null}
                    </span>
                  </>
                ) : active.brand ? (
                  <>
                    <span className="v2-work-identity-title">
                      {active.brand.detail}
                    </span>
                    <span className="v2-work-identity-sub">
                      {active.brand.meta === "usequantiv.com" ? (
                        <a
                          href={site.links.quantiv}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          usequantiv.com
                        </a>
                      ) : (
                        active.brand.meta
                      )}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          )}

          <p className="v2-work-summary">{active.summary}</p>
          {active.award && (
            <div className="v2-work-award" aria-label={active.award.label}>
              <Medal size={22} strokeWidth={2.2} />
              <span>
                <b>{active.award.label}</b>
                <small>{active.award.detail}</small>
              </span>
            </div>
          )}
          <p className="v2-work-impact">{active.impact}</p>

          <div className="v2-work-metrics">
            {active.metrics.map((metric) => (
              <div key={metric.label} className="v2-work-metric">
                <span
                  className={[
                    "v2-work-metric-v",
                    metric.tone === "gold" && "v2-work-metric-v--gold",
                    metric.tone === "platinum" && "v2-work-metric-v--platinum",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {metric.value}
                </span>
                <span className="v2-work-metric-l">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="v2-chips">
            {active.tags.map((tag) => (
              <span key={tag} className="v2-chip">
                {tag}
              </span>
            ))}
          </div>

          <details className="v2-work-details">
            <summary>Implementation notes</summary>
            <ul>
              {active.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </details>

          {mediaList.map((item) => (
            <figure key={item.src} className="v2-work-media">
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(max-width: 900px) 100vw, 820px"
                className="v2-work-media-img"
              />
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          ))}

          {active.links && active.links.length > 0 && (
            <div className="v2-work-links">
              {active.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={link.download}
                  className="v2-proj-link"
                >
                  <span className="v2-proj-link-text">{link.label}</span>
                  <Arrow size={12} />
                </a>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
