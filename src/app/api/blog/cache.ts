// Cache configuration for blog API endpoints
export const cacheConfig = {
  // Blog list cache - 5 minutes
  blogList: {
    revalidate: 300,
    tags: ['blog-posts']
  },
  
  // Individual blog post cache - 1 hour
  blogPost: {
    revalidate: 3600,
    tags: ['blog-post']
  },
  
  // Categories cache - 1 day
  categories: {
    revalidate: 86400,
    tags: ['categories']
  },
  
  // Tags cache - 1 day
  tags: {
    revalidate: 86400,
    tags: ['tags']
  }
};

// Cache headers for API responses
export const getCacheHeaders = (type: keyof typeof cacheConfig) => {
  const config = cacheConfig[type];
  
  return {
    'Cache-Control': `public, s-maxage=${config.revalidate}, stale-while-revalidate=${config.revalidate * 2}`,
    'CDN-Cache-Control': `public, max-age=${config.revalidate}`,
    'Vercel-CDN-Cache-Control': `public, max-age=${config.revalidate}`,
  };
};
