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
  title: "TechXak - Leading Technology Solutions & Development Partner",
  description: "TechXak provides cutting-edge technology solutions including web development, mobile apps, AI/ML, AWS cloud services, IoT solutions, and database expertise. We work with Google, Apple, McDonald's and other Fortune 500 companies. Expert hiring partner for affordable developer talent.",
  keywords: "web development, mobile apps, AI development, AWS cloud services, IoT solutions, Oracle database, medical software, HIPAA compliance, hiring partner, developer recruitment, technology consulting, Fortune 500 clients",
  authors: [{ name: "TechXak Team" }],
  creator: "TechXak",
  publisher: "TechXak",
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/chatgpt-logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/chatgpt-logo.png', type: 'image/png', sizes: '16x16' }
    ],
    apple: [
      { url: '/chatgpt-logo.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techxak.com",
    title: "TechXak - Leading Technology Solutions & Development Partner",
    description: "Expert technology solutions for Fortune 500 companies. Specializing in web development, mobile apps, AI/ML, AWS cloud, IoT, and database solutions.",
    siteName: "TechXak",
    images: [
      {
        url: "/chatgpt-logo.png",
        width: 1200,
        height: 630,
        alt: "TechXak - Technology Solutions with AI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TechXak - Leading Technology Solutions",
    description: "Expert technology solutions for Fortune 500 companies. Web development, mobile apps, AI/ML, AWS cloud services.",
    images: ["/chatgpt-logo.png"]
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/chatgpt-logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/chatgpt-logo.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/chatgpt-logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
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
