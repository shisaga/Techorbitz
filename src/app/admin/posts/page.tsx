'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishedAt: string | null;
  views: number;
  author: { name: string };
}

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-coral-primary">Posts</span> Management
          </h1>
          <Link href="/admin/editor">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-coral-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-coral-secondary transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Post
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Posts</h3>
            </div>
            
            {posts.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">Create your first post to get started</p>
                <Link href="/admin/editor">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-coral-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-coral-secondary transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Post
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>By {post.author.name}</span>
                          <span>•</span>
                          <span>{post.views} views</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'PUBLISHED' ? 'bg-green-100 text-green-900' :
                            post.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-900' :
                            'bg-blue-100 text-blue-900'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.slug}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View post"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </Link>
                        <Link href={`/admin/editor?post=${post.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Edit post"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
