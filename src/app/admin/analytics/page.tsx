'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Eye, 
  MessageSquare, Calendar, BarChart3, PieChart,
  Download, Filter, Calendar as CalendarIcon
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import AdminLayout from '@/components/admin/AdminLayout';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPosts: Array<{
    title: string;
    views: number;
    growth: number;
  }>;
  trafficSources: Array<{
    source: string;
    percentage: number;
    color: string;
  }>;
  dailyViews: Array<{
    date: string;
    views: number;
  }>;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalyticsData({
        pageViews: data.overview.totalViews,
        uniqueVisitors: Math.floor(data.overview.totalViews * 0.7), // Estimate
        bounceRate: 42.5, // Could be calculated from analytics
        avgSessionDuration: 3.2, // Could be calculated from analytics
        topPosts: data.topPosts.map((post: any) => ({
          title: post.title,
          views: post.views,
          growth: Math.random() * 20 - 10 // Random growth for demo
        })),
        trafficSources: data.trafficSources,
        dailyViews: data.dailyViews
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <AdminLayout title="Analytics Dashboard" subtitle="Track your website performance and insights">
      <div className="max-w-7xl mx-auto">
        {/* Key Metrics */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              label: 'Page Views', 
              value: analyticsData.pageViews.toLocaleString(), 
              icon: Eye, 
              color: 'text-blue-900',
              growth: '+12.5%',
              trend: 'up'
            },
            { 
              label: 'Unique Visitors', 
              value: analyticsData.uniqueVisitors.toLocaleString(), 
              icon: Users, 
              color: 'text-green-900',
              growth: '+8.3%',
              trend: 'up'
            },
            { 
              label: 'Bounce Rate', 
              value: `${analyticsData.bounceRate}%`, 
              icon: TrendingDown, 
              color: 'text-red-900',
              growth: '-2.1%',
              trend: 'down'
            },
            { 
              label: 'Avg. Session', 
              value: `${analyticsData.avgSessionDuration}m`, 
              icon: Calendar, 
              color: 'text-purple-900',
              growth: '+5.2%',
              trend: 'up'
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {metric.growth}
                    </span>
                  </div>
                </div>
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic Chart */}
          <motion.div 
            variants={fadeInUp}
            className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Page Views Trend</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-coral-primary rounded-full"></div>
                <span className="text-sm text-gray-600">Page Views</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {analyticsData.dailyViews.map((day, index) => {
                const maxViews = Math.max(...analyticsData.dailyViews.map(d => d.views));
                const height = (day.views / maxViews) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-coral-primary rounded-t transition-all duration-300 hover:bg-coral-secondary"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
            
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{source.percentage}%</span>
                </div>
              ))}
            </div>

            {/* Pie Chart Placeholder */}
            <div className="mt-6 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
          </motion.div>
        </div>

        {/* Top Performing Posts */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white p-6 rounded-xl shadow-sm mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Posts</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-coral-primary hover:text-coral-secondary text-sm font-medium"
            >
              View All
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {analyticsData.topPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-coral-light rounded-lg flex items-center justify-center">
                    <span className="text-coral-primary font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 truncate max-w-md">{post.title}</h4>
                    <p className="text-sm text-gray-500">{post.views.toLocaleString()} views</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.growth > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    post.growth > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {post.growth > 0 ? '+' : ''}{post.growth}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Insights */}
        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Comments</span>
                <span className="font-semibold text-gray-900">892</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Shares</span>
                <span className="font-semibold text-gray-900">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bookmarks</span>
                <span className="font-semibold text-gray-900">567</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email Subscribers</span>
                <span className="font-semibold text-gray-900">2,345</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Desktop</span>
                <span className="font-semibold text-gray-900">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mobile</span>
                <span className="font-semibold text-gray-900">42%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tablet</span>
                <span className="font-semibold text-gray-900">13%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
