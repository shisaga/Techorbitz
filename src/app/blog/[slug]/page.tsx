import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './client-page';
import { cache } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

// Cache database queries for better performance
const getPostData = cache(async (slug: string) => {
  return await prisma.post.findUnique({
    where: { 
      slug,
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    },
    include: {
      author: {
        select: { 
          id: true, 
          name: true, 
          avatar: true, 
          bio: true,
          _count: {
            select: { posts: true, followers: true }
          }
        }
      },
      comments: {
        where: { isApproved: true },
        include: {
          author: {
            select: { id: true, name: true, avatar: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: { comments: true, likes: true }
      }
    }
  });
});

const getRelatedPosts = cache(async (postId: string, currentSlug: string) => {
  return await prisma.post.findMany({
    where: {
      id: { not: postId },
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    },
    include: {
      author: {
        select: { id: true, name: true, avatar: true }
      },
      _count: {
        select: { comments: true, likes: true }
      }
    },
    take: 3,
    orderBy: { publishedAt: 'desc' }
  });
});

// Enhanced static params generation with pagination
export async function generateStaticParams() {
  try {
    // Get total count of published posts
    const totalPosts = await prisma.post.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      }
    });

    // Generate static pages for all published posts (with pagination for large datasets)
    const batchSize = 100;
    const batches = Math.ceil(totalPosts / batchSize);
    const allSlugs: { slug: string }[] = [];

    for (let i = 0; i < batches; i++) {
      const posts = await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
        },
        select: { slug: true },
        skip: i * batchSize,
        take: batchSize,
        orderBy: { publishedAt: 'desc' }
      });

      allSlugs.push(...posts.map(post => ({ slug: post.slug })));
    }

    console.log(`Generated static params for ${allSlugs.length} blog posts`);
    return allSlugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Enhanced metadata generation with structured data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostData(slug);

    if (!post) {
      return {
        title: 'Post Not Found | TechOnigx',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    const baseUrl = 'https://techonigx.com';
    const postUrl = `${baseUrl}/blog/${slug}`;
    const imageUrl = post.coverImage || `${baseUrl}/og-blog-default.jpg`;
    const publishedDate = post.publishedAt?.toISOString();
    const modifiedDate = post.updatedAt.toISOString();

    return {
      title: `${post.seoTitle || post.title} | TechOnigx`,
      description: post.seoDescription || post.excerpt || '',
      keywords: `${post.title}, technology, web development, AI, cloud computing, IoT, Fortune 500, TechOnigx`,
      authors: [{ name: post.author.name || 'TechOnigx' }],
      creator: post.author.name || 'TechOnigx',
      publisher: 'TechOnigx',
      category: 'Technology',
      
      // Enhanced Open Graph
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: postUrl,
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || '',
        siteName: 'TechOnigx Tech Blog',
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        authors: [post.author.name || 'TechOnigx'],
        section: 'Technology',
        tags: ['Technology', 'AI', 'Web Development', 'Innovation'],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
            type: 'image/jpeg',
          }
        ]
      },

      // Enhanced Twitter
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || '',
        creator: '@techonigx',
        site: '@techonigx',
        images: [imageUrl]
      },

      // Enhanced alternates
      alternates: {
        canonical: postUrl,
        languages: {
          'en-US': postUrl,
        }
      },

      // Additional metadata for SEO
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Verification
      verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
        yahoo: 'your-yahoo-verification-code',
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'TechOnigx Tech Blog',
      description: 'Latest insights on technology and innovation.',
    };
  }
}

// Enhanced static generation with ISR and performance optimizations
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  try {
    // Fetch post data with caching
    const postData = await getPostData(slug);

    if (!postData) {
      notFound();
    }

    // Fetch related posts with caching
    const relatedPosts = await getRelatedPosts(postData.id, slug);

    // Pre-fetch additional data for better performance
    const [categories, tags] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' }
      }),
      prisma.tag.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
        take: 20
      })
    ]);

    // Pass data to client component
    return (
      <BlogPostClient 
        initialPost={postData} 
        initialRelatedPosts={relatedPosts}
        slug={slug}
      />
    );

  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}

// Enhanced ISR configuration
export const revalidate = 3600; // Revalidate every hour for fresh content

// Force static generation for better performance
export const dynamic = 'force-static';
