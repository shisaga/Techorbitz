import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCacheHeaders } from '../cache';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/blog/[slug] - Fetch single blog post
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const { slug } = params;

    console.log('Fetching post with slug:', slug);

    const post = await prisma.post.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      include: {
        author: {
          select: { 
            id: true, 
            name: true, 
            avatar: true, 
            bio: true,
            _count: {
              select: { posts: true, followers: true }
            }
          }
        },
        comments: {
          where: { isApproved: true },
          include: {
            author: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    if (!post) {
      console.log('Post not found:', slug);
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    console.log('Post found:', post.title);

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    // Log analytics
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
      console.error('Analytics error:', analyticsError);
      // Continue even if analytics fails
    }

    // Find related posts (simplified)
    const relatedPosts = await prisma.post.findMany({
      where: {
        id: { not: post.id },
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      },
      take: 3,
      orderBy: { publishedAt: 'desc' }
    });

    console.log('Found related posts:', relatedPosts.length);

    const response = NextResponse.json({
      post,
      relatedPosts
    });

    // Add cache headers for blog post
    const cacheHeaders = getCacheHeaders('blogPost');
    Object.entries(cacheHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[slug] - Update blog post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, content, excerpt, categoryIds, tagIds, coverImage, status } = body;

    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Calculate reading time
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        excerpt,
        readingTime,
        coverImage,
        status,
        publishedAt: status === 'PUBLISHED' && !existingPost.publishedAt ? new Date() : existingPost.publishedAt,
        categoryIds: categoryIds || [],
        tagIds: tagIds || []
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    return NextResponse.json(updatedPost);

  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[slug] - Delete blog post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { slug }
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}