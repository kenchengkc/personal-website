import type { Metadata } from "next";
import { DM_Serif_Display, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LightsOutIntro } from "@/components/intro/LightsOutIntro";
import { Starfield } from "@/components/sections/Starfield";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-hero-accent",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const isVercel = process.env.VERCEL === "1";

export const metadata: Metadata = {
  title: `${site.name} - CS @ Columbia`,
  description:
    "Ken Cheng, Columbia CS (Egleston Scholar). Founder of Quantiv (options-implied earnings analytics, LightGBM + DuckDB at billion-row scale). IEEE-published, USACO Platinum.",
  metadataBase: new URL("https://kencheng.dev"),
  icons: {
    icon: [{ url: "/images/kclogo.png", type: "image/png" }],
    apple: [{ url: "/images/kclogo.png", type: "image/png" }],
  },
  openGraph: {
    title: site.name,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrains.variable} ${dmSerifDisplay.variable}`}
    >
      <body>
        <div className="v2-bg-carbon" aria-hidden />
        <div className="v2-bg-glow" aria-hidden />
        <Starfield className="v2-stars--page" />
        <LightsOutIntro />
        {children}
        {isVercel ? <Analytics /> : null}
      </body>
    </html>
  );
}
