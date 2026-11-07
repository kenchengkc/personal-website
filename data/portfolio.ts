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
      "Shipped version-controlled JSON configuration delivery through Python, AWS Lambda, S3, and internal APIs, with infrastructure as code in TypeScript using AWS CDK.",
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
    eyebrow: "Founder & Lead Engineer · Earnings Forecasting with LightGBM",
    date: "Jul 2025 – Present",
    summary:
      "Built an open-source platform for researching earnings announcements. Users can screen upcoming earnings, save tickers to a watchlist, and compare the options-implied price move with the model forecast and past earnings reactions.",
    details: [
      "Trained six LightGBM models for point and quantile forecasts. On chronological development holdouts, weighted mean absolute error was 31% lower than the options-implied baseline. Also tested four walk-forward windows with a five-day purge and monitored model drift.",
      "Nightly GitHub Actions jobs check market data for freshness and run batch forecasts using DuckDB and Parquet. The calendar, screener, and ticker pages read precomputed JSON, so users can browse the results without waiting for a database query or a model to run.",
      "FastAPI verifies model signatures and SHA-256 digests before switching models. A failed update leaves the last verified model in service. Regression tests cover corrupt downloads, mismatched bundles, missing features, and crossed quantiles. Redis caches live quotes.",
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
        value: "250+",
        label: "monthly active users",
        count: { from: 0, to: 250, suffix: "+", durationMs: 1900 },
      },
    ],
    stack: "Next.js, TypeScript, Python, LightGBM, DuckDB, Parquet, PostgreSQL, Redis, FastAPI",
    href: "https://usequantiv.com",
    hrefLabel: "Open Quantiv",
    demo: "quantiv",
  },
  {
    name: "Financial Document Retrieval Engine",
    eyebrow: "SEC Filing Search · Vector Databases & Citation Verification",
    date: "Jun 2026 – Present",
    summary:
      "Built an open-source financial research platform over SEC filings, combining PostgreSQL full-text search and pgvector approximate nearest-neighbor search with citation verification, evidence-based abstention, and point-in-time filtering.",
    details: [
      "Multi-query expansion raised Recall@5 from 0.152 to 0.212 on a 33-query benchmark. Half-precision vectors reduced database size by 27%, from 15 to 11 GB, with no observed top-10 ranking change in benchmark comparisons.",
      "Batched embeddings, approximate nearest-neighbor search, and bounded candidate pools cut 95th-percentile cross-company retrieval latency from approximately 59 seconds to 1.74 seconds in a retrieval benchmark.",
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
    eyebrow: "Computer Vision for Property Insurance",
    date: "Apr 2025 · LA Hacks",
    summary:
      "Led a four-person team that built Embers. A homeowner can record a 30-second walkthrough and get a photo inventory with estimated replacement values for an insurance claim.",
    details: [
      "YOLOv11 tracks items across frames so a chair seen from several angles gets one inventory entry. The app saves item snapshots in Supabase, uses Gemini to estimate replacement costs, and lets homeowners search their inventory by voice with Whisper.",
      "Placed Top 5 of 172 teams and won the Google Gemini and Financial Tech prizes at LA Hacks 2025.",
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

type OtherWork = {
  title: string;
  meta: string;
  detail: string;
  href?: string;
  award?: { distinction: string; organization: string; year: string; highlight?: string };
};

export const otherWork: OtherWork[] = [
  {
    title: "Creative Machines Lab",
    meta: "Columbia · Undergraduate Deep Learning Researcher · Sep 2026 – Present",
    detail: "Built a reproducible pipeline for studying deceptive communication in language models, linking 1,602 recipient-answer records to factual-check evidence and 990 decoder-layer activation matrices. The latest controlled comparison collected 288 answers and 144 separate factual checks across Qwen3-8B reasoning modes and Llama-3.1-8B prompt styles, with unchanged model weights. Preserved prompts, token positions, model revisions, and activation checksums for review. Labels remain provisional pending human validation; principal component analysis and detector training have not yet been performed on this dataset.",
  },
  {
    title: "Wasserstein Regimes",
    meta: "Optimal Transport for Market Regime Clustering & Risk Forecasting · Sep 2026 – Present",
    detail: "Built a NumPy research platform for Wasserstein and joint sliced-Wasserstein clustering across five exchange-traded funds, with chronological validation, robustness controls, frozen-model scoring, and resumable parallel experiments. An exploratory study of 600 five-session risk forecasts did not demonstrate an advantage over four simpler baselines.",
    href: "https://wasserstein-regimes.vercel.app",
  },
  {
    title: "Aster",
    meta: "Parallel Hyperparameter Tuning for Noisy Simulations · Sep 2026 – Present",
    detail: "Built an open-source Python prototype for tuning noisy simulations through parallel evaluation, adaptive replication, early stopping, and independent audits. In one 16-configuration synthetic experiment, it selected the same candidate as full-budget search using 72 rather than 432 search evaluations.",
    href: "https://aster-hpo.vercel.app",
  },
  {
    title: "GC-INF Traffic Forecasting",
    meta: "Sole-Author Publication · IEEE Intelligent Transportation Systems Conference, 2023",
    detail: "Built a PyTorch model to predict the share of traffic turning in each direction at an intersection. Chebyshev graph convolutions capture relationships across the road network, and the Informer’s ProbSparse attention learns patterns in traffic history. Compared GC-INF with four baselines at 15, 30, and 45 minutes on SUMO-simulated traffic. At 15 minutes, GC-INF reduced turning-ratio root mean square error by 24% versus STGCN. Served as a conference Session Chair and was a Team Canada finalist for the International Science and Engineering Fair (Top 30).",
    href: "https://ieeexplore.ieee.org/abstract/document/10422188",
  },
  {
    title: "USACO Platinum",
    meta: "",
    award: { distinction: "Platinum", organization: "USA Computing Olympiad", year: "2023", highlight: "Top 1% nationally" },
    detail: "Highest division of the USA Computing Olympiad, promoted from Gold with a 1000/1000 score.",
  },
  {
    title: "Need for Speed",
    meta: "Formula 1 Aerodynamics · CFD & Neural Surrogates",
    award: { distinction: "Gold Medal", organization: "Canada-Wide Science Fair", year: "2022" },
    detail: "Computational fluid dynamics and neural surrogate modeling for Formula 1 aerodynamics, achieving a 43% drag reduction.",
  },
  {
    title: "Capacitated Vehicle Routing Problem Solver",
    meta: "",
    award: { distinction: "Best Paper", organization: "University of Florida Student Science Training Program", year: "2023" },
    detail: "Used machine learning to guide column generation in a C++ vehicle routing solver, cutting runtime by 15%. Ran benchmark cases as Slurm batch jobs and built a JavaFX viewer to inspect each vehicle’s route and debug solver output.",
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
    figure: {
      src: "/media/research/gcinf-model-architecture.png",
      width: 816,
      height: 528,
      alt: "Original GC-INF architecture: spatial and temporal inputs feed graph convolutional networks and Informer layers to predict traffic.",
      caption: "Figure 5 · Model architecture",
      label: "GC-INF model architecture",
    },
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
    figure: {
      src: "/media/research/f1-airfoil-pressure.png",
      width: 935,
      height: 707,
      alt: "Original ANSYS pressure contours around an airfoil cross-section, with a pressure legend in pascals and a length scale in metres.",
      caption: "ANSYS · Airfoil pressure field",
      label: "Need for Speed airfoil pressure field",
    },
  },
] as const;
