'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Eye, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import OptimizedImage from '../ui/OptimizedImage';

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

interface BlogCardProps {
  post: BlogPost;
  index: number;
  variant?: 'default' | 'featured';
}

export default function BlogCard({ post, index, variant = 'default' }: BlogCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount || post._count?.likes || 0);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.1, duration: 0.5 }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/blog/${post.slug}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <motion.article
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group ${
        variant === 'featured' ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Cover Image */}
      <div className={`relative ${
        variant === 'featured' ? 'h-64' : 'h-48'
      }`}>
        {(post.showcaseImage || post.coverImage) ? (
          <OptimizedImage
            src={post.showcaseImage || post.coverImage || ''}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-coral-light to-coral-primary/20 flex items-center justify-center">
            <div className="text-coral-primary text-4xl">📝</div>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <span className="bg-coral-primary text-white px-3 py-1 rounded-full text-xs font-medium">
            🔥 Trending
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 text-coral-primary px-2 py-1 rounded-full text-xs font-medium">
            Fortune 500 Insights
          </span>
        </div>
        {variant === 'featured' && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Author and Date */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name || 'TechXak')}&background=ff6b47&color=fff&size=24`}
              alt={post.author.name || 'TechXak'}
              className="w-6 h-6 rounded-full"
            />
            <span>{post.author.name || 'TechXak'}</span>
          </div>
          <span>•</span>
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</span>
        </div>
        
        {/* Title */}
        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-coral-primary transition-colors ${
          variant === 'featured' ? 'text-2xl' : 'text-xl'
        }`}>
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className={`text-gray-600 mb-4 ${
          variant === 'featured' ? 'line-clamp-4 text-lg' : 'line-clamp-3'
        }`}>
          
          {post.excerpt}
        </p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime || 5} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views || 0}</span>
          </div>
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1 hover:text-coral-primary transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-coral-primary text-coral-primary' : ''}`} />
            <span>{likeCount}</span>
          </motion.button>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post._count?.comments || 0}</span>
          </div>
        </div>
        
        {/* Read More Link */}
        <Link href={`/blog/${post.slug}`}>
          <motion.div
            whileHover={{ x: 5 }}
            className="text-coral-primary font-semibold flex items-center gap-2 cursor-pointer"
            onClick={async () => {
              // Track view when user clicks to read the article
              try {
                await fetch(`/api/blog/${post.slug}/view`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' }
                });
              } catch (error) {
                console.error('Error tracking view:', error);
              }
            }}
          >
            Read Full Article <ArrowRight className="w-4 h-4" />
          </motion.div>
        </Link>
      </div>
    </motion.article>
  );
}
