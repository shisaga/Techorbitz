import type { Metadata } from "next";
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

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
        title: 'Post Not Found | TechXak',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    const baseUrl = 'https://techxak.com';
    const postUrl = `${baseUrl}/blog/${slug}`;
    const imageUrl = post.coverImage || `${baseUrl}/og-blog-default.jpg`;

    return {
      title: `${post.seoTitle || post.title} | TechXak Tech Blog`,
      description: post.seoDescription || post.excerpt || `Read ${post.title} by ${post.author.name} on TechXak's tech blog.`,
      keywords: `${post.title}, technology blog, web development, AI, cloud computing, IoT, Fortune 500, TechXak, ${post.author.name}`,
      authors: [{ name: post.author.name || 'TechXak' }],
      creator: post.author.name || 'TechXak',
      publisher: 'TechXak',
      robots: 'index, follow',
      
      // Open Graph
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: postUrl,
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || '',
        siteName: 'TechXak Tech Blog',
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
                  authors: [post.author.name || 'TechXak'],
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
        creator: '@techxak',
        site: '@techxak',
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
                  'article:author': post.author.name || 'TechXak',
        'article:published_time': post.publishedAt?.toISOString() || '',
        'article:modified_time': post.updatedAt.toISOString(),
        'article:section': 'Technology',
        'article:tag': 'Technology, Web Development, AI, Cloud Computing'
      }
    };

  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'TechXak Tech Blog',
      description: 'Latest insights on technology, development, and innovation.',
    };
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9803515858146134" crossOrigin="anonymous"></script>
      </head>
      {children}
    </>
  );
}
