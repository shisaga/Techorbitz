import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './client-page';
import { cache } from 'react';
import { siteConfig } from '@/lib/site-config';

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

// Enhanced metadata generation with structured data for Google search
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostData(slug);

    if (!post) {
      return {
        title: 'Post Not Found | TechXak',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    const baseUrl = siteConfig.company.url;
    const postUrl = `${baseUrl}/blog/${slug}`;
    const imageUrl = post.coverImage || `${baseUrl}/og-blog-default.jpg`;
    const publishedDate = post.publishedAt?.toISOString();
    const modifiedDate = new Date(post.updatedAt).toISOString();

    return {
      title: `${post.seoTitle || post.title} | ${siteConfig.company.name}`,
      description: post.seoDescription || post.excerpt || post.content.substring(0, 160),
      keywords: [
        ...siteConfig.seo.keywords,
        post.title,
        'technology',
        'web development',
        'AI',
        'cloud computing',
        'IoT',
        'Fortune 500',
        'TechXak'
      ].join(', '),
      authors: [
        { name: post.author.name || siteConfig.team.founder.name },
        { name: siteConfig.company.name }
      ],
      creator: post.author.name || siteConfig.team.founder.name,
      publisher: siteConfig.company.name,
      category: 'Technology',
      
      // Enhanced Open Graph for Google search
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: postUrl,
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || post.content.substring(0, 160),
        siteName: siteConfig.company.name,
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        authors: [post.author.name || siteConfig.team.founder.name],
        section: 'Technology',
        tags: [
          'Technology',
          'AI',
          'Web Development',
          'Innovation',
          'Fortune 500',
          'Cloud Computing',
          'IoT',
          'Machine Learning'
        ],
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

      // Enhanced Twitter for Google search
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || post.content.substring(0, 160),
        creator: siteConfig.company.social.twitter.replace('https://twitter.com/', '@'),
        site: siteConfig.company.social.twitter.replace('https://twitter.com/', '@'),
        images: [imageUrl]
      },

      // Enhanced alternates for Google search
      alternates: {
        canonical: postUrl,
        languages: {
          'en-US': postUrl,
        }
      },

      // Additional metadata for Google search optimization
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

      // Verification for Google Search Console
      verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
        yahoo: 'your-yahoo-verification-code',
      },

      // Additional SEO meta tags
      other: {
        'article:author': post.author.name || siteConfig.team.founder.name,
        'article:section': 'Technology',
        'article:tag': 'AI, Web Development, Technology, Innovation, Fortune 500',
        'article:published_time': publishedDate,
        'article:modified_time': modifiedDate,
        'og:site_name': siteConfig.company.name,
        'og:locale': 'en_US',
        'twitter:site': siteConfig.company.social.twitter.replace('https://twitter.com/', '@'),
        'twitter:creator': siteConfig.company.social.twitter.replace('https://twitter.com/', '@'),
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: `${siteConfig.blog.title} | ${siteConfig.company.name}`,
      description: siteConfig.blog.description,
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
export const revalidate = 0; // Force revalidation on every request for fresh content

// Allow dynamic rendering for fresh content
export const dynamic = 'force-dynamic';
