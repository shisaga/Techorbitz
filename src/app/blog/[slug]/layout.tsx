import type { Metadata } from "next";
import { prisma } from '@/lib/prisma';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  try {
    // Fetch the blog post
    const post = await prisma.post.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      include: {
        author: {
          select: { name: true }
        }
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
      title: `${post.seoTitle || post.title} | TechOrbitze Tech Blog`,
      description: post.seoDescription || post.excerpt || `Read ${post.title} by ${post.author.name} on TechOrbitze's tech blog.`,
      keywords: `${post.title}, technology blog, web development, AI, cloud computing, IoT, Fortune 500, TechOrbitze, ${post.author.name}`,
      authors: [{ name: post.author.name || 'TechOrbitze' }],
      creator: post.author.name || 'TechOrbitze',
      publisher: 'TechOrbitze',
      robots: 'index, follow',
      
      // Open Graph
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
        section: 'Technology',
        tags: ['Technology', 'Web Development', 'AI', 'Cloud Computing', 'IoT'],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
            type: 'image/jpeg'
          }
        ]
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || '',
        creator: '@techorbitze',
        site: '@techorbitze',
        images: [
          {
            url: imageUrl,
            alt: post.title
          }
        ]
      },

      // Additional SEO
      alternates: {
        canonical: postUrl,
        types: {
          'application/rss+xml': `${baseUrl}/rss.xml`
        }
      },

      // Schema.org structured data will be added in the component
      other: {
        'article:author': post.author.name || 'TechOrbitze',
        'article:published_time': post.publishedAt?.toISOString() || '',
        'article:modified_time': post.updatedAt.toISOString(),
        'article:section': 'Technology',
        'article:tag': 'Technology, Web Development, AI, Cloud Computing'
      }
    };

  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'TechOrbitze Tech Blog',
      description: 'Latest insights on technology, development, and innovation.',
    };
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
