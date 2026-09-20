import type { Metadata } from "next";
import { Libre_Franklin, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ScrollExperience } from "@/components/motion/ScrollExperience";
import { site } from "@/lib/site";
import "./globals.css";

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
    <html lang="en" className={`${libreFranklin.variable} ${lora.variable}`}>
      <body>
        <ScrollExperience />
        {children}
        {isVercel ? <Analytics /> : null}
      </body>
    </html>
  );
}
