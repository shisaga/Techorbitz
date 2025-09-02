/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Static generation optimizations
    staticPageGenerationTimeout: 120,
    workerThreads: true,
    cpus: Math.max(1, Math.min(4, require('os').cpus().length)),
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
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Static generation settings
  output: 'standalone',
  trailingSlash: false,
  
  // Bundle analyzer and optimization
  webpack: (config, { dev, isServer, webpack }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
          // Separate large libraries
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 20,
          },
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide-react',
            chunks: 'all',
            priority: 20,
          },
        },
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Add performance hints
    config.performance = {
      hints: dev ? false : 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };

    // Optimize for static generation
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  
  // Headers for caching and performance
  async headers() {
    return [
      {
        source: '/api/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/blog/page/:page',
        destination: '/blog?page=:page',
        permanent: true,
      },
      {
        source: '/blog/category/:category/page/:page',
        destination: '/blog?category=:category&page=:page',
        permanent: true,
      },
      {
        source: '/blog/tag/:tag/page/:page',
        destination: '/blog?tag=:tag&page=:page',
        permanent: true,
      },
    ];
  },

  // Rewrites for dynamic routes
  async rewrites() {
    return [
      {
        source: '/blog/sitemap.xml',
        destination: '/api/blog/sitemap',
      },
      {
        source: '/blog/rss.xml',
        destination: '/api/blog/rss',
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Build-time optimizations
  swcMinify: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript validation during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint validation during build
  },
};

module.exports = nextConfig;
