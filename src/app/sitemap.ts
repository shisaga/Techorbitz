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

    // Static pages - matching the static sitemap.xml structure
    const staticPages = [
      {
        url: `${baseUrl}/robots.txt`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/sitemap.xml`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/careers`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/career`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/project-estimation`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/join-our-team`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/components-demo`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/try-our-product`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/start-project`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/schedule-meeting`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/website-builder`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/admin`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 1.0,
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

    // Note: All main public pages are now included in the sitemap

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
