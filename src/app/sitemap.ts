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

    // Get all categories
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { name: 'asc' }
    });

    // Get all tags
    const tags = await prisma.tag.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { name: 'asc' }
    });

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
      {
        url: `${baseUrl}/about`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/careers`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];

    // Blog post pages
    const blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Category pages
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: category.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Tag pages
    const tagPages = tags.map((tag) => ({
      url: `${baseUrl}/blog/tag/${tag.slug}`,
      lastModified: tag.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Service pages
    const servicePages = siteConfig.company.services.map((service) => ({
      url: `${baseUrl}/services/${service.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // Technology pages
    const technologyPages = siteConfig.company.technologies.map((tech) => ({
      url: `${baseUrl}/technologies/${tech.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Industry pages
    const industryPages = siteConfig.company.industries.map((industry) => ({
      url: `${baseUrl}/industries/${industry.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Team member pages
    const teamPages = [
      {
        url: `${baseUrl}/team/${siteConfig.team.founder.name.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/team/${siteConfig.team.coFounder.name.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ];

    // Case study pages
    const caseStudyPages = [
      {
        url: `${baseUrl}/case-studies/fortune-500-digital-transformation`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/case-studies/ai-ml-healthcare-solutions`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/case-studies/cloud-architecture-enterprise`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
    ];

    // Resource pages
    const resourcePages = [
      {
        url: `${baseUrl}/resources/whitepapers`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/resources/webinars`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/resources/guides`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ];

    // Combine all sitemap entries
    const sitemap = [
      ...staticPages,
      ...blogPages,
      ...categoryPages,
      ...tagPages,
      ...servicePages,
      ...technologyPages,
      ...industryPages,
      ...teamPages,
      ...caseStudyPages,
      ...resourcePages,
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
