const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// All the blog post topics organized by category
const blogTopics = [
  // 📌 General AI Tools
  {
    title: "Top 10 Free AI Tools You Should Be Using in 2025",
    category: "AI Tools",
    keywords: ["free AI tools", "AI software", "productivity tools", "2025", "artificial intelligence"],
    description: "Discover the best free AI tools that will revolutionize your workflow in 2025"
  },
  {
    title: "Best AI Tools for Small Businesses (2025 Edition)",
    category: "Business AI",
    keywords: ["AI for business", "small business tools", "automation", "productivity", "2025"],
    description: "Essential AI tools that every small business needs to stay competitive in 2025"
  },
  {
    title: "How to Use AI Tools to Automate Your Blog Writing",
    category: "Content Creation",
    keywords: ["AI writing", "blog automation", "content creation", "productivity", "writing tools"],
    description: "Master the art of automated blog writing with cutting-edge AI tools"
  },
  {
    title: "AI Tools That Will Replace Virtual Assistants",
    category: "Automation",
    keywords: ["virtual assistants", "AI automation", "productivity", "business tools", "automation"],
    description: "The AI revolution in virtual assistance and what it means for businesses"
  },
  {
    title: "5 Must-Have AI Tools for Solopreneurs in 2025",
    category: "Entrepreneurship",
    keywords: ["solopreneur", "AI tools", "business automation", "productivity", "2025"],
    description: "Essential AI tools that every solopreneur needs to scale their business"
  },

  // 🤖 AI Tool Comparisons
  {
    title: "ChatGPT vs Claude: Which AI Writer Is Better in 2025?",
    category: "AI Comparison",
    keywords: ["ChatGPT", "Claude", "AI comparison", "writing tools", "2025"],
    description: "Comprehensive comparison of ChatGPT and Claude for content creation in 2025"
  },
  {
    title: "Jasper vs Copy.ai: Best AI Tool for Marketers",
    category: "Marketing AI",
    keywords: ["Jasper", "Copy.ai", "marketing tools", "AI writing", "content marketing"],
    description: "Which AI writing tool reigns supreme for marketers in 2025?"
  },
  {
    title: "Google Gemini vs ChatGPT: A Real-World Comparison",
    category: "AI Comparison",
    keywords: ["Google Gemini", "ChatGPT", "AI comparison", "Google AI", "2025"],
    description: "Real-world testing and comparison of Google Gemini vs ChatGPT"
  },
  {
    title: "Top 5 ChatGPT Alternatives (Free & Paid)",
    category: "AI Tools",
    keywords: ["ChatGPT alternatives", "AI chatbots", "free AI tools", "paid AI tools"],
    description: "The best ChatGPT alternatives for different use cases and budgets"
  },
  {
    title: "Midjourney vs DALL·E: Which AI Art Tool Should You Use?",
    category: "AI Art",
    keywords: ["Midjourney", "DALL-E", "AI art", "image generation", "creative tools"],
    description: "Comprehensive guide to choosing between Midjourney and DALL-E for AI art"
  },

  // 🎯 Niche-Specific AI Tool Lists
  {
    title: "Best AI Tools for Teachers and Educators",
    category: "Education",
    keywords: ["AI for education", "teaching tools", "educational technology", "classroom AI"],
    description: "Revolutionary AI tools that are transforming education in 2025"
  },
  {
    title: "Top AI Tools for Real Estate Professionals",
    category: "Real Estate",
    keywords: ["AI real estate", "property tools", "real estate technology", "automation"],
    description: "AI tools that are revolutionizing the real estate industry"
  },
  {
    title: "AI for Content Creators: 7 Tools to Boost Your Workflow",
    category: "Content Creation",
    keywords: ["content creation", "AI tools", "creators", "workflow", "productivity"],
    description: "Essential AI tools that every content creator needs in 2025"
  },
  {
    title: "AI Tools for E-commerce: Automate Product Descriptions",
    category: "E-commerce",
    keywords: ["e-commerce AI", "product descriptions", "automation", "online business"],
    description: "How AI is transforming e-commerce product management and descriptions"
  },
  {
    title: "AI Tools Every Freelancer Should Use in 2025",
    category: "Freelancing",
    keywords: ["freelancer tools", "AI productivity", "remote work", "freelance business"],
    description: "Must-have AI tools for freelancers to boost productivity and income"
  },

  // 🛠️ Tutorials & Guides
  {
    title: "How to Create a Blog Post Using ChatGPT (Step-by-Step)",
    category: "Tutorials",
    keywords: ["ChatGPT tutorial", "blog writing", "step-by-step guide", "content creation"],
    description: "Complete step-by-step guide to creating blog posts with ChatGPT"
  },
  {
    title: "How to Make YouTube Videos Using AI Tools Like Pictory",
    category: "Video Creation",
    keywords: ["YouTube AI", "Pictory", "video creation", "AI video tools", "content creation"],
    description: "Create engaging YouTube videos using AI tools like Pictory"
  },
  {
    title: "How to Use Canva's AI Tools for Fast Design",
    category: "Design",
    keywords: ["Canva AI", "design tools", "AI design", "graphic design", "automation"],
    description: "Master Canva's AI features for lightning-fast design creation"
  },
  {
    title: "Step-by-Step Guide to Using ElevenLabs for Voice Cloning",
    category: "Audio AI",
    keywords: ["ElevenLabs", "voice cloning", "AI voice", "audio tools", "tutorial"],
    description: "Complete guide to voice cloning with ElevenLabs AI technology"
  },
  {
    title: "How to Generate Product Descriptions with Jasper AI",
    category: "E-commerce",
    keywords: ["Jasper AI", "product descriptions", "e-commerce", "AI writing", "tutorial"],
    description: "Generate compelling product descriptions using Jasper AI"
  },

  // 🔥 Trending + Timely Topics
  {
    title: "New AI Tools Launched in September 2025",
    category: "Trending",
    keywords: ["new AI tools", "September 2025", "latest AI", "emerging technology"],
    description: "The hottest new AI tools that launched in September 2025"
  },
  {
    title: "What's New in ChatGPT-5 (Everything You Need to Know)",
    category: "Trending",
    keywords: ["ChatGPT-5", "OpenAI", "latest features", "AI updates", "2025"],
    description: "Complete overview of ChatGPT-5's new features and capabilities"
  },
  {
    title: "The Rise of Multimodal AI: What It Means for Creators",
    category: "Trending",
    keywords: ["multimodal AI", "AI technology", "content creation", "future of AI"],
    description: "How multimodal AI is revolutionizing content creation and what's next"
  },
  {
    title: "Why Claude 3.5 Is Gaining on ChatGPT",
    category: "Trending",
    keywords: ["Claude 3.5", "ChatGPT", "AI competition", "Anthropic", "2025"],
    description: "Why Claude 3.5 is becoming a serious competitor to ChatGPT"
  },
  {
    title: "AI Trends to Watch in Late 2025",
    category: "Trending",
    keywords: ["AI trends", "2025", "future technology", "artificial intelligence", "predictions"],
    description: "The most important AI trends that will shape the rest of 2025"
  },

  // 💸 Monetization & Affiliate Potential
  {
    title: "Top 7 AI Tools with Affiliate Programs (and How to Promote Them)",
    category: "Monetization",
    keywords: ["AI affiliate programs", "monetization", "affiliate marketing", "AI tools", "income"],
    description: "The best AI tools with affiliate programs and strategies to promote them"
  },
  {
    title: "How to Make Money with AI Blogs",
    category: "Monetization",
    keywords: ["AI blogging", "monetization", "blog income", "AI content", "passive income"],
    description: "Complete guide to monetizing your AI blog and generating passive income"
  },
  {
    title: "Best AI Tools for Passive Income Ideas",
    category: "Monetization",
    keywords: ["passive income", "AI tools", "automation", "side hustle", "income generation"],
    description: "AI tools that can help you create multiple passive income streams"
  },
  {
    title: "Free vs Paid AI Tools: What's Worth Paying For?",
    category: "AI Tools",
    keywords: ["free AI tools", "paid AI tools", "AI pricing", "value comparison", "ROI"],
    description: "Comprehensive analysis of free vs paid AI tools and their value"
  },
  {
    title: "5 AI Side Hustles You Can Start Today",
    category: "Monetization",
    keywords: ["AI side hustle", "passive income", "AI business", "entrepreneurship", "income"],
    description: "Five profitable AI side hustles you can start immediately"
  }
];

async function generateBlogPost(topic) {
  try {
    console.log(`🎯 Generating blog post: ${topic.title}`);

    const systemPrompt = `You are an expert SEO content writer and editor. Generate comprehensive, SEO-optimized HTML content following the exact structure below. Return a JSON object with the following structure:

{
  "title": "Catchy, keyword-rich title with numbers or timely references",
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
9. Strong conclusion with call-to-action
10. FAQ section with 3-5 questions for featured snippets
11. Final CTA encouraging engagement

Include 2 external links to reputable sources and one internal link to our homepage. Provide a short 150-160 character meta description and a list of 8-12 SEO keywords. Tone: professional, informative, and engaging. IMPORTANT: Create 100% original content. Do not copy from any existing sources. Write unique analysis and insights. If you are unsure about a fact, write "source unavailable" instead of inventing one.`;

    const userPrompt = `Generate a comprehensive blog post about: ${topic.title}

Category: ${topic.category}
Target Keywords: ${topic.keywords.join(', ')}
Description: ${topic.description}

Make sure the content is:
- Unique and original (not copied from anywhere)
- SEO-optimized with the target keywords
- Engaging and informative
- 1500-1800 words
- Follows the exact structure provided
- Includes practical examples and actionable insights
- Suitable for the ${topic.category} audience`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    // Parse the JSON response
    const parsedPost = JSON.parse(content);
    
    // Generate unique slug
    const slug = parsedPost.slug || topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@techonigx.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Creating default admin user...');
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@techonigx.com',
          name: 'TechOnigx Admin',
          role: 'ADMIN',
          bio: 'TechOnigx AI Blog Generator'
        }
      });
      return newAdmin;
    }

    // Get or create categories and tags
    const category = await prisma.category.upsert({
      where: { slug: topic.category.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name: topic.category,
        slug: topic.category.toLowerCase().replace(/\s+/g, '-'),
        description: `${topic.category} related content`
      }
    });

    // Create tags
    const tagPromises = parsedPost.tags.map(async (tagName) => {
      return await prisma.tag.upsert({
        where: { slug: tagName.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/\s+/g, '-')
        }
      });
    });

    const tags = await Promise.all(tagPromises);

    // Create the blog post
    const blogPost = await prisma.post.create({
      data: {
        title: parsedPost.title,
        slug: slug,
        excerpt: parsedPost.description,
        content: parsedPost.content,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryIds: [category.id],
        tagIds: tags.map(tag => tag.id),
        readingTime: Math.ceil(parsedPost.content.split(' ').length / 200), // Estimate reading time
        seoTitle: parsedPost.title,
        seoDescription: parsedPost.description,
      }
    });

    console.log(`✅ Successfully created: ${parsedPost.title}`);
    return blogPost;

  } catch (error) {
    console.error(`❌ Error generating blog post for "${topic.title}":`, error.message);
    return null;
  }
}

async function generateAllBlogPosts() {
  try {
    console.log('🚀 Starting AI blog post generation...');
    console.log(`📝 Total topics to generate: ${blogTopics.length}`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < blogTopics.length; i++) {
      const topic = blogTopics[i];
      console.log(`\n📊 Progress: ${i + 1}/${blogTopics.length}`);
      
      const result = await generateBlogPost(topic);
      
      if (result) {
        successCount++;
        console.log(`✅ Generated: ${topic.title}`);
      } else {
        errorCount++;
        console.log(`❌ Failed: ${topic.title}`);
      }

      // Add delay between requests to avoid rate limiting
      if (i < blogTopics.length - 1) {
        console.log('⏳ Waiting 5 seconds before next generation...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log(`\n🎉 Blog generation completed!`);
    console.log(`✅ Successfully generated: ${successCount} posts`);
    console.log(`❌ Failed: ${errorCount} posts`);
    console.log(`📊 Success rate: ${((successCount / blogTopics.length) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error in blog generation process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the generation
generateAllBlogPosts();
