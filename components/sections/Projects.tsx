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
  /** Render the integer with thousands separators (e.g. 2,762). */
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
      lightBackground?: boolean;
      compact?: boolean;
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
  { id: "build", label: "Details" },
];

const brandLinks: Record<string, string> = {
  "usequantiv.com": site.links.quantiv,
  "thefdre.com": site.links.fdre,
};

function BrandMeta({ meta }: { meta: string }) {
  const href = brandLinks[meta];

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {meta}
    </a>
  ) : (
    meta
  );
}

const projects: Project[] = [
  {
    title: "Amazon",
    category: "SCOT · long-term planning configuration",
    dates: "Jun 2026 - Present",
    role: {
      title: "Software Development Engineer Intern",
      org: "Amazon · Long-Term Planning and Forecasting (LTPF)",
      location: "Supply Chain Optimization Technologies (SCOT)",
    },
    summary:
      "Building the shared, version-controlled configuration layer behind Amazon SCOT's long-term revenue and inventory forecasts, replacing scattered service setups with one reliable source of truth.",
    brand: {
      label: "Amazon",
      detail: "Amazon",
      meta: "",
      logo: {
        src: "/images/amazon/amazon-logo.svg",
        alt: "Amazon logo",
        variant: "wide",
        lightBackground: true,
        compact: true,
        width: 399,
        height: 133,
      },
    },
    metrics: [
      {
        value: "17",
        label: "packages and services",
        tone: "white",
        count: { from: 0, to: 17, durationMs: 2600 },
      },
      {
        value: "13",
        label: "engineers on the service",
        tone: "green",
        count: { from: 0, to: 13, durationMs: 2600 },
      },
      {
        value: "~90%",
        label: "less manual comparison",
        tone: "green",
        count: { from: 0, to: 90, prefix: "~", suffix: "%", durationMs: 2600 },
      },
    ],
    tags: [
      "Python",
      "TypeScript",
      "AWS CDK",
      "AWS Lambda",
      "Amazon S3",
      "AWS Glue",
      "Amazon Coral",
      "Configuration Management",
    ],
    details: [
      "One version-controlled JSON config now backs 17 interconnected packages and services, replacing the legacy per-service setups each team maintained by hand. All 13 engineers work from it.",
      "Config changes used to be reconciled by eye, from Research Scientists' model outputs down to Business Intelligence Engineer configs. Automating that dependency tracking cut the manual comparison time by roughly 90%.",
      "Delivery works across lanes: Python Lambda functions publish and retrieve configs in S3, Amazon Coral APIs expose them to consuming services, and the infrastructure is provisioned with TypeScript AWS CDK.",
    ],
  },
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
      "I founded Quantiv, a production platform that turns options data and earnings calendars into fast, research-ready expected-move insights for active investors.",
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
        value: "120,000+",
        label: "historical earnings records",
        tone: "white",
        count: { from: 0, to: 120000, suffix: "+", thousands: true, durationMs: 2600 },
      },
      {
        value: "10,000+",
        label: "searchable ticker identities",
        tone: "white",
        count: { from: 0, to: 10000, suffix: "+", thousands: true, durationMs: 2600 },
      },
      {
        value: "~100",
        label: "monthly active users (MAUs)",
        tone: "green",
        count: { from: 0, to: 100, prefix: "~", durationMs: 2600 },
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
      "Calendar, screener, symbol, and watchlist routes cover expected moves, per-expiry context, and live batch quotes across 120,000+ historical earnings records and 10,000+ searchable ticker identities. Roughly 100 people use it monthly.",
      "Browsing stays fast because the frontend reads prebuilt data that tools/build_frontend_data.py generates, leaving Railway FastAPI for HMAC-signed live LightGBM inference only. Production p90 FCP is 428 ms against a 1.8 s budget.",
      "A nightly pipeline reconciles providers and rescores: DoltHub sync, Finnhub and FMP earnings overlays, integrity gates, DuckDB/Parquet views, daily_score, Neon import, and a Vercel public-data commit. 296 local tests cover the frontend, the backend and ML, and the pipeline tooling.",
      "Watchlists are authenticated and drag-reorderable with live prices and batch ML scoring. User state lives in Neon Postgres behind Clerk, while Parquet and model artifacts sit in Cloudflare R2 rather than git.",
      "For high-interest symbols, a Railway worker on Finnhub WebSocket and REST writes to a shared Upstash quote:{symbol} cache that both web and worker paths read, backed by Vercel cron fallbacks and interest-ranked refreshes.",
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
      "FDRE is hedge-fund-oriented research infrastructure for point-in-time SEC filing retrieval, citation-verified evidence, and reproducible cross-sectional research.",
    brand: {
      label: "FDRE",
      detail: "Financial Document Retrieval Engine",
      meta: "thefdre.com",
      logo: {
        src: "/images/fdre/fdre-wordmark.png",
        alt: "FDRE, Financial Document Retrieval Engine wordmark",
        variant: "wide",
        width: 638,
        height: 236,
      },
    },
    metrics: [
      {
        value: "2.71M",
        label: "parsed chunks",
        tone: "white",
        count: { from: 0, to: 2.71, decimals: 2, suffix: "M", durationMs: 2600 },
      },
      {
        value: "2,762",
        label: "SEC filings",
        tone: "white",
        count: { from: 0, to: 2762, thousands: true, durationMs: 2600 },
      },
      {
        value: "100%",
        label: "issuer Recall@3 / @5",
        tone: "green",
        count: { from: 0, to: 100, suffix: "%", durationMs: 2600 },
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
      "Retrieval is hybrid and point-in-time: PostgreSQL GIN full-text search alongside pgvector HNSW halfvec Voyage embeddings, with exact company resolution, query expansion, and SEC acceptance-time filters. The corpus is 2,712,277 parsed and embedded chunks from 2,762 10-K and 10-Q filings, covering 498 of 499 S&P 500 primary tickers.",
      "The deployed cross-sectional research path is validated over real HTTPS: 28 of 28 frozen-development cases pass, issuer Recall@1/3/5 comes in at 0.929/1.000/1.000, condition correctness, lineage, and grounding are all 100%, point-in-time leakage is 0%, and end-to-end p95 latency is 1.86s.",
      "A bounded LangGraph workflow resolves filters, retrieves text, tables, and facts, reranks the evidence, gates claims, and verifies citations. When the evidence does not support an answer it abstains instead of generating one.",
      "Verified responses to identical point-in-time questions are cached, bringing repeat queries down to about 44 ms. Abstentions are never cached.",
      "Typed Company Facts queries and provider-neutral filing event studies turn filings into reusable datasets, exported as JSON, CSV, or Parquet issuer-period panels with leakage checks and persisted manifests.",
      "One PostgreSQL instance is the entire system of record: metadata, lexical and vector indexes, facts, traces, ingestion manifests, and experiments. There are no separate search, vector, queue, or analytics services to keep in sync.",
      "Ingestion is resumable and deployable, with provider backoff and stage manifests behind staged GitHub Actions runs, Alembic migrations applied pre-deploy on Railway, and a Vercel-hosted Next.js UI.",
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
      "Embers turns a quick home walkthrough into a claims-ready inventory with real-time object detection, Gemini-backed valuations, and a hands-free voice assistant.",
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
      "A React and Flask app that auto-inventories household items from roughly 30-second wildfire-claim videos. It took Top 5 of 172 teams, Best Use of Google Gemini API, and Best FinTech Project.",
      "YOLOv11 and OpenCV localize objects at 90%+ detection accuracy, crops go to Gemini for valuation, and per-item confidence and value land in a Flask and Supabase dashboard.",
      "A voice assistant built on Whisper, Gemini, and ElevenLabs handles hands-free asset valuation, cutting manual claim documentation by an estimated 50%.",
      "Video capture, detection overlays, inventory totals, valuation, and conversational assistance all shipped as one working demo inside the hackathon window.",
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
    role: {
      title: "Platinum Division Competitor",
      org: "USA Computing Olympiad (USACO)",
      location: "National algorithmic programming competition",
    },
    summary:
      "The USA Computing Olympiad is the U.S. national algorithmic programming competition and IOI selection pathway, where I advanced to its top Platinum division.",
    brand: {
      label: "USACO",
      detail: "USA Computing Olympiad",
      meta: "",
      logo: {
        src: "/images/usaco/usaco-logo.png",
        alt: "USA Computing Olympiad logo",
        variant: "wide",
        lightBackground: true,
        width: 900,
        height: 130,
      },
    },
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
      "USACO is a national programming competition and U.S. IOI selection pathway built around progressively harder Bronze, Silver, Gold, and Platinum divisions.",
      "A perfect 1000/1000 in the Gold Division contest qualified me for Platinum, working through competition C++ problems across graphs, dynamic programming, segment trees, and computational geometry.",
      "Tight memory and runtime budgets mean edge cases decide the score, so I leaned on gdb profiling to find those and the performance bottlenecks behind them.",
      "Bronze to Silver to Gold to Platinum, one division at a time, on progressively harder contest sets.",
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
      "I authored and published a hybrid Graph ConvNet–Informer model that forecasts intersection turning ratios for more adaptive traffic signals.",
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
      "GC-INF is a 4-layer Graph ConvNet and Informer hybrid in PyTorch that learns spatial-temporal road-graph patterns. On intersection turning-ratio prediction it cut RMSE 24% below STGCN (IJCAI '17), the prior state of the art.",
      "Chebyshev graph-convolution outputs feed Informer's ProbSparse attention, trained on raw series with Adam and cosine decay, which holds long-range dependencies well enough for stable 15-minute forecasts.",
      "I wrote, presented, and defended the work myself: a single-author IEEE ITSC 2023 paper, a Simulation and Control session chair role, and Team Canada ISEF finalist status.",
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
      "I built a MATLAB neural surrogate that turns computationally expensive F1 CFD studies into near-instant pressure-map predictions for faster aerodynamic design.",
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
      "A MATLAB backpropagation feed-forward network trained as a CFD surrogate returns pressure maps in under a second, so aerodynamic iteration stops waiting on full simulation runs.",
      "Embedded in an end-to-end aero-analytics stack driving geometry decisions, it reached 43% drag reduction with a 100x iteration speedup.",
      "Single-author write-up of the CFD, surrogate-model, and optimization workflow, published in Highlights in Science Engineering and Technology and awarded a CWSF gold medal.",
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
      "At UF, I developed an ML-guided branch-pruning approach that helps large vehicle-routing solvers reach good routes faster at HPC scale.",
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
      "Training ML on dual-value and variable patterns from Column Generation pricing problems let the solver prune unproductive branches earlier, worth a 15% C++ speedup on instances with 1,000+ nodes and 40+ vehicles.",
      "Experiments ran batched under SLURM across tens of thousands of cores on UF HiPerGator, collecting performance traces along the way.",
      "A JavaFX visualizer lets researchers step through generated solutions and inspect solver behavior route by route.",
      "The internship research became a paper and took Best Paper Award at SSTP.",
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
                            } ${
                              active.brand.logo.lightBackground
                                ? "v2-work-identity-logo--on-light"
                                : ""
                            } ${
                              active.brand.logo.compact
                                ? "v2-work-identity-logo--compact"
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
                                <BrandMeta meta={active.brand.meta} />
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
                            <BrandMeta meta={active.brand.meta} />
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
