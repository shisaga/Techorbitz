import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// DELETE /api/admin/comments/[id] - Delete a comment (Admin only)
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const { id } = params;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          select: { id: true }
        }
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id }
    });

    // Update post comment count
    await prisma.post.update({
      where: { id: comment.post.id },
      data: { 
        commentsCount: { decrement: 1 }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
