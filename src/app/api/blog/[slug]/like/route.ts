import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// POST /api/blog/[slug]/like - Like/unlike a blog post
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

    // For now, we'll just increment the likes count
    // In a real app, you'd want to track individual user likes
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { 
        likesCount: { increment: 1 }
      }
    });

    return NextResponse.json({
      success: true,
      likesCount: updatedPost.likesCount
    });

  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    );
  }
}
