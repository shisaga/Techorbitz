// Cache configuration for optimal performance
export const cacheConfig = {
  // Blog post cache settings
  blogPost: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 600, // 10 minutes
    tags: ['blog', 'post']
  },
  
  // Related posts cache
  relatedPosts: {
    maxAge: 600, // 10 minutes
    staleWhileRevalidate: 1800, // 30 minutes
    tags: ['blog', 'related']
  },
  
  // Comments cache
  comments: {
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 300, // 5 minutes
    tags: ['blog', 'comments']
  },
  
  // Analytics cache
  analytics: {
    maxAge: 0, // No cache for analytics
    tags: ['analytics']
  }
};

// Cache headers generator
export function getCacheHeaders(type: keyof typeof cacheConfig) {
  const config = cacheConfig[type];
  return {
    'Cache-Control': `public, max-age=${config.maxAge}, s-maxage=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`,
    'CDN-Cache-Control': `public, max-age=${config.maxAge}`,
    'Vercel-CDN-Cache-Control': `public, max-age=${config.maxAge}`
  };
}

// In-memory cache for frequently accessed data
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global memory cache instance
export const memoryCache = new MemoryCache();
