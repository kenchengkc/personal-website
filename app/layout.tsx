import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { LightsOutIntro } from "@/components/intro/LightsOutIntro";
import { CarbonBg } from "@/components/common/CarbonBg";
import { site } from "@/lib/site";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    "Personal site of Ken Cheng — Computer Science at Columbia. ML, quantitative finance, and systems engineering. IEEE-published, USACO Platinum.",
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CarbonBg />
        <LightsOutIntro />
        <Nav />
        <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
