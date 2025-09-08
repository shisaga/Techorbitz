import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.company.url;
  const currentDate = new Date().toISOString();

  try {
    // Get all published blog posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true
      },
      orderBy: { publishedAt: 'desc' }
    });

    // Note: Categories and tags are not included in sitemap as they don't have dedicated pages
    // These routes (/blog/tag/* and /blog/category/*) are handled by middleware redirects

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      // Note: about, services, contact pages don't exist yet - these are handled by middleware redirects
      {
        url: `${baseUrl}/careers`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
    ];

    // Blog post pages
    const blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Category and tag pages removed - they don't exist as actual routes
    // These are handled by middleware redirects to prevent 404 errors

    // Note: Service, technology, industry, team, case study, and resource pages don't exist yet

    // Combine all sitemap entries
    const sitemap = [
      ...staticPages,
      ...blogPages,
    ];

    console.log(`Generated sitemap with ${sitemap.length} URLs`);
    return sitemap;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with basic pages
    return [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ];
  }
}

// Revalidate sitemap every hour
export const revalidate = 3600;
