import type { Metadata } from "next";
import { Libre_Franklin, Lora } from "next/font/google";
import "./globals.css";
import { LightsOutIntro } from "@/components/intro/LightsOutIntro";
import { ScrollRevealController } from "@/components/motion/ScrollRevealController";
import { Starfield } from "@/components/sections/Starfield";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});


const isVercel = process.env.VERCEL === "1";

export const metadata: Metadata = {
  title: `${site.name} - CS @ Columbia`,
  description:
    "Ken Cheng, Columbia CS (Egleston Scholar). Founder of Quantiv (options-implied earnings moves on Vercel, DuckDB + LightGBM pipeline, live quotes). IEEE-published, USACO Platinum.",
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
      className={`${libreFranklin.variable} ${lora.variable}`}
    >
      <body suppressHydrationWarning>
        <div className="v2-bg-carbon" aria-hidden />
        <div className="v2-bg-glow" aria-hidden />
        <Starfield className="v2-stars--page" />
        <LightsOutIntro />
        <ScrollRevealController />
        {children}
        {isVercel ? <Analytics /> : null}
      </body>
    </html>
  );
}
