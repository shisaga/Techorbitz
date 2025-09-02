const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test with just one topic
const testTopic = {
  title: "Top 10 Free AI Tools You Should Be Using in 2025",
  category: "AI Tools",
  keywords: ["free AI tools", "AI software", "productivity tools", "2025"]
};

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

    console.log('Raw response:', content.substring(0, 200) + '...');

    const parsedPost = extractJsonFromResponse(content);
    if (!parsedPost) {
      throw new Error('Failed to parse JSON response');
    }
    
    console.log('✅ Successfully parsed JSON');
    console.log('Title:', parsedPost.title);
    console.log('Slug:', parsedPost.slug);
    
    // Get admin user
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

async function testSingleBlog() {
  console.log('🧪 Testing single blog post generation...');
  
  const result = await generateBlogPost(testTopic);
  
  if (result) {
    console.log('✅ Test successful!');
  } else {
    console.log('❌ Test failed!');
  }

  await prisma.$disconnect();
}

testSingleBlog();
