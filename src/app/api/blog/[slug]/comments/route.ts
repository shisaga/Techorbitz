import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/blog/[slug]/comments - Fetch comments for a blog post
export async function GET(request: NextRequest, context: RouteParams) {
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

    // Fetch approved comments
    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        isApproved: true
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      comments
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
