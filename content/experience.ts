export type Experience = {
  id: string;
  role: string;
  org: string;
  location: string;
  dates: string;
  tags: string[];
  bullets: string[];
  awards?: string[];
  links?: { label: string; href: string }[];
  image?: string;
  imageAlt?: string;
};

export const experiences: Experience[] = [
  {
    id: "embers",
    role: "Machine Learning Lead & Winner",
    org: "LA Hacks · Embers",
    location: "University of California - Los Angeles",
    dates: "04/2025",
    tags: ["React", "Flask", "Python", "TypeScript", "APIs", "Supabase"],
    bullets: [
      "Led team to develop Embers, a React + Python/Flask computer vision app achieving 90%+ detection accuracy in auto-inventorying household items from 30-second videos, streamlining insurance claims for wildfire survivors.",
      "Integrated Google Gemini, ElevenLabs, and OpenAI Whisper APIs into an intelligent voice-first chatbot assistant, enabling personalized asset valuation and reducing manual claim documentation time by an estimated 50%.",
    ],
    awards: [
      "Top 5 Finalist out of 172 teams",
      "Best Use of Google Gemini API",
      "Best Financial Tech Project",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/kenchengkc/embers" },
    ],
    image: "/images/embers/cover.png",
    imageAlt: "Embers app: wildfire insurance claim assistant",
  },
];
