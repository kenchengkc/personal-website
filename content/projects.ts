export type Project = {
  id: string;
  title: string;
  subtitle: string;
  dates: string;
  tags: string[];
  bullets: string[];
  callout?: string;
  links?: { label: string; href: string }[];
  image?: string;
  imageAlt?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "quantiv",
    title: "Quantiv",
    subtitle: "Options Trading Data Platform · ML for Volatility",
    dates: "07/2025 - Present",
    tags: [
      "Next.js",
      "FastAPI",
      "SQL",
      "AWS EC2",
      "Redis",
      "Docker",
      "XGBoost",
      "DuckDB",
    ],
    bullets: [
      "Built a Next.js + Python (FastAPI) options analytics platform to predict implied earnings moves for 50-100 tickers weekly, combining mathematical IV models with ML (XGBoost) on historical Greeks and volatility.",
      "Integrated Docker containerization for faster deployment and Redis caching to reduce query latency to 100ms.",
      "Engineered a data pipeline (DuckDB + Parquet) processing 1B+ option chain and volatility history records.",
      "Reduced data sync time by ~90% through atomic directory swap and rsync staging, ensuring zero-downtime updates of large option chain datasets on AWS EC2.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/kenchengkc/quantiv" },
    ],
    image: "/images/quantiv/cover.png",
    imageAlt: "Quantiv options analytics dashboard",
    featured: true,
  },
  {
    id: "gc-inf",
    title: "GC-INF",
    subtitle: "Deep Learning Traffic Forecast Model using Turning Ratios",
    dates: "09/2022 - 10/2023",
    tags: ["PyTorch", "Scikit-learn", "Data pipelines"],
    bullets: [
      "Designed GC-INF, a hybrid Graph ConvNet + Informer model for adaptive traffic signal control in PyTorch, improving intersection turning ratio forecasts by 24% RMSE compared to prior state-of-the-art models.",
      "Built full ML pipeline with Chebyshev graph convolutions, ProbSparse attention, Adam optimizer + cosine decay.",
    ],
    callout:
      "Single-author publication · IEEE ITSC 2023 Session Chair · Team Canada-ISEF Finalist (Top 30)",
    links: [
      {
        label: "IEEE Publication",
        href: "https://ieeexplore.ieee.org/",
      },
    ],
    image: "/images/gc-inf/cover.png",
    imageAlt: "GC-INF model architecture diagram",
    featured: true,
  },
  {
    id: "vrp-solver",
    title: "Vehicle Routing Problem Solver with ML",
    subtitle: "Research with Dr. Yu Yang, University of Florida",
    dates: "06/2023 - 08/2023",
    tags: ["C++", "CMake", "SLURM", "Java", "JavaFX"],
    bullets: [
      "Improved C++ VRP solver with ML and data mining, reducing compute time on TB-scale datasets by 15%.",
      "Developed a Java-based visualization tool for route solutions, enabling interpretable insights for researchers.",
    ],
    image: "/images/vrp/cover.png",
    imageAlt: "VRP route visualization tool",
  },
];
