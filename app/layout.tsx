import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ScrollExperience } from "@/components/motion/ScrollExperience";
import { site } from "@/lib/site";
import "./globals.css";
import "./project-demos.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const isVercel = process.env.VERCEL === "1";

export const metadata: Metadata = {
  title: "Ken Cheng | Software, ML, Quant",
  description:
    "Ken Cheng is a Columbia computer science student building software, machine learning, quantitative, and research systems.",
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
    <html lang="en" className={inter.variable}>
      <body>
        <ScrollExperience />
        {children}
        {isVercel ? <Analytics /> : null}
      </body>
    </html>
  );
}
