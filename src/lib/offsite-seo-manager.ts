/**
 * Off-Site SEO Manager
 * Tracks and manages off-site SEO activities
 */

export interface BacklinkData {
  url: string;
  sourceUrl: string;
  sourceDomain: string;
  domainAuthority?: number;
  anchorText: string;
  linkType: 'dofollow' | 'nofollow';
  dateAcquired: Date;
  status: 'active' | 'lost' | 'pending';
  category: 'guest-post' | 'resource-page' | 'broken-link' | 'haro' | 'directory' | 'other';
}

export interface SocialMetrics {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'youtube' | 'reddit' | 'medium' | 'devto';
  followers: number;
  engagement: number;
  posts: number;
  reach: number;
  date: Date;
}

export interface BrandMention {
  url: string;
  source: string;
  mentionText: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  hasLink: boolean;
  dateFound: Date;
  contacted: boolean;
}

export interface OutreachCampaign {
  id: string;
  type: 'guest-post' | 'resource-page' | 'broken-link' | 'partnership';
  targetDomain: string;
  contactEmail: string;
  status: 'pending' | 'sent' | 'replied' | 'accepted' | 'rejected';
  dateSent?: Date;
  dateReplied?: Date;
  followUpCount: number;
  notes: string;
}

export interface OffsiteSEOReport {
  period: string;
  backlinks: {
    total: number;
    new: number;
    lost: number;
    byCategory: Record<string, number>;
    averageDA: number;
  };
  social: {
    totalFollowers: number;
    totalEngagement: number;
    topPlatform: string;
    growthRate: number;
  };
  brandMentions: {
    total: number;
    withLinks: number;
    withoutLinks: number;
    sentiment: Record<string, number>;
  };
  outreach: {
    sent: number;
    replied: number;
    accepted: number;
    replyRate: number;
    acceptanceRate: number;
  };
  domainAuthority: number;
  recommendations: string[];
}

export class OffsiteSEOManager {
  private backlinks: BacklinkData[] = [];
  private socialMetrics: SocialMetrics[] = [];
  private brandMentions: BrandMention[] = [];
  private outreachCampaigns: OutreachCampaign[] = [];

  /**
   * Add a new backlink
   */
  addBacklink(backlink: Omit<BacklinkData, 'dateAcquired' | 'status'>): void {
    this.backlinks.push({
      ...backlink,
      dateAcquired: new Date(),
      status: 'active'
    });
  }

  /**
   * Track social media metrics
   */
  trackSocialMetrics(metrics: Omit<SocialMetrics, 'date'>): void {
    this.socialMetrics.push({
      ...metrics,
      date: new Date()
    });
  }

  /**
   * Add brand mention
   */
  addBrandMention(mention: Omit<BrandMention, 'dateFound' | 'contacted'>): void {
    this.brandMentions.push({
      ...mention,
      dateFound: new Date(),
      contacted: false
    });
  }

  /**
   * Create outreach campaign
   */
  createOutreachCampaign(campaign: Omit<OutreachCampaign, 'id' | 'status' | 'followUpCount'>): string {
    const id = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.outreachCampaigns.push({
      ...campaign,
      id,
      status: 'pending',
      followUpCount: 0
    });

    return id;
  }

  /**
   * Update outreach campaign status
   */
  updateOutreachStatus(
    id: string, 
    status: OutreachCampaign['status'],
    notes?: string
  ): void {
    const campaign = this.outreachCampaigns.find(c => c.id === id);
    if (campaign) {
      campaign.status = status;
      if (status === 'sent' && !campaign.dateSent) {
        campaign.dateSent = new Date();
      }
      if (status === 'replied' && !campaign.dateReplied) {
        campaign.dateReplied = new Date();
      }
      if (notes) {
        campaign.notes = notes;
      }
    }
  }

  /**
   * Generate off-site SEO report
   */
  generateReport(periodDays: number = 30): OffsiteSEOReport {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);

    // Backlink analysis
    const activeBacklinks = this.backlinks.filter(b => b.status === 'active');
    const newBacklinks = activeBacklinks.filter(b => b.dateAcquired >= cutoffDate);
    const lostBacklinks = this.backlinks.filter(
      b => b.status === 'lost' && b.dateAcquired >= cutoffDate
    );

    const backlinksByCategory = activeBacklinks.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageDA = activeBacklinks.reduce((sum, b) => 
      sum + (b.domainAuthority || 0), 0
    ) / activeBacklinks.length || 0;

    // Social metrics analysis
    const recentSocial = this.socialMetrics.filter(m => m.date >= cutoffDate);
    const totalFollowers = recentSocial.reduce((sum, m) => sum + m.followers, 0);
    const totalEngagement = recentSocial.reduce((sum, m) => sum + m.engagement, 0);
    
    const platformEngagement = recentSocial.reduce((acc, m) => {
      acc[m.platform] = (acc[m.platform] || 0) + m.engagement;
      return acc;
    }, {} as Record<string, number>);
    
    const topPlatform = Object.entries(platformEngagement)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    // Calculate growth rate
    const oldMetrics = this.socialMetrics.filter(m => {
      const oldDate = new Date(cutoffDate);
      oldDate.setDate(oldDate.getDate() - periodDays);
      return m.date >= oldDate && m.date < cutoffDate;
    });
    const oldFollowers = oldMetrics.reduce((sum, m) => sum + m.followers, 0);
    const growthRate = oldFollowers > 0 
      ? ((totalFollowers - oldFollowers) / oldFollowers) * 100 
      : 0;

    // Brand mentions analysis
    const recentMentions = this.brandMentions.filter(m => m.dateFound >= cutoffDate);
    const mentionsWithLinks = recentMentions.filter(m => m.hasLink).length;
    const mentionsWithoutLinks = recentMentions.filter(m => !m.hasLink).length;
    
    const sentimentCounts = recentMentions.reduce((acc, m) => {
      acc[m.sentiment] = (acc[m.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Outreach analysis
    const recentOutreach = this.outreachCampaigns.filter(
      c => c.dateSent && c.dateSent >= cutoffDate
    );
    const sent = recentOutreach.length;
    const replied = recentOutreach.filter(c => c.status === 'replied' || c.status === 'accepted').length;
    const accepted = recentOutreach.filter(c => c.status === 'accepted').length;
    const replyRate = sent > 0 ? (replied / sent) * 100 : 0;
    const acceptanceRate = sent > 0 ? (accepted / sent) * 100 : 0;

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      backlinks: activeBacklinks.length,
      newBacklinks: newBacklinks.length,
      averageDA,
      replyRate,
      acceptanceRate,
      mentionsWithoutLinks
    });

    return {
      period: `Last ${periodDays} days`,
      backlinks: {
        total: activeBacklinks.length,
        new: newBacklinks.length,
        lost: lostBacklinks.length,
        byCategory: backlinksByCategory,
        averageDA: Math.round(averageDA)
      },
      social: {
        totalFollowers,
        totalEngagement,
        topPlatform,
        growthRate: Math.round(growthRate * 100) / 100
      },
      brandMentions: {
        total: recentMentions.length,
        withLinks: mentionsWithLinks,
        withoutLinks: mentionsWithoutLinks,
        sentiment: sentimentCounts
      },
      outreach: {
        sent,
        replied,
        accepted,
        replyRate: Math.round(replyRate * 100) / 100,
        acceptanceRate: Math.round(acceptanceRate * 100) / 100
      },
      domainAuthority: Math.round(averageDA),
      recommendations
    };
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(metrics: {
    backlinks: number;
    newBacklinks: number;
    averageDA: number;
    replyRate: number;
    acceptanceRate: number;
    mentionsWithoutLinks: number;
  }): string[] {
    const recommendations: string[] = [];

    // Backlink recommendations
    if (metrics.backlinks < 50) {
      recommendations.push('🎯 Focus on building more backlinks. Target: 50+ quality backlinks');
    }
    if (metrics.newBacklinks < 5) {
      recommendations.push('📈 Increase link building velocity. Aim for 5-10 new backlinks per month');
    }
    if (metrics.averageDA < 40) {
      recommendations.push('⬆️ Target higher authority sites (DA 40+) for guest posting');
    }

    // Outreach recommendations
    if (metrics.replyRate < 20) {
      recommendations.push('✉️ Improve outreach emails. Current reply rate is low. Personalize more!');
    }
    if (metrics.acceptanceRate < 10) {
      recommendations.push('📝 Enhance pitch quality. Focus on unique angles and value proposition');
    }

    // Brand mention recommendations
    if (metrics.mentionsWithoutLinks > 5) {
      recommendations.push(`🔗 Reach out to ${metrics.mentionsWithoutLinks} unlinked mentions to request links`);
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('🎉 Great job! Keep up the consistent off-site SEO efforts');
      recommendations.push('🚀 Consider scaling up: increase outreach volume by 20%');
    }

    return recommendations;
  }

  /**
   * Get pending outreach campaigns that need follow-up
   */
  getPendingFollowUps(daysSinceSent: number = 7): OutreachCampaign[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceSent);

    return this.outreachCampaigns.filter(c => 
      c.status === 'sent' && 
      c.dateSent && 
      c.dateSent <= cutoffDate &&
      c.followUpCount < 2
    );
  }

  /**
   * Get unlinked brand mentions for outreach
   */
  getUnlinkedMentions(): BrandMention[] {
    return this.brandMentions.filter(m => !m.hasLink && !m.contacted);
  }

  /**
   * Export data for external analysis
   */
  exportData(): {
    backlinks: BacklinkData[];
    socialMetrics: SocialMetrics[];
    brandMentions: BrandMention[];
    outreachCampaigns: OutreachCampaign[];
  } {
    return {
      backlinks: this.backlinks,
      socialMetrics: this.socialMetrics,
      brandMentions: this.brandMentions,
      outreachCampaigns: this.outreachCampaigns
    };
  }
}

// Singleton instance
export const offsiteSEOManager = new OffsiteSEOManager();

