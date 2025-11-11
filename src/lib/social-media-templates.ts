/**
 * Social Media Content Templates
 * Pre-built templates for consistent social media posting
 */

export interface BlogPost {
  title: string;
  excerpt: string;
  url: string;
  tags: string[];
  category: string;
}

export interface SocialPost {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'reddit';
  content: string;
  hashtags?: string[];
  imageUrl?: string;
}

export class SocialMediaTemplates {
  
  /**
   * Generate LinkedIn post from blog article
   */
  static generateLinkedInPost(post: BlogPost): SocialPost {
    const hooks = [
      `🚀 ${post.title}`,
      `💡 New insight: ${post.title}`,
      `📊 Just published: ${post.title}`,
      `🎯 ${post.title}`,
      `⚡ ${post.title}`
    ];

    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    
    const content = `${hook}

${post.excerpt}

Key takeaways:
→ ${this.extractKeyPoint(post.excerpt, 0)}
→ ${this.extractKeyPoint(post.excerpt, 1)}
→ ${this.extractKeyPoint(post.excerpt, 2)}

Read the full guide: ${post.url}`;

    const hashtags = this.generateHashtags(post.tags, 'linkedin');

    return {
      platform: 'linkedin',
      content: `${content}\n\n${hashtags.join(' ')}`,
      hashtags
    };
  }

  /**
   * Generate Twitter thread from blog article
   */
  static generateTwitterThread(post: BlogPost): SocialPost[] {
    const tweets: SocialPost[] = [];

    // Tweet 1: Hook
    tweets.push({
      platform: 'twitter',
      content: `🧵 ${post.title}\n\nA thread 👇`,
      hashtags: this.generateHashtags(post.tags, 'twitter')
    });

    // Tweet 2-4: Key points
    const points = this.extractKeyPoints(post.excerpt, 3);
    points.forEach((point, index) => {
      tweets.push({
        platform: 'twitter',
        content: `${index + 2}/ ${point}`
      });
    });

    // Final tweet: CTA
    tweets.push({
      platform: 'twitter',
      content: `${points.length + 2}/ Want to learn more?\n\nRead the full guide with examples and code:\n${post.url}`,
      hashtags: this.generateHashtags(post.tags, 'twitter')
    });

    return tweets;
  }

  /**
   * Generate single Twitter post
   */
  static generateTwitterPost(post: BlogPost): SocialPost {
    const templates = [
      `🚀 ${post.title}\n\n${this.truncate(post.excerpt, 180)}\n\n${post.url}`,
      `💡 New: ${post.title}\n\n${this.truncate(post.excerpt, 180)}\n\n${post.url}`,
      `📊 ${post.title}\n\n${this.truncate(post.excerpt, 180)}\n\nRead more: ${post.url}`,
    ];

    const content = templates[Math.floor(Math.random() * templates.length)];
    const hashtags = this.generateHashtags(post.tags, 'twitter');

    return {
      platform: 'twitter',
      content: `${content}\n\n${hashtags.join(' ')}`,
      hashtags
    };
  }

  /**
   * Generate Reddit post
   */
  static generateRedditPost(post: BlogPost, subreddit: string): SocialPost {
    const content = `**${post.title}**

${post.excerpt}

I've written a comprehensive guide covering:

- ${this.extractKeyPoint(post.excerpt, 0)}
- ${this.extractKeyPoint(post.excerpt, 1)}
- ${this.extractKeyPoint(post.excerpt, 2)}

You can read the full article here: ${post.url}

Happy to answer any questions!`;

    return {
      platform: 'reddit',
      content
    };
  }

  /**
   * Generate Facebook post
   */
  static generateFacebookPost(post: BlogPost): SocialPost {
    const content = `${post.title}

${post.excerpt}

Learn more: ${post.url}`;

    const hashtags = this.generateHashtags(post.tags, 'facebook');

    return {
      platform: 'facebook',
      content: `${content}\n\n${hashtags.join(' ')}`,
      hashtags
    };
  }

  /**
   * Generate Dev.to article frontmatter
   */
  static generateDevToFrontmatter(post: BlogPost): string {
    return `---
title: ${post.title}
published: true
description: ${this.truncate(post.excerpt, 150)}
tags: ${post.tags.slice(0, 4).join(', ')}
canonical_url: ${post.url}
cover_image: 
---

*Originally published at [TechXak](${post.url})*

${post.excerpt}

[Continue reading on TechXak →](${post.url})`;
  }

  /**
   * Generate Medium article intro
   */
  static generateMediumIntro(post: BlogPost): string {
    return `# ${post.title}

*This article was originally published on [TechXak](${post.url}). Read the full version with interactive examples and code snippets.*

${post.excerpt}

---`;
  }

  /**
   * Generate email newsletter content
   */
  static generateNewsletterContent(posts: BlogPost[]): string {
    const content = `# This Week at TechXak

Hi there! 👋

Here are this week's top articles:

${posts.map((post, index) => `
## ${index + 1}. ${post.title}

${post.excerpt}

[Read more →](${post.url})
`).join('\n')}

---

💡 **Quick Tip of the Week**

${this.generateQuickTip(posts[0].category)}

---

See you next week!

Best,
The TechXak Team

[Visit TechXak](https://techxak.com) | [Unsubscribe](https://techxak.com/unsubscribe)`;

    return content;
  }

  /**
   * Generate outreach email templates
   */
  static generateOutreachEmail(type: 'guest-post' | 'resource-page' | 'broken-link', data: {
    recipientName: string;
    siteName: string;
    articleTitle?: string;
    articleUrl?: string;
    brokenUrl?: string;
    resourceUrl?: string;
  }): string {
    switch (type) {
      case 'guest-post':
        return `Subject: Guest Post Idea: ${data.articleTitle}

Hi ${data.recipientName},

I'm a regular reader of ${data.siteName} and loved your recent article on ${data.articleTitle}.

I'd love to contribute a guest post that would add value to your readers:

**Proposed Title:** "${data.articleTitle}"

**Outline:**
- [Key Point 1]
- [Key Point 2]
- [Key Point 3]

The article will include:
✓ Original research and data
✓ Practical examples
✓ Custom graphics
✓ 2,000+ words of actionable content

Here are some samples of my work:
- [Sample 1 URL]
- [Sample 2 URL]

Would this be a good fit for ${data.siteName}?

Best regards,
[Your Name]
TechXak.com`;

      case 'resource-page':
        return `Subject: Resource Suggestion for ${data.siteName}

Hi ${data.recipientName},

I came across your excellent resource page on [topic] and found it incredibly helpful.

I recently published a comprehensive guide that your visitors might find valuable:

${data.resourceUrl}

It covers:
- [Unique Value 1]
- [Unique Value 2]
- [Unique Value 3]

Would you consider adding it to your resource list?

Thanks for curating such a great collection!

Best,
[Your Name]
TechXak.com`;

      case 'broken-link':
        return `Subject: Broken Link on ${data.siteName}

Hi ${data.recipientName},

I was reading your article "${data.articleTitle}" and noticed a broken link pointing to:
${data.brokenUrl}

I recently published a comprehensive guide on the same topic that could serve as an updated replacement:

${data.resourceUrl}

It includes:
- [Updated Information]
- [Additional Insights]
- [Visual Aids]

Hope this helps!

Best regards,
[Your Name]
TechXak.com`;

      default:
        return '';
    }
  }

  /**
   * Helper: Extract key points from text
   */
  private static extractKeyPoints(text: string, count: number): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, count).map(s => s.trim());
  }

  /**
   * Helper: Extract single key point
   */
  private static extractKeyPoint(text: string, index: number): string {
    const points = this.extractKeyPoints(text, index + 1);
    return points[index] || 'Key insight from the article';
  }

  /**
   * Helper: Truncate text
   */
  private static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Helper: Generate hashtags based on platform
   */
  private static generateHashtags(tags: string[], platform: string): string[] {
    const hashtagMap: Record<string, string[]> = {
      'web development': ['WebDev', 'WebDevelopment', 'Coding'],
      'ai': ['AI', 'ArtificialIntelligence', 'MachineLearning'],
      'cloud': ['Cloud', 'CloudComputing', 'AWS'],
      'javascript': ['JavaScript', 'JS', 'WebDev'],
      'react': ['React', 'ReactJS', 'Frontend'],
      'nextjs': ['NextJS', 'React', 'WebDev'],
      'typescript': ['TypeScript', 'JavaScript', 'WebDev'],
      'nodejs': ['NodeJS', 'JavaScript', 'Backend'],
      'python': ['Python', 'Programming', 'Coding'],
      'devops': ['DevOps', 'CloudComputing', 'Automation']
    };

    const hashtags = new Set<string>();
    
    tags.forEach(tag => {
      const normalized = tag.toLowerCase();
      const mapped = hashtagMap[normalized] || [tag];
      mapped.forEach(h => hashtags.add(`#${h}`));
    });

    // Platform-specific limits
    const limits: Record<string, number> = {
      linkedin: 5,
      twitter: 3,
      facebook: 5,
      reddit: 0 // Reddit doesn't use hashtags
    };

    const limit = limits[platform] || 3;
    return Array.from(hashtags).slice(0, limit);
  }

  /**
   * Helper: Generate quick tip based on category
   */
  private static generateQuickTip(category: string): string {
    const tips: Record<string, string> = {
      'web development': 'Use semantic HTML for better SEO and accessibility!',
      'ai': 'Start small with AI - focus on one use case and iterate.',
      'cloud': 'Always use infrastructure as code for reproducible deployments.',
      'javascript': 'Use const by default, let when needed, avoid var.',
      'react': 'Keep components small and focused on a single responsibility.',
      'nextjs': 'Use Server Components by default in Next.js 15 for better performance.',
      'typescript': 'Enable strict mode in TypeScript for better type safety.',
      'nodejs': 'Use async/await instead of callbacks for cleaner code.',
      'python': 'Use virtual environments to manage project dependencies.',
      'devops': 'Automate everything - if you do it twice, script it!'
    };

    return tips[category.toLowerCase()] || 'Keep learning and building! 🚀';
  }
}

/**
 * Social media posting schedule generator
 */
export class SocialMediaScheduler {
  
  /**
   * Generate optimal posting times
   */
  static getOptimalPostingTimes(platform: string): string[] {
    const schedules: Record<string, string[]> = {
      linkedin: [
        '08:00', // Morning commute
        '12:00', // Lunch break
        '17:00'  // End of workday
      ],
      twitter: [
        '09:00', // Morning
        '12:00', // Lunch
        '15:00', // Afternoon
        '18:00', // Evening
        '21:00'  // Night
      ],
      facebook: [
        '09:00', // Morning
        '13:00', // Afternoon
        '19:00'  // Evening
      ],
      reddit: [
        '07:00', // Early morning
        '12:00', // Lunch
        '18:00'  // Evening
      ]
    };

    return schedules[platform] || ['09:00', '15:00', '21:00'];
  }

  /**
   * Generate weekly posting schedule
   */
  static generateWeeklySchedule(posts: BlogPost[]): Array<{
    day: string;
    time: string;
    platform: string;
    post: SocialPost;
  }> {
    const schedule: Array<{
      day: string;
      time: string;
      platform: string;
      post: SocialPost;
    }> = [];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    posts.forEach((post, index) => {
      const day = days[index % days.length];
      
      // LinkedIn
      schedule.push({
        day,
        time: '08:00',
        platform: 'LinkedIn',
        post: SocialMediaTemplates.generateLinkedInPost(post)
      });

      // Twitter
      schedule.push({
        day,
        time: '12:00',
        platform: 'Twitter',
        post: SocialMediaTemplates.generateTwitterPost(post)
      });

      // Reddit (only for selected posts)
      if (index % 2 === 0) {
        schedule.push({
          day,
          time: '18:00',
          platform: 'Reddit',
          post: SocialMediaTemplates.generateRedditPost(post, 'programming')
        });
      }
    });

    return schedule;
  }
}

