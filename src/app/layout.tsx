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
  title: {
    default: "TechXak - Leading Technology Solutions & Development Partner",
    template: "%s | TechXak - Technology Solutions"
  },
  description: "TechXak is driving the future with AI & software excellence. We provide cutting-edge technology solutions including web development, mobile apps, AI/ML, AWS cloud services, IoT solutions, and database expertise. We work with Google, Apple, McDonald's and other Fortune 500 companies.",
  keywords: [
    "web development", "mobile app development", "AI development", "machine learning", 
    "AWS cloud services", "IoT solutions", "Oracle database", "medical software", 
    "HIPAA compliance", "hiring partner", "developer recruitment", "technology consulting", 
    "Fortune 500 clients", "React development", "Node.js", "Python development",
    "cloud architecture", "microservices", "API development", "database design",
    "DevOps", "CI/CD", "agile development", "software architecture"
  ],
  authors: [{ name: "TechXak Team", url: "https://techxak.com" }],
  creator: "TechXak",
  publisher: "TechXak",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://techxak.com",
  },
  category: 'Technology',
  classification: 'Technology Services',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16' }
    ],
    apple: [
      { url: '/favicon.ico', sizes: '180x180', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico'
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techxak.com",
    title: "TechXak - Leading Technology Solutions & Development Partner",
    description: "Driving the future with AI & software excellence. Expert technology solutions for Fortune 500 companies. Specializing in web development, mobile apps, AI/ML, AWS cloud, IoT, and database solutions.",
    siteName: "TechXak",
    countryName: "United States",
    images: [
      {
        url: "https://techxak.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechXak - Technology Solutions with AI",
        type: "image/jpeg"
      }
    ],
    emails: ["contact@techxak.com"],
    phoneNumbers: ["+91-9876543210"],
    streetAddress: "Ahmedabad, Gujarat, India",
    locality: "Ahmedabad",
    region: "Gujarat",
    postalCode: "380001",
    countryName: "India"
  },
  twitter: {
    card: "summary_large_image",
    site: "@techxak",
    creator: "@techxak",
    title: "TechXak - Leading Technology Solutions",
    description: "Driving the future with AI & software excellence. Expert technology solutions for Fortune 500 companies. Web development, mobile apps, AI/ML, AWS cloud services.",
    images: ["/favicon.ico"]
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
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
        <meta name="google-adsense-account" content="ca-pub-9803515858146134" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9803515858146134" crossOrigin="anonymous"></script>
        <StructuredData />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
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
