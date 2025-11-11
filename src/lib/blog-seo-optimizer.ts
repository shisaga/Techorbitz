/**
 * Blog SEO Optimizer
 * Enhances blog posts with advanced SEO features
 */

interface SEOOptimizationResult {
  title: string;
  seoTitle: string;
  description: string;
  keywords: string[];
  readingTime: number;
  wordCount: number;
  headings: { level: number; text: string }[];
  internalLinks: number;
  externalLinks: number;
  images: number;
  seoScore: number;
  recommendations: string[];
}

export class BlogSEOOptimizer {
  /**
   * Optimize blog post title for SEO
   */
  static optimizeTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) {
      return title;
    }
    
    // Truncate at word boundary
    const truncated = title.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  /**
   * Generate SEO-optimized meta description
   */
  static generateMetaDescription(content: string, maxLength: number = 160): string {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    // Find the best sentence that fits
    const sentences = plainText.split(/[.!?]+/);
    let description = '';
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (description.length + trimmed.length + 1 <= maxLength) {
        description += (description ? '. ' : '') + trimmed;
      } else {
        break;
      }
    }
    
    if (!description) {
      // Fallback: truncate at word boundary
      const truncated = plainText.substring(0, maxLength - 3);
      const lastSpace = truncated.lastIndexOf(' ');
      description = (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
    }
    
    return description;
  }

  /**
   * Extract keywords from content
   */
  static extractKeywords(title: string, content: string, maxKeywords: number = 10): string[] {
    const text = (title + ' ' + content.replace(/<[^>]*>/g, ' ')).toLowerCase();
    
    // Common stop words to exclude
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'it',
      'its', 'they', 'them', 'their', 'what', 'which', 'who', 'when', 'where',
      'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
      'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
      'so', 'than', 'too', 'very', 'just', 'about', 'into', 'through', 'during'
    ]);
    
    // Extract words and count frequency
    const words = text.match(/\b[a-z]{3,}\b/g) || [];
    const frequency: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (!stopWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    // Sort by frequency and return top keywords
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  /**
   * Calculate reading time
   */
  static calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  /**
   * Analyze blog post for SEO
   */
  static analyzeSEO(title: string, content: string, description?: string): SEOOptimizationResult {
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = this.calculateReadingTime(content);
    
    // Extract headings
    const headingMatches = content.matchAll(/<h([1-6])>(.*?)<\/h\1>/gi);
    const headings = Array.from(headingMatches).map(match => ({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, '').trim()
    }));
    
    // Count links
    const internalLinks = (content.match(/href=['"]\/[^'"]*['"]/gi) || []).length;
    const externalLinks = (content.match(/href=['"]https?:\/\/[^'"]*['"]/gi) || []).length;
    
    // Count images
    const images = (content.match(/<img/gi) || []).length;
    
    // Generate keywords
    const keywords = this.extractKeywords(title, content);
    
    // Calculate SEO score
    const seoScore = this.calculateSEOScore({
      titleLength: title.length,
      descriptionLength: description?.length || 0,
      wordCount,
      headings: headings.length,
      internalLinks,
      externalLinks,
      images,
      keywords: keywords.length
    });
    
    // Generate recommendations
    const recommendations = this.generateRecommendations({
      titleLength: title.length,
      descriptionLength: description?.length || 0,
      wordCount,
      headings: headings.length,
      internalLinks,
      externalLinks,
      images,
      keywords: keywords.length
    });
    
    return {
      title,
      seoTitle: this.optimizeTitle(title),
      description: description || this.generateMetaDescription(content),
      keywords,
      readingTime,
      wordCount,
      headings,
      internalLinks,
      externalLinks,
      images,
      seoScore,
      recommendations
    };
  }

  /**
   * Calculate SEO score (0-100)
   */
  private static calculateSEOScore(metrics: {
    titleLength: number;
    descriptionLength: number;
    wordCount: number;
    headings: number;
    internalLinks: number;
    externalLinks: number;
    images: number;
    keywords: number;
  }): number {
    let score = 0;
    
    // Title (15 points)
    if (metrics.titleLength >= 30 && metrics.titleLength <= 60) score += 15;
    else if (metrics.titleLength >= 20 && metrics.titleLength <= 70) score += 10;
    else score += 5;
    
    // Description (15 points)
    if (metrics.descriptionLength >= 120 && metrics.descriptionLength <= 160) score += 15;
    else if (metrics.descriptionLength >= 100 && metrics.descriptionLength <= 180) score += 10;
    else if (metrics.descriptionLength > 0) score += 5;
    
    // Word count (20 points)
    if (metrics.wordCount >= 1500) score += 20;
    else if (metrics.wordCount >= 1000) score += 15;
    else if (metrics.wordCount >= 500) score += 10;
    else score += 5;
    
    // Headings (15 points)
    if (metrics.headings >= 5) score += 15;
    else if (metrics.headings >= 3) score += 10;
    else if (metrics.headings >= 1) score += 5;
    
    // Internal links (10 points)
    if (metrics.internalLinks >= 3) score += 10;
    else if (metrics.internalLinks >= 1) score += 5;
    
    // External links (10 points)
    if (metrics.externalLinks >= 2) score += 10;
    else if (metrics.externalLinks >= 1) score += 5;
    
    // Images (10 points)
    if (metrics.images >= 3) score += 10;
    else if (metrics.images >= 1) score += 5;
    
    // Keywords (5 points)
    if (metrics.keywords >= 8) score += 5;
    else if (metrics.keywords >= 5) score += 3;
    
    return Math.min(100, score);
  }

  /**
   * Generate SEO recommendations
   */
  private static generateRecommendations(metrics: {
    titleLength: number;
    descriptionLength: number;
    wordCount: number;
    headings: number;
    internalLinks: number;
    externalLinks: number;
    images: number;
    keywords: number;
  }): string[] {
    const recommendations: string[] = [];
    
    if (metrics.titleLength < 30 || metrics.titleLength > 60) {
      recommendations.push('Optimize title length to 30-60 characters for better SEO');
    }
    
    if (metrics.descriptionLength < 120 || metrics.descriptionLength > 160) {
      recommendations.push('Optimize meta description to 120-160 characters');
    }
    
    if (metrics.wordCount < 1000) {
      recommendations.push('Increase content length to at least 1000 words for better ranking');
    }
    
    if (metrics.headings < 3) {
      recommendations.push('Add more headings (H2, H3) to improve content structure');
    }
    
    if (metrics.internalLinks < 2) {
      recommendations.push('Add more internal links to improve site navigation');
    }
    
    if (metrics.externalLinks < 2) {
      recommendations.push('Add authoritative external links to increase credibility');
    }
    
    if (metrics.images < 2) {
      recommendations.push('Add more relevant images to enhance user engagement');
    }
    
    if (metrics.keywords < 5) {
      recommendations.push('Include more relevant keywords naturally in the content');
    }
    
    return recommendations;
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  /**
   * Add schema markup to content
   */
  static addSchemaMarkup(post: {
    title: string;
    description: string;
    author: string;
    publishedAt: string;
    modifiedAt: string;
    image: string;
    url: string;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: post.image,
      datePublished: post.publishedAt,
      dateModified: post.modifiedAt,
      author: {
        '@type': 'Person',
        name: post.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'TechXak',
        logo: {
          '@type': 'ImageObject',
          url: 'https://techxak.com/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': post.url
      }
    };
    
    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  }
}

