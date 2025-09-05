import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.company.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog',
          '/about',
          '/services',
          '/contact',
          '/careers',
          '/team',
          '/case-studies',
          '/resources',
          '/technologies',
          '/industries',
        ],
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/private',
          '/temp',
          '/projects',
          '/*.json',
          '/*.xml',
          '/search',
          '/login',
          '/register',
          '/dashboard',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/temp',
          '/projects',
        ],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/temp',
          '/projects',
        ],
      },
      {
        userAgent: 'CCBot',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/temp',
          '/projects',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/blog',
          '/about',
          '/services',
          '/contact',
          '/careers',
          '/team',
          '/case-studies',
          '/resources',
          '/technologies',
          '/industries',
        ],
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/private',
          '/temp',
          '/projects',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/blog',
          '/about',
          '/services',
          '/contact',
          '/careers',
          '/team',
          '/case-studies',
          '/resources',
          '/technologies',
          '/industries',
        ],
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/private',
          '/temp',
          '/projects',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/blog/sitemap.xml`,
      `${baseUrl}/sitemap-categories.xml`,
      `${baseUrl}/sitemap-tags.xml`,
    ],
    host: baseUrl,
  };
}
