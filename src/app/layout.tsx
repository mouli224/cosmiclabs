import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CosmicLabs — Infinite Digital Possibilities",
  description:
    "CosmicLabs is a premium tech studio specialising in Web, AI, App Development and Data Pipelines. We build scalable digital universes.",
  keywords: [
    "CosmicLabs",
    "tech studio",
    "web development",
    "AI integration",
    "app development",
    "data pipelines",
  ],
  openGraph: {
    title: "CosmicLabs — Infinite Digital Possibilities",
    description:
      "We combine Web + AI + Data + Precision Engineering to build scalable digital universes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CosmicLabs — Infinite Digital Possibilities",
    description:
      "We combine Web + AI + Data + Precision Engineering to build scalable digital universes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white antialiased overflow-x-hidden noise-overlay">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
