import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './client-page';

interface Props {
  params: { slug: string };
}

// Generate static params for known blog posts
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      select: { slug: true },
      take: 50 // Generate static pages for top 50 posts
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  try {
    const post = await prisma.post.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      include: {
        author: { select: { name: true } }
      }
    });

    if (!post) {
      return {
        title: 'Post Not Found | TechOrbitze',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    const baseUrl = 'https://techorbitze.com';
    const postUrl = `${baseUrl}/blog/${slug}`;
    const imageUrl = post.coverImage || `${baseUrl}/og-blog-default.jpg`;

    return {
      title: `${post.seoTitle || post.title} | TechOrbitze`,
      description: post.seoDescription || post.excerpt || '',
      keywords: `${post.title}, technology, web development, AI, cloud computing, IoT, Fortune 500, TechOrbitze`,
      authors: [{ name: post.author.name || 'TechOrbitze' }],
      creator: post.author.name || 'TechOrbitze',
      publisher: 'TechOrbitze',
      
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: postUrl,
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || '',
        siteName: 'TechOrbitze Tech Blog',
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author.name || 'TechOrbitze'],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ]
      },

      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || '',
        creator: '@techorbitze',
        images: [imageUrl]
      },

      alternates: {
        canonical: postUrl
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'TechOrbitze Tech Blog',
      description: 'Latest insights on technology and innovation.',
    };
  }
}

// Static generation with ISR
export default async function BlogPostPage({ params }: Props) {
  const { slug } = params;

  try {
    // Fetch post data at build time
    const postData = await prisma.post.findUnique({
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

    if (!postData) {
      notFound();
    }

    // Fetch related posts
    const relatedPosts = await prisma.post.findMany({
      where: {
        id: { not: postData.id },
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

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;
