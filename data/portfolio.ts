export type MetricCount = {
  from: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  thousands?: boolean;
  durationMs?: number;
};

export type FeaturedMetric = {
  value: string;
  label: string;
  count?: MetricCount;
  award?: boolean;
};

export type FeaturedProject = {
  name: string;
  eyebrow: string;
  date: string;
  summary: string;
  metrics: FeaturedMetric[];
  stack: string;
  href?: string;
  hrefLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  demo: "amazon" | "quantiv" | "fdre" | "embers";
};

export const featuredProjects: FeaturedProject[] = [
  {
    name: "Amazon",
    eyebrow: "Software engineering",
    date: "Summer 2026",
    summary:
      "Built shared configuration infrastructure behind long-term supply-chain forecasting across 17 packages and services.",
    metrics: [
      {
        value: "17",
        label: "packages + services",
        count: { from: 0, to: 17, durationMs: 1700 },
      },
      {
        value: "13",
        label: "engineers",
        count: { from: 0, to: 13, durationMs: 1700 },
      },
      {
        value: "~90%",
        label: "less manual comparison",
        count: { from: 0, to: 90, prefix: "~", suffix: "%", durationMs: 1900 },
      },
    ],
    stack: "Python, TypeScript, AWS Lambda, S3, CDK",
    demo: "amazon",
  },
  {
    name: "Quantiv",
    eyebrow: "Founder, product + ML",
    date: "2025 - present",
    summary:
      "Options and earnings analytics that turns live market data into expected-move forecasts and searchable research.",
    metrics: [
      {
        value: "120k+",
        label: "earnings records",
        count: { from: 0, to: 120, suffix: "k+", durationMs: 2000 },
      },
      {
        value: "10k+",
        label: "ticker identities",
        count: { from: 0, to: 10, suffix: "k+", durationMs: 1800 },
      },
      {
        value: "~100",
        label: "monthly active users",
        count: { from: 0, to: 100, prefix: "~", durationMs: 1900 },
      },
    ],
    stack: "Next.js, Python, LightGBM, DuckDB, Postgres, Redis",
    href: "https://usequantiv.com",
    hrefLabel: "Open Quantiv",
    demo: "quantiv",
  },
  {
    name: "Financial Document Retrieval Engine",
    eyebrow: "Research infrastructure",
    date: "2026 - present",
    summary:
      "A point-in-time SEC research engine with hybrid retrieval, citation verification, and reproducible cross-sectional analysis.",
    metrics: [
      {
        value: "2.71M",
        label: "parsed chunks",
        count: { from: 0, to: 2.71, decimals: 2, suffix: "M", durationMs: 2000 },
      },
      {
        value: "2,762",
        label: "SEC filings",
        count: { from: 0, to: 2762, thousands: true, durationMs: 2000 },
      },
      {
        value: "100%",
        label: "issuer Recall@3",
        count: { from: 0, to: 100, suffix: "%", durationMs: 1800 },
      },
    ],
    stack: "FastAPI, Postgres, pgvector, LangGraph, Next.js",
    href: "https://thefdre.com",
    hrefLabel: "Open Financial Document Retrieval Engine",
    secondaryHref:
      "https://github.com/kenchengkc/the-financial-document-retrieval-engine",
    secondaryLabel: "Source",
    demo: "fdre",
  },
  {
    name: "Embers",
    eyebrow: "Machine learning",
    date: "LA Hacks 2025",
    summary:
      "A claims-ready home inventory from a short video walkthrough, with real-time detection, valuation, and voice assistance.",
    metrics: [
      {
        value: "Top 5",
        label: "of 172 teams",
        count: { from: 172, to: 5, prefix: "Top ", durationMs: 1900 },
        award: true,
      },
      {
        value: "90%+",
        label: "detection accuracy",
        count: { from: 0, to: 90, suffix: "%+", durationMs: 1800 },
      },
      {
        value: "3",
        label: "awards",
        count: { from: 0, to: 3, durationMs: 1500 },
        award: true,
      },
    ],
    stack: "Python, YOLOv11, Gemini, React, Flask, Supabase",
    href: "https://devpost.com/software/insurefire",
    hrefLabel: "View project",
    demo: "embers",
  },
];

export const otherWork = [
  {
    title: "GC-INF",
    meta: "IEEE ITSC, 2023",
    detail: "Traffic forecasting with a Graph ConvNet and Informer, 24% lower RMSE than STGCN.",
  },
  {
    title: "USACO Platinum",
    meta: "Top 1% nationally · 2023",
    detail: "Highest USACO division, promoted from Gold with a 1000/1000 score.",
  },
  {
    title: "Need for Speed",
    meta: "CWSF Gold, 2022",
    detail: "CFD plus neural surrogate modeling for Formula 1 aero, 43% drag reduction.",
  },
  {
    title: "CVRP Solver",
    meta: "UF SSTP · Best Paper, 2023",
    detail: "ML-assisted column generation for vehicle routing, 15% faster C++ solver.",
  },
] as const;

export const publications = [
  {
    title:
      "GC-INF: A Novel Adaptive Traffic Control System using Machine Learning for Turning Ratio Predictions",
    venue: "IEEE Intelligent Transportation Systems Conference",
    date: "2023",
    citations: 1,
    href:
      "https://www.researchgate.net/publication/378189206_GC-INF_A_Novel_Adaptive_Traffic_Control_System_using_Machine_Learning_for_Turning_Ratio_Predictions",
  },
  {
    title:
      "A Need For Speed: Enhancing F1 Race Cars with a Novel Computational Fluid Dynamics and Machine Learning Method",
    venue: "Highlights in Science, Engineering and Technology",
    date: "2023",
    citations: 2,
    href:
      "https://www.researchgate.net/publication/371141171_A_Need_For_Speed_Enhancing_F1_Race_Cars_with_a_Novel_Computational_Fluid_Dynamics_and_Machine_Learning_Method",
  },
] as const;
