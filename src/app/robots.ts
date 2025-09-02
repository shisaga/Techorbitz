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
          '/projects',
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
        ],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/temp',
        ],
      },
      {
        userAgent: 'CCBot',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/temp',
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
          '/projects',
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
          '/projects',
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
