// Static Site Generation (SSG) configuration for Next.js blog optimization
import { prisma } from './prisma';

export interface StaticGenerationConfig {
  // Blog post generation settings
  blogPosts: {
    batchSize: number;
    maxPosts: number;
    revalidateTime: number;
  };
  
  // Category and tag generation
  taxonomies: {
    revalidateTime: number;
    maxItems: number;
  };
  
  // Pagination settings
  pagination: {
    postsPerPage: number;
    maxPages: number;
  };
  
  // Cache settings
  cache: {
    memory: boolean;
    redis: boolean;
    cdn: boolean;
  };
}

// Default configuration
export const defaultConfig: StaticGenerationConfig = {
  blogPosts: {
    batchSize: 100,
    maxPosts: 1000,
    revalidateTime: 3600, // 1 hour
  },
  taxonomies: {
    revalidateTime: 7200, // 2 hours
    maxItems: 100,
  },
  pagination: {
    postsPerPage: 12,
    maxPages: 100,
  },
  cache: {
    memory: true,
    redis: false,
    cdn: true,
  },
};

// Static generation utilities
export class StaticGenerator {
  private config: StaticGenerationConfig;

  constructor(config: Partial<StaticGenerationConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Generate static paths for blog posts
  async generateBlogPostPaths(): Promise<{ slug: string }[]> {
    try {
      const totalPosts = await prisma.post.count({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
        }
      });

      const { batchSize, maxPosts } = this.config.blogPosts;
      const actualMaxPosts = Math.min(totalPosts, maxPosts);
      const batches = Math.ceil(actualMaxPosts / batchSize);
      const allSlugs: { slug: string }[] = [];

      for (let i = 0; i < batches; i++) {
        const posts = await prisma.post.findMany({
          where: {
            status: 'PUBLISHED',
            publishedAt: { lte: new Date() }
          },
          select: { slug: true },
          skip: i * batchSize,
          take: batchSize,
          orderBy: { publishedAt: 'desc' }
        });

        allSlugs.push(...posts.map(post => ({ slug: post.slug })));
      }

      console.log(`Generated static paths for ${allSlugs.length} blog posts`);
      return allSlugs;
    } catch (error) {
      console.error('Error generating blog post paths:', error);
      return [];
    }
  }

  // Generate static paths for pagination
  async generatePaginationPaths(): Promise<{ page: string }[]> {
    try {
      const totalPosts = await prisma.post.count({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
        }
      });

      const { postsPerPage, maxPages } = this.config.pagination;
      const totalPages = Math.min(Math.ceil(totalPosts / postsPerPage), maxPages);
      const pages = [];

      for (let i = 1; i <= totalPages; i++) {
        pages.push({ page: i.toString() });
      }

      console.log(`Generated static paths for ${totalPages} pagination pages`);
      return pages;
    } catch (error) {
      console.error('Error generating pagination paths:', error);
      return [];
    }
  }

  // Generate static paths for categories
  async generateCategoryPaths(): Promise<{ slug: string }[]> {
    try {
      const categories = await prisma.category.findMany({
        select: { slug: true },
        orderBy: { name: 'asc' },
        take: this.config.taxonomies.maxItems
      });

      const paths = categories.map(category => ({ slug: category.slug }));
      console.log(`Generated static paths for ${paths.length} categories`);
      return paths;
    } catch (error) {
      console.error('Error generating category paths:', error);
      return [];
    }
  }

  // Generate static paths for tags
  async generateTagPaths(): Promise<{ slug: string }[]> {
    try {
      const tags = await prisma.tag.findMany({
        select: { slug: true },
        orderBy: { name: 'asc' },
        take: this.config.taxonomies.maxItems
      });

      const paths = tags.map(tag => ({ slug: tag.slug }));
      console.log(`Generated static paths for ${paths.length} tags`);
      return paths;
    } catch (error) {
      console.error('Error generating tag paths:', error);
      return [];
    }
  }

  // Generate all static paths
  async generateAllPaths() {
    const [blogPosts, pagination, categories, tags] = await Promise.all([
      this.generateBlogPostPaths(),
      this.generatePaginationPaths(),
      this.generateCategoryPaths(),
      this.generateTagPaths()
    ]);

    return {
      blogPosts,
      pagination,
      categories,
      tags,
      total: blogPosts.length + pagination.length + categories.length + tags.length
    };
  }

  // Pre-generate data for static pages
  async pregenerateData() {
    try {
      console.log('Starting data pre-generation for static pages...');
      
      // Pre-generate blog post data
      const posts = await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
        },
        include: {
          author: {
            select: { id: true, name: true, avatar: true, bio: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        take: this.config.blogPosts.maxPosts
      });

      // Pre-generate taxonomy data
      const [categories, tags] = await Promise.all([
        prisma.category.findMany({
          select: { id: true, name: true, slug: true },
          orderBy: { name: 'asc' }
        }),
        prisma.tag.findMany({
          select: { id: true, name: true, slug: true },
          orderBy: { name: 'asc' },
          take: this.config.taxonomies.maxItems
        })
      ]);

      console.log(`Pre-generated data for ${posts.length} posts, ${categories.length} categories, and ${tags.length} tags`);
      
      return { posts, categories, tags };
    } catch (error) {
      console.error('Error pre-generating data:', error);
      return { posts: [], categories: [], tags: [] };
    }
  }

  // Get revalidation times
  getRevalidationTimes() {
    return {
      blogPosts: this.config.blogPosts.revalidateTime,
      taxonomies: this.config.taxonomies.revalidateTime,
      pagination: this.config.blogPosts.revalidateTime
    };
  }
}

// Export default instance
export const staticGenerator = new StaticGenerator();

// Export configuration
export { defaultConfig as staticConfig };
