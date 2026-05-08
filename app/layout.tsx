import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LightsOutIntro } from "@/components/intro/LightsOutIntro";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
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

export const metadata: Metadata = {
  title: `${site.name} - CS @ Columbia`,
  description:
    "Ken Cheng - CS @ Columbia (Egleston Scholar). I build fast systems for machine learning and quant. IEEE-published, USACO Platinum, Quantiv founder.",
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
      className={`${archivo.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <div className="v2-bg-carbon" aria-hidden />
        <div className="v2-bg-glow" aria-hidden />
        <LightsOutIntro />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
