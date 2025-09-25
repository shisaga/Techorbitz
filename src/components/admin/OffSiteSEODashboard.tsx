'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, Users, Share2, Link, BarChart3 } from 'lucide-react';

interface OffSiteSEOMetrics {
  backlinks: {
    total: number;
    newThisMonth: number;
    highDA: number;
    averageDA: number;
  };
  socialMedia: {
    linkedin: { followers: number; engagement: number };
    twitter: { followers: number; engagement: number };
    github: { stars: number; forks: number };
    medium: { followers: number; views: number };
  };
  directories: {
    total: number;
    completed: number;
    pending: number;
  };
  content: {
    guestPosts: number;
    syndicatedContent: number;
    mentions: number;
  };
}

export default function OffSiteSEODashboard() {
  const [metrics, setMetrics] = useState<OffSiteSEOMetrics>({
    backlinks: {
      total: 0,
      newThisMonth: 0,
      highDA: 0,
      averageDA: 0
    },
    socialMedia: {
      linkedin: { followers: 0, engagement: 0 },
      twitter: { followers: 0, engagement: 0 },
      github: { stars: 0, forks: 0 },
      medium: { followers: 0, views: 0 }
    },
    directories: {
      total: 0,
      completed: 0,
      pending: 0
    },
    content: {
      guestPosts: 0,
      syndicatedContent: 0,
      mentions: 0
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch metrics
    const fetchMetrics = async () => {
      try {
        // In a real implementation, this would fetch from your analytics API
        const mockMetrics: OffSiteSEOMetrics = {
          backlinks: {
            total: 45,
            newThisMonth: 8,
            highDA: 12,
            averageDA: 65
          },
          socialMedia: {
            linkedin: { followers: 1250, engagement: 85 },
            twitter: { followers: 890, engagement: 92 },
            github: { stars: 156, forks: 43 },
            medium: { followers: 2100, views: 15600 }
          },
          directories: {
            total: 15,
            completed: 8,
            pending: 7
          },
          content: {
            guestPosts: 3,
            syndicatedContent: 12,
            mentions: 28
          }
        };
        
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Off-Site SEO Dashboard</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Generate Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <ExternalLink className="w-4 h-4 mr-2 inline" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Backlinks</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.backlinks.total}</p>
              <p className="text-sm text-green-600">+{metrics.backlinks.newThisMonth} this month</p>
            </div>
            <Link className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Social Followers</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.socialMedia.linkedin.followers + metrics.socialMedia.twitter.followers + metrics.socialMedia.medium.followers}
              </p>
              <p className="text-sm text-blue-600">Across all platforms</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Directory Listings</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.directories.completed}</p>
              <p className="text-sm text-orange-600">{metrics.directories.pending} pending</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Content Mentions</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.content.mentions}</p>
              <p className="text-sm text-purple-600">This month</p>
            </div>
            <Share2 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Backlink Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Backlink Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{metrics.backlinks.total}</p>
            <p className="text-sm text-gray-600">Total Backlinks</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{metrics.backlinks.highDA}</p>
            <p className="text-sm text-gray-600">High DA Links (70+)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{metrics.backlinks.averageDA}</p>
            <p className="text-sm text-gray-600">Average DA</p>
          </div>
        </div>
      </div>

      {/* Social Media Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">LinkedIn</h3>
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.socialMedia.linkedin.followers}</p>
            <p className="text-sm text-gray-600">Followers</p>
            <p className="text-sm text-green-600">{metrics.socialMedia.linkedin.engagement}% engagement</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Twitter</h3>
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.socialMedia.twitter.followers}</p>
            <p className="text-sm text-gray-600">Followers</p>
            <p className="text-sm text-green-600">{metrics.socialMedia.twitter.engagement}% engagement</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">GitHub</h3>
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.socialMedia.github.stars}</p>
            <p className="text-sm text-gray-600">Stars</p>
            <p className="text-sm text-blue-600">{metrics.socialMedia.github.forks} forks</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Medium</h3>
              <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.socialMedia.medium.followers}</p>
            <p className="text-sm text-gray-600">Followers</p>
            <p className="text-sm text-purple-600">{metrics.socialMedia.medium.views.toLocaleString()} views</p>
          </div>
        </div>
      </div>

      {/* Directory Submissions Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Directory Submissions Progress</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Completed Submissions</span>
            <span className="text-sm text-gray-600">{metrics.directories.completed} / {metrics.directories.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(metrics.directories.completed / metrics.directories.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {metrics.directories.pending} submissions pending
          </p>
        </div>
      </div>

      {/* Content Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{metrics.content.guestPosts}</p>
            <p className="text-sm text-gray-600">Guest Posts Published</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{metrics.content.syndicatedContent}</p>
            <p className="text-sm text-gray-600">Syndicated Content</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{metrics.content.mentions}</p>
            <p className="text-sm text-gray-600">Brand Mentions</p>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Submit to remaining directories</p>
              <p className="text-sm text-gray-600">{metrics.directories.pending} pending submissions</p>
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
              View List
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Increase social media engagement</p>
              <p className="text-sm text-gray-600">Focus on LinkedIn and Twitter</p>
            </div>
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
              Create Content
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Build more high-quality backlinks</p>
              <p className="text-sm text-gray-600">Target DA 70+ websites</p>
            </div>
            <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
              Start Outreach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
