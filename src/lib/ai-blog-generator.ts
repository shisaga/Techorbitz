import OpenAI from 'openai';
import { prisma } from './prisma';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  description?: string;
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
.blog-content { max-width: 800px; margin: 0 auto; line-height: 1.6; font-family: Arial, sans-serif; }
.toc { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
.toc h3 { margin-top: 0; color: #007bff; }
.toc ul { margin: 10px 0; }
.toc li { margin: 5px 0; }
.callout-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
.feature-box { border: 2px solid #e1e5e9; padding: 15px; border-radius: 8px; background: #f8f9fa; margin: 15px 0; }
.comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
.comparison-table th, .comparison-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
.comparison-table th { background: #f2f2f2; }
.faq-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
.faq-question { font-weight: bold; color: #007bff; margin-top: 15px; }
.content-image { width: 100%; max-width: 600px; height: auto; border-radius: 10px; margin: 30px auto; display: block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
.image-caption { text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 14px; }
.cta-section { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
</style>

<div class='blog-content'>
<h1>Top 10 ${title} Features and Best Practices in 2025</h1>

<h2>Introduction: Why ${title} Matters in 2025</h2>
<p>In today's rapidly evolving technology landscape, ${title} has emerged as a game-changer for developers worldwide. With the increasing demand for efficient, scalable solutions, understanding ${primaryTech} development has never been more crucial. This comprehensive guide will walk you through everything you need to know about ${title} and how it's shaping the future of software development.</p>

<div class='toc'>
<h3>Table of Contents</h3>
<ul>
<li><a href='#features'>Top 10 ${title} Features</a></li>
<li><a href='#implementation'>Implementation Guide</a></li>
<li><a href='#best-practices'>Best Practices</a></li>
<li><a href='#use-cases'>Real-World Use Cases</a></li>
<li><a href='#conclusion'>Conclusion</a></li>
<li><a href='#faq'>Frequently Asked Questions</a></li>
</ul>
</div>

<h2 id='features'>Top 10 ${title} Features You Need to Know</h2>
<p>${title} offers a comprehensive suite of features that make it stand out in the crowded ${primaryTech} landscape. Here are the top 10 features that every developer should understand:</p>

<div class='callout-box'>
<strong>Key Insight:</strong> ${title} combines cutting-edge technology with practical usability, making it accessible to developers of all skill levels while providing the power needed for enterprise applications.
</div>

<h3>1. Modern Architecture Design</h3>
<p>${title} leverages the latest architectural patterns to ensure your applications are built on solid foundations. The modular design allows for easy maintenance and scalability.</p>

<h3>2. Advanced Performance Optimization</h3>
<p>Built-in performance optimizations ensure your applications run smoothly even under heavy load. The intelligent caching system and efficient algorithms provide exceptional speed.</p>

<h3>3. Comprehensive Testing Framework</h3>
<p>Testing is built into the core of ${title}, with support for unit tests, integration tests, and end-to-end testing. This ensures your code is reliable and maintainable.</p>

<h3>4. Cloud-Native Deployment</h3>
<p>Deploy your applications to any cloud platform with ease. ${title} provides seamless integration with major cloud providers and containerization technologies.</p>

<h3>5. Developer Experience Excellence</h3>
<p>From comprehensive documentation to intuitive APIs, ${title} prioritizes developer experience. Hot reloading, debugging tools, and extensive examples make development a breeze.</p>

<h3>6. Security-First Approach</h3>
<p>Security is not an afterthought in ${title}. Built-in security features protect your applications from common vulnerabilities and threats.</p>

<h3>7. Scalable Database Integration</h3>
<p>Connect to any database with ease. ${title} supports both SQL and NoSQL databases with optimized query builders and migration tools.</p>

<h3>8. Real-Time Capabilities</h3>
<p>Build real-time applications with WebSocket support and event-driven architecture. Perfect for chat applications, live dashboards, and collaborative tools.</p>

<h3>9. API-First Design</h3>
<p>Create robust APIs that serve web, mobile, and desktop applications. RESTful and GraphQL support with automatic documentation generation.</p>

<h3>10. Community and Ecosystem</h3>
<p>Join a vibrant community of developers contributing plugins, extensions, and improvements. Regular updates and active maintenance ensure long-term viability.</p>

<h2 id='implementation'>Getting Started: Implementation Guide</h2>
<p>Ready to dive into ${title}? Follow this step-by-step guide to get your first project up and running:</p>

<div class='feature-box'>
<strong>Prerequisites:</strong> Before starting, ensure you have Node.js 18+ and npm installed on your system. Basic knowledge of JavaScript and web development concepts will be helpful.
</div>

<h3>Step 1: Installation and Setup</h3>
<p>Begin by installing ${title} in your development environment:</p>
<pre><code>npm install ${title.toLowerCase().replace(/\s+/g, '-')}
# or using yarn
yarn add ${title.toLowerCase().replace(/\s+/g, '-')}</code></pre>

<h3>Step 2: Project Initialization</h3>
<p>Create a new project and configure the basic settings:</p>
<pre><code>npx ${title.toLowerCase().replace(/\s+/g, '-')} init my-project
cd my-project
npm run setup</code></pre>

<h3>Step 3: Development and Testing</h3>
<p>Start the development server and begin building:</p>
<pre><code>npm run dev
# Your application is now running on http://localhost:3000</code></pre>

<h2 id='best-practices'>Best Practices for ${title} Development</h2>
<p>To get the most out of ${title}, follow these proven best practices:</p>

<table class='comparison-table'>
<tr><th>Practice</th><th>Description</th><th>Benefits</th></tr>
<tr><td>Code Organization</td><td>Use modular architecture and clear file structure</td><td>Maintainability and scalability</td></tr>
<tr><td>Testing Strategy</td><td>Implement comprehensive testing at all levels</td><td>Reliability and confidence in deployments</td></tr>
<tr><td>Performance Monitoring</td><td>Use built-in tools to monitor application performance</td><td>Optimized user experience</td></tr>
<tr><td>Security Implementation</td><td>Follow security best practices and regular updates</td><td>Protection against vulnerabilities</td></tr>
</table>

<h2 id='use-cases'>Real-World Use Cases and Applications</h2>
<p>${title} is being used successfully across various industries and applications:</p>

<ul>
<li><strong>E-commerce Platforms:</strong> Build scalable online stores with advanced features</li>
<li><strong>Content Management Systems:</strong> Create flexible CMS solutions for content creators</li>
<li><strong>API Services:</strong> Develop robust backend services for mobile and web applications</li>
<li><strong>Real-Time Applications:</strong> Build chat applications, live dashboards, and collaborative tools</li>
<li><strong>Enterprise Solutions:</strong> Create complex business applications with enterprise-grade features</li>
</ul>

<h2 id='conclusion'>Conclusion: The Future of ${title}</h2>
<p>${title} represents the future of ${primaryTech} development, offering a perfect balance of power, flexibility, and ease of use. Whether you're building a simple web application or a complex enterprise system, ${title} provides the tools and framework you need to succeed.</p>

<div class='cta-section'>
<h3>Ready to Get Started with ${title}?</h3>
<p>Which ${title} feature are you most excited to explore? Let us know in the comments below!</p>
</div>

<div class='faq-section' id='faq'>
<h2>Frequently Asked Questions (FAQ)</h2>

<div class='faq-question'>What makes ${title} different from other ${primaryTech} frameworks?</div>
<p>${title} stands out with its modern architecture, comprehensive testing framework, and developer-first approach. It combines the best practices from multiple frameworks while maintaining simplicity and performance.</p>

<div class='faq-question'>How can ${title} help improve my development workflow?</div>
<p>${title} streamlines development with hot reloading, comprehensive debugging tools, and extensive documentation. The modular architecture makes it easy to build, test, and deploy applications efficiently.</p>

<div class='faq-question'>What should I consider when choosing ${title} for my project?</div>
<p>Consider your project requirements, team expertise, and long-term maintenance needs. ${title} is ideal for projects that need scalability, performance, and modern development practices.</p>

<div class='faq-question'>Is ${title} suitable for beginners?</div>
<p>Yes, ${title} is designed to be accessible to developers of all skill levels. While it offers advanced features for experienced developers, it also provides clear documentation and examples for beginners.</p>

<div class='faq-question'>How does ${title} handle performance and scalability?</div>
<p>${title} includes built-in performance optimizations, intelligent caching, and scalable architecture patterns. It's designed to handle growth from small projects to enterprise applications.</p>
</div>

 <div class='cta-section'>
 <h3>Stay Updated with ${title}!</h3>
 <p>If you found this guide helpful, make sure to subscribe to our newsletter for the latest updates on ${title} and ${primaryTech} development trends in 2025!</p>
 </div>
 </div><meta name="keywords" content="${title.toLowerCase()}, ${primaryTech}, tutorial, guide, best practices, development, programming, 2025">
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
 
 
 `;
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
        
        // Filter to only tech-related topics
        const techTopics = allTopics.filter(topic => {
          const title = topic.title.toLowerCase();
          const description = topic.description.toLowerCase();
          const techKeywords = [
            'technology', 'tech', 'ai', 'artificial intelligence', 'machine learning',
            'software', 'programming', 'development', 'startup', 'innovation',
            'blockchain', 'cryptocurrency', 'web3', 'cloud', 'cybersecurity',
            'mobile', 'app', 'digital', 'data', 'analytics', 'automation',
            'iot', 'internet of things', 'vr', 'ar', 'metaverse', 'api',
            'javascript', 'python', 'react', 'node', 'database', 'server',
            'business', 'entrepreneurship', 'funding', 'investment', 'market',
            'research', 'analysis', 'case study', 'tutorial', 'guide'
          ];
          
          return techKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword)
          );
        });
        
        console.log(`Filtered to ${techTopics.length} tech-related topics`);
        
        if (techTopics.length === 0) {
          console.error('No tech-related topics found - using fallback topics');
          const fallbackTopics = this.getFallbackTopics();
          techTopics.push(...fallbackTopics.slice(0, count));
        }
        
        // Separate GitHub and NewsAPI topics
        const githubTopics = techTopics.filter(topic => topic.source === 'GitHub Trending');
        const newsTopics = techTopics.filter(topic => topic.source !== 'GitHub Trending');
      
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
    const systemPrompt = `You are an expert SEO content writer and editor specializing in TECHNOLOGY, INNOVATION, and BUSINESS topics. Generate comprehensive, SEO-optimized HTML content following the exact structure below. 

IMPORTANT: Only write about technology, innovation, business, startups, software development, AI, emerging technologies, digital transformation, and related topics. Do NOT write about entertainment, celebrities, fashion, lifestyle, or non-tech topics.

Return a JSON object with the following structure:

{
  "title": "Catchy, keyword-rich title with numbers or timely references (e.g., 'Top 10 AI Tools for Small Businesses in 2025')",
  "slug": "url-friendly-slug",
  "description": "150-160 character meta description with primary keyword",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"],
  "tags": ["tag1", "tag2", "tag3"],
  "content": "<style>
    .blog-content { max-width: 800px; margin: 0 auto; line-height: 1.6; font-family: Arial, sans-serif; }
    .toc { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
    .toc h3 { margin-top: 0; color: #007bff; }
    .toc ul { margin: 10px 0; }
    .toc li { margin: 5px 0; }
    .callout-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .feature-box { border: 2px solid #e1e5e9; padding: 15px; border-radius: 8px; background: #f8f9fa; margin: 15px 0; }
    .comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .comparison-table th, .comparison-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .comparison-table th { background: #f2f2f2; }
    .faq-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .faq-question { font-weight: bold; color: #007bff; margin-top: 15px; }
    .content-image { width: 100%; max-width: 600px; height: auto; border-radius: 10px; margin: 30px auto; display: block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .image-caption { text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 14px; }
    .cta-section { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
  </style>
  <div class='blog-content'>
    <h1>SEO-Optimized Title</h1>
    
    <h2>Introduction (Engaging + Keyword-Optimized)</h2>
    <p>Hook the reader with a question, statistic, or intriguing statement. Introduce the primary topic and briefly mention why it's important. Add keywords naturally in the first 100 words.</p>
    
    <div class='toc'>
      <h3>Table of Contents</h3>
      <ul>
        <li><a href='#section1'>Section 1</a></li>
        <li><a href='#section2'>Section 2</a></li>
        <li><a href='#section3'>Section 3</a></li>
        <li><a href='#conclusion'>Conclusion</a></li>
        <li><a href='#faq'>Frequently Asked Questions</a></li>
      </ul>
    </div>
    
    <h2 id='section1'>Main Content Section 1</h2>
    <p>Well-structured content with short, scannable paragraphs (2-4 sentences). Use H2 for main points and H3/H4 for detailed subpoints.</p>
    
    <div class='callout-box'>
      <strong>Key Insight:</strong> Highlight important points, stats, or quotes in callout boxes for easy visibility.
    </div>
    
    <h3>Subsection with H3</h3>
    <p>Detailed content with bullet points or numbered lists for easy scanning.</p>
    <ul>
      <li>Bullet point 1 with detailed explanation</li>
      <li>Bullet point 2 with practical examples</li>
      <li>Bullet point 3 with actionable insights</li>
    </ul>
    
    <img src='${contentImage.imageUrl}' alt='${contentImage.altText}' class='content-image'/>
    <p class='image-caption'>${contentImage.altText}</p>
    
    <h2 id='section2'>Main Content Section 2</h2>
    <p>Include 2 external links to reputable sources and one internal link to our homepage. Example: <a href='https://example.com' target='_blank'>external source</a> and <a href='/'>internal link to homepage</a>.</p>
    
    <div class='feature-box'>
      <strong>Feature Analysis:</strong> Detailed analysis of features, benefits, and use cases with real-life scenarios or case studies.
    </div>
    
    <table class='comparison-table'>
      <tr><th>Feature</th><th>Details</th><th>Benefits</th></tr>
      <tr><td>Feature 1</td><td>Description</td><td>Benefits</td></tr>
      <tr><td>Feature 2</td><td>Description</td><td>Benefits</td></tr>
    </table>
    
    <h2 id='section3'>Main Content Section 3</h2>
    <p>Continue with comprehensive content covering multiple angles of the topic.</p>
    
    <h2 id='conclusion'>Conclusion (Call to Action + Recap)</h2>
    <p>Recap the key points briefly and end with a clear call-to-action asking readers to comment, share, or download something.</p>
    
    <div class='cta-section'>
      <h3>Ready to Get Started?</h3>
      <p>Which [topic-related item] are you most excited about? Let us know in the comments below!</p>
    </div>
    
    <div class='faq-section' id='faq'>
      <h2>Frequently Asked Questions (FAQ)</h2>
      
      <div class='faq-question'>What are the best [topic-related] options available?</div>
      <p>Answer with 40-50 words for featured snippet optimization.</p>
      
      <div class='faq-question'>How can [topic] help improve [related area]?</div>
      <p>Provide a comprehensive answer with practical examples and actionable insights.</p>
      
      <div class='faq-question'>What should I consider when choosing [topic-related item]?</div>
      <p>Offer expert advice and considerations for making informed decisions.</p>
    </div>
    
    <div class='cta-section'>
      <h3>Stay Updated!</h3>
      <p>If you found this guide helpful, make sure to subscribe to our newsletter for the latest updates on [topic] and trends in 2025!</p>
    </div>
  </div>"
}

Write a comprehensive 1500-1800 word article following this exact SEO structure:
1. Catchy, keyword-rich title with numbers or timely references
2. Engaging introduction with hook and keywords in first 100 words
3. Table of contents for navigation
4. Well-structured main content with H2, H3, H4 headings
5. Short, scannable paragraphs (2-4 sentences)
6. Bullet points and numbered lists for easy scanning
7. Callout boxes highlighting important points
8. Comparison tables where relevant
9. One relevant image in the middle of content
10. Strong conclusion with call-to-action
11. FAQ section with 3-5 questions for featured snippets
12. Final CTA encouraging engagement

Include 2 external links to reputable sources and one internal link to our homepage. Provide a short 150-160 character meta description and a list of 8-12 SEO keywords. Tone: professional, informative, and engaging. IMPORTANT: Create 100% original content. Do not copy from any existing sources. Write unique analysis and insights. If you are unsure about a fact, write "source unavailable" instead of inventing one.`;

    const userPrompt = `Topic: ${topic.title}
Description: ${topic.description}
Keywords to emphasize: ${topic.keywords.join(', ')}

Write the blog using the system instructions. Focus on providing in-depth technical analysis, practical implementation guidance, and industry insights. Create comprehensive content that demonstrates expertise in the subject matter.

CRITICAL: Only write about technology, innovation, business, startups, software development, AI, emerging technologies, digital transformation, and related topics. If the topic is not tech-related, transform it into a technology angle or skip it entirely.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
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

      // Generate both cover and card images
      const [heroImage, cardImage] = await Promise.all([
        this.generateHeroImage(parsedPost.title),
        this.generateCardImage(parsedPost.title)
      ]);

      // Add card image to content
      const contentWithCardImage = parsedPost.content + `
      <div style="text-align: center; margin: 30px 0;">
        <img src="${cardImage}" alt="${parsedPost.title} - Social Media Card" style="max-width: 400px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
        <p style="font-style: italic; color: #666; margin-top: 10px;">Social Media Card for ${parsedPost.title}</p>
      </div>
      `;

      return {
        ...parsedPost,
        slug: uniqueSlug,
        content: contentWithCardImage,
        heroImage: heroImage,
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
            model: 'gpt-4o-mini',
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
        model: 'gpt-4o-mini',
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
        model: 'gpt-4o-mini',
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
        model: 'gpt-4o-mini',
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
        model: 'gpt-4o-mini',
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
        model: 'gpt-4o-mini',
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
        model: 'gpt-4o-mini',
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
      console.log('🎨 Generating AI image with Stability API...');
      
      // Generate image using Stability API
      const imagePrompt = `Create a modern, professional hero banner image for a blog titled "${title}". Style: modern flat/vector design with a clear focal point and space suitable for text overlay. Keep it brand-friendly and not copyright-infringing. Use a 16:9 aspect ratio.`;
      
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.stabilityApiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: imagePrompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 768,
          width: 1344,
          samples: 1,
          steps: 30,
          style_preset: "photographic"
        })
      });

      if (!response.ok) {
        throw new Error(`Stability API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.artifacts && result.artifacts.length > 0) {
        const imageData = result.artifacts[0];
        const base64Image = imageData.base64;
        
        // Convert base64 to data URL
        const imageUrl = `data:image/png;base64,${base64Image}`;
        
        console.log('✅ AI image generated successfully');
        return imageUrl;
      } else {
        throw new Error('No image generated from Stability API');
      }

    } catch (error) {
      console.error('Error generating AI image:', error);
      
      // Fallback to Pexels API
      try {
        const pexelsImage = await this.getPexelsImage(title);
        return pexelsImage.imageUrl;
      } catch (pexelsError) {
        console.error('Error with Pexels fallback:', pexelsError);
        
        // Final fallback to static images
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
  }

  async generateCardImage(title: string): Promise<string> {
    try {
      console.log('🎨 Generating card image with Stability API...');
      
      // Generate square card image using Stability API
      const imagePrompt = `Create a square social media card image for a blog post about "${title}". Style: modern, clean design with icons and visual elements related to AI and technology. Use a 1:1 aspect ratio.`;
      
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.stabilityApiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: imagePrompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
          style_preset: "photographic"
        })
      });

      if (!response.ok) {
        throw new Error(`Stability API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.artifacts && result.artifacts.length > 0) {
        const imageData = result.artifacts[0];
        const base64Image = imageData.base64;
        
        // Convert base64 to data URL
        const imageUrl = `data:image/png;base64,${base64Image}`;
        
        console.log('✅ Card image generated successfully');
        return imageUrl;
      } else {
        throw new Error('No card image generated from Stability API');
      }

    } catch (error) {
      console.error('Error generating card image:', error);
      
      // Fallback to a default card image
      return 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg';
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
    console.log('No specific category matched, using innovation-insights as default');
    return ['innovation-insights'];
  }

  private getCategoryConfig(): Record<string, string[]> {
    return {
      // Core Innovation Categories
      'innovation-insights': [
        'innovation', 'breakthrough', 'cutting-edge', 'revolutionary', 'groundbreaking',
        'pioneering', 'advanced', 'next-generation', 'state-of-the-art', 'disruptive'
      ],
      'digital-transformation': [
        'digital transformation', 'digitalization', 'digitization', 'industry 4.0',
        'business transformation', 'digital strategy', 'automation', 'process optimization'
      ],
      
      // News & Current Affairs
      'breaking-news': [
        'breaking news', 'urgent', 'latest', 'recent', 'announcement', 'update',
        'developments', 'reports', 'news', 'current events', 'happening now'
      ],
      'industry-updates': [
        'industry news', 'sector updates', 'market news', 'business news',
        'corporate news', 'industry trends', 'market developments', 'sector analysis'
      ],
      
      // Development & Engineering
      'software-engineering': [
        'software engineering', 'software development', 'programming', 'coding',
        'software architecture', 'engineering practices', 'code quality', 'software design'
      ],
      'web-development': [
        'react', 'javascript', 'typescript', 'next.js', 'vue', 'angular',
        'web development', 'frontend', 'backend', 'full-stack', 'node.js',
        'html', 'css', 'jamstack', 'pwa', 'webassembly'
      ],
      
      // AI & Emerging Tech
      'artificial-intelligence': [
        'ai', 'artificial intelligence', 'machine learning', 'neural network',
        'deep learning', 'chatgpt', 'openai', 'gpt', 'ai dev tools', 'ai integration',
        'ml', 'neural networks', 'computer vision', 'natural language processing'
      ],
      'emerging-technologies': [
        'blockchain', 'cryptocurrency', 'iot', 'internet of things', 'ar', 'vr',
        'augmented reality', 'virtual reality', 'quantum computing', '5g',
        'edge computing', 'robotics', 'autonomous vehicles', 'biotechnology'
      ],
      
      // Business & Strategy
      'business-strategy': [
        'business strategy', 'market strategy', 'competitive analysis', 'business model',
        'strategic planning', 'market research', 'business intelligence', 'corporate strategy'
      ],
      'startup-ecosystem': [
        'startup', 'entrepreneurship', 'venture capital', 'funding', 'investment',
        'unicorn', 'scale-up', 'incubator', 'accelerator', 'pitch', 'seed funding'
      ],
      
      // Research & Analysis
      'research-analysis': [
        'research', 'analysis', 'study', 'survey', 'data analysis', 'market research',
        'statistical analysis', 'trend analysis', 'forecasting', 'predictive analytics'
      ],
      'case-studies': [
        'case study', 'success story', 'implementation', 'real-world', 'practical',
        'example', 'use case', 'scenario', 'application', 'deployment'
      ],
      
      // Global & Social Impact
      'global-impact': [
        'global impact', 'social impact', 'societal change', 'worldwide', 'international',
        'globalization', 'cross-border', 'universal', 'worldwide impact', 'global reach'
      ],
      'sustainability': [
        'sustainability', 'green technology', 'environmental', 'carbon neutral',
        'renewable energy', 'eco-friendly', 'climate change', 'green tech', 'clean energy'
      ],
      
      // Tools & Resources
      'tools-resources': [
        'tools', 'resources', 'productivity', 'software tools', 'development tools',
        'productivity apps', 'utilities', 'platforms', 'solutions', 'services'
      ],
      'tutorials-guides': [
        'tutorial', 'guide', 'how-to', 'step-by-step', 'walkthrough', 'instructions',
        'learning', 'education', 'training', 'course', 'lesson'
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
            excerpt: blogPost.excerpt || blogPost.metaDescription || blogPost.description,
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
