import OpenAI from 'openai';
import { prisma } from './prisma';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
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
    this.wpBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techorbitze.com';
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
    
    return {
      title: title,
      slug: slug,
      content: content,
      excerpt: `Explore the latest developments in ${title.toLowerCase()}. Learn about key insights, trends, and practical applications in this comprehensive analysis.`,
      tags: tags,
      category: 'Technology',
      seoTitle: `${title} - Latest Technology Insights and Analysis`,
      seoDescription: `Discover the latest developments in ${title.toLowerCase()}. Get insights, analysis, and practical information about this trending technology topic.`,
      heroImage: await this.generateHeroImage(title),
      heroImageAlt: `${title} - Technology Insights`,
      publishedAt: new Date().toISOString(),
      canonicalUrl: `${this.wpBaseUrl}/blog/${slug}`
    };
  }

  private generateGitHubFallbackContent(topic: any): string {
    const title = topic.title.replace(': Latest Technology Insights and Analysis', '');
    const description = topic.description || 'This open-source project';
    
    return `
<style>
.blog-content { 
  max-width: 800px; 
  margin: 0 auto; 
  line-height: 1.6; 
  font-family: Arial, sans-serif; 
} 
.tech-highlight { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  color: white; 
  padding: 20px; 
  border-radius: 10px; 
  margin: 20px 0; 
} 
.feature-box { 
  border: 2px solid #e1e5e9; 
  padding: 15px; 
  border-radius: 8px; 
  background: #f8f9fa; 
  margin: 15px 0; 
} 
.tech-spec { 
  background: #e3f2fd; 
  padding: 10px; 
  border-left: 4px solid #2196f3; 
  margin: 10px 0; 
}
</style>

<div class='blog-content'>
<h1>${title}</h1>
<p>TL;DR: ${description} represents an innovative approach to modern software development and technology implementation.</p>

<h2>Introduction</h2>
<p>In the rapidly evolving landscape of software development, ${title} has emerged as a significant project that showcases the power of open-source collaboration and modern programming practices. This repository demonstrates how developers can leverage cutting-edge technologies to create robust, scalable solutions.</p>

<div class='tech-highlight'>
<h3>Key Features</h3>
<ul>
<li>Modern architecture and design patterns</li>
<li>Comprehensive documentation and examples</li>
<li>Active community support and contributions</li>
<li>Cross-platform compatibility</li>
</ul>
</div>

<h2>Technical Overview</h2>
<p>${description} utilizes modern development practices and frameworks to deliver a high-quality solution. The project incorporates best practices in code organization, testing, and deployment strategies.</p>

<div class='feature-box'>
<h3>Technology Stack</h3>
<p>The project leverages a modern technology stack including:</p>
<ul>
<li>Latest programming languages and frameworks</li>
<li>Cloud-native deployment options</li>
<li>Comprehensive testing suite</li>
<li>Automated CI/CD pipelines</li>
</ul>
</div>

<h2>Implementation Guide</h2>
<p>To get started with ${title}, developers can follow these steps:</p>
<ol>
<li>Clone the repository from GitHub</li>
<li>Install dependencies and set up the development environment</li>
<li>Review the documentation and examples</li>
<li>Start contributing to the project</li>
</ol>

<div class='tech-spec'>
<h3>Getting Started</h3>
<p>Visit the project repository to explore the codebase, read documentation, and understand the implementation details. The project welcomes contributions from the open-source community.</p>
</div>

<h2>Use Cases</h2>
<p>${title} can be applied in various scenarios:</p>
<ul>
<li>Educational purposes for learning modern development practices</li>
<li>Building production-ready applications</li>
<li>Contributing to open-source projects</li>
<li>Understanding software architecture patterns</li>
</ul>

<h2>Future Development</h2>
<p>As an active open-source project, ${title} continues to evolve with regular updates, new features, and community contributions. The project roadmap includes enhancements for better performance, additional features, and improved documentation.</p>

<h2>Conclusion</h2>
<p>${title} represents the best of open-source development, offering valuable insights into modern software engineering practices. Whether you're a beginner looking to learn or an experienced developer seeking to contribute, this project provides an excellent opportunity to engage with cutting-edge technology.</p>
</div>`;
  }

  private generateNewsFallbackContent(topic: any): string {
    const title = topic.title.replace(': Latest Technology Insights and Analysis', '');
    
    return `
<style>
.blog-content { 
  max-width: 800px; 
  margin: 0 auto; 
  line-height: 1.6; 
  font-family: Arial, sans-serif; 
} 
.tech-highlight { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  color: white; 
  padding: 20px; 
  border-radius: 10px; 
  margin: 20px 0; 
} 
.feature-box { 
  border: 2px solid #e1e5e9; 
  padding: 15px; 
  border-radius: 8px; 
  background: #f8f9fa; 
  margin: 15px 0; 
} 
.tech-spec { 
  background: #e3f2fd; 
  padding: 10px; 
  border-left: 4px solid #2196f3; 
  margin: 10px 0; 
}
</style>

<div class='blog-content'>
<h1>${title}</h1>
<p>TL;DR: ${title} represents a significant development in the technology sector, showcasing innovation and progress in modern digital solutions.</p>

<h2>Introduction</h2>
<p>The technology landscape continues to evolve rapidly, with ${title} emerging as a key development that highlights the ongoing transformation in digital innovation. This development reflects the industry's commitment to advancing technology solutions and improving user experiences.</p>

<div class='tech-highlight'>
<h3>Key Insights</h3>
<ul>
<li>Innovation in technology implementation</li>
<li>Impact on industry standards and practices</li>
<li>Future implications for technology development</li>
<li>Opportunities for businesses and developers</li>
</ul>
</div>

<h2>Current State Analysis</h2>
<p>${title} demonstrates the current state of technology advancement and its implications for various sectors. The development showcases how modern technology solutions are addressing real-world challenges and creating new opportunities.</p>

<div class='feature-box'>
<h3>Technology Impact</h3>
<p>This development has significant implications for:</p>
<ul>
<li>Business operations and efficiency</li>
<li>User experience and accessibility</li>
<li>Industry standards and best practices</li>
<li>Future technology development</li>
</ul>
</div>

<h2>Technical Implications</h2>
<p>The technical aspects of ${title} reveal important insights about modern technology implementation. Key considerations include:</p>
<ul>
<li>Scalability and performance optimization</li>
<li>Security and data protection measures</li>
<li>Integration with existing systems</li>
<li>User adoption and training requirements</li>
</ul>

<div class='tech-spec'>
<h3>Implementation Considerations</h3>
<p>Organizations looking to leverage this technology should consider factors such as infrastructure requirements, training needs, and integration strategies. Proper planning and execution are essential for successful implementation.</p>
</div>

<h2>Future Trends</h2>
<p>Looking ahead, ${title} suggests several trends in technology development:</p>
<ul>
<li>Increased focus on user experience</li>
<li>Enhanced automation and efficiency</li>
<li>Improved accessibility and inclusivity</li>
<li>Greater integration across platforms</li>
</ul>

<h2>Industry Impact</h2>
<p>The impact of ${title} extends across multiple industries, offering opportunities for:</p>
<ul>
<li>Enhanced productivity and efficiency</li>
<li>Improved customer experiences</li>
<li>New business models and opportunities</li>
<li>Competitive advantages in the market</li>
</ul>

<h2>Conclusion</h2>
<p>${title} represents an important milestone in technology development, offering valuable insights into current trends and future possibilities. As the technology landscape continues to evolve, developments like this will play a crucial role in shaping the future of digital innovation.</p>
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
        where: { email: 'ai@techorbitze.com' }
      });

      if (!author) {
        author = await prisma.user.create({
          data: {
            email: 'ai@techorbitze.com',
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
          excerpt: blogPost.metaDescription,
          status: 'PUBLISHED',
          authorId: author.id,
          publishedAt: new Date(blogPost.publishedAt),
          showcaseImage: blogPost.heroImage,
          seoDescription: blogPost.metaDescription, // Use seoDescription instead of metaDescription
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
