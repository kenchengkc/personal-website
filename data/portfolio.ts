export type FeaturedProject = {
  name: string;
  eyebrow: string;
  date: string;
  summary: string;
  metrics: string[];
  stack: string;
  href?: string;
  hrefLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  visual: {
    src: string;
    alt: string;
    width: number;
    height: number;
    fit?: "contain" | "cover";
    surface?: "light" | "dark";
  };
};

export const featuredProjects: FeaturedProject[] = [
  {
    name: "Amazon",
    eyebrow: "Software engineering",
    date: "Summer 2026",
    summary:
      "Built shared configuration infrastructure behind long-term supply-chain forecasting across 17 packages and services.",
    metrics: ["17 packages + services", "13 engineers", "~90% less manual comparison"],
    stack: "Python, TypeScript, AWS Lambda, S3, CDK",
    visual: {
      src: "/images/amazon/amazon-logo.svg",
      alt: "Amazon",
      width: 520,
      height: 220,
      fit: "contain",
      surface: "light",
    },
  },
  {
    name: "Quantiv",
    eyebrow: "Founder, product + ML",
    date: "2025 - present",
    summary:
      "Options and earnings analytics that turns live market data into expected-move forecasts and searchable research.",
    metrics: ["120k+ earnings records", "10k+ ticker identities", "~100 monthly active users"],
    stack: "Next.js, Python, LightGBM, DuckDB, Postgres, Redis",
    href: "https://usequantiv.com",
    hrefLabel: "Open Quantiv",
    visual: {
      src: "/images/quantiv/quantiv-color-banner.png",
      alt: "Quantiv",
      width: 900,
      height: 360,
      fit: "contain",
      surface: "dark",
    },
  },
  {
    name: "FDRE",
    eyebrow: "Research infrastructure",
    date: "2026 - present",
    summary:
      "A point-in-time SEC research engine with hybrid retrieval, citation verification, and reproducible cross-sectional analysis.",
    metrics: ["2.71M parsed chunks", "2,762 SEC filings", "100% issuer Recall@3"],
    stack: "FastAPI, Postgres, pgvector, LangGraph, Next.js",
    href: "https://thefdre.com",
    hrefLabel: "Open FDRE",
    secondaryHref:
      "https://github.com/kenchengkc/the-financial-document-retrieval-engine",
    secondaryLabel: "Source",
    visual: {
      src: "/media/fdre-research-answer.png",
      alt: "FDRE research answer with cited SEC filing evidence",
      width: 1350,
      height: 850,
      fit: "cover",
      surface: "dark",
    },
  },
  {
    name: "Embers",
    eyebrow: "Machine learning",
    date: "LA Hacks 2025",
    summary:
      "A claims-ready home inventory from a short video walkthrough, with real-time detection, valuation, and voice assistance.",
    metrics: ["Top 5 of 172 teams", "90%+ detection accuracy", "3 awards"],
    stack: "Python, YOLOv11, Gemini, React, Flask, Supabase",
    href: "https://devpost.com/software/insurefire",
    hrefLabel: "View project",
    visual: {
      src: "/media/embers-yolo-live-detection.png",
      alt: "Embers live object detection",
      width: 1280,
      height: 720,
      fit: "cover",
      surface: "dark",
    },
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
    meta: "2023",
    detail: "Advanced algorithms competition, promoted from Gold with a 1000/1000 score.",
  },
  {
    title: "Need for Speed",
    meta: "CWSF Gold, 2022",
    detail: "CFD plus neural surrogate modeling for Formula 1 aero, 43% drag reduction.",
  },
  {
    title: "CVRP Solver",
    meta: "UF, 2023",
    detail: "ML-assisted column generation for vehicle routing, 15% faster C++ solver.",
  },
] as const;

export const publications = [
  {
    title:
      "GC-INF: A Novel Adaptive Traffic Control System using Machine Learning for Turning Ratio Predictions",
    venue: "IEEE Intelligent Transportation Systems Conference",
    date: "2023",
    href:
      "https://www.researchgate.net/publication/378189206_GC-INF_A_Novel_Adaptive_Traffic_Control_System_using_Machine_Learning_for_Turning_Ratio_Predictions",
  },
  {
    title:
      "A Need For Speed: Enhancing F1 Race Cars with a Novel Computational Fluid Dynamics and Machine Learning Method",
    venue: "Highlights in Science, Engineering and Technology",
    date: "2023",
    href:
      "https://www.researchgate.net/publication/371141171_A_Need_For_Speed_Enhancing_F1_Race_Cars_with_a_Novel_Computational_Fluid_Dynamics_and_Machine_Learning_Method",
  },
] as const;
