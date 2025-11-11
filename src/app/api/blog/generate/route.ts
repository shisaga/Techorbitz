import { NextRequest, NextResponse } from 'next/server';
import { blogGeneratorWrapper } from '@/lib/blog-generator-wrapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = body.count || 2;
    const validateSEO = body.validateSEO !== false;
    const minSEOScore = body.minSEOScore || 60;

    if (count < 1 || count > 5) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 5' },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting blog generation for ${count} posts...`);

    const result = await blogGeneratorWrapper.generatePosts({
      count,
      validateSEO,
      minSEOScore,
      retryAttempts: 3,
      retryDelay: 2000
    });

    if (!result.success && result.posts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate any blog posts',
          errors: result.errors,
          warnings: result.warnings,
          stats: result.stats
        },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully generated ${result.posts.length} posts`);

    return NextResponse.json({
      success: true,
      message: `Generated and published ${result.posts.length} blog posts`,
      posts: result.posts.map(post => ({
        title: post.title,
        slug: post.slug,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://techxak.com'}/blog/${post.slug}`,
        publishedAt: post.publishedAt,
        seoScore: post.seoScore,
        readingTime: post.readingTime
      })),
      stats: result.stats,
      warnings: result.warnings,
      errors: result.errors
    });

  } catch (error) {
    console.error('❌ Error in blog generation API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate blog posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const healthCheck = await blogGeneratorWrapper.healthCheck();
    const stats = await blogGeneratorWrapper.getStatistics();

    return NextResponse.json({
      status: healthCheck.healthy ? 'healthy' : 'unhealthy',
      checks: healthCheck.checks,
      statistics: stats,
      timestamp: new Date().toISOString(),
      usage: {
        method: 'POST',
        body: {
          count: 'number (1-5, default: 2)',
          validateSEO: 'boolean (default: true)',
          minSEOScore: 'number (default: 60)'
        },
        response: {
          success: 'boolean',
          message: 'string',
          posts: 'array of published posts with SEO scores',
          stats: 'generation statistics',
          warnings: 'array of warnings',
          errors: 'array of errors'
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
