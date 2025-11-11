/**
 * Advanced Schema Markup Generators for Maximum Search Visibility
 * Implements all major schema types for rich snippets
 */

export interface SchemaConfig {
  siteUrl: string;
  siteName: string;
  logo: string;
  socialProfiles: string[];
}

const defaultConfig: SchemaConfig = {
  siteUrl: 'https://techxak.com',
  siteName: 'TechXak',
  logo: 'https://techxak.com/logo.png',
  socialProfiles: [
    'https://linkedin.com/company/techxak',
    'https://twitter.com/techxak',
    'https://github.com/techxak'
  ]
};

/**
 * Generate HowTo schema for tutorial content
 */
export function generateHowToSchema(data: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration (e.g., "PT30M")
  estimatedCost?: { currency: string; value: string };
  steps: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
  config?: Partial<SchemaConfig>;
}): object {
  const config = { ...defaultConfig, ...data.config };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    image: data.image ? {
      '@type': 'ImageObject',
      url: data.image
    } : undefined,
    totalTime: data.totalTime,
    estimatedCost: data.estimatedCost,
    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
      url: step.url
    }))
  };
}

/**
 * Generate FAQ schema for Q&A content
 */
export function generateFAQSchema(data: {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(qa => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer
      }
    }))
  };
}

/**
 * Generate Course schema for educational content
 */
export function generateCourseSchema(data: {
  name: string;
  description: string;
  provider: string;
  url: string;
  image?: string;
  offers?: {
    price: string;
    currency: string;
    availability?: string;
  };
  config?: Partial<SchemaConfig>;
}): object {
  const config = { ...defaultConfig, ...data.config };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: data.name,
    description: data.description,
    provider: {
      '@type': 'Organization',
      name: data.provider,
      sameAs: config.siteUrl
    },
    url: data.url,
    image: data.image,
    offers: data.offers ? {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.currency,
      availability: data.offers.availability || 'https://schema.org/InStock'
    } : undefined
  };
}

/**
 * Generate Review schema for product/service reviews
 */
export function generateReviewSchema(data: {
  itemName: string;
  itemType: 'Product' | 'Service' | 'SoftwareApplication';
  rating: number; // 1-5
  reviewBody: string;
  author: string;
  datePublished: string;
  pros?: string[];
  cons?: string[];
  config?: Partial<SchemaConfig>;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': data.itemType,
      name: data.itemName
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: data.rating,
      bestRating: 5,
      worstRating: 1
    },
    author: {
      '@type': 'Person',
      name: data.author
    },
    reviewBody: data.reviewBody,
    datePublished: data.datePublished,
    positiveNotes: data.pros ? {
      '@type': 'ItemList',
      itemListElement: data.pros.map((pro, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: pro
      }))
    } : undefined,
    negativeNotes: data.cons ? {
      '@type': 'ItemList',
      itemListElement: data.cons.map((con, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: con
      }))
    } : undefined
  };
}

/**
 * Generate SoftwareApplication schema for tool reviews
 */
export function generateSoftwareSchema(data: {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    currency: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  config?: Partial<SchemaConfig>;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name,
    description: data.description,
    applicationCategory: data.applicationCategory,
    operatingSystem: data.operatingSystem,
    offers: data.offers ? {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.currency
    } : undefined,
    aggregateRating: data.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount
    } : undefined
  };
}

/**
 * Generate VideoObject schema for video content
 */
export function generateVideoSchema(data: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 duration (e.g., "PT1M30S")
  contentUrl?: string;
  embedUrl?: string;
  config?: Partial<SchemaConfig>;
}): object {
  const config = { ...defaultConfig, ...data.config };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate,
    duration: data.duration,
    contentUrl: data.contentUrl,
    embedUrl: data.embedUrl,
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      logo: {
        '@type': 'ImageObject',
        url: config.logo
      }
    }
  };
}

/**
 * Generate enhanced Article schema with all features
 */
export function generateEnhancedArticleSchema(data: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
    image?: string;
  };
  url: string;
  wordCount?: number;
  keywords?: string[];
  articleSection?: string;
  config?: Partial<SchemaConfig>;
}): object {
  const config = { ...defaultConfig, ...data.config };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: {
      '@type': 'ImageObject',
      url: data.image,
      width: 1200,
      height: 630
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
      image: data.author.image
    },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      logo: {
        '@type': 'ImageObject',
        url: config.logo,
        width: 200,
        height: 60
      },
      url: config.siteUrl,
      sameAs: config.socialProfiles
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url
    },
    url: data.url,
    wordCount: data.wordCount,
    keywords: data.keywords?.join(', '),
    articleSection: data.articleSection || 'Technology',
    inLanguage: 'en-US',
    isAccessibleForFree: true
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(data: {
  items: Array<{
    name: string;
    url: string;
  }>;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(data?: Partial<SchemaConfig>): object {
  const config = { ...defaultConfig, ...data };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: config.logo
    },
    sameAs: config.socialProfiles,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'hello@techxak.com',
      availableLanguage: 'English'
    }
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebsiteSchema(data?: Partial<SchemaConfig>): object {
  const config = { ...defaultConfig, ...data };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.siteUrl}/blog?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Combine multiple schemas into one script tag
 */
export function combineSchemas(...schemas: object[]): string {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
  
  return JSON.stringify(graph);
}

