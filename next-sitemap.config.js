/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://techxak.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  
  // Custom transformation for blog posts
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path.includes('/blog/') ? 'weekly' : 'daily',
      priority: path === '/' ? 1.0 : path.includes('/blog/') ? 0.8 : 0.7,
      lastmod: new Date().toISOString(),
    }
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next']
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/']
      }
    ],
    additionalSitemaps: [
      'https://techxak.com/sitemap.xml',
      'https://techxak.com/rss.xml'
    ]
  },

  // Additional paths for dynamic blog posts
  additionalPaths: async (config) => {
    const result = [];
    
    try {
      // Import Prisma client to fetch blog posts from database
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // Fetch all published blog posts
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

      // Add all blog posts to sitemap
      for (const post of posts) {
        result.push({
          loc: `/blog/${post.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: post.updatedAt.toISOString()
        });
      }
      
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error generating additional paths:', error);
    }

    return result;
  }
};
