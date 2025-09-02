const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test with just one premium topic
const testTopic = {
  title: "Top 10 Free AI Tools That Will Transform Your Business in 2025",
  category: "AI Tools",
  keywords: ["free AI tools", "business automation", "productivity", "2025", "AI software"],
  description: "Discover the most powerful free AI tools that can revolutionize your business operations and boost productivity in 2025."
};

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

async function testPremiumBlogGeneration() {
  try {
    console.log('🧪 Testing Premium Blog Generation...');
    console.log(`🎯 Topic: ${testTopic.title}`);

    const systemPrompt = `You are an expert SEO content writer and digital marketing specialist. Create a premium, high-quality blog post about ${testTopic.title}.

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
- Focus on keywords: ${testTopic.keywords.join(', ')}
- Category: ${testTopic.category}
- Make content unique, valuable, and actionable
- Professional yet conversational tone
- Include statistics and data where relevant
- Add expert insights and tips
- End with strong conclusion and next steps

Return ONLY the JSON object, no other text`;

    console.log('📝 Generating content with OpenAI...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a premium blog post about: ${testTopic.title}. Focus on creating highly valuable, actionable content that readers will love and share.` }
      ],
      max_tokens: 4000,
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    console.log('✅ Content generated successfully');
    const parsedPost = extractJsonFromResponse(content);
    if (!parsedPost) {
      throw new Error('Failed to parse JSON response');
    }
    
    console.log(`📊 Content parsed: ${parsedPost.title}`);
    
    // Generate premium cover image
    console.log('🖼️ Generating premium cover image...');
    const coverImagePrompt = `Create a stunning, modern hero banner image for a premium blog titled "${parsedPost.title}". Style: professional, high-quality design with vibrant colors, modern typography, and visual elements that represent AI and technology. Include space for text overlay. Use a 16:9 aspect ratio. Make it visually striking and brand-friendly.`;
    const coverImage = await generateImageWithStability(coverImagePrompt, "16:9");
    
    // Generate premium card image
    console.log('🖼️ Generating premium card image...');
    const cardImagePrompt = `Create an eye-catching square social media card for a premium blog post about "${parsedPost.title}". Style: modern, professional design with bold colors, clean typography, and visual elements that represent AI and technology. Include icons and graphics. Use a 1:1 aspect ratio. Make it highly shareable and engaging.`;
    const cardImage = await generateImageWithStability(cardImagePrompt, "1:1");
    
    console.log('✅ Images generated successfully');
    console.log(`🖼️ Cover Image: ${coverImage.substring(0, 100)}...`);
    console.log(`🖼️ Card Image: ${cardImage.substring(0, 100)}...`);
    
    // Test database connection
    console.log('🗄️ Testing database connection...');
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@techxak.com' }
    });

    if (!adminUser) {
      console.log('Creating admin user...');
      await prisma.user.create({
        data: {
          email: 'admin@techxak.com',
          name: 'TechXak Admin',
          role: 'ADMIN'
        }
      });
    }

    console.log('✅ Database connection successful');
    console.log('✅ All components working correctly!');
    console.log('🚀 Ready to run full premium blog generation!');

  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

testPremiumBlogGeneration();
