import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://techonigx.com';

  // Static pages with SEO priorities
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#expertise`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#clients`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  try {
    // Dynamic blog posts with high SEO priority
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
        views: true,
        likesCount: true
      },
      orderBy: { publishedAt: 'desc' }
    });

    const blogPages = posts.map((post) => {
      // Higher priority for popular posts
      const popularity = post.views + (post.likesCount * 10);
      const priority = Math.min(0.9, 0.7 + (popularity / 10000));
      
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: Math.round(priority * 10) / 10,
      };
    });

    // Category pages for SEO
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true }
    });

    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Tag pages for long-tail SEO
    const tags = await prisma.tag.findMany({
      select: { slug: true, updatedAt: true }
    });

    const tagPages = tags.map((tag) => ({
      url: `${baseUrl}/blog/tag/${tag.slug}`,
      lastModified: tag.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Author pages for authority building
    const authors = await prisma.user.findMany({
      where: { role: { in: ['AUTHOR', 'ADMIN'] } },
      select: { 
        id: true, 
        name: true, 
        updatedAt: true,
        _count: { select: { posts: true } }
      }
    });

    const authorPages = authors
      .filter(author => author._count.posts > 0 && author.name)
      .map((author) => ({
        url: `${baseUrl}/author/${(author.name || 'author').toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: author.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }));

    return [...staticPages, ...blogPages, ...categoryPages, ...tagPages, ...authorPages];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}

// Revalidate sitemap every hour
export const revalidate = 3600;
