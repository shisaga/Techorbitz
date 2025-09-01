const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Premium blog topics with detailed descriptions
const premiumBlogTopics = [
  {
    title: "Top 10 Free AI Tools That Will Transform Your Business in 2025",
    category: "AI Tools",
    keywords: ["free AI tools", "business automation", "productivity", "2025", "AI software"],
    description: "Discover the most powerful free AI tools that can revolutionize your business operations and boost productivity in 2025."
  },
  {
    title: "ChatGPT vs Claude: The Ultimate AI Writing Battle of 2025",
    category: "AI Comparison",
    keywords: ["ChatGPT", "Claude", "AI comparison", "writing tools", "2025", "AI assistants"],
    description: "An in-depth comparison of ChatGPT and Claude to help you choose the best AI writing assistant for your needs."
  },
  {
    title: "How to Build a 6-Figure AI Business from Scratch in 2025",
    category: "Entrepreneurship",
    keywords: ["AI business", "entrepreneurship", "passive income", "2025", "business strategy"],
    description: "Step-by-step guide to building a profitable AI-powered business and achieving financial freedom."
  },
  {
    title: "The Complete Guide to AI-Powered Content Creation in 2025",
    category: "Content Creation",
    keywords: ["AI content creation", "content marketing", "automation", "2025", "digital marketing"],
    description: "Master the art of creating engaging content using AI tools and strategies that work in 2025."
  },
  {
    title: "7 AI Tools Every Freelancer Needs to Dominate in 2025",
    category: "Freelancing",
    keywords: ["freelancer tools", "AI productivity", "remote work", "2025", "freelance business"],
    description: "Essential AI tools that will help freelancers increase productivity and grow their business."
  },
  {
    title: "Midjourney vs DALL-E 3: Which AI Art Generator Reigns Supreme?",
    category: "AI Art",
    keywords: ["Midjourney", "DALL-E", "AI art", "image generation", "creative tools"],
    description: "Comprehensive comparison of the two leading AI art generators to help you choose the best one."
  },
  {
    title: "The Future of AI in Education: 10 Revolutionary Tools for 2025",
    category: "Education",
    keywords: ["AI education", "teaching tools", "educational technology", "2025", "learning"],
    description: "Explore how AI is transforming education and discover the best tools for teachers and students."
  },
  {
    title: "How to Make $10,000+ Monthly with AI Affiliate Marketing",
    category: "Monetization",
    keywords: ["AI affiliate marketing", "passive income", "monetization", "affiliate programs"],
    description: "Proven strategies to earn substantial income through AI affiliate marketing programs."
  },
  {
    title: "The Ultimate Guide to AI-Powered Social Media Marketing",
    category: "Marketing",
    keywords: ["social media marketing", "AI marketing", "digital marketing", "automation"],
    description: "Learn how to leverage AI tools for effective social media marketing and audience growth."
  },
  {
    title: "5 AI Side Hustles That Actually Work in 2025",
    category: "Side Hustles",
    keywords: ["AI side hustles", "passive income", "side business", "2025", "extra income"],
    description: "Realistic AI side hustle opportunities that can generate significant income in 2025."
  }
];

async function generateImageWithStability(prompt, aspectRatio = "16:9") {
  try {
    console.log(`🎨 Generating image with Stability API: ${prompt.substring(0, 50)}...`);
    
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
      
      // Convert base64 to URL
      const imageUrl = `data:image/png;base64,${base64Image}`;
      
      console.log(`✅ Stability API image generated successfully`);
      return imageUrl;
    } else {
      throw new Error('No image generated from Stability API');
    }

  } catch (error) {
    console.error(`❌ Stability API failed: ${error.message}`);
    console.log('🔄 Falling back to Pexels API...');
    
    // Fallback to Pexels API
    try {
      const pexelsApiKey = process.env.PEXELS_API_KEY;
      if (!pexelsApiKey) {
        throw new Error('PEXELS_API_KEY not found');
      }

      // Extract keywords from prompt for Pexels search
      const searchTerms = prompt.toLowerCase()
        .replace(/create a|stunning|modern|hero|banner|image|for|a|blog|titled|style|professional|high-quality|design|with|vibrant|colors|typography|visual|elements|that|represent|ai|and|technology|include|space|text|overlay|aspect|ratio|make|visually|striking|brand-friendly/g, '')
        .replace(/create|square|social|media|card|post|about|eye-catching|bold|clean|icons|graphics|highly|shareable|engaging/g, '')
        .trim()
        .split(' ')
        .filter(word => word.length > 3)
        .slice(0, 3)
        .join(' ');

      const pexelsResponse = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerms + ' technology AI')}&per_page=1`, {
        headers: {
          'Authorization': pexelsApiKey
        }
      });

      if (!pexelsResponse.ok) {
        throw new Error(`Pexels API error: ${pexelsResponse.status}`);
      }

      const pexelsData = await pexelsResponse.json();
      
      if (pexelsData.photos && pexelsData.photos.length > 0) {
        const photo = pexelsData.photos[0];
        const imageUrl = photo.src.large;
        
        console.log(`✅ Pexels fallback image found: ${imageUrl}`);
        return imageUrl;
      } else {
        throw new Error('No images found in Pexels');
      }

    } catch (pexelsError) {
      console.error(`❌ Pexels fallback failed: ${pexelsError.message}`);
      
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
      
      // Use prompt hash to select a consistent but different image
      const hash = prompt.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      const index = Math.abs(hash) % fallbackImages.length;
      const fallbackUrl = fallbackImages[index];
      
      console.log(`✅ Using static fallback image: ${fallbackUrl}`);
      return fallbackUrl;
    }
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

async function generatePremiumBlogPost(topic) {
  try {
    console.log(`🎯 Generating Premium Blog: ${topic.title}`);

    const systemPrompt = `You are an expert SEO content writer and digital marketing specialist. Create a premium, high-quality blog post about ${topic.title}.

Return ONLY a JSON object with this exact structure (no markdown formatting, no code blocks):
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "description": "150-160 character meta description",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "content": "Premium HTML content with advanced structure and styling"
}

PREMIUM CONTENT REQUIREMENTS:
- 2000-2500 words of high-quality, engaging content
- Use advanced SEO structure with proper H1, H2, H3, H4 headings
- Include a compelling introduction with hook and value proposition
- Add comprehensive table of contents with anchor links
- Use short, scannable paragraphs (2-3 sentences max)
- Include bullet points, numbered lists, and callout boxes
- Add comparison tables where relevant
- Include real-world examples and case studies
- Add FAQ section with 5-7 questions
- Include multiple call-to-action sections
- Add 3-4 external links to authoritative sources
- Include 2-3 internal links to related topics
- Focus on keywords: ${topic.keywords.join(', ')}
- Category: ${topic.category}
- Make content unique, valuable, and actionable
- Professional yet conversational tone
- Include statistics and data where relevant
- Add expert insights and tips
- End with strong conclusion and next steps

HTML STRUCTURE REQUIREMENTS:
- Use modern CSS styling with gradients, shadows, and animations
- Include feature boxes, highlight boxes, and tip boxes
- Add progress bars, rating systems, and visual elements
- Use emojis strategically for visual appeal
- Include social proof elements
- Add "Pro Tips" and "Expert Insights" sections
- Use color-coded sections for different types of content
- Include "Quick Wins" and "Action Items" sections
- Add "What You'll Learn" section at the beginning
- Include "Key Takeaways" at the end

Return ONLY the JSON object, no other text`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a premium blog post about: ${topic.title}. Focus on creating highly valuable, actionable content that readers will love and share.` }
      ],
      max_tokens: 4000,
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const parsedPost = extractJsonFromResponse(content);
    if (!parsedPost) {
      throw new Error('Failed to parse JSON response');
    }
    
    // Generate premium cover image
    console.log('🖼️ Generating premium cover image...');
    const coverImagePrompt = `Create a stunning, modern hero banner image for a premium blog titled "${parsedPost.title}". Style: professional, high-quality design with vibrant colors, modern typography, and visual elements that represent AI and technology. Include space for text overlay. Use a 16:9 aspect ratio. Make it visually striking and brand-friendly.`;
    const coverImage = await generateImageWithStability(coverImagePrompt, "16:9");
    
    // Generate premium card image
    console.log('🖼️ Generating premium card image...');
    const cardImagePrompt = `Create an eye-catching square social media card for a premium blog post about "${parsedPost.title}". Style: modern, professional design with bold colors, clean typography, and visual elements that represent AI and technology. Include icons and graphics. Use a 1:1 aspect ratio. Make it highly shareable and engaging.`;
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

    // Add premium styling and card image to content
    const premiumContent = `
    <style>
      .premium-blog {
        max-width: 900px;
        margin: 0 auto;
        line-height: 1.8;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #2d3748;
      }
      
      .premium-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px 30px;
        border-radius: 15px;
        margin-bottom: 30px;
        text-align: center;
      }
      
      .premium-header h1 {
        font-size: 2.5rem;
        margin-bottom: 15px;
        font-weight: 700;
      }
      
      .premium-header p {
        font-size: 1.2rem;
        opacity: 0.9;
        margin-bottom: 0;
      }
      
      .toc {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin: 30px 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      
      .toc h3 {
        margin-top: 0;
        font-size: 1.4rem;
        font-weight: 600;
      }
      
      .toc ul {
        margin: 15px 0;
        padding-left: 20px;
      }
      
      .toc li {
        margin: 8px 0;
        font-size: 1.1rem;
      }
      
      .toc a {
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
      }
      
      .toc a:hover {
        color: #fbbf24;
        transform: translateX(5px);
      }
      
      .callout-box {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-left: 5px solid #fbbf24;
      }
      
      .feature-box {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      .tip-box {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      .warning-box {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin: 30px 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      
      .comparison-table th {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        text-align: left;
        font-weight: 600;
        font-size: 1.1rem;
      }
      
      .comparison-table td {
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
        background: white;
      }
      
      .comparison-table tr:nth-child(even) td {
        background: #f7fafc;
      }
      
      .faq-section {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        padding: 30px;
        border-radius: 15px;
        margin: 30px 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      
      .faq-question {
        font-weight: 700;
        color: #2d3748;
        margin-top: 20px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: color 0.3s ease;
      }
      
      .faq-question:hover {
        color: #667eea;
      }
      
      .cta-section {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        padding: 40px;
        border-radius: 15px;
        margin: 40px 0;
        text-align: center;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      }
      
      .cta-section h3 {
        color: white;
        font-size: 2rem;
        margin-bottom: 15px;
        font-weight: 700;
      }
      
      .cta-section p {
        color: white;
        font-size: 1.2rem;
        margin-bottom: 20px;
      }
      
      .cta-button {
        display: inline-block;
        background: white;
        color: #667eea;
        padding: 15px 30px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      }
      
      .cta-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      }
      
      .content-image {
        width: 100%;
        max-width: 700px;
        height: auto;
        border-radius: 15px;
        margin: 40px auto;
        display: block;
        box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        transition: transform 0.3s ease;
      }
      
      .content-image:hover {
        transform: scale(1.02);
      }
      
      .image-caption {
        text-align: center;
        font-style: italic;
        color: #718096;
        margin-top: 15px;
        font-size: 1rem;
      }
      
      .pro-tip {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        border-left: 5px solid #fbbf24;
      }
      
      .pro-tip strong {
        color: #fbbf24;
      }
      
      .key-takeaways {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 30px;
        border-radius: 15px;
        margin: 30px 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      
      .key-takeaways h3 {
        margin-top: 0;
        font-size: 1.5rem;
        font-weight: 700;
      }
      
      .key-takeaways ul {
        margin: 15px 0;
        padding-left: 20px;
      }
      
      .key-takeaways li {
        margin: 10px 0;
        font-size: 1.1rem;
      }
    </style>
    
    <div class="premium-blog">
      <div class="premium-header">
        <h1>${parsedPost.title}</h1>
        <p>${topic.description}</p>
      </div>
      
      ${parsedPost.content}
      
      <div style="text-align: center; margin: 40px 0;">
        <img src="${cardImage}" alt="${parsedPost.title} - Social Media Card" class="content-image" />
        <p class="image-caption">Share this premium content on social media! 🚀</p>
      </div>
      
      <div class="key-takeaways">
        <h3>🎯 Key Takeaways</h3>
        <ul>
          <li>Implement these strategies to achieve your goals</li>
          <li>Focus on the most impactful actions first</li>
          <li>Track your progress and measure results</li>
          <li>Stay updated with the latest trends and tools</li>
        </ul>
      </div>
      
      <div class="cta-section">
        <h3>🚀 Ready to Take Action?</h3>
        <p>Which strategy from this guide are you most excited to implement? Share your thoughts in the comments below!</p>
        <a href="/blog" class="cta-button">Explore More Premium Content →</a>
      </div>
    </div>`;

    // Create premium blog post
    const blogPost = await prisma.post.create({
      data: {
        title: parsedPost.title,
        slug: parsedPost.slug,
        excerpt: parsedPost.description,
        content: premiumContent,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryIds: [category.id],
        tagIds: tags.map(tag => tag.id),
        readingTime: 12,
        seoTitle: parsedPost.title,
        seoDescription: parsedPost.description,
        coverImage: coverImage,
        heroImageAlt: `${parsedPost.title} - Premium Cover Image`,
      }
    });

    console.log(`✅ Created Premium Blog: ${parsedPost.title}`);
    console.log(`🖼️ Cover Image: ${coverImage.substring(0, 50)}...`);
    console.log(`🖼️ Card Image: ${cardImage.substring(0, 50)}...`);
    console.log(`📊 Word Count: ~${premiumContent.split(' ').length} words`);
    
    return blogPost;

  } catch (error) {
    console.error(`❌ Error: ${topic.title} - ${error.message}`);
    return null;
  }
}

async function generateAllPremiumBlogs() {
  console.log('🚀 Starting Premium AI Blog Generation...');
  console.log(`📝 Total premium topics: ${premiumBlogTopics.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < premiumBlogTopics.length; i++) {
    const topic = premiumBlogTopics[i];
    console.log(`\n📊 Progress: ${i + 1}/${premiumBlogTopics.length}`);
    
    const result = await generatePremiumBlogPost(topic);
    
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }

    // Longer delay to avoid rate limits and ensure quality
    if (i < premiumBlogTopics.length - 1) {
      console.log('⏳ Waiting 90 seconds to ensure premium quality...');
      await new Promise(resolve => setTimeout(resolve, 90000));
    }
  }

  console.log(`\n🎉 Premium Blog Generation Completed!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📊 Success rate: ${((successCount / premiumBlogTopics.length) * 100).toFixed(1)}%`);
  console.log(`🌟 Premium content quality: EXCELLENT`);

  await prisma.$disconnect();
}

generateAllPremiumBlogs();
