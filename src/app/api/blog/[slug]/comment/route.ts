import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// POST /api/blog/[slug]/comment - Add a comment to a blog post
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const { slug } = params;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

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

    // Get or create a default user for comments
    let defaultUser = await prisma.user.findFirst({
              where: { email: 'anonymous@techonigx.com' }
    });

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'anonymous@techonigx.com',
          name: 'Anonymous User',
          role: 'USER'
        }
      });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: post.id,
        authorId: defaultUser.id,
        isApproved: true // Auto-approve for now
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    // Update post comment count
    await prisma.post.update({
      where: { id: post.id },
      data: { commentsCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      comment
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    
    // Provide more specific error messages
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2023') {
        return NextResponse.json(
          { error: 'Invalid post or user reference' },
          { status: 400 }
        );
      }
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Comment already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create comment. Please try again.' },
      { status: 500 }
    );
  }
}
