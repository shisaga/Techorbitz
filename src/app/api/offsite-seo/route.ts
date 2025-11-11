import { NextRequest, NextResponse } from 'next/server';
import { offsiteSEOManager } from '@/lib/offsite-seo-manager';

/**
 * GET /api/offsite-seo
 * Get off-site SEO report and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const periodDays = parseInt(searchParams.get('period') || '30');

    switch (action) {
      case 'report':
        const report = offsiteSEOManager.generateReport(periodDays);
        return NextResponse.json({
          success: true,
          report
        });

      case 'pending-followups':
        const followUps = offsiteSEOManager.getPendingFollowUps();
        return NextResponse.json({
          success: true,
          followUps,
          count: followUps.length
        });

      case 'unlinked-mentions':
        const mentions = offsiteSEOManager.getUnlinkedMentions();
        return NextResponse.json({
          success: true,
          mentions,
          count: mentions.length
        });

      case 'export':
        const data = offsiteSEOManager.exportData();
        return NextResponse.json({
          success: true,
          data
        });

      default:
        // Default: return summary
        const summary = offsiteSEOManager.generateReport(30);
        return NextResponse.json({
          success: true,
          summary,
          actions: {
            report: '/api/offsite-seo?action=report&period=30',
            pendingFollowups: '/api/offsite-seo?action=pending-followups',
            unlinkedMentions: '/api/offsite-seo?action=unlinked-mentions',
            export: '/api/offsite-seo?action=export'
          }
        });
    }
  } catch (error) {
    console.error('Off-site SEO API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch off-site SEO data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/offsite-seo
 * Add off-site SEO activities
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'add-backlink':
        offsiteSEOManager.addBacklink(data);
        return NextResponse.json({
          success: true,
          message: 'Backlink added successfully'
        });

      case 'track-social':
        offsiteSEOManager.trackSocialMetrics(data);
        return NextResponse.json({
          success: true,
          message: 'Social metrics tracked successfully'
        });

      case 'add-mention':
        offsiteSEOManager.addBrandMention(data);
        return NextResponse.json({
          success: true,
          message: 'Brand mention added successfully'
        });

      case 'create-outreach':
        const campaignId = offsiteSEOManager.createOutreachCampaign(data);
        return NextResponse.json({
          success: true,
          message: 'Outreach campaign created successfully',
          campaignId
        });

      case 'update-outreach':
        offsiteSEOManager.updateOutreachStatus(
          data.id,
          data.status,
          data.notes
        );
        return NextResponse.json({
          success: true,
          message: 'Outreach campaign updated successfully'
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            validActions: [
              'add-backlink',
              'track-social',
              'add-mention',
              'create-outreach',
              'update-outreach'
            ]
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Off-site SEO API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process off-site SEO action',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

