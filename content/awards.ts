export type Award = {
  id: string;
  title: string;
  org: string;
  date: string;
  tags: string[];
  description?: string;
};

export const awards: Award[] = [
  {
    id: "usaco-platinum",
    title: "Platinum Division Qualifier: Perfect Score",
    org: "USA Computing Olympiad",
    date: "12/2023",
    tags: ["C++", "Adv. DSA", "gdb Profiling"],
    description: "Top 1% Competitive Programmer.",
  },
  {
    id: "nrc-bigdata",
    title: "National Champions: High School Big Data & AI Challenge",
    org: "National Research Council Canada",
    date: "02/2024",
    tags: ["Python", "PyTorch", "Jupyter", "Pillow"],
  },
];
