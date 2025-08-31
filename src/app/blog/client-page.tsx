'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Header from '@/components/layout/Header';
import BlogCard from '@/components/blog/BlogCard';
import BlogFilters from '@/components/blog/BlogFilters';
import Newsletter from '@/components/common/Newsletter';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage?: string | null;
  showcaseImage?: string | null;
  publishedAt: string | Date | null;
  readingTime: number | null;
  views: number;
  likesCount: number;
  author: {
    id: string;
    name: string | null;
    avatar?: string | null;
    bio?: string | null;
    _count?: {
      posts: number;
      followers: number;
    };
  };
  _count: {
    comments: number;
    likes: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPageClientProps {
  initialPosts: BlogPost[];
  categories: Category[];
  tags: Tag[];
}

export default function BlogPageClient({ 
  initialPosts, 
  categories, 
  tags 
}: BlogPageClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPosts = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '6'
      });
      
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTag) params.append('tag', selectedTag);
      
      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();
      
      if (data.posts && Array.isArray(data.posts)) {
        if (reset || pageNum === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.pagination.hasMore);
        setPage(pageNum + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedCategory, selectedTag]);

  // Fetch when filters change
  useEffect(() => {
    if (debouncedSearchTerm || selectedCategory || selectedTag) {
      fetchPosts(1, true);
    } else {
      // Reset to initial posts when no filters
      setPosts(initialPosts);
      setPage(1);
      setHasMore(true);
    }
  }, [debouncedSearchTerm, selectedCategory, selectedTag, fetchPosts, initialPosts]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading && posts.length > 0) {
      fetchPosts(page);
    }
  }, [inView, hasMore, loading, page, fetchPosts, posts.length]);

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backUrl="/" showAdminLink />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coral-light to-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Tech Insights & <span className="text-coral-primary">Innovation</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              🚀 Stay ahead with cutting-edge insights from our Fortune 500 technology experts. 
              Discover breakthrough innovations that drive business success and digital transformation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters Component */}
      <BlogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        debouncedSearchTerm={debouncedSearchTerm}
      />

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Featured Section Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              🔥 <span className="text-coral-primary">Trending</span> Tech Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Exclusive insights from industry leaders who've worked with Google, Apple, and Fortune 500 companies
            </motion.p>
          </div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <>
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {posts.map((post, index) => (
                  <BlogCard 
                    key={post.id} 
                    post={post} 
                    index={index}
                  />
                ))}
              </motion.div>

              {/* Load More Trigger */}
              <div ref={loadMoreRef} className="mt-12">
                {loading && (
                  <LoadingSpinner text="Loading more articles..." className="py-12" />
                )}
              </div>

              {/* End Message */}
              {!hasMore && posts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="bg-gradient-to-r from-coral-primary to-coral-secondary p-8 rounded-2xl text-white">
                    <h3 className="text-2xl font-bold mb-4">🎉 You're All Caught Up!</h3>
                    <p className="text-lg opacity-90 mb-6">
                      You've explored all our latest insights. More coming soon!
                    </p>
                    <div className="text-sm opacity-80">
                      📊 {posts.length} articles • 🚀 More weekly • 🎯 Fortune 500 focused
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Articles Found</h3>
              <p className="text-gray-600 mb-8">
                Try adjusting your search or explore different categories.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Component */}
      <Newsletter />
    </div>
  );
}
