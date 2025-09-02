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
      // In a real implementation, you would fetch from your database
      // For now, we'll use static paths
      const blogSlugs = [
        'the-future-of-ai-in-web-development-transforming-code-creation',
        'aws-cloud-architecture-building-scalable-enterprise-solutions',
        'iot-in-healthcare-revolutionary-patient-monitoring-systems'
      ];

      for (const slug of blogSlugs) {
        result.push({
          loc: `/blog/${slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error generating additional paths:', error);
    }

    return result;
  }
};
