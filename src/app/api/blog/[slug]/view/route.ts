import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// POST /api/blog/[slug]/view - Track a view for a blog post
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const { slug } = params;

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { 
        views: { increment: 1 }
      }
    });

    // Log analytics (optional - don't fail if this doesn't work)
    try {
      await prisma.analytics.create({
        data: {
          postId: post.id,
          event: 'view',
          userAgent: request.headers.get('user-agent') || '',
          referrer: request.headers.get('referer') || ''
        }
      });
    } catch (analyticsError) {
      // Analytics is optional, don't fail the request
      console.error('Analytics error (non-critical):', analyticsError);
    }

    return NextResponse.json({
      success: true,
      views: updatedPost.views
    });

  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}
