import { NextRequest, NextResponse } from 'next/server';
import AIBlogGenerator from '@/lib/ai-blog-generator';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (you can add additional security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get configuration from environment
    const postsPerDay = parseInt(process.env.POSTS_PER_DAY || '2');
    const publishTimes = process.env.PUBLISH_TIMES?.split(',') || ['08:00', '20:00'];
    
    console.log(`Cron job triggered - generating ${postsPerDay} blog posts...`);
    
    const generator = new AIBlogGenerator();
    const publishedPosts = await generator.generateAndPublishPosts(postsPerDay);

    // Log the results
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'scheduled_blog_generation',
      postsRequested: postsPerDay,
      postsPublished: publishedPosts.length,
      posts: publishedPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        url: post.canonicalUrl,
      })),
    };

    console.log('Blog generation cron job completed:', JSON.stringify(logEntry, null, 2));

    return NextResponse.json({
      success: true,
      message: `Scheduled blog generation completed. Published ${publishedPosts.length} posts.`,
      log: logEntry,
    });

  } catch (error) {
    console.error('Error in scheduled blog generation:', error);
    
    const errorLog = {
      timestamp: new Date().toISOString(),
      action: 'scheduled_blog_generation',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    };

    console.error('Blog generation cron job failed:', JSON.stringify(errorLog, null, 2));

    return NextResponse.json(
      { 
        error: 'Scheduled blog generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        log: errorLog,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Blog generation cron endpoint',
    usage: {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_CRON_SECRET (optional)'
      },
      environment: {
        POSTS_PER_DAY: 'number of posts to generate (default: 2)',
        PUBLISH_TIMES: 'comma-separated times (default: 08:00,20:00)',
        CRON_SECRET: 'optional secret for authentication'
      }
    }
  });
}
