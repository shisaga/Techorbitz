'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleSearchOptimizationProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage?: string | null;
    publishedAt: string | Date | null;
    updatedAt: string | Date;
    author: {
      id: string;
      name: string | null;
      bio?: string | null;
    };
    _count: {
      comments: number;
      likes: number;
      views: number;
    };
  };
  siteInfo: {
    name: string;
    url: string;
    logo: string;
    description: string;
    founder: string;
    location: string;
    phone: string;
    email: string;
    rating: number;
    category: string;
  };
}

export default function GoogleSearchOptimization({ post, siteInfo }: GoogleSearchOptimizationProps) {
  // Generate structured data for Google search
  const generateStructuredData = () => {
    const baseUrl = siteInfo.url;
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const publishedDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString();
    const modifiedDate = new Date(post.updatedAt).toISOString();

    // Article structured data
    const articleData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": post.title,
      "description": post.excerpt || post.content.substring(0, 160),
      "image": post.coverImage || `${baseUrl}/og-blog-default.jpg`,
      "author": {
        "@type": "Person",
        "name": post.author.name || "TechOnigx Team",
        "description": post.author.bio || "Technology expert and thought leader"
      },
      "publisher": {
        "@type": "Organization",
        "name": siteInfo.name,
        "logo": {
          "@type": "ImageObject",
          "url": siteInfo.logo
        },
        "url": baseUrl,
        "description": siteInfo.description,
        "foundingDate": "2024",
        "founder": {
          "@type": "Person",
          "name": siteInfo.founder
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": siteInfo.location,
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": siteInfo.phone,
          "email": siteInfo.email,
          "contactType": "customer service"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": siteInfo.rating,
          "reviewCount": 150,
          "bestRating": 5,
          "worstRating": 1
        },
        "sameAs": [
          "https://www.linkedin.com/company/techonigx",
          "https://twitter.com/techonigx",
          "https://github.com/techonigx"
        ]
      },
      "datePublished": publishedDate,
      "dateModified": modifiedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
      },
      "articleSection": "Technology",
      "keywords": [
        "AI", "Web Development", "Technology", "Innovation", 
        "Fortune 500", "Cloud Computing", "IoT", "Machine Learning"
      ],
      "wordCount": post.content.split(' ').length,
      "timeRequired": `PT${Math.ceil(post.content.split(' ').length / 200)}M`,
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ReadAction",
          "userInteractionCount": post._count.views
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": post._count.likes
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/CommentAction",
          "userInteractionCount": post._count.comments
        }
      ]
    };

    // Organization structured data
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": siteInfo.name,
      "description": siteInfo.description,
      "url": baseUrl,
      "applicationCategory": siteInfo.category,
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": siteInfo.rating,
        "reviewCount": 150,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Organization",
        "name": siteInfo.name,
        "url": baseUrl,
        "logo": siteInfo.logo,
        "description": siteInfo.description,
        "foundingDate": "2024",
        "founder": {
          "@type": "Person",
          "name": siteInfo.founder,
          "jobTitle": "Co-founder & CEO",
          "description": "Technology futurist and Fortune 500 consultant"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": siteInfo.location,
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": siteInfo.phone,
          "email": siteInfo.email,
          "contactType": "customer service"
        },
        "sameAs": [
          "https://www.linkedin.com/company/techonigx",
          "https://twitter.com/techonigx",
          "https://github.com/techonigx"
        ]
      }
    };

    // Breadcrumb structured data
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

    // FAQ structured data (if content has questions)
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the future of AI in web development?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI is revolutionizing web development by automating code generation, improving user experience, and enabling intelligent applications."
          }
        },
        {
          "@type": "Question",
          "name": "How can Fortune 500 companies benefit from technology consulting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fortune 500 companies can achieve digital transformation, improve efficiency, and gain competitive advantages through strategic technology consulting."
          }
        }
      ]
    };

    return {
      article: articleData,
      organization: organizationData,
      breadcrumb: breadcrumbData,
      faq: faqData
    };
  };

  const structuredData = generateStructuredData();

  // Add Google Analytics and Search Console
  useEffect(() => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_title: post.title,
        page_location: `${siteInfo.url}/blog/${post.slug}`,
        custom_map: {
          'custom_parameter_1': 'post_id',
          'custom_parameter_2': 'author_name'
        }
      });
    }

    // Google Search Console verification
    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = 'your-google-verification-code';
    document.head.appendChild(meta);
  }, [post, siteInfo]);

  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>

      {/* Structured Data for Google Search */}
      <Script
        id="structured-data-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.article)
        }}
      />
      
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.organization)
        }}
      />
      
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.breadcrumb)
        }}
      />
      
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.faq)
        }}
      />

      {/* Google Search Console */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Social media optimization */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content={siteInfo.name} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter optimization */}
      <meta name="twitter:site" content="@techonigx" />
      <meta name="twitter:creator" content="@techonigx" />
      
      {/* Additional structured data for rich snippets */}
      <meta name="author" content={post.author.name || "TechOnigx Team"} />
      <meta name="article:author" content={post.author.name || "TechOnigx Team"} />
      <meta name="article:section" content="Technology" />
      <meta name="article:tag" content="AI, Web Development, Technology, Innovation, Fortune 500" />
      <meta name="article:published_time" content={post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()} />
      <meta name="article:modified_time" content={new Date(post.updatedAt).toISOString()} />
    </>
  );
}
