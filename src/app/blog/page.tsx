import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import BlogPageClient from './client-page';
import { cache } from 'react';

// Cache database queries for better performance
const getBlogData = cache(async () => {
  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, bio: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 12 // Initial load
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' }
    }),
    prisma.tag.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
      take: 20 // Most popular tags
    })
  ]);

  return { posts, categories, tags };
});

// Enhanced metadata for blog listing page
export const metadata: Metadata = {
  title: 'Tech Blog - Latest Insights & Trends | TechXak',
  description: 'Discover cutting-edge technology insights from Fortune 500 experts. Read about AI, cloud computing, IoT, database optimization, and breakthrough innovations that drive business success.',
  keywords: 'tech blog, technology insights, AI articles, cloud computing, IoT solutions, Fortune 500 technology, web development, database optimization, enterprise solutions, TechXak',
  authors: [{ name: 'TechXak Team' }],
  creator: 'TechXak',
  publisher: 'TechXak',
  robots: 'index, follow',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techxak.com/blog',
    title: 'Tech Blog - Latest Insights & Trends | TechXak',
    description: 'Expert insights on AI, cloud computing, IoT, and more from Fortune 500 technology consultants.',
    siteName: 'TechXak',
    images: [
      {
        url: 'https://techxak.com/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'TechXak Tech Blog'
      }
    ]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Blog - Latest Insights & Trends | TechXak',
    description: 'Expert insights on AI, cloud computing, IoT, and more from Fortune 500 technology consultants.',
    creator: '@techxak',
    site: '@techxak',
    images: ['https://techxak.com/twitter-blog.jpg']
  },
  
  alternates: {
    canonical: 'https://techxak.com/blog',
    types: {
      'application/rss+xml': 'https://techxak.com/rss.xml'
    }
  }
};

// Generate static params for pagination
export async function generateStaticParams() {
  try {
    const totalPosts = await prisma.post.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      }
    });

    const postsPerPage = 12;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push({ page: i.toString() });
    }

    console.log(`Generated static params for ${totalPages} blog pages`);
    return pages;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Enhanced static generation with ISR and performance optimizations
export default async function BlogPage() {
  try {
    // Fetch blog data with caching
    const { posts, categories, tags } = await getBlogData();

    // Pre-fetch additional data for better performance
    const totalPosts = await prisma.post.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      }
    });

    return (
      <BlogPageClient 
        initialPosts={posts}
        categories={categories}
        tags={tags}
      />
    );

  } catch (error) {
    console.error('Error fetching blog data:', error);
    
    // Fallback with empty data
    return (
      <BlogPageClient 
        initialPosts={[]}
        categories={[]}
        tags={[]}
      />
    );
  }
}

// Enhanced ISR configuration
export const revalidate = 1800; // Revalidate every 30 minutes for fresh content

// Force static generation for better performance
export const dynamic = 'force-static';
