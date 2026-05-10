import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LightsOutIntro } from "@/components/intro/LightsOutIntro";
import { Starfield } from "@/components/sections/Starfield";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-brand",
  display: "swap",
});

const isVercel = process.env.VERCEL === "1";

export const metadata: Metadata = {
  title: `${site.name} - CS @ Columbia`,
  description:
    "Ken Cheng, Columbia CS (Egleston Scholar). Founder of Quantiv (options-implied earnings analytics, LightGBM + DuckDB at billion-row scale). IEEE-published, USACO Platinum.",
  metadataBase: new URL("https://kencheng.dev"),
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
      className={`${archivo.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${montserrat.variable}`}
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
