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

async function generateImageWithStability(prompt, aspectRatio = "16:9") {
  try {
    console.log(`🎨 Generating image: ${prompt.substring(0, 50)}...`);
    
    const stabilityApiKey = process.env.STABILITY_API_KEY;
    if (!stabilityApiKey) {
      throw new Error('STABILITY_API_KEY not found in environment variables');
    }

    // Determine dimensions based on aspect ratio (using allowed SDXL dimensions)
    let width, height;
    switch (aspectRatio) {
      case "16:9":
        width = 1344;
        height = 768;
        break;
      case "4:3":
        width = 1024;
        height = 768;
        break;
      case "1:1":
        width = 1024;
        height = 1024;
        break;
      default:
        width = 1344;
        height = 768;
    }

    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stabilityApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: height,
        width: width,
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
      
      // Convert base64 to URL (you might want to save this to a file or cloud storage)
      const imageUrl = `data:image/png;base64,${base64Image}`;
      
      console.log(`✅ Image generated successfully`);
      return imageUrl;
    } else {
      throw new Error('No image generated from Stability API');
    }

  } catch (error) {
    console.error(`❌ Image generation failed: ${error.message}`);
    // Return a fallback image URL
    return 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg';
  }
}

function extractJsonFromResponse(response) {
  try {
    // Remove markdown code blocks if present
    let cleanedResponse = response.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    
    // Try to parse as JSON
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.log('Failed to parse JSON, trying to extract manually...');
    
    // Try to find JSON object in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.log('Failed to parse extracted JSON');
        return null;
      }
    }
    
    return null;
  }
}

async function generateBlogPost(topic) {
  try {
    console.log(`🎯 Generating: ${topic.title}`);

    const systemPrompt = `You are an expert SEO content writer. Generate a comprehensive blog post about ${topic.title}. 

Return ONLY a JSON object with this exact structure (no markdown formatting, no code blocks):
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
- Professional, informative tone
- Return ONLY the JSON object, no other text`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a comprehensive blog post about: ${topic.title}` }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const parsedPost = extractJsonFromResponse(content);
    if (!parsedPost) {
      throw new Error('Failed to parse JSON response');
    }
    
    // Generate cover image
    console.log('🖼️ Generating cover image...');
    const coverImagePrompt = `Create a modern, professional hero banner image for a blog titled "${parsedPost.title}". Style: modern flat/vector design with a clear focal point and space suitable for text overlay. Keep it brand-friendly and not copyright-infringing. Use a 16:9 aspect ratio.`;
    const coverImage = await generateImageWithStability(coverImagePrompt, "16:9");
    
    // Generate card image
    console.log('🖼️ Generating card image...');
    const cardImagePrompt = `Create a square social media card image for a blog post about "${parsedPost.title}". Style: modern, clean design with icons and visual elements related to AI and technology. Use a 1:1 aspect ratio.`;
    const cardImage = await generateImageWithStability(cardImagePrompt, "1:1");
    
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

    // Create blog post with images
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
        heroImage: coverImage,
        heroImageAlt: `${parsedPost.title} - Cover Image`,
        // Add card image to content or as a separate field
        content: parsedPost.content + `
        <div style="text-align: center; margin: 30px 0;">
          <img src="${cardImage}" alt="${parsedPost.title} - Social Media Card" style="max-width: 400px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
          <p style="font-style: italic; color: #666; margin-top: 10px;">Social Media Card for ${parsedPost.title}</p>
        </div>
        `
      }
    });

    console.log(`✅ Created: ${parsedPost.title}`);
    console.log(`🖼️ Cover Image: ${coverImage.substring(0, 50)}...`);
    console.log(`🖼️ Card Image: ${cardImage.substring(0, 50)}...`);
    
    return blogPost;

  } catch (error) {
    console.error(`❌ Error: ${topic.title} - ${error.message}`);
    return null;
  }
}

async function generateAllBlogPosts() {
  console.log('🚀 Starting AI blog generation with images...');
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

    // Longer delay to avoid rate limits
    if (i < blogTopics.length - 1) {
      console.log('⏳ Waiting 60 seconds to avoid rate limits...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }

  console.log(`\n🎉 Generation completed!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📊 Success rate: ${((successCount / blogTopics.length) * 100).toFixed(1)}%`);

  await prisma.$disconnect();
}

generateAllBlogPosts();
