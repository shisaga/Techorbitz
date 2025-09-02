const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI blog topics
const aiBlogTopics = [
  {
    title: "Top 10 Free AI Tools You Should Be Using in 2025",
    category: "AI Tools",
    keywords: ["free AI tools", "AI software", "productivity tools", "2025"]
  },
  {
    title: "ChatGPT vs Claude: Which AI Writer Is Better in 2025?",
    category: "AI Comparison",
    keywords: ["ChatGPT", "Claude", "AI comparison", "writing tools", "2025"]
  },
  {
    title: "How to Use AI Tools to Automate Your Blog Writing",
    category: "Content Creation",
    keywords: ["AI writing", "blog automation", "content creation", "productivity"]
  }
];

async function generateImageWithPexels(prompt) {
  try {
    console.log(`🎨 Generating image with Pexels API...`);
    
    const pexelsApiKey = process.env.PEXELS_API_KEY;
    if (!pexelsApiKey) {
      throw new Error('PEXELS_API_KEY not found');
    }

    // Extract keywords from prompt
    const searchTerms = prompt.toLowerCase()
      .replace(/create a|stunning|modern|hero|banner|image|for|a|blog|titled|style|professional|high-quality|design|with|vibrant|colors|typography|visual|elements|that|represent|ai|and|technology|include|space|text|overlay|aspect|ratio|make|visually|striking|brand-friendly/g, '')
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
      
      console.log(`✅ Pexels image found: ${imageUrl}`);
      return imageUrl;
    } else {
      throw new Error('No images found in Pexels');
    }

  } catch (error) {
    console.error(`❌ Pexels API failed: ${error.message}`);
    
    // Fallback to static images
    const fallbackImages = [
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
      'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg'
    ];
    
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

function extractJsonFromResponse(response) {
  try {
    let cleanedResponse = response.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.log('Failed to parse JSON, trying to extract manually...');
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

async function generateAIBlogPost(topic) {
  try {
    console.log(`🎯 Generating AI Blog: ${topic.title}`);

    const systemPrompt = `You are an expert SEO content writer and AI technology specialist. Create a comprehensive blog post about ${topic.title}.

Return ONLY a JSON object with this exact structure (no markdown formatting, no code blocks):
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "description": "150-160 character meta description",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "content": "Premium HTML content with advanced structure and styling"
}

CONTENT REQUIREMENTS:
- 2000-2500 words of high-quality, engaging content
- Use proper H1, H2, H3 headings
- Include table of contents with anchor links
- Use short, scannable paragraphs
- Include bullet points and numbered lists
- Add FAQ section with 5-7 questions
- Include call-to-action sections
- Add external links to authoritative sources
- Focus on keywords: ${topic.keywords.join(', ')}
- Category: ${topic.category}
- Make content unique and actionable
- Professional yet conversational tone
- Include statistics and data where relevant

Return ONLY the JSON object, no other text`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a premium blog post about: ${topic.title}.` }
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
    
    // Generate cover image using Pexels only
    console.log('🖼️ Generating cover image...');
    const coverImagePrompt = `Create a stunning, modern hero banner image for a blog titled "${parsedPost.title}". Style: professional, high-quality design with vibrant colors, modern typography, and visual elements that represent AI and technology.`;
    const coverImage = await generateImageWithPexels(coverImagePrompt);
    
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

    // Create AI blog post
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
        readingTime: 12,
        seoTitle: parsedPost.title,
        seoDescription: parsedPost.description,
        coverImage: coverImage,
      }
    });

    console.log(`✅ Created AI Blog: ${parsedPost.title}`);
    console.log(`🖼️ Cover Image: ${coverImage.substring(0, 50)}...`);
    console.log(`📊 Word Count: ~${parsedPost.content.split(' ').length} words`);
    
    return blogPost;

  } catch (error) {
    console.error(`❌ Error: ${topic.title} - ${error.message}`);
    return null;
  }
}

async function generateAllAIBlogs() {
  console.log('🚀 Starting AI Blog Generation...');
  console.log(`📝 Total AI topics: ${aiBlogTopics.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < aiBlogTopics.length; i++) {
    const topic = aiBlogTopics[i];
    console.log(`\n📊 Progress: ${i + 1}/${aiBlogTopics.length}`);
    
    const result = await generateAIBlogPost(topic);
    
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }

    // Delay to avoid rate limits
    if (i < aiBlogTopics.length - 1) {
      console.log('⏳ Waiting 30 seconds...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }

  console.log(`\n🎉 AI Blog Generation Completed!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📊 Success rate: ${((successCount / aiBlogTopics.length) * 100).toFixed(1)}%`);

  await prisma.$disconnect();
}

generateAllAIBlogs();
