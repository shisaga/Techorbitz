/**
 * Advanced SEO Optimizer for Top Rankings
 * Implements cutting-edge SEO strategies for maximum visibility
 */

export interface AdvancedSEOAnalysis {
  overallScore: number;
  technicalSEO: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  contentQuality: {
    score: number;
    wordCount: number;
    readabilityScore: number;
    keywordDensity: number;
    issues: string[];
  };
  onPageSEO: {
    score: number;
    titleOptimization: number;
    metaDescription: number;
    headingStructure: number;
    internalLinks: number;
    externalLinks: number;
  };
  userEngagement: {
    score: number;
    estimatedTimeOnPage: number;
    multimediaElements: number;
    interactiveElements: number;
  };
  competitiveAnalysis: {
    targetKeywords: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedRankingTime: string;
  };
}

export class AdvancedSEOOptimizer {
  
  /**
   * Comprehensive SEO analysis for top rankings
   */
  static analyzeForTopRanking(
    title: string,
    content: string,
    metaDescription: string,
    targetKeyword?: string
  ): AdvancedSEOAnalysis {
    const technicalSEO = this.analyzeTechnicalSEO(title, content, metaDescription);
    const contentQuality = this.analyzeContentQuality(content, targetKeyword);
    const onPageSEO = this.analyzeOnPageSEO(title, content, metaDescription, targetKeyword);
    const userEngagement = this.analyzeUserEngagement(content);
    const competitiveAnalysis = this.analyzeCompetitiveness(targetKeyword, content);

    const overallScore = Math.round(
      (technicalSEO.score * 0.2) +
      (contentQuality.score * 0.3) +
      (onPageSEO.score * 0.3) +
      (userEngagement.score * 0.2)
    );

    return {
      overallScore,
      technicalSEO,
      contentQuality,
      onPageSEO,
      userEngagement,
      competitiveAnalysis
    };
  }

  /**
   * Analyze technical SEO factors
   */
  private static analyzeTechnicalSEO(
    title: string,
    content: string,
    metaDescription: string
  ): AdvancedSEOAnalysis['technicalSEO'] {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Title length check
    if (title.length < 30 || title.length > 60) {
      issues.push('Title length not optimal (should be 30-60 characters)');
      score -= 10;
    }

    // Meta description check
    if (!metaDescription || metaDescription.length < 120 || metaDescription.length > 160) {
      issues.push('Meta description not optimal (should be 120-160 characters)');
      score -= 10;
    }

    // Content length check
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 1500) {
      issues.push(`Content too short (${wordCount} words, recommended: 1500+)`);
      recommendations.push('Add more comprehensive content to compete for top rankings');
      score -= 15;
    }

    // Heading structure
    const h1Count = (content.match(/<h1/gi) || []).length;
    const h2Count = (content.match(/<h2/gi) || []).length;
    
    if (h1Count === 0) {
      issues.push('Missing H1 heading');
      score -= 10;
    } else if (h1Count > 1) {
      issues.push('Multiple H1 headings (should have only one)');
      score -= 5;
    }

    if (h2Count < 3) {
      issues.push('Not enough H2 headings (recommended: 3+)');
      recommendations.push('Add more H2 headings to improve content structure');
      score -= 5;
    }

    // Image optimization
    const images = content.match(/<img[^>]+>/gi) || [];
    const imagesWithoutAlt = images.filter(img => !img.includes('alt=')).length;
    
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`);
      score -= 10;
    }

    if (images.length < 2) {
      recommendations.push('Add more images to improve engagement (recommended: 3+)');
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }

  /**
   * Analyze content quality
   */
  private static analyzeContentQuality(
    content: string,
    targetKeyword?: string
  ): AdvancedSEOAnalysis['contentQuality'] {
    const issues: string[] = [];
    let score = 100;

    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = wordCount / sentences.length;

    // Readability score (Flesch Reading Ease approximation)
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * (content.split(/\s+/).join('').length / wordCount)
    ));

    // Keyword density
    let keywordDensity = 0;
    if (targetKeyword) {
      const keywordCount = (content.toLowerCase().match(new RegExp(targetKeyword.toLowerCase(), 'g')) || []).length;
      keywordDensity = (keywordCount / wordCount) * 100;

      if (keywordDensity < 0.5) {
        issues.push('Keyword density too low (target: 1-2%)');
        score -= 15;
      } else if (keywordDensity > 3) {
        issues.push('Keyword density too high - risk of keyword stuffing');
        score -= 20;
      }
    }

    // Content depth
    if (wordCount < 1500) {
      issues.push('Content not comprehensive enough for top rankings');
      score -= 20;
    } else if (wordCount < 2500) {
      score -= 10;
    }

    // Readability
    if (readabilityScore < 50) {
      issues.push('Content may be too complex for average readers');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      wordCount,
      readabilityScore: Math.round(readabilityScore),
      keywordDensity: Math.round(keywordDensity * 100) / 100,
      issues
    };
  }

  /**
   * Analyze on-page SEO factors
   */
  private static analyzeOnPageSEO(
    title: string,
    content: string,
    metaDescription: string,
    targetKeyword?: string
  ): AdvancedSEOAnalysis['onPageSEO'] {
    let titleOptimization = 100;
    let metaDescriptionScore = 100;
    let headingStructure = 100;
    let internalLinks = 0;
    let externalLinks = 0;

    // Title optimization
    if (targetKeyword && !title.toLowerCase().includes(targetKeyword.toLowerCase())) {
      titleOptimization -= 30;
    }
    if (title.length < 30 || title.length > 60) {
      titleOptimization -= 20;
    }
    if (!/\d/.test(title)) {
      titleOptimization -= 10; // Numbers in titles improve CTR
    }

    // Meta description
    if (!metaDescription) {
      metaDescriptionScore = 0;
    } else {
      if (targetKeyword && !metaDescription.toLowerCase().includes(targetKeyword.toLowerCase())) {
        metaDescriptionScore -= 30;
      }
      if (metaDescription.length < 120 || metaDescription.length > 160) {
        metaDescriptionScore -= 20;
      }
      if (!metaDescription.match(/[!?]/)) {
        metaDescriptionScore -= 10; // Call-to-action
      }
    }

    // Heading structure
    const h2Count = (content.match(/<h2/gi) || []).length;
    const h3Count = (content.match(/<h3/gi) || []).length;
    
    if (h2Count < 3) headingStructure -= 30;
    if (h3Count < 2) headingStructure -= 20;

    // Links
    const allLinks = content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || [];
    internalLinks = allLinks.filter(link => 
      link.includes('techxak.com') || link.startsWith('href="/')
    ).length;
    externalLinks = allLinks.length - internalLinks;

    const score = Math.round(
      (titleOptimization * 0.3) +
      (metaDescriptionScore * 0.25) +
      (headingStructure * 0.25) +
      (Math.min(100, internalLinks * 20) * 0.1) +
      (Math.min(100, externalLinks * 25) * 0.1)
    );

    return {
      score: Math.max(0, score),
      titleOptimization: Math.max(0, titleOptimization),
      metaDescription: Math.max(0, metaDescriptionScore),
      headingStructure: Math.max(0, headingStructure),
      internalLinks,
      externalLinks
    };
  }

  /**
   * Analyze user engagement factors
   */
  private static analyzeUserEngagement(content: string): AdvancedSEOAnalysis['userEngagement'] {
    const wordCount = content.split(/\s+/).length;
    const estimatedTimeOnPage = Math.ceil(wordCount / 200); // 200 WPM

    const images = (content.match(/<img/gi) || []).length;
    const videos = (content.match(/<video|<iframe.*youtube|<iframe.*vimeo/gi) || []).length;
    const codeBlocks = (content.match(/<pre|<code/gi) || []).length;
    const lists = (content.match(/<ul|<ol/gi) || []).length;
    const tables = (content.match(/<table/gi) || []).length;

    const multimediaElements = images + videos;
    const interactiveElements = codeBlocks + lists + tables;

    let score = 50; // Base score

    // Multimedia bonus
    if (multimediaElements >= 3) score += 20;
    else if (multimediaElements >= 1) score += 10;

    // Interactive elements bonus
    if (interactiveElements >= 3) score += 20;
    else if (interactiveElements >= 1) score += 10;

    // Time on page bonus
    if (estimatedTimeOnPage >= 5) score += 10;

    return {
      score: Math.min(100, score),
      estimatedTimeOnPage,
      multimediaElements,
      interactiveElements
    };
  }

  /**
   * Analyze keyword competitiveness
   */
  private static analyzeCompetitiveness(
    targetKeyword: string | undefined,
    content: string
  ): AdvancedSEOAnalysis['competitiveAnalysis'] {
    const keywords: string[] = [];
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    let estimatedRankingTime = '3-6 months';

    if (targetKeyword) {
      keywords.push(targetKeyword);
      
      // Simple difficulty estimation based on keyword length
      const wordCount = targetKeyword.split(/\s+/).length;
      if (wordCount >= 4) {
        difficulty = 'easy';
        estimatedRankingTime = '1-3 months';
      } else if (wordCount === 3) {
        difficulty = 'medium';
        estimatedRankingTime = '3-6 months';
      } else {
        difficulty = 'hard';
        estimatedRankingTime = '6-12 months';
      }
    }

    // Extract potential keywords from content
    const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (!this.isStopWord(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    keywords.push(...topWords);

    return {
      targetKeywords: [...new Set(keywords)],
      difficulty,
      estimatedRankingTime
    };
  }

  /**
   * Check if word is a stop word
   */
  private static isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
    ]);
    return stopWords.has(word);
  }
}

