import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/analytics - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get basic stats
    const [
      totalPosts,
      totalViews,
      totalComments,
      totalUsers,
      publishedPosts,
      draftPosts,
      scheduledPosts
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.aggregate({
        _sum: { views: true }
      }),
      prisma.comment.count(),
      prisma.user.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.post.count({ where: { status: 'SCHEDULED' } })
    ]);

    // Get top performing posts
    const topPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gte: startDate }
      },
      select: {
        id: true,
        title: true,
        views: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: { views: 'desc' },
      take: 5
    });

    // Get daily views for chart
    const dailyViews = await prisma.analytics.groupBy({
      by: ['createdAt'],
      where: {
        event: 'view',
        createdAt: { gte: startDate }
      },
      _count: {
        event: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get traffic sources (simplified - you might want to enhance this)
    const trafficSources = [
      { source: 'Organic Search', percentage: 45, color: 'bg-blue-500' },
      { source: 'Direct', percentage: 25, color: 'bg-green-500' },
      { source: 'Social Media', percentage: 20, color: 'bg-purple-500' },
      { source: 'Referral', percentage: 10, color: 'bg-orange-500' }
    ];

    // Calculate engagement metrics
    const engagementMetrics = {
      comments: totalComments,
      shares: Math.floor((totalViews._sum.views || 0) * 0.1), // Estimate
      bookmarks: Math.floor((totalViews._sum.views || 0) * 0.05), // Estimate
      emailSubscribers: await prisma.newsletter.count({ where: { isActive: true } })
    };

    // Device breakdown (simplified - you might want to enhance this)
    const deviceBreakdown = [
      { device: 'Desktop', percentage: 45 },
      { device: 'Mobile', percentage: 42 },
      { device: 'Tablet', percentage: 13 }
    ];

    return NextResponse.json({
      overview: {
        totalPosts: totalPosts,
        totalViews: totalViews._sum.views || 0,
        totalComments: totalComments,
        totalUsers: totalUsers,
        publishedPosts,
        draftPosts,
        scheduledPosts
      },
      topPosts,
      dailyViews: dailyViews.map(day => ({
        date: day.createdAt.toISOString().split('T')[0],
        views: day._count.event
      })),
      trafficSources,
      engagementMetrics,
      deviceBreakdown
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
