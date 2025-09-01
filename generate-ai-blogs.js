const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Blog topics organized by category
const blogTopics = [
  // General AI Tools
  {
    title: "Top 10 Free AI Tools You Should Be Using in 2025",
    category: "AI Tools",
    keywords: ["free AI tools", "AI software", "productivity tools", "2025"]
  },
  {
    title: "Best AI Tools for Small Businesses (2025 Edition)",
    category: "Business AI",
    keywords: ["AI for business", "small business tools", "automation", "2025"]
  },
  {
    title: "How to Use AI Tools to Automate Your Blog Writing",
    category: "Content Creation",
    keywords: ["AI writing", "blog automation", "content creation", "productivity"]
  },
  {
    title: "AI Tools That Will Replace Virtual Assistants",
    category: "Automation",
    keywords: ["virtual assistants", "AI automation", "productivity", "business tools"]
  },
  {
    title: "5 Must-Have AI Tools for Solopreneurs in 2025",
    category: "Entrepreneurship",
    keywords: ["solopreneur", "AI tools", "business automation", "2025"]
  },

  // AI Tool Comparisons
  {
    title: "ChatGPT vs Claude: Which AI Writer Is Better in 2025?",
    category: "AI Comparison",
    keywords: ["ChatGPT", "Claude", "AI comparison", "writing tools", "2025"]
  },
  {
    title: "Jasper vs Copy.ai: Best AI Tool for Marketers",
    category: "Marketing AI",
    keywords: ["Jasper", "Copy.ai", "marketing tools", "AI writing"]
  },
  {
    title: "Google Gemini vs ChatGPT: A Real-World Comparison",
    category: "AI Comparison",
    keywords: ["Google Gemini", "ChatGPT", "AI comparison", "Google AI"]
  },
  {
    title: "Top 5 ChatGPT Alternatives (Free & Paid)",
    category: "AI Tools",
    keywords: ["ChatGPT alternatives", "AI chatbots", "free AI tools", "paid AI tools"]
  },
  {
    title: "Midjourney vs DALL·E: Which AI Art Tool Should You Use?",
    category: "AI Art",
    keywords: ["Midjourney", "DALL-E", "AI art", "image generation"]
  },

  // Niche-Specific AI Tools
  {
    title: "Best AI Tools for Teachers and Educators",
    category: "Education",
    keywords: ["AI for education", "teaching tools", "educational technology"]
  },
  {
    title: "Top AI Tools for Real Estate Professionals",
    category: "Real Estate",
    keywords: ["AI real estate", "property tools", "real estate technology"]
  },
  {
    title: "AI for Content Creators: 7 Tools to Boost Your Workflow",
    category: "Content Creation",
    keywords: ["content creation", "AI tools", "creators", "workflow"]
  },
  {
    title: "AI Tools for E-commerce: Automate Product Descriptions",
    category: "E-commerce",
    keywords: ["e-commerce AI", "product descriptions", "automation"]
  },
  {
    title: "AI Tools Every Freelancer Should Use in 2025",
    category: "Freelancing",
    keywords: ["freelancer tools", "AI productivity", "remote work"]
  },

  // Tutorials & Guides
  {
    title: "How to Create a Blog Post Using ChatGPT (Step-by-Step)",
    category: "Tutorials",
    keywords: ["ChatGPT tutorial", "blog writing", "step-by-step guide"]
  },
  {
    title: "How to Make YouTube Videos Using AI Tools Like Pictory",
    category: "Video Creation",
    keywords: ["YouTube AI", "Pictory", "video creation", "AI video tools"]
  },
  {
    title: "How to Use Canva's AI Tools for Fast Design",
    category: "Design",
    keywords: ["Canva AI", "design tools", "AI design", "graphic design"]
  },
  {
    title: "Step-by-Step Guide to Using ElevenLabs for Voice Cloning",
    category: "Audio AI",
    keywords: ["ElevenLabs", "voice cloning", "AI voice", "audio tools"]
  },
  {
    title: "How to Generate Product Descriptions with Jasper AI",
    category: "E-commerce",
    keywords: ["Jasper AI", "product descriptions", "e-commerce", "AI writing"]
  },

  // Trending Topics
  {
    title: "New AI Tools Launched in September 2025",
    category: "Trending",
    keywords: ["new AI tools", "September 2025", "latest AI", "emerging technology"]
  },
  {
    title: "What's New in ChatGPT-5 (Everything You Need to Know)",
    category: "Trending",
    keywords: ["ChatGPT-5", "OpenAI", "latest features", "AI updates", "2025"]
  },
  {
    title: "The Rise of Multimodal AI: What It Means for Creators",
    category: "Trending",
    keywords: ["multimodal AI", "AI technology", "content creation", "future of AI"]
  },
  {
    title: "Why Claude 3.5 Is Gaining on ChatGPT",
    category: "Trending",
    keywords: ["Claude 3.5", "ChatGPT", "AI competition", "Anthropic"]
  },
  {
    title: "AI Trends to Watch in Late 2025",
    category: "Trending",
    keywords: ["AI trends", "2025", "future technology", "artificial intelligence"]
  },

  // Monetization
  {
    title: "Top 7 AI Tools with Affiliate Programs (and How to Promote Them)",
    category: "Monetization",
    keywords: ["AI affiliate programs", "monetization", "affiliate marketing", "AI tools"]
  },
  {
    title: "How to Make Money with AI Blogs",
    category: "Monetization",
    keywords: ["AI blogging", "monetization", "blog income", "AI content"]
  },
  {
    title: "Best AI Tools for Passive Income Ideas",
    category: "Monetization",
    keywords: ["passive income", "AI tools", "automation", "side hustle"]
  },
  {
    title: "Free vs Paid AI Tools: What's Worth Paying For?",
    category: "AI Tools",
    keywords: ["free AI tools", "paid AI tools", "AI pricing", "value comparison"]
  },
  {
    title: "5 AI Side Hustles You Can Start Today",
    category: "Monetization",
    keywords: ["AI side hustle", "passive income", "AI business", "entrepreneurship"]
  }
];

async function generateBlogPost(topic) {
  try {
    console.log(`🎯 Generating: ${topic.title}`);

    const systemPrompt = `You are an expert SEO content writer. Generate a comprehensive blog post about ${topic.title}. 

Return a JSON object with this structure:
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "description": "150-160 character meta description",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "content": "HTML content with proper structure, H1, H2, H3 headings, bullet points, and engaging content"
}

Requirements:
- 1500-1800 words
- Include table of contents
- Use H1, H2, H3 headings
- Add bullet points and numbered lists
- Include FAQ section
- Add call-to-action sections
- Include 2 external links and 1 internal link
- Focus on keywords: ${topic.keywords.join(', ')}
- Category: ${topic.category}
- Make content unique and original
- Professional, informative tone`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a comprehensive blog post about: ${topic.title}` }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const parsedPost = JSON.parse(content);
    
    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@techonigx.com' }
    });

    if (!adminUser) {
      console.log('Creating admin user...');
      await prisma.user.create({
        data: {
          email: 'admin@techonigx.com',
          name: 'TechOnigx Admin',
          role: 'ADMIN'
        }
      });
    }

    // Create category
    const category = await prisma.category.upsert({
      where: { slug: topic.category.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name: topic.category,
        slug: topic.category.toLowerCase().replace(/\s+/g, '-'),
        description: `${topic.category} content`
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

    // Create blog post
    const blogPost = await prisma.post.create({
      data: {
        title: parsedPost.title,
        slug: parsedPost.slug,
        excerpt: parsedPost.description,
        content: parsedPost.content,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryIds: [category.id],
        tagIds: tags.map(tag => tag.id),
        readingTime: 8,
        seoTitle: parsedPost.title,
        seoDescription: parsedPost.description,
      }
    });

    console.log(`✅ Created: ${parsedPost.title}`);
    return blogPost;

  } catch (error) {
    console.error(`❌ Error: ${topic.title} - ${error.message}`);
    return null;
  }
}

async function generateAllBlogPosts() {
  console.log('🚀 Starting AI blog generation...');
  console.log(`📝 Total topics: ${blogTopics.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < blogTopics.length; i++) {
    const topic = blogTopics[i];
    console.log(`\n📊 Progress: ${i + 1}/${blogTopics.length}`);
    
    const result = await generateBlogPost(topic);
    
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }

    // Delay between requests
    if (i < blogTopics.length - 1) {
      console.log('⏳ Waiting 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log(`\n🎉 Generation completed!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📊 Success rate: ${((successCount / blogTopics.length) * 100).toFixed(1)}%`);

  await prisma.$disconnect();
}

generateAllBlogPosts();
