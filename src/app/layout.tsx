import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import StructuredData from "@/components/StructuredData";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Optimized fonts for performance and readability
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only load when needed
  fallback: ['Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace']
});

export const metadata: Metadata = {
  title: "TechOrbitze - Leading Technology Solutions & Development Partner",
  description: "TechOrbitze provides cutting-edge technology solutions including web development, mobile apps, AI/ML, AWS cloud services, IoT solutions, and database expertise. We work with Google, Apple, McDonald's and other Fortune 500 companies. Expert hiring partner for affordable developer talent.",
  keywords: "web development, mobile apps, AI development, AWS cloud services, IoT solutions, Oracle database, medical software, HIPAA compliance, hiring partner, developer recruitment, technology consulting, Fortune 500 clients",
  authors: [{ name: "TechOrbitze Team" }],
  creator: "TechOrbitze",
  publisher: "TechOrbitze",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techorbitze.com",
    title: "TechOrbitze - Leading Technology Solutions & Development Partner",
    description: "Expert technology solutions for Fortune 500 companies. Specializing in web development, mobile apps, AI/ML, AWS cloud, IoT, and database solutions.",
    siteName: "TechOrbitze",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechOrbitze - Technology Solutions"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TechOrbitze - Leading Technology Solutions",
    description: "Expert technology solutions for Fortune 500 companies. Web development, mobile apps, AI/ML, AWS cloud services.",
    images: ["/twitter-image.jpg"]
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ff6b47"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
