import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import BlogPageClient from './client-page';

// Enhanced metadata for blog listing page
export const metadata: Metadata = {
  title: 'Tech Blog - Latest Insights & Trends | TechOnigx',
  description: 'Discover cutting-edge technology insights from Fortune 500 experts. Read about AI, cloud computing, IoT, database optimization, and breakthrough innovations that drive business success.',
  keywords: 'tech blog, technology insights, AI articles, cloud computing, IoT solutions, Fortune 500 technology, web development, database optimization, enterprise solutions, TechOnigx',
  authors: [{ name: 'TechOnigx Team' }],
  creator: 'TechOnigx',
  publisher: 'TechOnigx',
  robots: 'index, follow',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techonigx.com/blog',
    title: 'Tech Blog - Latest Insights & Trends | TechOnigx',
    description: 'Expert insights on AI, cloud computing, IoT, and more from Fortune 500 technology consultants.',
    siteName: 'TechOnigx',
    images: [
      {
        url: 'https://techonigx.com/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'TechOnigx Tech Blog'
      }
    ]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Blog - Latest Insights & Trends | TechOnigx',
    description: 'Expert insights on AI, cloud computing, IoT, and more from Fortune 500 technology consultants.',
    creator: '@techonigx',
    images: ['https://techonigx.com/twitter-blog.jpg']
  },
  
  alternates: {
    canonical: 'https://techonigx.com/blog',
    types: {
              'application/rss+xml': 'https://techonigx.com/rss.xml'
    }
  }
};

// Static generation with ISR
export default async function BlogPage() {
  try {
    // Fetch initial blog posts at build time
    const initialPosts = await prisma.post.findMany({
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
    });

    // Fetch categories for filters
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' }
    });

    // Fetch tags for filters
    const tags = await prisma.tag.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
      take: 20 // Most popular tags
    });

    return (
      <BlogPageClient 
        initialPosts={initialPosts}
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

// Enable ISR - revalidate every 5 minutes for fresh content
export const revalidate = 300;
