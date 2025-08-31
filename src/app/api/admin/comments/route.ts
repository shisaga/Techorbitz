import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/comments - Fetch all comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    if (status && status !== 'ALL') {
      where.isApproved = status === 'APPROVED';
    }

    if (search) {
      where.content = { contains: search, mode: 'insensitive' };
    }

    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true, avatar: true }
          },
          post: {
            select: { id: true, title: true, slug: true }
          },
          parent: {
            select: { id: true, content: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.comment.count({ where })
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/admin/comments - Approve/Reject comments in bulk
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentIds, action } = body; // action: 'approve' or 'reject'

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json(
        { error: 'Comment IDs are required' },
        { status: 400 }
      );
    }

    const isApproved = action === 'approve';

    await prisma.comment.updateMany({
      where: { id: { in: commentIds } },
      data: { isApproved }
    });

    return NextResponse.json({ 
      message: `Comments ${action}d successfully`,
      updatedCount: commentIds.length
    });

  } catch (error) {
    console.error('Error updating comments:', error);
    return NextResponse.json(
      { error: 'Failed to update comments' },
      { status: 500 }
    );
  }
}
