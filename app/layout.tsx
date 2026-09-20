import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ScrollExperience } from "@/components/motion/ScrollExperience";
import { site } from "@/lib/site";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "600"],
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
    <html lang="en" className={mulish.variable}>
      <body>
        <ScrollExperience />
        {children}
        {isVercel ? <Analytics /> : null}
      </body>
    </html>
  );
}
