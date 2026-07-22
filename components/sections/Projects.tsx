"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Medal } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Arrow } from "@/components/icons/Icons";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
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

type MetricTone = "gold" | "platinum" | "green" | "yellow" | "white";

type MetricCount = {
  from: number;
  to: number;
  fromSecondary?: number;
  toSecondary?: number;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  /** Render the integer with thousands separators (e.g. 2,749). */
  thousands?: boolean;
};

type ProjectMetric = {
  value: string;
  label: string;
  tone?: MetricTone;
  count?: MetricCount;
};

type Project = {
  title: string;
  category: string;
  dates: string;
  /** Former “Experience” row merged into this project */
  role?: { title: string; org: string; location: string };
  summary: string;
  impact: string;
  metrics: ProjectMetric[];
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

type PanelTab = "overview" | "build";

const PANEL_TABS: { id: PanelTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "build", label: "Build" },
];

const projects: Project[] = [
  {
    title: "Quantiv",
    category: "Earnings · options-implied expected moves",
    dates: "Jul 2025 - Present",
    role: {
      title: "Founder and Lead Software Engineer",
      org: "Quantiv · Options-implied earnings analytics",
      location: "New York, NY, USA",
    },
    summary:
      "Founder and lead engineer on Quantiv: a Next.js dashboard for options-implied expected moves around earnings (multi-week calendar, screener, symbol detail, Clerk watchlist). The UI ships on Vercel from prebuilt JSON; a Python pipeline (DoltHub + Finnhub/FMP earnings, DuckDB over Parquet, LightGBM v3) refreshes nightly via GitHub Actions.",
    impact:
      "Live on usequantiv.com, averaging ~50 monthly active users over a 1.04B+ option-record dataset; nightly CI data refresh, multi-provider quote overlay (Finnhub/Alpaca/Polygon), and optional Railway FastAPI for live ML re-inference.",
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
      {
        value: "1.04B+",
        label: "option records",
        tone: "white",
        count: { from: 0, to: 1.04, decimals: 2, suffix: "B+" },
      },
      {
        value: "~50",
        label: "monthly active users",
        tone: "green",
        count: { from: 0, to: 50, prefix: "~" },
      },
      {
        value: "50-100",
        label: "tickers / week",
        tone: "white",
        count: {
          from: 0,
          to: 50,
          fromSecondary: 0,
          toSecondary: 100,
          separator: "-",
        },
      },
    ],
    tags: [
      "TypeScript",
      "Next.js",
      "Python",
      "FastAPI",
      "LightGBM",
      "DuckDB",
      "Parquet",
      "PostgreSQL",
      "Redis",
      "Clerk",
      "Vercel",
      "Railway",
    ],
    details: [
      "Shipped a production options-research workflow, measured by ~50 monthly active users and 50-100 ticker analyses per week, by building calendar, screener, symbol, and watchlist routes with expected moves, per-expiry context, and live batch quotes.",
      "Kept browsing fast and resilient, measured by static JSON navigation without FastAPI on every page load, by generating frontend data with tools/build_frontend_data.py and reserving Railway FastAPI for HMAC-signed live LightGBM inference.",
      "Automated daily data refreshes, measured by a 1.04B+ option-record dataset redeployed nightly, by orchestrating DoltHub sync, Finnhub/FMP earnings overlays, integrity gates, DuckDB/Parquet views, daily_score, Neon import, and Vercel public-data commits.",
      "Added authenticated portfolio tracking, measured by drag-reorder watchlists with live prices and batch ML, by storing user state in Neon Postgres via Clerk and keeping Parquet/model artifacts in Cloudflare R2 outside git.",
      "Improved quote freshness for high-interest symbols, measured by shared Upstash quote:{symbol} cache reads across web and worker paths, by combining a Railway Finnhub WebSocket/REST worker with Vercel cron fallbacks and interest-ranked refreshes.",
    ],
    links: [{ label: "Visit usequantiv.com", href: site.links.quantiv }],
  },
  {
    title: "FDRE",
    category: "SEC filing retrieval · citation-verified RAG",
    dates: "2026 - Present",
    role: {
      title: "Creator and Lead Engineer",
      org: "FDRE · Financial Document Retrieval Engine",
      location: "New York, NY, USA",
    },
    summary:
      "FDRE is a citation-verified RAG system for SEC filings. A LangGraph research agent resolves issuers and dates, retrieves and reranks 10-K/10-Q evidence, gates unsupported claims, and returns auditable answers with source citations.",
    impact:
      "Live at thefdre.com over an S&P 500 corpus with multi-class issuers normalized to one company record (~5 years each): 2,749 SEC 10-K/10-Q filings parsed into ~2.69M chunks, embedded with Voyage voyage-4-large. FastAPI on Railway, frontend on Vercel.",
    brand: {
      label: "FDRE",
      detail: "Financial Document Retrieval Engine",
      meta: "thefdre.com",
      logo: {
        src: "/images/fdre/fdre-wordmark.png",
        alt: "FDRE — Financial Document Retrieval Engine wordmark",
        variant: "wide",
        width: 638,
        height: 236,
      },
    },
    metrics: [
      {
        value: "2.69M",
        label: "parsed chunks",
        tone: "white",
        count: { from: 0, to: 2.69, decimals: 2, suffix: "M", durationMs: 2600 },
      },
      {
        value: "2,749",
        label: "SEC filings",
        tone: "white",
        count: { from: 0, to: 2749, thousands: true, durationMs: 2600 },
      },
      {
        value: "S&P 500",
        label: "issuer universe",
        tone: "green",
      },
    ],
    tags: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "LangGraph",
      "Voyage AI",
      "Next.js",
      "TypeScript",
      "Alembic",
      "Docker",
      "Railway",
      "Vercel",
    ],
    details: [
      "Made SEC filing search point-in-time and source-grounded, measured by 2.69M parsed chunks from 2,749 10-K/10-Q filings, by combining PostgreSQL GIN full-text BM25, pgvector HNSW halfvec Voyage embeddings, exact company resolution, query expansion, and SEC acceptance-time filters.",
      "Reduced unsupported generation in research answers, measured by citation-verified responses and deliberate abstention, by running a bounded LangGraph workflow that resolves filters, retrieves text/tables/facts, reranks evidence, gates claims, and verifies citations.",
      "Turned filings into reusable research datasets, measured by JSON, CSV, and Parquet exports for point-in-time issuer-period panels, by adding typed Company Facts queries and provider-neutral filing event studies with leakage checks and persisted manifests.",
      "Simplified the retrieval stack, measured by one PostgreSQL system of record instead of separate search, vector, queue, and analytics services, by storing metadata, lexical/vector indexes, facts, traces, ingestion manifests, and experiments together.",
      "Kept ingestion resumable and deployable, measured by staged GitHub Actions runs and Railway pre-deploy migrations, by adding provider backoff, stage manifests, Alembic, FastAPI, and a Vercel-hosted Next.js UI.",
    ],
    links: [
      { label: "Visit thefdre.com", href: site.links.fdre },
      { label: "View on GitHub", href: site.links.fdreRepo },
    ],
    media: {
      src: "/media/fdre-research-answer.png",
      alt: "FDRE research answer for META data-center capex commitments: a citation-verified figure with retrieval-confidence score, evidence gate, hybrid dense/sparse/rerank breakdown, and the exact cited 10-Q passage.",
      width: 1427,
      height: 871,
      caption:
        "Cited answer view: a citation-verified figure pulled from META's 10-Q, with retrieval-confidence scoring, evidence gate, hybrid dense/sparse/rerank scores, and the exact supporting passage.",
    },
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
      "A platform built on a React + Flask pipeline that intakes a video of a home, runs OpenCV + YOLOv11 detections, and turns them into an insurance-ready inventory with Gemini-grounded valuations and a voice assistant.",
    impact:
      "Top 5 Finalist of 172 teams · Best Use of Google Gemini API · Best FinTech Project.",
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
      {
        value: "Top 5",
        label: "of 172 teams",
        tone: "green",
        count: { from: 172, to: 5, prefix: "Top ", durationMs: 2600 },
      },
      {
        value: "90%+",
        label: "detection accuracy",
        tone: "white",
        count: { from: 0, to: 90, suffix: "%+", durationMs: 2600 },
      },
      {
        value: "3",
        label: "hackathon awards",
        tone: "gold",
        count: { from: 0, to: 3, durationMs: 2600 },
      },
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
      "Led Embers to hackathon finals and awards, measured by Top 5 of 172 teams, Best Use of Google Gemini API, and Best FinTech Project, by building a React + Flask app that auto-inventoried household items from ~30s wildfire-claim videos.",
      "Automated insurance inventory valuation, measured by 90%+ detection accuracy and per-item confidence/value outputs, by localizing objects with YOLOv11 and OpenCV, sending crops to Gemini, and storing dashboard results in Flask and Supabase.",
      "Reduced manual claim documentation effort, measured by an estimated ~50% time savings, by adding a voice assistant with Whisper, Gemini, and ElevenLabs for hands-free asset valuation.",
      "Presented a complete claim workflow under hackathon constraints, measured by three LA Hacks awards, by integrating video capture, detection overlays, inventory totals, valuation, and conversational assistance into one demo.",
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
      {
        value: "1000/1000",
        label: "Gold Division",
        tone: "gold",
        count: { from: 0, to: 1000, suffix: "/1000", durationMs: 1700 },
      },
      {
        value: "Top 1%",
        label: "national rank",
        tone: "green",
        count: { from: 100, to: 1, prefix: "Top ", suffix: "%", durationMs: 1700 },
      },
      { value: "Platinum", label: "qualifier", tone: "platinum" },
    ],
    tags: ["C++", "Advanced Data Structures and Algorithms", "gdb"],
    details: [
      "Reached USACO Platinum, measured by a perfect 1000/1000 Gold Division contest score, by solving competition-grade C++ problems across graphs, dynamic programming, segment trees, and computational geometry.",
      "Improved contest reliability under hard limits, measured by accepted solutions within tight memory and runtime budgets, by using gdb profiling to isolate edge cases and performance bottlenecks.",
      "Advanced to the top USACO division, measured by Bronze to Silver to Gold to Platinum progression, by consistently solving higher-difficulty algorithmic contest sets.",
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
      detail:
        "IEEE Intelligent Transportation Systems Conference Proceedings 2023",
      meta: "Peer-reviewed research venue",
      logo: {
        src: "/images/gc-inf/ieee-logo.png",
        alt: "IEEE logo",
        width: 1000,
        height: 1083,
      },
    },
    metrics: [
      {
        value: "24%",
        label: "RMSE improvement",
        tone: "green",
        count: { from: 0, to: 24, suffix: "%", durationMs: 2600 },
      },
      {
        value: "Top 30",
        label: "Team Canada · ISEF",
        tone: "white",
        count: { from: 200, to: 30, prefix: "Top ", durationMs: 2600 },
      },
      { value: "1st", label: "sole-author IEEE paper", tone: "white" },
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
      "Improved traffic turning-ratio forecasting, measured by 24% lower RMSE than STGCN, by engineering GC-INF as a 4-layer Graph ConvNet + Informer model that learns spatial-temporal road-graph patterns in PyTorch.",
      "Captured long-range traffic dependencies efficiently, measured by stable 15-minute turning-ratio forecasts, by feeding Chebyshev graph-convolution outputs into Informer's ProbSparse attention with Adam and cosine decay on raw series.",
      "Validated the model against a prior benchmark, measured by 24% RMSE improvement over STGCN (IJCAI '17), by comparing GC-INF on intersection turning-ratio prediction tasks.",
      "Earned peer-reviewed visibility for independent research, measured by a single-author IEEE ITSC 2023 paper, Simulation and Control session chair role, and Team Canada ISEF finalist status, by writing, presenting, and defending the GC-INF work.",
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
      "100x iteration speed-up · 43% drag reduction in simulations · CWSF gold medalist.",
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
      {
        value: "100x",
        label: "iteration speedup",
        tone: "white",
        count: { from: 1, to: 100, suffix: "x", durationMs: 2600 },
      },
      {
        value: "43%",
        label: "drag reduction",
        tone: "green",
        count: { from: 0, to: 43, suffix: "%", durationMs: 2600 },
      },
      { value: "Gold", label: "CWSF '22", tone: "gold" },
    ],
    tags: [
      "MATLAB",
      "Deep Learning Toolbox",
      "Feedforward",
      "trainlm",
      "CFD",
      "Surrogate Modeling",
      "Neural Networks",
      "Supervised Learning",
      "Backpropagation",
    ],
    details: [
      "Made aerodynamic iteration faster, measured by sub-second pressure-map predictions, by training a MATLAB backpropagation feed-forward neural network as a CFD surrogate.",
      "Reduced simulated drag while exploring wing designs, measured by 43% drag reduction and 100x iteration speedup, by embedding the ANN in an end-to-end aero-analytics stack for geometry decisions.",
      "Published the single-author research outcome, measured by a Highlights in Science Engineering and Technology paper and CWSF gold medal, by documenting the CFD, surrogate-model, and optimization workflow.",
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
      "15% C++ solver speedup on large CVRP instances (1,000+ nodes, 40+ vehicles) of an NP-hard problem; Best Paper at SSTP.",
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
      {
        value: "15%",
        label: "C++ solver speedup",
        tone: "green",
        count: { from: 0, to: 15, suffix: "%", durationMs: 2600 },
      },
      {
        value: "1,000+",
        label: "nodes solved with 40+ vehicles",
        tone: "white",
        count: { from: 0, to: 1000, suffix: "+", thousands: true, durationMs: 2600 },
      },
      {
        value: "10k+",
        label: "SLURM cores used",
        tone: "white",
        count: { from: 1, to: 10, suffix: "k+", durationMs: 2600 },
      },
    ],
    tags: ["C++", "CMake", "SLURM", "Java", "JavaFX", "Python"],
    details: [
      "Accelerated large CVRP solving, measured by a 15% C++ solver speedup on 1,000+ node instances with 40+ vehicles, by training ML on dual-value and variable patterns from Column Generation pricing problems to prune unproductive branches earlier.",
      "Scaled experiments across university HPC resources, measured by SLURM runs across tens of thousands of cores on UF HiPerGator, by batching solver simulations and collecting performance traces.",
      "Improved researcher inspection of solver behavior, measured by an interactive route exploration workflow, by building a JavaFX visualizer for stepping through generated CVRP solutions.",
      "Converted the internship research into a recognized paper, measured by Best Paper Award at SSTP, by presenting the ML-guided branch-pruning approach and experimental results.",
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

function formatCountPart(value: number, count: MetricCount) {
  if (count.decimals != null) return value.toFixed(count.decimals);
  const rounded = Math.round(value);
  return count.thousands ? rounded.toLocaleString("en-US") : String(rounded);
}

function formatCountValue(
  value: number,
  count: MetricCount,
  secondaryValue?: number,
) {
  const formatted =
    count.toSecondary != null && secondaryValue != null
      ? [
          formatCountPart(value, count),
          formatCountPart(secondaryValue, count),
        ].join(count.separator ?? "-")
      : formatCountPart(value, count);
  return `${count.prefix ?? ""}${formatted}${count.suffix ?? ""}`;
}

function AnimatedMetricValue({ metric }: { metric: ProjectMetric }) {
  const count = metric.count;
  const [displayValue, setDisplayValue] = useState(metric.count?.from);
  const [displaySecondaryValue, setDisplaySecondaryValue] = useState(
    metric.count?.fromSecondary,
  );

  useEffect(() => {
    if (!count) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let startedAt = 0;
    const duration = count.durationMs ?? 850;

    const step = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(count.from + (count.to - count.from) * eased);
      if (count.fromSecondary != null && count.toSecondary != null) {
        setDisplaySecondaryValue(
          count.fromSecondary +
            (count.toSecondary - count.fromSecondary) * eased,
        );
      }
      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(() => {
      if (reduceMotion) {
        setDisplayValue(count.to);
        setDisplaySecondaryValue(count.toSecondary);
        return;
      }

      setDisplayValue(count.from);
      setDisplaySecondaryValue(count.fromSecondary);
      frame = window.requestAnimationFrame(step);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [count]);

  const classes = [
    "v2-work-metric-v",
    metric.tone === "gold" && "v2-work-metric-v--gold",
    metric.tone === "platinum" && "v2-work-metric-v--platinum",
    metric.tone === "green" && "v2-work-metric-v--green",
    metric.tone === "yellow" && "v2-work-metric-v--yellow",
    metric.tone === "white" && "v2-work-metric-v--white",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} aria-label={`${metric.value} ${metric.label}`}>
      {metric.count && displayValue != null
        ? formatCountValue(displayValue, metric.count, displaySecondaryValue)
        : metric.value}
    </span>
  );
}

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const [glide, setGlide] = useState<{ y: number; h: number; ready: boolean }>({
    y: 0,
    h: 0,
    ready: false,
  });

  const measureGlide = useCallback(() => {
    const list = listRef.current;
    const btn = tabRefs.current.get(activeIndex);
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
  }, [activeIndex]);

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

  const [panelTab, setPanelTab] = useState<PanelTab>("overview");

  const subTabsRef = useRef<HTMLDivElement>(null);
  const subTabRefs = useRef<Map<PanelTab, HTMLButtonElement>>(new Map());

  const [subGlide, setSubGlide] = useState({
    x: 0,
    w: 0,
    ready: false,
  });

  const measureSubGlide = useCallback(() => {
    const shell = subTabsRef.current;
    const btn = subTabRefs.current.get(panelTab);
    if (!shell || !btn) return;
    const sr = shell.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const x = br.left - sr.left;
    const w = br.width;
    setSubGlide((prev) => {
      if (
        prev.ready &&
        Math.abs(prev.x - x) < 0.5 &&
        Math.abs(prev.w - w) < 0.5
      ) {
        return prev;
      }
      return { x, w, ready: true };
    });
  }, [panelTab]);

  useLayoutEffect(() => {
    measureSubGlide();
  }, [panelTab, activeIndex, measureSubGlide]);

  useLayoutEffect(() => {
    const shell = subTabsRef.current;
    if (!shell) return;
    const ro = new ResizeObserver(() => measureSubGlide());
    ro.observe(shell);
    window.addEventListener("resize", measureSubGlide);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureSubGlide);
    };
  }, [measureSubGlide]);

  function setSubTabRef(id: PanelTab, el: HTMLButtonElement | null) {
    if (el) subTabRefs.current.set(id, el);
    else subTabRefs.current.delete(id);
  }

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
        <ScrollReveal
          className="v2-work-list"
          ref={listRef}
          aria-label="Project selector"
          variant="panel"
          y={20}
        >
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
              onClick={() => {
                setActiveIndex(index);
                setPanelTab("overview");
              }}
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
        </ScrollReveal>

        <ScrollReveal
          as="article"
          className="v2-work-panel"
          key={active.title}
          variant="panel"
          delay={0.08}
          once={false}
          y={22}
        >
          <div className="v2-work-panel-head">
            <h3 className="v2-work-title">{active.title}</h3>
            <span className="v2-work-date">{active.dates}</span>
          </div>

          <div className="v2-work-subtabs" ref={subTabsRef}>
            <span
              className="v2-work-subtabs-glide"
              aria-hidden
              style={{
                opacity: subGlide.ready ? 1 : 0,
                width: subGlide.w,
                transform: `translate3d(${subGlide.x}px, 0, 0)`,
              }}
            />
            {PANEL_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                ref={(el) => setSubTabRef(t.id, el)}
                className={`v2-work-subtab ${
                  panelTab === t.id ? "v2-work-subtab--active" : ""
                }`}
                onClick={() => setPanelTab(t.id)}
                aria-pressed={panelTab === t.id}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="v2-work-panel-stage">
            {panelTab === "overview" && (
              <div className="v2-work-panel-page">
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

                {active.award && (
                  <div className="v2-work-award" aria-label={active.award.label}>
                    <Medal size={22} strokeWidth={2.2} />
                    <span>
                      <b>{active.award.label}</b>
                      <small>{active.award.detail}</small>
                    </span>
                  </div>
                )}

                <div className="v2-work-blurb">
                  <p className="v2-work-summary">{active.summary}</p>
                  <p className="v2-work-impact">{active.impact}</p>
                </div>

                <div className="v2-work-metrics">
                  {active.metrics.map((metric, index) => (
                    <ScrollReveal
                      key={metric.label}
                      className="v2-work-metric"
                      variant="scale"
                      delay={0.08 + index * 0.04}
                      once={false}
                    >
                      <AnimatedMetricValue metric={metric} />
                      <span className="v2-work-metric-l">{metric.label}</span>
                    </ScrollReveal>
                  ))}
                </div>

                {active.links && active.links.length > 0 && (
                  <div className="v2-work-links">
                    {active.links.map((link, index) => (
                      <ScrollReveal
                        as="a"
                        key={link.href}
                        href={link.href}
                        className="v2-proj-link"
                        delay={0.1 + index * 0.04}
                        once={false}
                        {...(link.download
                          ? { download: true }
                          : {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
                      >
                        <span className="v2-proj-link-text">{link.label}</span>
                        <Arrow size={12} className="v2-proj-link-icon" />
                      </ScrollReveal>
                    ))}
                  </div>
                )}
              </div>
            )}

            {panelTab === "build" && (
              <div className="v2-work-panel-page">
                <div className="v2-chips">
                  {active.tags.map((tag, index) => (
                    <ScrollReveal
                      as="span"
                      key={tag}
                      className="v2-chip"
                      delay={index * 0.025}
                      once={false}
                      y={12}
                    >
                      {tag}
                    </ScrollReveal>
                  ))}
                </div>

                <details className="v2-work-details" open>
                  <summary>Implementation notes</summary>
                  <ul>
                    {active.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </details>

                {mediaList.map((item, index) => (
                  <ScrollReveal
                    key={item.src}
                    variant="panel"
                    delay={0.06 + index * 0.04}
                    once={false}
                    y={18}
                  >
                    <figure className="v2-work-media">
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
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
