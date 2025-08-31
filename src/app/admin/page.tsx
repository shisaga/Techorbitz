'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/ui/CustomSelect';
import InputField from '@/components/ui/InputField';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Plus, Edit, Trash2, Eye, Calendar, Clock, Tag, 
  Users, BarChart3, TrendingUp, FileText, Settings,
  Search, Filter, ChevronLeft, ChevronRight, MessageSquare,
  Image, UserPlus, Activity, Zap
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishedAt: string | null;
  views: number;
  likesCount: number;
  commentsCount: number;
  readingTime: number;
  author: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  categories: { id: string; name: string; color: string }[];
  tags: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalUsers: 0
  });

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

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '10',
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from analytics API
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats({
        totalPosts: data.overview.totalPosts,
        totalViews: data.overview.totalViews,
        totalComments: data.overview.totalComments,
        totalUsers: data.overview.totalUsers
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [statusFilter, searchTerm]);

  // Handle post actions
  const handleEditPost = (postId: string) => {
    router.push(`/admin/editor?postId=${postId}`);
  };

  const handleViewPost = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      
      // Refresh posts
      fetchPosts();
      fetchStats();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const statsData = [
    { label: 'Total Posts', value: stats.totalPosts.toString(), icon: FileText, color: 'text-blue-900' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-green-900' },
    { label: 'Comments', value: stats.totalComments.toString(), icon: Users, color: 'text-purple-900' },
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: UserPlus, color: 'text-coral-primary' }
  ];

  const filteredPosts = posts;

  return (
    <AdminLayout title="Dashboard" subtitle="Manage your blog and content">
      <div className="w-full max-w-full overflow-hidden">
        {/* Navigation Tabs */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="flex space-x-8 mb-8 overflow-x-auto pb-2"
        >
          {[
            { id: 'posts', label: 'Posts', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              variants={fadeInUp}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0 ${
                selectedTab === tab.id
                  ? 'bg-coral-primary text-white'
                  : 'text-gray-600 hover:text-coral-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {selectedTab === 'posts' && (
          <>
                    {/* Stats Cards */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Search and Filters */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-sm mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <InputField
                  type="search"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                  variant="minimal"
                  size="sm"
                  className="flex-1"
                  inputClassName="text-gray-900"
                />
                <div className="w-[200px]">
                  <CustomSelect
                    options={[
                      { value: 'ALL', label: 'All Status', emoji: '📄' },
                      { value: 'PUBLISHED', label: 'Published', emoji: '✅' },
                      { value: 'DRAFT', label: 'Draft', emoji: '📝' },
                      { value: 'SCHEDULED', label: 'Scheduled', emoji: '⏰' }
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Filter by Status"
                    width="w-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Posts Table */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Blog Posts</h3>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Post
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stats
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPosts.map((post) => (
                        <motion.tr
                          key={post.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-coral-light rounded-lg flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {post.title}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {post.categories.map((category, idx) => (
                                    <span
                                      key={idx}
                                      className={`px-2 py-1 text-xs rounded ${category.color} text-white`}
                                    >
                                      {category.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              post.status === 'PUBLISHED' 
                                ? 'bg-green-100 text-green-800'
                                : post.status === 'DRAFT'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Eye className="w-3 h-3" />
                                {post.views}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                {post.commentsCount}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditPost(post.id)}
                                className="text-coral-primary hover:text-coral-secondary"
                                title="Edit Post"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleViewPost(post.slug)}
                                className="text-blue-500 hover:text-blue-600"
                                title="View Post"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-500 hover:text-red-600"
                                title="Delete Post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}

        {selectedTab === 'analytics' && (
          <motion.div 
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-coral-primary mb-2">45.2K</div>
                  <div className="text-gray-600">Total Page Views</div>
                  <div className="text-sm text-green-500 mt-1">↗ +12.5% from last month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-coral-primary mb-2">8.4%</div>
                  <div className="text-gray-600">Engagement Rate</div>
                  <div className="text-sm text-green-500 mt-1">↗ +2.1% from last month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-coral-primary mb-2">156</div>
                  <div className="text-gray-600">Published Posts</div>
                  <div className="text-sm text-green-500 mt-1">↗ +8 this month</div>
                </div>
              </div>

              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Analytics Chart Placeholder</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h4>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{post.title}</h5>
                      <p className="text-sm text-gray-500">{post.views} views • {post.likesCount} likes</p>
                    </div>
                    <div className="text-2xl font-bold text-coral-primary">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedTab === 'settings' && (
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="bg-white p-8 rounded-xl shadow-sm"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Blog Settings</h3>
            
                          <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title
                  </label>
                  <InputField
                    type="text"
                    value="TechOrbitze Tech Blog"
                    placeholder="Enter blog title"
                    variant="minimal"
                    size="md"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Latest insights on technology, development, and innovation from TechOrbitze experts."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-transparent outline-none"
                  />
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Features
                </label>
                <div className="space-y-3">
                  {[
                    'Auto-generate SEO descriptions',
                    'AI-powered title suggestions',
                    'Automatic tag generation',
                    'Content improvement suggestions',
                    'Related posts recommendations'
                  ].map((feature, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-coral-primary border-gray-300 rounded focus:ring-coral-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-coral-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-coral-secondary transition-colors"
              >
                Save Settings
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
