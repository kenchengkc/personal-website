import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "Ken Cheng",
  description: site.description,
  metadataBase: new URL(site.url),
  icons: {
    icon: [{ url: "/images/kclogo.png", type: "image/png" }],
    apple: [{ url: "/images/kclogo.png", type: "image/png" }],
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
    <html lang="en" className={inter.variable} style={{ backgroundColor: "#0a0a0a", color: "#e7e7e4", colorScheme: "dark" }}>
      <body>
        <ScrollExperience />
        {children}
        {isVercel ? <Analytics /> : null}
      </body>
    </html>
  );
}
