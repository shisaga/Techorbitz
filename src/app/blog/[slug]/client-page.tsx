'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Eye, Heart, MessageCircle, Share2, 
  Bookmark, Send, Copy, Twitter, Linkedin, Facebook
} from 'lucide-react';
import InputField from '@/components/ui/InputField';
import { useState, useEffect, useCallback, useMemo, useRef, Suspense, lazy } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import BlogCard from '@/components/blog/BlogCard';
import BlogContent from '@/components/blog/BlogContent';
import Newsletter from '@/components/common/Newsletter';
import BlogStructuredData from '@/components/seo/BlogStructuredData';

// Lazy load heavy components
const LazyNewsletter = lazy(() => import('@/components/common/Newsletter'));
const LazyBlogCard = lazy(() => import('@/components/blog/BlogCard'));

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage?: string | null;
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

interface BlogPostClientProps {
  initialPost: BlogPost;
  initialRelatedPosts: BlogPost[];
  slug: string;
}

// Debounce hook for performance
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Memoized avatar component
const MemoizedAvatar = ({ name, size = 40 }: { name: string; size?: number }) => {
  const avatarUrl = useMemo(() => 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'TechXak')}&background=ff6b47&color=fff&size=${size}`,
    [name, size]
  );

  return (
    <img 
      src={avatarUrl}
      alt={name || 'TechXak'}
      className={`w-${size/4} h-${size/4} rounded-full ring-2 ring-coral-primary/20`}
      loading="lazy"
    />
  );
};

export default function BlogPostClient({ 
  initialPost, 
  initialRelatedPosts, 
  slug 
}: BlogPostClientProps) {
  const [post, setPost] = useState(initialPost);
  const [relatedPosts, setRelatedPosts] = useState(initialRelatedPosts);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [viewTracked, setViewTracked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Refs for performance
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Memoized values
  const debouncedReadingProgress = useDebounce(readingProgress, 100);
  const publishedDate = useMemo(() => 
    post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'Draft',
    [post.publishedAt]
  );

  const readingTime = useMemo(() => 
    post.readingTime || Math.max(1, Math.ceil(post.content.split(' ').length / 200)),
    [post.readingTime, post.content]
  );

  const currentLikesCount = useMemo(() => 
    post.likesCount + (isLiked ? 1 : 0),
    [post.likesCount, isLiked]
  );

  // Optimized animations
  const fadeInUp = useMemo(() => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }), []);

  const stagger = useMemo(() => ({
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized view tracking with debouncing
  useEffect(() => {
    if (viewTracked) return;

    const trackView = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPost(prev => ({
            ...prev,
            views: data.views
          }));
          setViewTracked(true);
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    // Track view after user has been on page for 2 seconds
    const timer = setTimeout(trackView, 2000);
    return () => clearTimeout(timer);
  }, [slug, viewTracked]);

  // Optimized reading progress tracker with throttling
  useEffect(() => {
    let ticking = false;

    const updateReadingProgress = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (scrollTop / docHeight) * 100;
          setReadingProgress(Math.min(100, Math.max(0, progress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Memoized event handlers
  const handleLike = useCallback(async () => {
    setIsLiked(!isLiked);
    try {
      const response = await fetch(`/api/blog/${slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: !isLiked })
      });
      
      if (response.ok) {
        const data = await response.json();
        setPost(prev => ({
          ...prev,
          likesCount: data.likesCount
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }, [isLiked, slug]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked);
  }, [isBookmarked]);

  const handleShare = useCallback((platform?: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! 📋');
    }
    setShowShareMenu(false);
  }, [post.title]);

  // Optimized comment fetching
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/blog/${slug}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await fetch(`/api/blog/${slug}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        const data = await response.json();
        setNewComment('');
        setComments(prev => [data.comment, ...prev]);
        setPost(prev => ({
          ...prev,
          _count: {
            ...prev._count,
            comments: prev._count.comments + 1
          }
        }));
        alert('Comment submitted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  }, [newComment, slug]);

  // Memoized cover image component
  const CoverImage = useMemo(() => {
    if (!post.coverImage || !(post.coverImage.startsWith('http') || post.coverImage.startsWith('data:image/') || post.coverImage.startsWith('blob:'))) {
      return null;
    }

    return (
      <motion.div
        variants={fadeInUp}
        className="mb-8 rounded-2xl overflow-hidden shadow-2xl"
      >
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-[200px] md:h-[300px] object-fill"
          loading="lazy"
          onError={(e) => {
            console.error('Cover image failed to load:', post.coverImage);
            e.currentTarget.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'w-full h-[400px] md:h-[500px] bg-gradient-to-br from-coral-light to-coral-primary/20 flex items-center justify-center';
            placeholder.innerHTML = `
              <div class="text-center">
                <div class="text-coral-primary text-6xl mb-4">📝</div>
                <p class="text-gray-600 text-lg">Cover Image</p>
              </div>
            `;
            e.currentTarget.parentNode?.appendChild(placeholder);
          }}
        />
      </motion.div>
    );
  }, [post.coverImage, post.title, fadeInUp]);

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Structured Data */}
      <BlogStructuredData post={{...post, updatedAt: (post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString())}} />
      
      <Header showBackButton backUrl="/blog" showAdminLink />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-1 bg-gray-200 z-40">
        <motion.div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-coral-primary to-coral-secondary"
          style={{ width: `${debouncedReadingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coral-light via-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {/* Article Meta */}
            <motion.div 
              variants={fadeInUp}
              className="flex items-center gap-4 text-sm text-gray-600 mb-8"
            >
              <div className="flex items-center gap-3">
                <MemoizedAvatar name={post.author.name || 'TechXak'} size={40} />
                <div>
                  <div className="font-semibold text-gray-900">{post.author.name || 'TechXak'}</div>
                  <div className="text-xs text-gray-500">Fortune 500 Expert</div>
                </div>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{publishedDate}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            </motion.div>

            {/* Article Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight"
            >
              {post.title}
            </motion.h1>

            {/* Cover Image */}
            {CoverImage}

            {/* Article Excerpt */}
            {post.excerpt && (
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light"
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Engagement Stats Row */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg"
            >
              <div className="flex hidden md:block items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Eye className={`w-5 h-5 ${viewTracked ? 'text-green-500' : 'text-blue-500'}`} />
                  <span className="font-medium">
                    {post.views.toLocaleString()} views
                    {viewTracked && <span className="text-green-500 ml-1">✓</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{currentLikesCount} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{post._count.comments} comments</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBookmark}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-coral-light text-coral-primary shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-coral-light hover:text-coral-primary'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden min-w-[200px]"
                    >
                      {[
                        { icon: Twitter, label: 'Share on Twitter', color: 'text-blue-400', platform: 'twitter' },
                        { icon: Linkedin, label: 'Share on LinkedIn', color: 'text-blue-600', platform: 'linkedin' },
                        { icon: Facebook, label: 'Share on Facebook', color: 'text-blue-500', platform: 'facebook' },
                        { icon: Copy, label: 'Copy Link', color: 'text-gray-600', platform: 'copy' }
                      ].map((item) => (
                        <motion.button
                          key={item.platform}
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          onClick={() => handleShare(item.platform)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section ref={contentRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Floating Sidebar - Engagement Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start"
            >
              <div className="flex lg:flex-col gap-4 lg:gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{currentLikesCount}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full transition-colors ${
                    isBookmarked 
                      ? 'bg-coral-light text-coral-primary' 
                      : 'bg-gray-100 text-gray-600 hover:bg-coral-light hover:text-coral-primary'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-10"
            >
              {/* Beautiful Article Content */}
              <BlogContent content={post.content} />

              {/* Tags Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="flex flex-wrap gap-3">
                  {['AI', 'Web Development', 'Technology', 'Innovation', 'Fortune 500'].map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog?tag=${tag.toLowerCase().replace(' ', '-')}`}
                      className="bg-coral-light text-coral-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-coral-primary hover:text-white transition-colors cursor-pointer"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Author Bio Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-coral-light to-blue-50 p-8 rounded-3xl mb-16 border border-coral-primary/20"
              >
                <div className="flex items-start gap-6">
                  <MemoizedAvatar name={post.author.name || 'TechXak'} size={80} />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{post.author.name || 'TechXak'}</h3>
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                      {post.author.bio || 'Technology expert and thought leader at TechXak, specializing in Fortune 500 solutions and cutting-edge innovations. Passionate about sharing insights that drive business transformation.'}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <span className="font-medium">{post.author._count?.posts || 0} articles published</span>
                      <span>•</span>
                      <span className="font-medium">{post.author._count?.followers || 0} followers</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-coral-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-coral-secondary transition-colors"
                    >
                      Follow Author
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Comments Section - Lazy Loaded */}
              {isIntersecting && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    💬 Join the Discussion 
                    <span className="text-lg font-normal text-gray-500">({comments.length})</span>
                  </h3>

                  {/* Comment Form */}
                  <div className="bg-gradient-to-r from-gray-50 to-coral-light/20 p-8 rounded-3xl mb-8 border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Share Your Expert Opinion</h4>
                    <form onSubmit={submitComment} className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MemoizedAvatar name="You" size={48} />
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="What are your thoughts on this article? Share your insights with the tech community..."
                            rows={4}
                            maxLength={500}
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20 outline-none resize-none text-lg text-gray-900 placeholder-gray-500"
                          />
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-500">
                              {newComment.length}/500 characters
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              disabled={!newComment.trim() || commentLoading}
                              className="bg-coral-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-coral-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {commentLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Posting...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Post Comment
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Comments List */}
                  {comments.length > 0 ? (
                    <div className="space-y-6">
                      {comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                        >
                          <div className="flex items-start gap-4">
                            <MemoizedAvatar name={comment.author?.name || 'User'} size={40} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-semibold text-gray-900">
                                  {comment.author?.name || 'Anonymous User'}
                                </h5>
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-700 mb-2">Start the Conversation!</h4>
                      <p className="text-gray-600">Be the first to share your expert insights on this article.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts - Lazy Loaded */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-coral-light/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center"
              >
                🔗 Continue Your Journey
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto"
              >
                Explore more insights from our Fortune 500 technology experts
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Suspense fallback={<div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>}>
                  {relatedPosts.map((relatedPost, index) => (
                    <LazyBlogCard 
                      key={relatedPost.id} 
                      post={relatedPost} 
                      index={index}
                    />
                  ))}
                </Suspense>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Newsletter CTA - Lazy Loaded */}
      <Suspense fallback={<div className="h-32 bg-gray-200 animate-pulse"></div>}>
        <LazyNewsletter 
          title="💡 Loved This Article?"
          description="Get more exclusive insights like this delivered weekly. Join Fortune 500 CTOs who trust our intelligence briefings to stay ahead of technology trends."
        />
      </Suspense>
    </div>
  );
}
