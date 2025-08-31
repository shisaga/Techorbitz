import { NextRequest, NextResponse } from 'next/server';
import AIBlogGenerator from '@/lib/ai-blog-generator';

export async function POST(request: NextRequest) {
  try {
    const { count = 2 } = await request.json();

    // Validate environment variables
    const requiredEnvVars = [
      'OPENAI_API_KEY',
      'NEWSAPI_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required environment variables', 
          missing: missingVars 
        },
        { status: 400 }
      );
    }

    console.log(`Starting manual blog generation for ${count} posts...`);
    
    const generator = new AIBlogGenerator();
    const publishedPosts = await generator.generateAndPublishPosts(count);

    console.log(`Successfully generated and published ${publishedPosts.length} posts`);

    return NextResponse.json({
      success: true,
      message: `Generated and published ${publishedPosts.length} blog posts`,
      posts: publishedPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        url: post.canonicalUrl,
        publishedAt: post.publishedAt,
      })),
    });

  } catch (error) {
    console.error('Error in blog generation API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate blog posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Blog generation API endpoint',
    usage: {
      method: 'POST',
      body: {
        count: 'number (optional, default: 2)'
      },
      response: {
        success: 'boolean',
        message: 'string',
        posts: 'array of published posts'
      }
    }
  });
}
