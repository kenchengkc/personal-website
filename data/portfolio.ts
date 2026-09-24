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
  details?: string[];
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
    eyebrow: "Software Development Engineer Intern",
    date: "Jun–Aug 2026",
    summary:
      "Owned design, testing, rollout, and documentation of shared configuration infrastructure for Amazon SCOT’s long-term supply-chain forecasting.",
    details: [
      "Used by engineers, managers, economists, and scientists. Automated dependency tracing from research model outputs to downstream configurations; the reduction in manual comparison time is based on user surveys.",
    ],
    metrics: [
      {
        value: "17",
        label: "packages + services",
        count: { from: 0, to: 17, durationMs: 1700 },
      },
      {
        value: "30+",
        label: "cross-functional users",
        count: { from: 0, to: 30, suffix: "+", durationMs: 1700 },
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
    eyebrow: "Founder & Lead Engineer",
    date: "Jul 2025 – Present",
    summary:
      "Built and launched an earnings analytics platform with searchable calendars, watchlists, and point and quantile forecasts from six LightGBM models.",
    details: [
      "On development validation, the models achieved 31% lower weighted MAE than the options-implied baseline. Forecast pipelines use chronological validation, data-freshness checks, and model-drift monitoring.",
      "Nightly ingestion and batch inference run on DuckDB/Parquet and GitHub Actions. FastAPI model serving uses signed artifacts, SHA-256 verification, atomic activation, and recovery to the previous verified model; Redis shares live quotes.",
    ],
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
        value: "120+",
        label: "monthly active users",
        count: { from: 0, to: 120, suffix: "+", durationMs: 1900 },
      },
    ],
    stack: "Next.js, TypeScript, Python, LightGBM, DuckDB, Parquet, PostgreSQL, Redis, FastAPI",
    href: "https://usequantiv.com",
    hrefLabel: "Open Quantiv",
    demo: "quantiv",
  },
  {
    name: "Financial Document Retrieval Engine",
    eyebrow: "Research Infrastructure",
    date: "Jun 2026 – Present",
    summary:
      "Built hybrid lexical and vector retrieval over SEC filings, with citation verification, evidence-based abstention, and point-in-time filtering.",
    details: [
      "Multi-query expansion raised Recall@5 from 0.152 to 0.212 on a 33-query benchmark. Half-precision vectors reduced database size by 27%, from 15 to 11 GB.",
      "Batched embeddings, ANN-first search, and bounded candidate pools cut cross-company retrieval p95 from approximately 59 seconds to 1.74 seconds in a retrieval benchmark.",
    ],
    metrics: [
      {
        value: "3.04M",
        label: "embedded passages",
        count: { from: 0, to: 3.04, decimals: 2, suffix: "M", durationMs: 2000 },
      },
      {
        value: "3,204",
        label: "SEC filings",
        count: { from: 0, to: 3204, thousands: true, durationMs: 2000 },
      },
      {
        value: "75+",
        label: "monthly active users",
        count: { from: 0, to: 75, suffix: "+", durationMs: 1800 },
      },
    ],
    stack: "Python, FastAPI, PostgreSQL, pgvector, Next.js",
    href: "https://thefdre.com",
    hrefLabel: "Open Financial Document Retrieval Engine",
    secondaryHref:
      "https://github.com/kenchengkc/the-financial-document-retrieval-engine",
    secondaryLabel: "Source",
    demo: "fdre",
  },
  {
    name: "Embers",
    eyebrow: "Machine Learning",
    date: "Apr 2025 · LA Hacks",
    summary:
      "Led a four-person team building a video-to-inventory app with YOLO object tracking, cross-frame deduplication, Gemini valuation, and Supabase persistence.",
    details: [
      "Integrated voice search and item snapshots into the inventory workflow. Placed Top 5 of 172 teams and won the Google Gemini and Financial Tech prizes at LA Hacks 2025.",
    ],
    metrics: [
      {
        value: "Top 5",
        label: "of 172 teams",
        count: { from: 172, to: 5, prefix: "Top ", durationMs: 1900 },
        award: true,
      },
      {
        value: "4",
        label: "person team",
        count: { from: 0, to: 4, durationMs: 1800 },
      },
      {
        value: "2",
        label: "category prizes",
        count: { from: 0, to: 2, durationMs: 1500 },
        award: true,
      },
    ],
    stack: "Python, YOLOv11, Gemini, React, Flask, Supabase",
    href: "https://devpost.com/software/insurefire",
    hrefLabel: "View project",
    demo: "embers",
  },
];

type OtherWork = { title: string; meta: string; detail: string; href?: string };

export const otherWork: OtherWork[] = [
  {
    title: "Creative Machines Lab",
    meta: "Columbia · Undergraduate Deep Learning Researcher · Sep 2026 – Present",
    detail: "Developing LLM evaluation and activation-probing tools to study deceptive communication separately from factual errors and unsupported claims. Collected 160 Qwen2.5-7B responses under a fixed development protocol, with scenario-level split checks and annotation gates.",
  },
  {
    title: "Wasserstein Regimes",
    meta: "Optimal Transport & Unsupervised Learning · Sep 2026 – Present",
    detail: "Compared nine clustering methods across five ETFs using chronological folds, purged holdouts, and synthetic controls. Scale explained 95–98% of raw Wasserstein centroid separation, limiting claims of added distributional information.",
    href: "https://wasserstein-regimes.vercel.app",
  },
  {
    title: "GC-INF",
    meta: "Sole-Author Publication · IEEE ITSC, 2023",
    detail: "Developed a graph-convolutional and Informer model, evaluating four baselines across three horizons. Reduced 15-minute turning-ratio RMSE by 24% versus STGCN on SUMO-simulated traffic data. IEEE ITSC Session Chair and Team Canada ISEF finalist (Top 30).",
    href: "https://ieeexplore.ieee.org/abstract/document/10422188",
  },
  {
    title: "USACO Platinum",
    meta: "Top 1% nationally · 2023",
    detail: "Highest USACO division, promoted from Gold with a 1000/1000 score.",
  },
  {
    title: "High School Big Data & AI Challenge",
    meta: "National Champion · National Research Council Canada, 2024",
    detail: "Computer vision with Python and PyTorch.",
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
];

export const publications = [
  {
    title:
      "GC-INF: A Novel Adaptive Traffic Control System using Machine Learning for Turning Ratio Predictions",
    venue: "IEEE Intelligent Transportation Systems Conference",
    date: "2023",
    citations: 1,
    authorship: "Sole Author",
    href:
      "https://ieeexplore.ieee.org/abstract/document/10422188",
  },
  {
    title:
      "A Need For Speed: Enhancing F1 Race Cars with a Novel Computational Fluid Dynamics and Machine Learning Method",
    venue: "Highlights in Science, Engineering and Technology",
    date: "2023",
    citations: 2,
    authorship: null,
    href:
      "https://www.researchgate.net/publication/371141171_A_Need_For_Speed_Enhancing_F1_Race_Cars_with_a_Novel_Computational_Fluid_Dynamics_and_Machine_Learning_Method",
  },
] as const;
