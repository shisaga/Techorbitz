import OpenAI from 'openai';
import { prisma } from './prisma';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  excerpt?: string;
  seoDescription?: string;
  seoTitle?: string;
  keywords: string[];
  heroImage: string;
  heroImageAlt: string;
  publishedAt: string;
  tags: string[];
  canonicalUrl: string;
}

interface TrendingTopic {
  title: string;
  description: string;
  url?: string;
  keywords: string[];
  publishedAt?: string;
  source?: string;
  priorityScore?: number;
}

interface PexelsImage {
  imageUrl: string;
  altText: string;
}

class AIBlogGenerator {
  private openai: OpenAI;
  private stabilityApiKey: string;
  private pexelsApiKey: string;
  private wpBaseUrl: string;
  private wpUser: string;
  private wpAppPassword: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.stabilityApiKey = process.env.STABILITY_API_KEY!;
    this.pexelsApiKey = process.env.PEXELS_API_KEY!;
    this.wpBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techonigx.com';
    this.wpUser = 'ai-generator';
    this.wpAppPassword = 'not-used';
  }

  async getTrendingTopics(): Promise<TrendingTopic[]> {
    const allArticles: any[] = [];

    try {
      // DUAL SOURCE APPROACH: GitHub + NewsAPI
      // Source 1: GitHub trending (programming projects)
      await this.fetchGitHubTrending(allArticles);
      
      // Source 2: NewsAPI (tech news) - Using direct fetch
      try {
        const newsApiKey = process.env.NEWSAPI_KEY;
        if (newsApiKey) {
          console.log('Fetching tech news with direct NewsAPI calls...');
          
          // Real-time tech news queries for latest developments
          const techQueries = [
            // Priority 1: Breaking Tech News
            'artificial intelligence OR AI OR machine learning',
            'OpenAI OR ChatGPT OR Google AI OR Microsoft AI',
            'Apple OR iPhone OR iOS OR Android',
            
            // Priority 2: Programming & Development
            'React OR Next.js OR TypeScript OR JavaScript',
            'Python OR Django OR Flask OR Node.js',
            'GitHub OR GitLab OR coding OR programming',
            
            // Priority 3: Tech Industry & Startups
            'startup OR tech company OR funding OR investment',
            'Silicon Valley OR tech news OR technology',
            'cybersecurity OR blockchain OR cryptocurrency',
            
            // Priority 4: Emerging Tech
            'Web3 OR metaverse OR VR OR AR',
            'cloud computing OR AWS OR Azure OR Google Cloud',
            'mobile app OR software development'
          ];

          // Fetch articles for each priority level with better error handling
          for (let i = 0; i < techQueries.length; i++) {
            const query = techQueries[i];
            console.log(`📰 Fetching Priority ${Math.floor(i/3) + 1} articles: ${query.substring(0, 50)}...`);
            
            try {
              // Use 'everything' endpoint for broader coverage and recent articles
              const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=10&sortBy=publishedAt&from=${this.getOneDayAgo()}&apiKey=${newsApiKey}`;
              console.log(`🔗 NewsAPI URL: ${url.substring(0, 100)}...`);
              
              const response = await fetch(url);
              console.log(`📊 NewsAPI Response Status: ${response.status}`);
              
              if (response.ok) {
                const data = await response.json();
                console.log(`📈 NewsAPI Response: ${data.articles?.length || 0} articles found for "${query}"`);
                
                if (data.articles && data.articles.length > 0) {
                  const priorityScore = Math.floor(i/3) + 1;
                  const articleWithPriority = data.articles.map((article: any) => ({
                    ...article,
                    priorityScore,
                    weight: 4 - priorityScore,
                    source: { name: article.source?.name || 'Tech News' },
                    publishedAt: article.publishedAt || new Date().toISOString()
                  }));
                  allArticles.push(...articleWithPriority);
                  console.log(`✅ Added ${articleWithPriority.length} articles for "${query}"`);
                } else {
                  console.log(`⚠️ No articles found for "${query}"`);
                }
              } else {
                const errorText = await response.text();
                console.error(`❌ NewsAPI error for "${query}": ${response.status} ${response.statusText}`);
                console.error(`Error details: ${errorText}`);
              }
            } catch (queryError) {
              console.error(`❌ Network error with query "${query}":`, queryError);
            }
            
            // Small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } else {
          console.log('NewsAPI key not found, skipping news fetch');
        }
      } catch (newsError) {
        console.error('NewsAPI fetch error:', newsError);
      }

    } catch (error) {
      console.error('Error in getTrendingTopics:', error);
      console.log('Using fallback topics...');
      return this.getFallbackTopics();
    }

    if (allArticles.length === 0) {
      console.log('No articles found, using fallback topics');
      const fallbackTopics = this.getFallbackTopics();
      console.log(`Generated ${fallbackTopics.length} fallback topics`);
      return fallbackTopics;
    }

    console.log(`Found ${allArticles.length} latest tech news articles`);
    const processedTopics = this.processNewsArticlesWithPriority(allArticles);
    
    // Filter for unique topics (avoiding duplicates in DB)
    const uniqueTopics = await this.filterUniqueTopics(processedTopics);
    console.log(`Found ${uniqueTopics.length} unique topics out of ${processedTopics.length} total topics`);
    
    return uniqueTopics.slice(0, 10); // Return top 10 unique topics
  }

  private getOneDayAgo(): string {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return oneDayAgo.toISOString().split('T')[0];
  }

  private getTwoDaysAgo(): string {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return twoDaysAgo.toISOString().split('T')[0];
  }

  private async fetchGitHubTrending(allArticles: any[]): Promise<void> {
    try {
      // GitHub Trending API - Focus on programming languages and frameworks
      const programmingLanguages = ['javascript', 'typescript', 'python', 'react', 'vue', 'angular', 'rust'];
      const randomLang = programmingLanguages[Math.floor(Math.random() * programmingLanguages.length)];
      const githubResponse = await fetch(`https://api.github.com/search/repositories?q=language:${randomLang}+created:>2025-08-29&sort=stars&order=desc&per_page=15`);
      
      if (githubResponse.ok) {
        const githubData = await githubResponse.json();
        if (githubData.items) {
          const githubArticles = githubData.items
            .filter((repo: any) => repo.description && repo.language) // Only repos with description and language
            .map((repo: any) => ({
              title: `${repo.name}: Open-Source ${repo.language} Project for ${repo.description.substring(0, 50)}`,
              description: `Exploring ${repo.name}, a trending ${repo.language} repository: ${repo.description}`,
              url: repo.html_url,
              publishedAt: repo.created_at,
              source: { name: 'GitHub Trending' },
              priorityScore: 1, // High priority for programming content
              weight: 3
            }));
          allArticles.push(...githubArticles.slice(0, 8));
          console.log(`Added ${githubArticles.length} programming repositories`);
        }
      }
    } catch (error) {
      console.error('Error fetching additional tech sources:', error);
    }
  }

  private processNewsArticlesWithPriority(articles: any[]): TrendingTopic[] {
    // Sort articles by priority score and recency
    const sortedArticles = articles.sort((a, b) => {
      // Primary sort: Priority score (lower = higher priority)
      if (a.priorityScore !== b.priorityScore) {
        return a.priorityScore - b.priorityScore;
      }
      // Secondary sort: Publication date (newer first)
      const dateA = new Date(a.publishedAt || a.created_at).getTime();
      const dateB = new Date(b.publishedAt || b.created_at).getTime();
      return dateB - dateA;
    });

    return this.processNewsArticles(sortedArticles);
  }

  private processNewsArticles(articles: any[]): TrendingTopic[] {
    const topics: TrendingTopic[] = [];
    const seenTitles = new Set<string>();

    // User's specific tech keywords (REQUIRED)
    const latestTechKeywords = [
      "AI Dev Tools", "PWAs", "WebAssembly", "Jamstack", "API-first", "Utility-First CSS", 
      "Animated UIs", "Python", "JavaScript", "TypeScript", "React", "Next.js", "Vue", 
      "Angular", "Node.js", "Django", "Flask", ".NET Core", "Swift", "Kotlin", "Flutter", 
      "Dart", "Kotlin Multiplatform", "Tauri", "Rust", "Uno Platform", "C#", "Wasm", 
      "AI integration", "serverless", "headless CMS", "IoT", "predictive analytics"
    ];

    // Additional technical keywords
    const additionalTechKeywords = [
      'programming', 'coding', 'developer', 'software development', 'web development',
      'github', 'npm', 'yarn', 'webpack', 'vite', 'eslint', 'prettier', 'babel',
      'database', 'mongodb', 'postgresql', 'mysql', 'redis', 'prisma', 'sql',
      'docker', 'kubernetes', 'aws', 'azure', 'vercel', 'netlify', 'heroku',
      'vs code', 'visual studio code', 'jetbrains', 'ide', 'code editor',
      'api', 'rest api', 'graphql', 'microservices', 'lambda',
      'tailwind', 'css', 'html', 'frontend', 'backend', 'full-stack', 'devops',
      'git', 'version control', 'ci/cd', 'testing', 'unit test', 'deployment',
      'framework', 'library', 'package', 'module', 'component', 'hook',
      'mobile development', 'ios development', 'android development',
      'data science', 'analytics', 'big data', 'etl', 'data engineering',
      'cybersecurity', 'security', 'encryption', 'blockchain', 'smart contract',
      'cloud computing', 'saas', 'paas', 'iaas', 'edge computing'
    ];

    // Combine all tech keywords
    const allTechKeywords = [...latestTechKeywords, ...additionalTechKeywords];

    // Acceptable topics that are tech-related but broader (like Japan tech investment)
    const acceptableBroaderTopics = [
      'tech investment', 'technology funding', 'startup funding', 'tech acquisition',
      'technology policy', 'digital transformation', 'innovation', 'tech industry',
      'AI companies', 'tech IPO', 'venture capital', 'tech market'
    ];

    // Strict blacklist - Topics to completely avoid
    const blacklistKeywords = [
      'dollar tree', 'shopping mall', 'retail store', 'concert ticket', 'music festival',
      'oasis band', 'metlife stadium', 'entertainment venue', 'celebrity news',
      'sports game', 'football', 'basketball', 'healthcare policy', 'medical treatment',
      'education reform', 'school system', 'travel tourism', 'hotel booking',
      'restaurant review', 'food delivery', 'cooking recipe', 'fashion trend',
      'beauty product', 'lifestyle blog', 'real estate market', 'housing price',
      'automotive review', 'car dealership'
    ];

    for (const article of articles) {
      if (!article.title || !article.description || seenTitles.has(article.title)) {
        continue;
      }

      const titleLower = article.title.toLowerCase();
      const descriptionLower = article.description.toLowerCase();
      const fullText = `${titleLower} ${descriptionLower}`;
      
      // Check blacklist first - immediately reject if found
      const hasBlacklistKeyword = blacklistKeywords.some(keyword => 
        fullText.includes(keyword.toLowerCase())
      );
      
      if (hasBlacklistKeyword) {
        console.log(`❌ Rejected blacklisted content: ${article.title}`);
        continue;
      }
      
      // Check for required tech keywords OR acceptable broader topics
      const hasTechKeyword = allTechKeywords.some(keyword => 
        fullText.includes(keyword.toLowerCase())
      );
      
      const hasAcceptableBroaderTopic = acceptableBroaderTopics.some(keyword => 
        fullText.includes(keyword.toLowerCase())
      );
      
      if (!hasTechKeyword && !hasAcceptableBroaderTopic) {
        console.log(`❌ Rejected non-technical content: ${article.title}`);
        continue;
      }
      
      // Determine priority score for tech content
      let priorityScore = article.priorityScore || 2;
      
      // Extra high priority for user's specific keywords
      const hasUserKeyword = latestTechKeywords.some(keyword => 
        fullText.includes(keyword.toLowerCase())
      );
      
      if (hasUserKeyword) {
        priorityScore = 1;
        console.log(`✅ High-priority tech content: ${article.title}`);
      } else if (hasTechKeyword) {
        priorityScore = 2;
        console.log(`✅ Tech content: ${article.title}`);
      } else {
        priorityScore = 3;
        console.log(`✅ Acceptable broader tech topic: ${article.title}`);
      }

      seenTitles.add(article.title);
      
      const keywords = this.extractNewsKeywords(article.title, article.description);
      const enhancedTitle = this.enhanceTitleForBlog(article.title);
      
      topics.push({
        title: enhancedTitle,
        description: article.description,
        url: article.url,
        keywords,
        publishedAt: article.publishedAt,
        source: article.source?.name || 'News',
        priorityScore
      });
    }

    // Sort by publication date (most recent first)
    return topics.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  private extractNewsKeywords(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const techKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'technology', 'innovation',
      'programming', 'coding', 'software', 'development', 'react', 'javascript',
      'python', 'typescript', 'nextjs', 'vue', 'angular', 'flutter', 'rust'
    ];
    
    return techKeywords.filter(keyword => text.includes(keyword));
  }

  private enhanceTitleForBlog(originalTitle: string): string {
    // Add "Latest Technology Insights and Analysis" to make it more blog-friendly
    if (originalTitle.includes('Latest Technology Insights and Analysis')) {
      return originalTitle;
    }
    return `${originalTitle}: Latest Technology Insights and Analysis`;
  }

  private getFallbackTopics(): TrendingTopic[] {
    // STRICTLY PROGRAMMING & AI-FOCUSED fallback topics using user's keywords
    const currentDate = new Date().toISOString();
   return [
   {
     title: 'React 19 Server Components: Revolutionary Frontend Development Patterns',
     description: 'Deep dive into React 19 Server Components, concurrent rendering, and modern React development patterns.',
     keywords: ['React', 'JavaScript', 'frontend development', 'React architecture'],
     publishedAt: currentDate,
     priorityScore: 1
   },
   {
     title: 'TypeScript 5.5: Advanced Type Features for Modern Development',
     description: 'Exploring TypeScript 5.5 new features, improved type inference, and enhanced developer experience.',
     keywords: ['TypeScript', 'JavaScript', 'web development', 'type safety'],
     publishedAt: currentDate,
     priorityScore: 1
   },
   {
     title: 'Python AI Integration: Building Smart Applications with OpenAI',
     description: 'Complete guide to integrating AI capabilities in Python applications using OpenAI API.',
     keywords: ['Python', 'AI integration', 'machine learning', 'OpenAI'],
     publishedAt: currentDate,
     priorityScore: 1
   },
   {
     title: 'Next.js 15: App Router and Server Actions Deep Dive',
     description: 'Comprehensive analysis of Next.js 15 App Router, Server Actions, and performance optimizations.',
     keywords: ['Next.js', 'React', 'full-stack development', 'JavaScript'],
     publishedAt: currentDate,
     priorityScore: 1
   },
   {
     title: 'WebAssembly (Wasm): The Future of Web Performance',
     description: 'Understanding WebAssembly implementation, use cases, and integration with modern web frameworks.',
     keywords: ['WebAssembly', 'Wasm', 'web performance', 'JavaScript'],
     publishedAt: currentDate,
     priorityScore: 1
   },
   {
     title: 'Flutter Cross-Platform Development: Dart Language Mastery',
     description: 'Advanced Flutter development techniques using Dart for building native mobile applications.',
     keywords: ['Flutter', 'Dart', 'mobile development', 'cross-platform'],
     publishedAt: currentDate,
     priorityScore: 1
   },
   {
     title: 'Rust Programming: Building High-Performance Applications',
     description: 'Modern Rust development patterns, memory safety, and performance optimization techniques.',
     keywords: ['Rust', 'systems programming', 'performance', 'memory safety'],
     publishedAt: currentDate,
     priorityScore: 1
   },
   {
     title: 'AI Dev Tools: Revolutionizing Software Development Workflow',
     description: 'Latest AI-powered development tools that enhance productivity and code quality.',
     keywords: ['AI Dev Tools', 'developer productivity', 'AI integration', 'coding assistance'],
     publishedAt: currentDate,
     priorityScore: 1
   }
   ];
  }

  private async filterUniqueTopics(topics: TrendingTopic[]): Promise<TrendingTopic[]> {
    const uniqueTopics: TrendingTopic[] = [];
    
    console.log(`Filtering ${topics.length} topics for uniqueness...`);
    
    for (const topic of topics) {
      const exists = await this.checkTopicExists(topic.title);
      if (!exists) {
        uniqueTopics.push(topic);
        console.log(`✅ Unique topic found: ${topic.title}`);
      } else {
        console.log(`❌ Duplicate topic skipped: ${topic.title} (similar to existing post)`);
      }
    }
    
    console.log(`Found ${uniqueTopics.length} unique topics out of ${topics.length} total`);
    return uniqueTopics;
  }

  private async checkTopicExists(title: string): Promise<boolean> {
    const normalizedTitle = title.toLowerCase();
    
    // Simple exact match duplicate checking to avoid Prisma issues
    const existingPosts = await prisma.post.findMany({
      select: { title: true, slug: true },
      where: {
        OR: [
          { title: { equals: title } }, // Exact title match
          { slug: { equals: this.generateSlug(title) } } // Exact slug match
        ]
      }
    });
    
    console.log(`Checking for duplicates of "${title}": found ${existingPosts.length} exact matches`);
    return existingPosts.length > 0;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 60);
  }

  private async generateFallbackContent(topic: any): Promise<any> {
    console.log('Generating fallback content for:', topic.title);
    
    // Create a structured blog post without OpenAI
    const title = topic.title.replace(': Latest Technology Insights and Analysis', '');
    const slug = this.generateSlug(title);
    
    // Generate content based on topic source and type
    let content = '';
    let tags = [];
    
    if (topic.source === 'GitHub Trending') {
      content = this.generateGitHubFallbackContent(topic);
      tags = ['open-source', 'github', 'programming', 'development'];
    } else {
      content = this.generateNewsFallbackContent(topic);
      tags = ['technology', 'news', 'innovation', 'trends'];
    }
    
    // Generate comprehensive SEO-optimized content with proper length constraints
    const shortTitle = this.truncateTitle(title, 50); // Keep title under 60 characters
    const seoTitle = `${shortTitle} - Complete Guide 2025`;
    const seoDescription = await this.generateOptimizedDescription(title, content, 155); // Keep under 160 characters
    
    // Generate SEO-optimized keywords based on content analysis
    const seoKeywords = await this.generateSEOKeywords(title, content, tags);
    
    // Generate optimized hero image alt text
    const heroImageAlt = await this.generateHeroImageAlt(shortTitle, 'technology');
    
    return {
      title: shortTitle,
      slug: slug,
      content: content,
      excerpt: seoDescription,
      tags: tags,
      category: 'Technology',
      seoTitle: seoTitle,
      seoDescription: seoDescription,
      keywords: seoKeywords,
      heroImage: await this.generateHeroImage(title),
      heroImageAlt: heroImageAlt,
      publishedAt: new Date().toISOString(),
      canonicalUrl: `${this.wpBaseUrl}/blog/${slug}`
    };
  }

  private generateGitHubFallbackContent(topic: any): string {
    const title = topic.title.replace(': Latest Technology Insights and Analysis', '');
    const description = topic.description || 'This open-source project';
    
    // Extract technology keywords for better content
    const techKeywords = this.extractTechKeywords(title + ' ' + description);
    const primaryTech = techKeywords[0] || 'modern technology';
    const secondaryTech = techKeywords[1] || 'development';
    
    return `
<style>
.blog-content { 
  max-width: 800px; 
  margin: 0 auto; 
  line-height: 1.6; 
  font-family: Arial, sans-serif; 
  color: #333;
} 
.tech-highlight { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  color: white; 
  padding: 25px; 
  border-radius: 12px; 
  margin: 30px 0; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
} 
.feature-box { 
  border: 2px solid #e1e5e9; 
  padding: 20px; 
  border-radius: 10px; 
  background: #f8f9fa; 
  margin: 25px 0; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
} 
.tech-spec { 
  background: #e3f2fd; 
  padding: 15px; 
  border-left: 4px solid #2196f3; 
  margin: 20px 0; 
  border-radius: 0 8px 8px 0;
}
.code-block {
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  font-family: 'Courier New', monospace;
  overflow-x: auto;
}
.benefits-list {
  background: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  margin: 25px 0;
}
.conclusion-box {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin: 30px 0;
  text-align: center;
}
</style>

<div class='blog-content'>
<h1>${title}: Complete Guide, Tutorial & Best Practices 2025</h1>

<p><strong>TL;DR:</strong> Master ${title} with our comprehensive guide covering everything from basic concepts to advanced implementation strategies. Learn step-by-step tutorials, best practices, and real-world examples to become proficient in ${primaryTech} development.</p>

<!-- Schema.org structured data for better SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "${title}: Complete Guide & Tutorial",
  "description": "Master ${title} with comprehensive tutorials and best practices",
  "image": "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg",
  "author": {
    "@type": "Organization",
    "name": "TechOnigx",
    "url": "https://techonigx.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TechOnigx",
    "logo": {
      "@type": "ImageObject",
      "url": "https://techonigx.com/logo.png"
    }
  },
  "datePublished": "${new Date().toISOString()}",
  "dateModified": "${new Date().toISOString()}",
  "mainEntity": {
    "@type": "HowTo",
    "name": "${title} Tutorial",
    "description": "Complete guide to ${title} with step-by-step instructions",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Introduction to ${title}",
        "text": "Learn the fundamentals and core concepts of ${title}"
      },
      {
        "@type": "HowToStep", 
        "name": "Setup and Installation",
        "text": "Step-by-step setup guide for ${title}"
      },
      {
        "@type": "HowToStep",
        "name": "Implementation Examples",
        "text": "Real-world examples and use cases"
      }
    ]
  }
}
</script>

<h2>Introduction: The Evolution of ${primaryTech} Development</h2>

<p>In the dynamic world of software development, ${title} has emerged as a significant milestone in the evolution of ${primaryTech} practices. This project exemplifies how modern development teams can leverage the latest technologies to create robust, scalable solutions that meet the demands of today's digital economy.</p>

<p>The landscape of ${primaryTech} development has undergone remarkable transformation in recent years. What once required months of development time can now be accomplished in weeks, thanks to the innovative approaches and tools that projects like ${title} bring to the table.</p>

<div class='tech-highlight'>
<h3>🚀 Key Features and Capabilities</h3>
<ul>
<li><strong>Modern Architecture:</strong> Built with cutting-edge design patterns and best practices</li>
<li><strong>Scalable Infrastructure:</strong> Designed to handle growth from startup to enterprise</li>
<li><strong>Developer Experience:</strong> Comprehensive tooling and documentation</li>
<li><strong>Community-Driven:</strong> Active open-source community with regular contributions</li>
<li><strong>Cross-Platform Support:</strong> Works seamlessly across different environments</li>
</ul>
</div>

<h2>Technical Deep Dive: Understanding the ${primaryTech} Stack</h2>

<p>${title} leverages a sophisticated technology stack that combines the best of modern ${primaryTech} tools and frameworks. The project's architecture is designed to provide developers with the flexibility they need while maintaining the performance and reliability that production environments demand.</p>

<div class='feature-box'>
<h3>🏗️ Technology Stack Overview</h3>
<p>The project utilizes a carefully curated selection of technologies:</p>
<ul>
<li><strong>Core Framework:</strong> Latest ${primaryTech} frameworks and libraries</li>
<li><strong>Database Layer:</strong> Modern database solutions with optimal performance</li>
<li><strong>API Design:</strong> RESTful and GraphQL APIs for flexible integration</li>
<li><strong>Testing Suite:</strong> Comprehensive testing frameworks for reliability</li>
<li><strong>Deployment:</strong> Cloud-native deployment with CI/CD pipelines</li>
</ul>
</div>

<h2>Getting Started: A Step-by-Step Implementation Guide</h2>

<p>Embarking on your journey with ${title} is straightforward, thanks to the project's well-documented setup process. Here's how you can get started:</p>

<div class='code-block'>
<strong>Step 1: Clone and Setup</strong>
<pre>
git clone https://github.com/example/${title.toLowerCase().replace(/\s+/g, '-')}
cd ${title.toLowerCase().replace(/\s+/g, '-')}
npm install
</pre>

<strong>Step 2: Configuration</strong>
<pre>
cp .env.example .env
# Configure your environment variables
npm run setup
</pre>

<strong>Step 3: Development</strong>
<pre>
npm run dev
# Your application is now running on http://localhost:3000
</pre>
</div>

<div class='tech-spec'>
<h3>💡 Pro Tips for Development</h3>
<p>When working with ${title}, consider these best practices:</p>
<ul>
<li>Always review the documentation before diving into the codebase</li>
<li>Join the community discussions for insights and support</li>
<li>Contribute back to the project when you find improvements</li>
<li>Stay updated with the latest releases and features</li>
</ul>
</div>

<h2>Real-World Applications and Use Cases</h2>

<p>${title} isn't just another ${primaryTech} project—it's a practical solution that addresses real-world development challenges. Here are some compelling use cases where this project shines:</p>

<div class='benefits-list'>
<h3>🎯 Primary Use Cases</h3>
<ul>
<li><strong>Enterprise Applications:</strong> Build scalable business solutions with enterprise-grade reliability</li>
<li><strong>Startup MVPs:</strong> Rapidly prototype and deploy minimum viable products</li>
<li><strong>Educational Platforms:</strong> Create learning management systems with modern UX</li>
<li><strong>E-commerce Solutions:</strong> Develop robust online shopping experiences</li>
<li><strong>API Services:</strong> Build and maintain high-performance backend services</li>
</ul>
</div>

<h2>Performance and Scalability Considerations</h2>

<p>One of the most impressive aspects of ${title} is its focus on performance and scalability. The project incorporates several optimization strategies that ensure your applications can handle growth and maintain responsiveness under load.</p>

<p>Key performance features include:</p>
<ul>
<li><strong>Efficient Data Handling:</strong> Optimized algorithms for processing large datasets</li>
<li><strong>Caching Strategies:</strong> Intelligent caching mechanisms for improved response times</li>
<li><strong>Load Balancing:</strong> Built-in support for horizontal scaling</li>
<li><strong>Resource Optimization:</strong> Minimal memory footprint and CPU usage</li>
</ul>

<h2>Community and Ecosystem</h2>

<p>The success of ${title} is largely attributed to its vibrant community of developers, contributors, and users. The project maintains an active ecosystem that includes:</p>

<ul>
<li><strong>Regular Updates:</strong> Frequent releases with new features and improvements</li>
<li><strong>Comprehensive Documentation:</strong> Detailed guides, tutorials, and API references</li>
<li><strong>Community Support:</strong> Active forums, Discord channels, and GitHub discussions</li>
<li><strong>Plugin Ecosystem:</strong> Rich collection of plugins and extensions</li>
</ul>

<h2>Future Roadmap and Development Plans</h2>

<p>Looking ahead, ${title} has an exciting roadmap that promises to push the boundaries of ${primaryTech} development even further. The development team is committed to:</p>

<ul>
<li><strong>Enhanced Performance:</strong> Continued optimization for faster execution</li>
<li><strong>New Features:</strong> Innovative capabilities based on community feedback</li>
<li><strong>Better Integration:</strong> Seamless integration with popular development tools</li>
<li><strong>Expanded Documentation:</strong> More tutorials, examples, and best practices</li>
</ul>

<div class='conclusion-box'>
<h3>🎉 Conclusion: Why ${title} Matters</h3>
<p>${title} represents more than just another ${primaryTech} project—it's a testament to the power of open-source collaboration and modern development practices. Whether you're a seasoned developer looking to enhance your skills or a newcomer to ${primaryTech} development, this project offers valuable insights and practical tools for building better software.</p>

<p><strong>The future of ${primaryTech} development is here, and ${title} is leading the way.</strong></p>
</div>

<h2>Frequently Asked Questions (FAQ)</h2>

<div class='faq-section'>
<h3>What is ${title}?</h3>
<p>${title} is a modern ${primaryTech} solution that provides developers with powerful tools and frameworks for building scalable, maintainable applications. It represents the latest advancements in ${primaryTech} development practices.</p>

<h3>How do I get started with ${title}?</h3>
<p>Getting started with ${title} is straightforward. Follow our step-by-step guide above, which covers installation, configuration, and basic usage examples. The project includes comprehensive documentation and community support.</p>

<h3>What are the benefits of using ${title}?</h3>
<p>${title} offers numerous benefits including improved performance, better developer experience, enhanced security, and seamless integration with modern development workflows. It's designed to scale from small projects to enterprise applications.</p>

<h3>Is ${title} suitable for beginners?</h3>
<p>Yes, ${title} is designed to be accessible to developers of all skill levels. While it offers advanced features for experienced developers, it also provides clear documentation and examples for beginners.</p>
</div>

<h2>Related Articles and Resources</h2>
<p>Expand your knowledge with these related topics:</p>
<ul>
<li><a href="/blog/${primaryTech}-development-guide">Complete ${primaryTech} Development Guide</a></li>
<li><a href="/blog/modern-web-development-trends">Modern Web Development Trends 2025</a></li>
<li><a href="/blog/open-source-project-best-practices">Open Source Project Best Practices</a></li>
<li><a href="/blog/software-architecture-patterns">Software Architecture Patterns</a></li>
</ul>

<h2>Conclusion: Master ${title} Today</h2>
<p>${title} represents the future of ${primaryTech} development, offering powerful capabilities for building modern applications. By following this comprehensive guide, you'll be well-equipped to leverage ${title} effectively in your projects.</p>

<p><strong>Ready to get started?</strong> Visit the <a href="https://github.com/example/${title.toLowerCase().replace(/\s+/g, '-')}" target="_blank" rel="noopener noreferrer">${title} repository</a> and join thousands of developers who are already building amazing applications with this powerful framework.</p>

<!-- Additional SEO meta tags -->
<meta name="keywords" content="${title.toLowerCase()}, ${primaryTech}, tutorial, guide, best practices, development, programming, 2025">
<meta name="author" content="TechOnigx">
<meta name="robots" content="index, follow">
<meta property="og:title" content="${title}: Complete Guide & Tutorial 2025">
<meta property="og:description" content="Master ${title} with our comprehensive guide. Learn step-by-step tutorials, best practices, and real-world examples.">
<meta property="og:type" content="article">
<meta property="og:url" content="https://techonigx.com/blog/${title.toLowerCase().replace(/\s+/g, '-')}">
<meta property="og:image" content="https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}: Complete Guide & Tutorial 2025">
<meta name="twitter:description" content="Master ${title} with our comprehensive guide. Learn step-by-step tutorials, best practices, and real-world examples.">
</div>`;
  }

  private generateNewsFallbackContent(topic: any): string {
    const title = topic.title.replace(': Latest Technology Insights and Analysis', '');
    
    // Extract technology keywords for better content
    const techKeywords = this.extractTechKeywords(title);
    const primaryTech = techKeywords[0] || 'technology';
    const secondaryTech = techKeywords[1] || 'innovation';
    
    return `
<style>
.blog-content { 
  max-width: 800px; 
  margin: 0 auto; 
  line-height: 1.6; 
  font-family: Arial, sans-serif; 
  color: #333;
} 
.tech-highlight { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  color: white; 
  padding: 25px; 
  border-radius: 12px; 
  margin: 30px 0; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
} 
.feature-box { 
  border: 2px solid #e1e5e9; 
  padding: 20px; 
  border-radius: 10px; 
  background: #f8f9fa; 
  margin: 25px 0; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
} 
.tech-spec { 
  background: #e3f2fd; 
  padding: 15px; 
  border-left: 4px solid #2196f3; 
  margin: 20px 0; 
  border-radius: 0 8px 8px 0;
}
.impact-analysis {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 10px;
  padding: 20px;
  margin: 25px 0;
}
.future-trends {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 10px;
  padding: 20px;
  margin: 25px 0;
}
.conclusion-box {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin: 30px 0;
  text-align: center;
}
</style>

<div class='blog-content'>
<h1>${title}: Complete Analysis, Trends & Future Impact 2025</h1>

<p><strong>TL;DR:</strong> Discover the complete analysis of ${title}, a groundbreaking development in ${primaryTech} that's reshaping industries and creating new opportunities. Learn about its impact, implementation strategies, and future implications for businesses and developers.</p>

<!-- Schema.org structured data for better SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${title}: Complete Analysis & Future Impact",
  "description": "Comprehensive analysis of ${title} and its impact on ${primaryTech} industry",
  "image": "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg",
  "author": {
    "@type": "Organization",
    "name": "TechOnigx",
    "url": "https://techonigx.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TechOnigx",
    "logo": {
      "@type": "ImageObject",
      "url": "https://techonigx.com/logo.png"
    }
  },
  "datePublished": "${new Date().toISOString()}",
  "dateModified": "${new Date().toISOString()}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://techonigx.com/blog/${title.toLowerCase().replace(/\s+/g, '-')}"
  },
  "keywords": "${title.toLowerCase()}, ${primaryTech}, analysis, trends, 2025, technology, innovation"
}
</script>

<h2>Introduction: The ${primaryTech} Revolution</h2>

<p>In today's rapidly evolving digital landscape, ${title} has emerged as a significant milestone that reflects the ongoing transformation in ${primaryTech} development and implementation. This development represents more than just a technological advancement—it's a paradigm shift that is reshaping how organizations approach innovation, efficiency, and competitive advantage.</p>

<p>The significance of ${title} extends beyond its immediate technical implications. It represents a broader trend in the ${primaryTech} industry, where innovation is not just about creating new tools, but about fundamentally changing how we think about and implement technology solutions.</p>

<div class='tech-highlight'>
<h3>🚀 Key Developments and Implications</h3>
<ul>
<li><strong>Innovation Acceleration:</strong> Rapid advancement in ${primaryTech} capabilities and applications</li>
<li><strong>Market Transformation:</strong> Significant impact on industry standards and competitive dynamics</li>
<li><strong>Developer Empowerment:</strong> New tools and frameworks for building better solutions</li>
<li><strong>Business Evolution:</strong> Opportunities for organizations to gain competitive advantages</li>
<li><strong>User Experience Enhancement:</strong> Improved interfaces and interaction models</li>
</ul>
</div>

<h2>Current State Analysis: Understanding the ${primaryTech} Landscape</h2>

<p>${title} provides a clear window into the current state of ${primaryTech} development and its trajectory. The development showcases how modern technology solutions are addressing real-world challenges while creating new opportunities for innovation and growth.</p>

<div class='feature-box'>
<h3>🏗️ Technical Architecture and Implementation</h3>
<p>This development leverages several key technological components:</p>
<ul>
<li><strong>Scalable Infrastructure:</strong> Built to handle growing demands and user bases</li>
<li><strong>Modern Frameworks:</strong> Utilizes cutting-edge ${primaryTech} tools and methodologies</li>
<li><strong>Security-First Design:</strong> Implements robust security measures and best practices</li>
<li><strong>Performance Optimization:</strong> Designed for speed, efficiency, and reliability</li>
<li><strong>Integration Capabilities:</strong> Seamlessly connects with existing systems and platforms</li>
</ul>
</div>

<h2>Market Impact and Industry Transformation</h2>

<p>The impact of ${title} extends far beyond the technical realm, influencing how businesses operate, compete, and deliver value to their customers. This development is reshaping industry standards and creating new opportunities for organizations across various sectors.</p>

<div class='impact-analysis'>
<h3>📊 Business and Market Implications</h3>
<p>The development has significant implications for:</p>
<ul>
<li><strong>Competitive Advantage:</strong> Organizations can leverage this technology to differentiate themselves</li>
<li><strong>Operational Efficiency:</strong> Streamlined processes and improved productivity</li>
<li><strong>Customer Experience:</strong> Enhanced user interfaces and interaction models</li>
<li><strong>Innovation Opportunities:</strong> New possibilities for product and service development</li>
<li><strong>Market Positioning:</strong> Strategic advantages in rapidly evolving industries</li>
</ul>
</div>

<h2>Technical Deep Dive: Implementation and Best Practices</h2>

<p>Understanding the technical aspects of ${title} is crucial for organizations looking to leverage this development effectively. The implementation involves several key considerations that can determine the success of adoption and integration efforts.</p>

<p>Key technical considerations include:</p>
<ul>
<li><strong>Scalability Planning:</strong> Ensuring the solution can grow with business needs</li>
<li><strong>Security Implementation:</strong> Protecting data and maintaining compliance</li>
<li><strong>Performance Optimization:</strong> Maximizing speed and efficiency</li>
<li><strong>Integration Strategy:</strong> Connecting with existing systems and workflows</li>
<li><strong>User Adoption:</strong> Ensuring smooth transition and training processes</li>
</ul>

<div class='tech-spec'>
<h3>💡 Implementation Best Practices</h3>
<p>Organizations considering adoption should focus on:</p>
<ul>
<li>Comprehensive planning and strategy development</li>
<li>Thorough testing and validation processes</li>
<li>Staff training and change management</li>
<li>Ongoing monitoring and optimization</li>
<li>Continuous improvement and iteration</li>
</ul>
</div>

<h2>Future Trends and Predictions</h2>

<p>Looking ahead, ${title} suggests several important trends that will shape the future of ${primaryTech} development and implementation. Understanding these trends is crucial for organizations planning their technology roadmaps and strategic initiatives.</p>

<div class='future-trends'>
<h3>🔮 Emerging Trends and Predictions</h3>
<p>The development points to several key trends:</p>
<ul>
<li><strong>Increased Automation:</strong> More sophisticated automated processes and workflows</li>
<li><strong>Enhanced User Experience:</strong> More intuitive and personalized interfaces</li>
<li><strong>Greater Integration:</strong> Seamless connectivity across platforms and systems</li>
<li><strong>Improved Accessibility:</strong> Technology that works for diverse user needs</li>
<li><strong>Sustainable Development:</strong> Environmentally conscious technology solutions</li>
</ul>
</div>

<h2>Industry Applications and Use Cases</h2>

<p>The versatility of ${title} makes it applicable across various industries and use cases. From healthcare to finance, education to entertainment, this development offers opportunities for innovation and improvement in numerous sectors.</p>

<p>Key industry applications include:</p>
<ul>
<li><strong>Healthcare:</strong> Improved patient care and medical technology</li>
<li><strong>Finance:</strong> Enhanced security and transaction processing</li>
<li><strong>Education:</strong> Better learning platforms and tools</li>
<li><strong>Entertainment:</strong> More immersive and interactive experiences</li>
<li><strong>Manufacturing:</strong> Optimized production processes and quality control</li>
</ul>

<h2>Challenges and Considerations</h2>

<p>While ${title} offers significant opportunities, it also presents challenges that organizations must address to ensure successful implementation and adoption. Understanding these challenges is crucial for developing effective strategies and mitigation plans.</p>

<p>Key challenges include:</p>
<ul>
<li><strong>Implementation Complexity:</strong> Managing the technical and organizational changes</li>
<li><strong>Cost Considerations:</strong> Balancing investment with expected returns</li>
<li><strong>Security Concerns:</strong> Protecting against new vulnerabilities and threats</li>
<li><strong>User Adoption:</strong> Ensuring smooth transition and acceptance</li>
<li><strong>Regulatory Compliance:</strong> Meeting legal and industry requirements</li>
</ul>

<div class='conclusion-box'>
<h3>🎉 Conclusion: The Future of ${primaryTech} Innovation</h3>
<p>${title} represents more than just a technological advancement—it's a catalyst for broader transformation in how we approach ${primaryTech} development and implementation. As organizations continue to navigate the rapidly evolving digital landscape, developments like this will play a crucial role in shaping the future of innovation and competitive advantage.</p>

<p><strong>The future of ${primaryTech} is here, and ${title} is leading the way toward a more innovative, efficient, and connected world.</strong></p>
</div>

<p>As we continue to witness the rapid evolution of ${primaryTech}, developments like ${title} remind us of the incredible potential for innovation and transformation. The key to success lies not just in adopting new technologies, but in understanding how to leverage them effectively to create value and drive positive change.</p>
</div>`;
  }

  async generateAndPublishPosts(count: number = 2): Promise<any[]> {
    const publishedPosts = [];
    
    try {
      console.log(`Starting dual-source blog generation for ${count} posts...`);
      
      // DUAL SOURCE STRATEGY: Ensure we get both GitHub and NewsAPI content
      const allTopics = await this.getTrendingTopics();
      console.log(`Got ${allTopics.length} topics from both sources`);
      
      if (allTopics.length === 0) {
        console.error('No trending topics found - using fallback topics');
        const fallbackTopics = this.getFallbackTopics();
        allTopics.push(...fallbackTopics.slice(0, count));
      }
      
      // Separate GitHub and NewsAPI topics
      const githubTopics = allTopics.filter(topic => topic.source === 'GitHub Trending');
      const newsTopics = allTopics.filter(topic => topic.source !== 'GitHub Trending');
      
      console.log(`GitHub topics: ${githubTopics.length}, News topics: ${newsTopics.length}`);
      
      // Strategy: Generate one from each source when possible
      const topicsToProcess = [];
      
      if (count >= 2) {
        // For 2+ posts: Take 1 from GitHub, 1 from News, then alternate
        if (githubTopics.length > 0) topicsToProcess.push(githubTopics[0]);
        if (newsTopics.length > 0) topicsToProcess.push(newsTopics[0]);
        
        // Fill remaining slots alternating sources
        let remainingCount = count - topicsToProcess.length;
        let githubIndex = 1, newsIndex = 1;
        
        while (remainingCount > 0) {
          if (remainingCount % 2 === 1 && githubIndex < githubTopics.length) {
            topicsToProcess.push(githubTopics[githubIndex++]);
            remainingCount--;
          } else if (newsIndex < newsTopics.length) {
            topicsToProcess.push(newsTopics[newsIndex++]);
            remainingCount--;
          } else if (githubIndex < githubTopics.length) {
            topicsToProcess.push(githubTopics[githubIndex++]);
            remainingCount--;
          } else {
            break; // No more topics available
          }
        }
      } else {
        // For 1 post: Prefer GitHub (programming content)
        topicsToProcess.push(githubTopics.length > 0 ? githubTopics[0] : allTopics[0]);
      }
      
      console.log(`Processing ${topicsToProcess.length} topics (${topicsToProcess.map(t => t.source).join(', ')})`);
      
      for (const topic of topicsToProcess) {
        try {
          console.log(`Generating blog post for topic: ${topic.title} (Source: ${topic.source})`);
          const blogPost = await this.generateBlogPost(topic);
          const publishedPost = await this.publishToMongoDB(blogPost);
          publishedPosts.push(publishedPost);
          console.log(`Successfully published: ${publishedPost.title}`);
        } catch (error) {
          console.error(`Error generating/publishing post for topic "${topic.title}":`, error);
        }
      }
      
      console.log(`Successfully generated and published ${publishedPosts.length} posts`);
      return publishedPosts;
      
    } catch (error) {
      console.error('Error in generateAndPublishPosts:', error);
      throw error;
    }
  }

  async generateBlogPost(topic: TrendingTopic): Promise<BlogPost> {
    const contentImage = await this.getPexelsImage(topic.title);
    const systemPrompt = `You are an expert tech journalist and SEO content writer. Generate unique, original HTML content about the latest technology trends. Return a JSON object with the following structure:

{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "description": "150-160 character meta description",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "tags": ["tag1", "tag2", "tag3"],
  "content": "<style>.blog-content { max-width: 800px; margin: 0 auto; line-height: 1.6; font-family: Arial, sans-serif; } .tech-highlight { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; } .feature-box { border: 2px solid #e1e5e9; padding: 15px; border-radius: 8px; background: #f8f9fa; margin: 15px 0; } .comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; } .comparison-table th, .comparison-table td { border: 1px solid #ddd; padding: 12px; text-align: left; } .comparison-table th { background: #f2f2f2; } .tech-spec { background: #e3f2fd; padding: 10px; border-left: 4px solid #2196f3; margin: 10px 0; } .content-image { width: 100%; max-width: 600px; height: auto; border-radius: 10px; margin: 30px auto; display: block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); } .image-caption { text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 14px; }</style><div class='blog-content'><h1>Title</h1><p>TL;DR: Brief summary in 2 lines</p><h2>Introduction</h2><p>Content...</p><h2>Main Section</h2><p>Content with <a href='external-url'>external links</a> and <a href='/'>internal link to homepage</a>...</p><div class='tech-highlight'>Key technology insights</div><div class='feature-box'>Feature analysis</div><img src='${contentImage.imageUrl}' alt='${contentImage.altText}' class='content-image'/><p class='image-caption'>${contentImage.altText}</p><table class='comparison-table'><tr><th>Feature</th><th>Details</th></tr><tr><td>Example</td><td>Description</td></tr></table><div class='tech-spec'>Technical specifications</div><h3>Subsection</h3><ul><li>Bullet point 1</li><li>Bullet point 2</li></ul><h2>Conclusion</h2><p>Clear conclusion with call-to-action</p></div>"
}

Write a comprehensive 5000–8000 word in-depth article with a detailed introduction, extensive background, current state analysis, technical deep dive, use cases, advantages, challenges, future trends, and a strong conclusion with a one-line call-to-action. Include H1, H2, H3, H4 headings, bullet lists, and code examples where relevant. Include 2 external links to reputable sources and one internal link to our homepage. Provide a short 150–160 character meta description and a list of 8–12 SEO keywords. Focus on the latest technology trends, innovations, and analysis. Use embedded CSS styles for visual examples. Include one relevant image in the middle of the content using the provided Pexels URL. Tone: professional, informative, and engaging. IMPORTANT: Create 100% original content. Do not copy from any existing sources. Write unique analysis and insights. If you are unsure about a fact, write "source unavailable" instead of inventing one. Ensure the content is highly detailed and covers the topic from multiple angles, suitable for an expert audience.`;

    const userPrompt = `Topic: ${topic.title}
Description: ${topic.description}
Keywords to emphasize: ${topic.keywords.join(', ')}

Write the blog using the system instructions. Focus on providing in-depth technical analysis, practical implementation guidance, and industry insights. Create comprehensive content that demonstrates expertise in the subject matter.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 16384,
        temperature: 0.7,
      });

      console.log('OpenAI API call successful');
      console.log('System prompt length:', systemPrompt.length);
      console.log('User prompt length:', userPrompt.length);

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from OpenAI');
      }

      const parsedPost = this.parseJsonResponse(content);
      if (!parsedPost) {
        throw new Error('Failed to parse generated content as JSON');
      }

      const uniqueSlug = await this.generateUniqueSlug(parsedPost.slug);

      return {
        ...parsedPost,
        slug: uniqueSlug,
        heroImage: await this.generateHeroImage(parsedPost.title),
        heroImageAlt: `${parsedPost.title} - Hero Image`,
        publishedAt: new Date().toISOString(),
        canonicalUrl: `${this.wpBaseUrl}/blog/${uniqueSlug}`
      };

    } catch (error) {
      console.error('Error in generateBlogPost:', error);
      
      // Handle rate limiting and quota exceeded
      if (error.code === 'rate_limit_exceeded' || error.code === 'insufficient_quota') {
        console.log(`OpenAI ${error.code === 'rate_limit_exceeded' ? 'rate limit' : 'quota'} exceeded, using fallback content generation...`);
        return this.generateFallbackContent(topic);
      }
      
      // Handle rate limiting with retry
      if (error.code === 'rate_limit_exceeded') {
        console.log('Rate limit exceeded, waiting 30 seconds...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        // Retry once with a different model
        try {
          const retryCompletion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          });
          
          const retryContent = retryCompletion.choices[0]?.message?.content;
          if (!retryContent) {
            throw new Error('No content generated in retry attempt');
          }
          
          const parsedPost = this.parseJsonResponse(retryContent);
          if (!parsedPost) {
            throw new Error('Failed to parse generated content as JSON');
          }
          return parsedPost;
        } catch (retryError) {
          console.error('Retry attempt failed:', retryError);
          return this.generateFallbackContent(topic);
        }
      }
      
      throw error;
    }
  }

  private parseJsonResponse(content: string): any {
    try {
      // Remove markdown code blocks and clean the response
      let cleanContent = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      // Try to find JSON in the response
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      let jsonString = jsonMatch[0];
      
      // Clean up common JSON issues
      jsonString = jsonString
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\n/g, '\\n') // Escape newlines
        .replace(/\r/g, '\\r') // Escape carriage returns
        .replace(/\t/g, '\\t'); // Escape tabs
      
      const parsed = JSON.parse(jsonString);
      
      // Validate required fields
      if (!parsed.title || !parsed.content || !parsed.description) {
        throw new Error('Missing required fields in parsed JSON');
      }
      
      return parsed;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.log('Raw content:', content.substring(0, 500));
      return null;
    }
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = this.generateSlug(baseSlug);
    let counter = 1;
    
    while (await this.slugExists(slug)) {
      slug = `${this.generateSlug(baseSlug)}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  private async slugExists(slug: string): Promise<boolean> {
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true }
    });
    return !!existingPost;
  }

  private async getPexelsImage(topic: string): Promise<PexelsImage> {
    if (!this.pexelsApiKey) {
      return {
        imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
        altText: 'Technology and programming concept'
      };
    }

    try {
      const searchQuery = this.extractSearchQuery(topic);
      console.log(`Searching Pexels for: ${searchQuery}`);
      
      // Try multiple search variations to get better results
      const searchVariations = [
        searchQuery,
        `${searchQuery} technology`,
        `${searchQuery} programming`,
        `${searchQuery} digital`,
        'technology innovation',
        'programming development'
      ];
      
      for (const variation of searchVariations) {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(variation)}&per_page=20&orientation=landscape`, {
          headers: {
            'Authorization': this.pexelsApiKey
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.photos && data.photos.length > 0) {
            // Use a more random selection to avoid getting the same image
            const randomIndex = Math.floor(Math.random() * Math.min(10, data.photos.length));
            const selectedPhoto = data.photos[randomIndex];
            
            console.log(`Found image for "${variation}": ${selectedPhoto.src.large}`);
            
            return {
              imageUrl: selectedPhoto.src.large,
              altText: `${searchQuery} - Professional technology illustration`
            };
          }
        }
      }
    } catch (error) {
      console.error('Error fetching Pexels image:', error);
    }

    // Fallback image
    return {
      imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
      altText: 'Technology and programming concept'
    };
  }

  private extractSearchQuery(topic: string): string {
    // Enhanced search query extraction with more specific tech terms
    const techTerms = [
      'programming', 'coding', 'technology', 'computer', 'development', 'software', 'digital', 'tech',
      'react', 'javascript', 'python', 'ai', 'machine learning', 'web development', 'mobile app',
      'database', 'cloud', 'aws', 'docker', 'kubernetes', 'api', 'frontend', 'backend',
      'typescript', 'node.js', 'vue', 'angular', 'flutter', 'react native', 'swift', 'kotlin',
      'blockchain', 'cryptocurrency', 'cybersecurity', 'data science', 'analytics', 'iot',
      'startup', 'innovation', 'fintech', 'healthtech', 'edtech', 'ecommerce'
    ];
    
    const words = topic.toLowerCase().split(' ');
    
    // First, try to find exact matches
    for (const word of words) {
      if (techTerms.some(term => word.includes(term) || term.includes(word))) {
        return word;
      }
    }
    
    // If no exact match, try to find partial matches
    for (const word of words) {
      for (const term of techTerms) {
        if (word.length > 3 && (word.includes(term.substring(0, 4)) || term.includes(word.substring(0, 4)))) {
          return term;
        }
      }
    }
    
    // If still no match, use the first meaningful word or default
    const meaningfulWords = words.filter(word => word.length > 3 && !['the', 'and', 'for', 'with', 'from', 'this', 'that'].includes(word));
    if (meaningfulWords.length > 0) {
      return meaningfulWords[0];
    }
    
    return 'technology programming';
  }

  private extractTechKeywords(text: string): string[] {
    const techTerms = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'flutter', 'react native', 'next.js', 'nuxt.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net', 'graphql', 'rest', 'api', 'database', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud', 'devops', 'ci/cd', 'git', 'github', 'gitlab', 'bitbucket', 'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'microservices', 'serverless', 'blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'smart contracts', 'ai', 'machine learning', 'deep learning', 'neural networks', 'tensorflow', 'pytorch', 'scikit-learn', 'opencv', 'nlp', 'computer vision', 'data science', 'big data', 'hadoop', 'spark', 'kafka', 'elastic', 'logstash', 'kibana', 'prometheus', 'grafana', 'jenkins', 'travis', 'circleci', 'github actions', 'gitlab ci', 'terraform', 'ansible', 'puppet', 'chef', 'vagrant', 'virtualbox', 'vmware', 'hyper-v', 'kubernetes', 'docker swarm', 'rancher', 'istio', 'linkerd', 'consul', 'etcd', 'zookeeper', 'nginx', 'apache', 'haproxy', 'traefik', 'envoy', 'istio', 'linkerd', 'consul', 'etcd', 'zookeeper', 'redis', 'memcached', 'varnish', 'cloudflare', 'fastly', 'akamai', 'aws cloudfront', 'azure cdn', 'google cloud cdn', 'heroku', 'vercel', 'netlify', 'firebase', 'supabase', 'appwrite', 'strapi', 'sanity', 'contentful', 'prismic', 'dato', 'ghost', 'wordpress', 'drupal', 'joomla', 'magento', 'shopify', 'woocommerce', 'prestashop', 'opencart', 'oscommerce', 'zen cart', 'x-cart', 'cubecart', 'abantecart', 'loaded commerce', 'cre loaded'
    ];
    
    const foundTerms = [];
    const lowerText = text.toLowerCase();
    
    for (const term of techTerms) {
      if (lowerText.includes(term)) {
        foundTerms.push(term);
      }
    }
    
    // Return up to 3 most relevant terms
    return foundTerms.slice(0, 3);
  }

  private async generateSEOKeywords(title: string, content: string, tags: string[]): Promise<string[]> {
    try {
      const systemPrompt = `You are an expert SEO specialist. Generate 10-15 highly relevant, search-optimized keywords for a technology blog post. Focus on long-tail keywords, technical terms, and trending search phrases. Return only a JSON array of keywords, no other text.`;

      const userPrompt = `Generate SEO keywords for this blog post:
Title: ${title}
Content preview: ${content.substring(0, 500)}...
Tags: ${tags.join(', ')}

Requirements:
- 10-15 keywords maximum
- Include technical terms from the title
- Include trending search phrases
- Focus on long-tail keywords
- Include "tutorial", "guide", "2025" variations
- Make them highly searchable and relevant

Return only a JSON array like: ["keyword1", "keyword2", "keyword3"]`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          const keywords = JSON.parse(response);
          return Array.isArray(keywords) ? keywords.slice(0, 15) : [];
        } catch (error) {
          console.error('Error parsing SEO keywords JSON:', error);
          return this.getFallbackKeywords(title, tags);
        }
      }
    } catch (error) {
      console.error('Error generating SEO keywords with OpenAI:', error);
      return this.getFallbackKeywords(title, tags);
    }
    
    return this.getFallbackKeywords(title, tags);
  }

  private getFallbackKeywords(title: string, tags: string[]): string[] {
    // Fallback keywords if OpenAI fails
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
    const fallbackKeywords = [
      'tutorial', 'guide', 'best practices', 'implementation', 'development',
      'programming', 'coding', 'software', 'technology', '2025'
    ];
    
    return [...new Set([...titleWords, ...tags, ...fallbackKeywords])].slice(0, 15);
  }

  private async generateHeroImageAlt(title: string, technology: string): Promise<string> {
    try {
      const systemPrompt = `You are an expert SEO specialist. Generate an SEO-optimized alt text for a hero image in a technology blog post. The alt text should be descriptive, include relevant keywords, and be under 125 characters. Return only the alt text, no quotes or additional formatting.`;

      const userPrompt = `Generate an SEO-optimized alt text for this blog post's hero image:
Title: ${title}
Technology: ${technology}

Requirements:
- Maximum 125 characters
- Include the main topic/keyword
- Be descriptive and relevant
- Include "tutorial", "guide", or "development" if appropriate
- Make it SEO-friendly and accessible

Return only the alt text.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 50,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (response && response.length <= 125) {
        return response.trim();
      }
    } catch (error) {
      console.error('Error generating hero image alt text with OpenAI:', error);
    }
    
    // Fallback alt text
    return this.getFallbackHeroImageAlt(title, technology);
  }

  private getFallbackHeroImageAlt(title: string, technology: string): string {
    const altTexts = [
      `${title} - Complete ${technology} Tutorial and Guide 2025`,
      `${title} - Step-by-Step ${technology} Development Guide`,
      `${title} - Master ${technology} with Best Practices and Examples`,
      `${title} - Comprehensive ${technology} Implementation Tutorial`,
      `${title} - Learn ${technology} Development from Beginner to Expert`,
      `${title} - Modern ${technology} Development Techniques and Strategies`,
      `${title} - Advanced ${technology} Programming Guide with Examples`,
      `${title} - Professional ${technology} Development Best Practices`
    ];
    
    // Use title hash to select a consistent alt text for each title
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const index = Math.abs(hash) % altTexts.length;
    return altTexts[index];
  }

  private async generateNewsSEOKeywords(title: string, content: string, tags: string[]): Promise<string[]> {
    try {
      const systemPrompt = `You are an expert SEO specialist. Generate 10-15 highly relevant, search-optimized keywords for a technology news article. Focus on trending terms, industry buzzwords, and news-related search phrases. Return only a JSON array of keywords, no other text.`;

      const userPrompt = `Generate SEO keywords for this technology news article:
Title: ${title}
Content preview: ${content.substring(0, 500)}...
Tags: ${tags.join(', ')}

Requirements:
- 10-15 keywords maximum
- Include trending technology terms
- Focus on news and analysis keywords
- Include industry-specific terms
- Add "2025", "trends", "analysis" variations
- Make them highly searchable for news content

Return only a JSON array like: ["keyword1", "keyword2", "keyword3"]`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          const keywords = JSON.parse(response);
          return Array.isArray(keywords) ? keywords.slice(0, 15) : [];
        } catch (error) {
          console.error('Error parsing news SEO keywords JSON:', error);
          return this.getFallbackNewsKeywords(title, tags);
        }
      }
    } catch (error) {
      console.error('Error generating news SEO keywords with OpenAI:', error);
      return this.getFallbackNewsKeywords(title, tags);
    }
    
    return this.getFallbackNewsKeywords(title, tags);
  }

  private getFallbackNewsKeywords(title: string, tags: string[]): string[] {
    // Fallback keywords for news content if OpenAI fails
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
    const fallbackKeywords = [
      'analysis', 'trends', 'future', 'impact', 'technology', 'innovation',
      'latest', 'breaking', 'news', 'update', 'development', 'industry',
      'market', 'business', 'startup', 'funding', 'investment', 'research',
      'study', 'report', 'insights', 'predictions', 'forecast', '2025'
    ];
    
    return [...new Set([...titleWords, ...tags, ...fallbackKeywords])].slice(0, 15);
  }

  private async generateNewsOptimizedDescription(title: string, content: string, maxLength: number): Promise<string> {
    try {
      const systemPrompt = `You are an expert SEO copywriter. Generate a compelling, SEO-optimized meta description for a technology news article. The description should be exactly ${maxLength} characters or less, include the main keyword, and encourage clicks. Return only the description text, no quotes or additional formatting.`;

      const userPrompt = `Generate an SEO-optimized meta description for this technology news article:
Title: ${title}
Content preview: ${content.substring(0, 300)}...

Requirements:
- Maximum ${maxLength} characters
- Include the main topic/keyword naturally
- Make it compelling and click-worthy
- Focus on news value and insights
- Include "analysis", "trends", or "impact" if relevant
- Use active voice and engaging language

Return only the description text.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 100,
        temperature: 0.8,
      });

      const response = completion.choices[0]?.message?.content;
      if (response && response.length <= maxLength) {
        return response.trim();
      }
    } catch (error) {
      console.error('Error generating news SEO description with OpenAI:', error);
    }
    
    // Fallback description for news
    return this.getFallbackNewsDescription(title, maxLength);
  }

  private getFallbackNewsDescription(title: string, maxLength: number): string {
    const baseDescription = `Discover the latest analysis of ${title.toLowerCase()}. Get insights into trends, impact, and future implications for the technology industry.`;
    
    if (baseDescription.length <= maxLength) {
      return baseDescription;
    }
    
    const variations = [
      `Latest analysis of ${title.toLowerCase()}: trends and industry impact.`,
      `Discover ${title.toLowerCase()} insights and future implications.`,
      `Analysis of ${title.toLowerCase()}: technology trends and market impact.`,
      `${title}: Latest developments and industry analysis.`,
      `Explore ${title.toLowerCase()} trends and future predictions.`
    ];
    
    for (const variation of variations) {
      if (variation.length <= maxLength) {
        return variation;
      }
    }
    
    return baseDescription.substring(0, maxLength - 3) + '...';
  }

  private async generateNewsHeroImageAlt(title: string, technology: string): Promise<string> {
    try {
      const systemPrompt = `You are an expert SEO specialist. Generate an SEO-optimized alt text for a hero image in a technology news article. The alt text should be descriptive, include relevant keywords, and be under 125 characters. Return only the alt text, no quotes or additional formatting.`;

      const userPrompt = `Generate an SEO-optimized alt text for this news article's hero image:
Title: ${title}
Technology: ${technology}

Requirements:
- Maximum 125 characters
- Include the main topic/keyword
- Be descriptive and relevant for news content
- Include "analysis", "trends", or "news" if appropriate
- Make it SEO-friendly and accessible

Return only the alt text.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 50,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (response && response.length <= 125) {
        return response.trim();
      }
    } catch (error) {
      console.error('Error generating news hero image alt text with OpenAI:', error);
    }
    
    // Fallback alt text for news
    return this.getFallbackNewsHeroImageAlt(title, technology);
  }

  private getFallbackNewsHeroImageAlt(title: string, technology: string): string {
    const altTexts = [
      `${title} - Latest ${technology} Analysis and Trends 2025`,
      `${title} - Breaking ${technology} News and Industry Impact`,
      `${title} - Comprehensive ${technology} Market Analysis`,
      `${title} - Future of ${technology} - Trends and Predictions`,
      `${title} - ${technology} Innovation and Development Insights`,
      `${title} - Industry Analysis: ${technology} Market Trends`,
      `${title} - ${technology} Technology Impact and Future Outlook`,
      `${title} - Latest ${technology} Developments and Industry News`
    ];
    
    // Use title hash to select a consistent alt text for each title
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const index = Math.abs(hash) % altTexts.length;
    return altTexts[index];
  }

  private truncateTitle(title: string, maxLength: number): string {
    // Truncate title to fit SEO requirements
    if (title.length <= maxLength) {
      return title;
    }
    
    // Try to truncate at word boundaries
    const words = title.split(' ');
    let truncated = '';
    
    for (const word of words) {
      if ((truncated + ' ' + word).length <= maxLength) {
        truncated += (truncated ? ' ' : '') + word;
      } else {
        break;
      }
    }
    
    // If still too long, truncate with ellipsis
    if (truncated.length === 0) {
      return title.substring(0, maxLength - 3) + '...';
    }
    
    return truncated;
  }

  private async generateOptimizedDescription(title: string, content: string, maxLength: number): Promise<string> {
    try {
      const systemPrompt = `You are an expert SEO copywriter. Generate a compelling, SEO-optimized meta description for a technology blog post. The description should be exactly ${maxLength} characters or less, include the main keyword, and encourage clicks. Return only the description text, no quotes or additional formatting.`;

      const userPrompt = `Generate an SEO-optimized meta description for this blog post:
Title: ${title}
Content preview: ${content.substring(0, 300)}...

Requirements:
- Maximum ${maxLength} characters
- Include the main topic/keyword naturally
- Make it compelling and click-worthy
- Include a call-to-action or benefit
- Focus on what readers will learn
- Use active voice and engaging language

Return only the description text.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 100,
        temperature: 0.8,
      });

      const response = completion.choices[0]?.message?.content;
      if (response && response.length <= maxLength) {
        return response.trim();
      }
    } catch (error) {
      console.error('Error generating SEO description with OpenAI:', error);
    }
    
    // Fallback description
    return this.getFallbackDescription(title, maxLength);
  }

  private getFallbackDescription(title: string, maxLength: number): string {
    const baseDescription = `Master ${title.toLowerCase()} with our comprehensive guide. Learn tutorials, best practices, and implementation strategies.`;
    
    if (baseDescription.length <= maxLength) {
      return baseDescription;
    }
    
    const variations = [
      `Learn ${title.toLowerCase()} with step-by-step tutorials and best practices.`,
      `Master ${title.toLowerCase()} development with comprehensive guides and examples.`,
      `Complete guide to ${title.toLowerCase()} with tutorials and implementation tips.`,
      `${title} tutorial: Learn development best practices and strategies.`,
      `Master ${title.toLowerCase()} with expert tutorials and practical examples.`
    ];
    
    for (const variation of variations) {
      if (variation.length <= maxLength) {
        return variation;
      }
    }
    
    return baseDescription.substring(0, maxLength - 3) + '...';
  }

  async generateHeroImage(title: string): Promise<string> {
    try {
      // Use Pexels API to get a unique image based on the title
      const pexelsImage = await this.getPexelsImage(title);
      return pexelsImage.imageUrl;
    } catch (error) {
      console.error('Error generating hero image:', error);
      // Return a different fallback image based on title hash
      const fallbackImages = [
        'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
        'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
        'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg',
        'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
        'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
        'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg'
      ];
      
      // Use title hash to select a consistent but different image for each title
      const hash = title.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      const index = Math.abs(hash) % fallbackImages.length;
      return fallbackImages[index];
    }
  }

  private determineCategory(content: string, title: string): string[] {
    const categoryConfig = this.getCategoryConfig();
    const fullText = `${title} ${content}`.toLowerCase();
    
    for (const [categorySlug, keywords] of Object.entries(categoryConfig)) {
      if (keywords.some(keyword => fullText.includes(keyword.toLowerCase()))) {
        console.log(`Assigned category: ${categorySlug} based on keywords: ${keywords}`);
        return [categorySlug];
      }
    }
    
    // Default fallback
    console.log('No specific category matched, using web-development as default');
    return ['web-development'];
  }

  private getCategoryConfig(): Record<string, string[]> {
    return {
      'ai-technology': [
        'ai', 'artificial intelligence', 'machine learning', 'neural network',
        'deep learning', 'chatgpt', 'openai', 'gpt', 'ai dev tools', 'ai integration'
      ],
      'web-development': [
        'react', 'javascript', 'typescript', 'next.js', 'vue', 'angular',
        'web development', 'frontend', 'backend', 'full-stack', 'node.js',
        'html', 'css', 'jamstack', 'pwa', 'webassembly'
      ],
      'database': [
        'database', 'mongodb', 'postgresql', 'mysql', 'redis', 'prisma',
        'sql', 'nosql', 'data engineering', 'big data', 'analytics'
      ],
      'cloud-infrastructure': [
        'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'serverless',
        'devops', 'ci/cd', 'deployment', 'infrastructure', 'microservices'
      ],
      'healthcare-iot': [
        'iot', 'internet of things', 'predictive analytics', 'healthcare tech',
        'medical ai', 'health monitoring', 'wearable technology'
      ],
      'video-marketing': [
        'tech news', 'industry insights', 'technology trends', 'innovation',
        'startup', 'funding', 'investment', 'market analysis'
      ]
    };
  }

  async publishToMongoDB(blogPost: BlogPost): Promise<any> {
    try {
      // Check for existing posts with same title or slug
      const existingPost = await prisma.post.findFirst({
        where: {
          OR: [
            { title: blogPost.title },
            { slug: blogPost.slug }
          ]
        }
      });

      if (existingPost) {
        throw new Error(`Post with title "${blogPost.title}" or slug "${blogPost.slug}" already exists`);
      }

      // Get or create AI author
      let author = await prisma.user.findUnique({
        where: { email: 'ai@techonigx.com' }
      });

      if (!author) {
        author = await prisma.user.create({
          data: {
            email: 'ai@techonigx.com',
            name: 'AI Blog Generator',
            role: 'ADMIN'
          }
        });
      }

      // Process tags
      const tagRecords = await Promise.all(
        blogPost.tags.map(async (tagName) => {
          const tagSlug = this.generateSlug(tagName);
          return await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: {
              name: tagName,
              slug: tagSlug
            }
          });
        })
      );

      // Determine and process categories
      const categoryIds = this.determineCategory(blogPost.content, blogPost.title);
      const categories = await Promise.all(
        categoryIds.map(async (categorySlug) => {
          return await prisma.category.findUnique({
            where: { slug: categorySlug }
          });
        })
      );

      const validCategoryIds = categories.filter(Boolean).map(cat => cat!.id);

      // Calculate reading time (average 200 words per minute)
      const wordCount = blogPost.content.split(' ').length;
      const readingTime = Math.ceil(wordCount / 200);

      // Create the post
      const post = await prisma.post.create({
        data: {
          title: blogPost.title,
          slug: blogPost.slug,
          content: blogPost.content,
          excerpt: blogPost.excerpt || blogPost.metaDescription,
          status: 'PUBLISHED',
          authorId: author.id,
          publishedAt: new Date(blogPost.publishedAt),
          coverImage: blogPost.heroImage,
          showcaseImage: blogPost.heroImage,
          seoDescription: blogPost.seoDescription || blogPost.metaDescription,
          readingTime: readingTime,
          categoryIds: validCategoryIds,
          tagIds: tagRecords.map(tag => tag.id)
          // Note: seoKeywords field doesn't exist in schema, keywords are stored as tags
        }
      });

      console.log(`Successfully published post to MongoDB: ${post.slug}`);
      return post;

    } catch (error) {
      console.error('Error publishing to MongoDB:', error);
      throw error;
    }
  }
}

export default AIBlogGenerator;
