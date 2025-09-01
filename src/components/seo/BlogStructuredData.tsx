interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  publishedAt: string | Date | null;
  updatedAt: string;
  readingTime: number | null;
  views: number;
  coverImage?: string | null;
  author: {
    name: string | null;
    bio?: string | null;
  };
}

interface BlogStructuredDataProps {
  post: BlogPost;
}

export default function BlogStructuredData({ post }: BlogStructuredDataProps) {
  const baseUrl = 'https://techonigx.com';
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.coverImage || `${baseUrl}/og-blog-default.jpg`;

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.title,
    "image": [
      {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 630
      }
    ],
    "datePublished": post.publishedAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name || "TechOnigx",
      "description": post.author.bio || "Technology expert at TechOnigx",
      "url": `${baseUrl}/author/${(post.author.name || "TechOnigx").toLowerCase().replace(/\s+/g, '-')}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "TechOnigx",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
        "width": 200,
        "height": 60
      },
      "url": baseUrl,
      "sameAs": [
        "https://linkedin.com/company/techorbitze",
        "https://twitter.com/techorbitze"
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "url": postUrl,
    "wordCount": post.content.split(' ').length,
    "timeRequired": `PT${post.readingTime || Math.max(1, Math.ceil(post.content.split(' ').length / 200))}M`,
    "articleSection": "Technology",
    "articleBody": post.content,
    "keywords": [
      "technology",
      "web development", 
      "AI",
      "cloud computing",
      "IoT",
      "Fortune 500",
      "enterprise solutions"
    ],
    "about": [
      {
        "@type": "Thing",
        "name": "Technology",
        "description": "Latest trends and insights in technology"
      },
      {
        "@type": "Thing", 
        "name": "Enterprise Solutions",
        "description": "Technology solutions for Fortune 500 companies"
      }
    ],
    "mentions": [
      {
        "@type": "Organization",
        "name": "Google"
      },
      {
        "@type": "Organization",
        "name": "Apple"
      },
      {
        "@type": "Organization",
        "name": "McDonald's"
      }
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": postUrl
      }
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TechOnigx",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/blog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
    </>
  );
}
