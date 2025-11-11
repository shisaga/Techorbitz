/**
 * Blog Generator Wrapper with Enhanced Error Handling
 * Provides retry logic, fallbacks, and comprehensive error handling
 */

import AIBlogGenerator from './ai-blog-generator';
import { BlogSEOOptimizer } from './blog-seo-optimizer';
import { AdvancedSEOOptimizer } from './advanced-seo-optimizer';

interface GenerationOptions {
  count?: number;
  retryAttempts?: number;
  retryDelay?: number;
  validateSEO?: boolean;
  minSEOScore?: number;
}

interface GenerationResult {
  success: boolean;
  posts: any[];
  errors: string[];
  warnings: string[];
  stats: {
    requested: number;
    generated: number;
    failed: number;
    averageSEOScore?: number;
  };
}

export class BlogGeneratorWrapper {
  private generator: AIBlogGenerator;
  private defaultOptions: GenerationOptions = {
    count: 2,
    retryAttempts: 3,
    retryDelay: 2000,
    validateSEO: true,
    minSEOScore: 60
  };

  constructor() {
    this.generator = new AIBlogGenerator();
  }

  /**
   * Generate blog posts with comprehensive error handling
   */
  async generatePosts(options: GenerationOptions = {}): Promise<GenerationResult> {
    const opts = { ...this.defaultOptions, ...options };
    const result: GenerationResult = {
      success: false,
      posts: [],
      errors: [],
      warnings: [],
      stats: {
        requested: opts.count || 2,
        generated: 0,
        failed: 0
      }
    };

    console.log(`🚀 Starting blog generation: ${opts.count} posts requested`);

    try {
      // Validate environment variables
      const envCheck = this.validateEnvironment();
      if (!envCheck.valid) {
        result.errors.push(...envCheck.errors);
        result.warnings.push(...envCheck.warnings);
        
        if (envCheck.errors.length > 0) {
          console.error('❌ Environment validation failed:', envCheck.errors);
          return result;
        }
      }

      // Generate posts with retry logic
      for (let i = 0; i < (opts.count || 2); i++) {
        console.log(`\n📝 Generating post ${i + 1}/${opts.count}...`);
        
        const postResult = await this.generateSinglePostWithRetry(opts);
        
        if (postResult.success && postResult.post) {
          // Validate SEO if enabled
          if (opts.validateSEO) {
            // Basic SEO analysis
            const seoAnalysis = BlogSEOOptimizer.analyzeSEO(
              postResult.post.title,
              postResult.post.content,
              postResult.post.seoDescription
            );

            // Advanced SEO analysis for top rankings
            const advancedAnalysis = AdvancedSEOOptimizer.analyzeForTopRanking(
              postResult.post.title,
              postResult.post.content,
              postResult.post.seoDescription
            );

            console.log(`📊 Basic SEO Score: ${seoAnalysis.seoScore}/100`);
            console.log(`🏆 Advanced SEO Score: ${advancedAnalysis.overallScore}/100`);
            console.log(`   - Technical SEO: ${advancedAnalysis.technicalSEO.score}/100`);
            console.log(`   - Content Quality: ${advancedAnalysis.contentQuality.score}/100`);
            console.log(`   - On-Page SEO: ${advancedAnalysis.onPageSEO.score}/100`);
            console.log(`   - User Engagement: ${advancedAnalysis.userEngagement.score}/100`);

            if (advancedAnalysis.overallScore < (opts.minSEOScore || 60)) {
              result.warnings.push(
                `Post "${postResult.post.title}" has low SEO score: ${advancedAnalysis.overallScore}/100`
              );
              console.warn(`⚠️ Low SEO score: ${advancedAnalysis.overallScore}/100`);

              if (advancedAnalysis.technicalSEO.issues.length > 0) {
                console.warn('Technical Issues:', advancedAnalysis.technicalSEO.issues);
              }
              if (advancedAnalysis.contentQuality.issues.length > 0) {
                console.warn('Content Issues:', advancedAnalysis.contentQuality.issues);
              }
            }

            // Add SEO stats to post
            postResult.post.seoScore = advancedAnalysis.overallScore;
            postResult.post.basicSEOScore = seoAnalysis.seoScore;
            postResult.post.seoRecommendations = seoAnalysis.recommendations;
            postResult.post.advancedSEOAnalysis = advancedAnalysis;
          }

          result.posts.push(postResult.post);
          result.stats.generated++;
          console.log(`✅ Successfully generated: "${postResult.post.title}"`);
        } else {
          result.errors.push(postResult.error || 'Unknown error');
          result.stats.failed++;
          console.error(`❌ Failed to generate post ${i + 1}:`, postResult.error);
        }

        // Add delay between posts to avoid rate limiting
        if (i < (opts.count || 2) - 1) {
          await this.delay(1000);
        }
      }

      // Calculate average SEO score
      if (result.posts.length > 0 && opts.validateSEO) {
        const totalScore = result.posts.reduce((sum, post) => sum + (post.seoScore || 0), 0);
        result.stats.averageSEOScore = Math.round(totalScore / result.posts.length);
      }

      result.success = result.posts.length > 0;

      // Log final results
      console.log('\n' + '='.repeat(50));
      console.log('📊 Generation Summary:');
      console.log(`   Requested: ${result.stats.requested}`);
      console.log(`   Generated: ${result.stats.generated}`);
      console.log(`   Failed: ${result.stats.failed}`);
      if (result.stats.averageSEOScore) {
        console.log(`   Average SEO Score: ${result.stats.averageSEOScore}/100`);
      }
      console.log('='.repeat(50) + '\n');

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Fatal error: ${errorMessage}`);
      console.error('❌ Fatal error in blog generation:', error);
      return result;
    }
  }

  /**
   * Generate a single post with retry logic
   */
  private async generateSinglePostWithRetry(
    options: GenerationOptions
  ): Promise<{ success: boolean; post?: any; error?: string }> {
    const maxAttempts = options.retryAttempts || 3;
    const delay = options.retryDelay || 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`   Attempt ${attempt}/${maxAttempts}...`);
        
        const posts = await this.generator.generateAndPublishPosts(1);
        
        if (posts && posts.length > 0) {
          return { success: true, post: posts[0] };
        } else {
          throw new Error('No posts generated');
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`   ❌ Attempt ${attempt} failed:`, errorMessage);

        if (attempt < maxAttempts) {
          console.log(`   ⏳ Retrying in ${delay / 1000}s...`);
          await this.delay(delay);
        } else {
          return { success: false, error: errorMessage };
        }
      }
    }

    return { success: false, error: 'Max retry attempts reached' };
  }

  /**
   * Validate environment variables
   */
  private validateEnvironment(): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required variables
    if (!process.env.OPENAI_API_KEY) {
      errors.push('OPENAI_API_KEY is not set');
    }

    // Optional but recommended variables
    if (!process.env.NEWSAPI_KEY) {
      warnings.push('NEWSAPI_KEY is not set - will use fallback topics');
    }

    if (!process.env.PEXELS_API_KEY) {
      warnings.push('PEXELS_API_KEY is not set - image generation may be limited');
    }

    if (!process.env.STABILITY_API_KEY) {
      warnings.push('STABILITY_API_KEY is not set - will use Pexels for images');
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      warnings.push('NEXT_PUBLIC_SITE_URL is not set - using default URL');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get generator statistics
   */
  async getStatistics(): Promise<{
    totalPosts: number;
    publishedToday: number;
    averageReadingTime: number;
    topCategories: { name: string; count: number }[];
  }> {
    try {
      const { prisma } = await import('./prisma');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [totalPosts, publishedToday, posts] = await Promise.all([
        prisma.post.count({ where: { status: 'PUBLISHED' } }),
        prisma.post.count({
          where: {
            status: 'PUBLISHED',
            publishedAt: { gte: today }
          }
        }),
        prisma.post.findMany({
          where: { status: 'PUBLISHED' },
          select: { readingTime: true },
          take: 100
        })
      ]);

      const averageReadingTime = posts.length > 0
        ? Math.round(posts.reduce((sum, p) => sum + (p.readingTime || 0), 0) / posts.length)
        : 0;

      return {
        totalPosts,
        publishedToday,
        averageReadingTime,
        topCategories: [] // Can be enhanced with actual category data
      };

    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalPosts: 0,
        publishedToday: 0,
        averageReadingTime: 0,
        topCategories: []
      };
    }
  }

  /**
   * Health check for the blog generator
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    checks: { name: string; status: 'pass' | 'fail' | 'warn'; message: string }[];
  }> {
    const checks: { name: string; status: 'pass' | 'fail' | 'warn'; message: string }[] = [];

    // Check environment variables
    const envCheck = this.validateEnvironment();
    checks.push({
      name: 'Environment Variables',
      status: envCheck.errors.length > 0 ? 'fail' : envCheck.warnings.length > 0 ? 'warn' : 'pass',
      message: envCheck.errors.length > 0
        ? envCheck.errors.join(', ')
        : envCheck.warnings.length > 0
        ? envCheck.warnings.join(', ')
        : 'All required variables set'
    });

    // Check database connection
    try {
      const { prisma } = await import('./prisma');
      await prisma.$queryRaw`SELECT 1`;
      checks.push({
        name: 'Database Connection',
        status: 'pass',
        message: 'Connected successfully'
      });
    } catch (error) {
      checks.push({
        name: 'Database Connection',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Connection failed'
      });
    }

    const healthy = checks.every(check => check.status !== 'fail');

    return { healthy, checks };
  }
}

// Export singleton instance
export const blogGeneratorWrapper = new BlogGeneratorWrapper();

