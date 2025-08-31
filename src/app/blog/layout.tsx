import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Blog - Latest Insights & Trends | TechOrbitze",
  description: "Discover the latest technology trends, development best practices, AI/ML insights, AWS cloud solutions, IoT innovations, and expert tips from TechOrbitze's team of professionals.",
  keywords: "tech blog, web development tutorials, AI machine learning, AWS cloud computing, IoT solutions, Oracle database, medical software, HIPAA compliance, video editing, graphic design, technology trends",
  openGraph: {
    title: "Tech Blog - Latest Insights & Trends | TechOrbitze",
    description: "Expert insights on web development, AI/ML, AWS cloud, IoT, and more from Fortune 500 technology consultants.",
    type: "website",
    url: "https://techorbitze.com/blog"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Blog - Latest Insights & Trends | TechOrbitze",
    description: "Expert insights on web development, AI/ML, AWS cloud, IoT, and more from Fortune 500 technology consultants."
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
