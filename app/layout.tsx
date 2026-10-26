import type { Metadata, Viewport } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ScrollExperience } from "@/components/motion/ScrollExperience";
import { site } from "@/lib/site";
import "./globals.css";
import "./project-artwork.css";
import "./animated-artwork.css";
import "./amazon-artwork.css";
import "./model-artwork.css";
import "./research-artwork.css";
import "./speed-artwork.css";
import "./cvrp-artwork.css";
import "./product-flow-artwork.css";
import "./product-browser-preview.css";
import "./artwork-window.css";
import "./portfolio.css";
import "./skills.css";
import "./publications.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const isVercel = process.env.VERCEL === "1";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#d8dfe3",
};

export const metadata: Metadata = {
  title: "Ken Cheng",
  description: site.description,
  metadataBase: new URL(site.url),
  icons: {
    icon: [
      { url: "/images/icons/v1/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icons/v1/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/images/icons/v1/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${geistMono.variable}`} style={{ backgroundColor: "#d8dfe3", color: "#2e3c4c", colorScheme: "light" }}>
      <body>
        <ScrollExperience />
        {children}
        {isVercel ? <Analytics /> : null}
      </body>
    </html>
  );
}
