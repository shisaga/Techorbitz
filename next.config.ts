/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Image optimization
  images: {
    domains: ['ui-avatars.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Basic settings
  compress: true,
  poweredByHeader: false,
  output: 'standalone',
  trailingSlash: false,
  
  // Build-time optimizations
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript validation during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint validation during build
  },
};

module.exports = nextConfig;
