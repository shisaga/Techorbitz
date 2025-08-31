import OpenAI from 'openai';
import { NewsAPI } from 'newsapi';

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
}

class AIBlogGenerator {
  private openai: OpenAI;
  private newsapi: NewsAPI;
  private stabilityApiKey: string;
  private pexelsApiKey: string;
  private wpBaseUrl: string;
  private wpUser: string;
  private wpAppPassword: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.newsapi = new NewsAPI(process.env.NEWSAPI_KEY!);
    this.stabilityApiKey = process.env.STABILITY_API_KEY!;
    this.pexelsApiKey = process.env.PEXELS_API_KEY!;
    this.wpBaseUrl = process.env.WP_BASE_URL!;
    this.wpUser = process.env.WP_USER!;
    this.wpAppPassword = process.env.WP_APP_PASSWORD!;
  }

  async getTrendingTopics(): Promise<TrendingTopic[]> {
    try {
      // Get trending tech news
      const response = await this.newsapi.v2.topHeadlines({
        category: 'technology',
        language: 'en',
        country: 'us',
        pageSize: 10,
      });

      const topics: TrendingTopic[] = response.articles
        .filter(article => article.title && article.description)
        .slice(0, 5)
        .map(article => ({
          title: article.title!,
          description: article.description!,
          url: article.url,
          keywords: this.extractKeywords(article.title! + ' ' + article.description!),
        }));

      return topics;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      // Fallback topics if NewsAPI fails
      return [
        {
          title: 'The Future of AI in Web Development',
          description: 'How artificial intelligence is transforming web development practices',
          keywords: ['AI', 'web development', 'automation', 'technology'],
        },
        {
          title: 'Mobile-First Design Strategies',
          description: 'Best practices for creating mobile-optimized user experiences',
          keywords: ['mobile design', 'UX', 'responsive design', 'user experience'],
        },
      ];
    }
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - in production, you might want to use a more sophisticated approach
    const commonTechKeywords = [
      'AI', 'machine learning', 'web development', 'mobile apps', 'cloud computing',
      'cybersecurity', 'blockchain', 'IoT', 'data science', 'automation',
      'user experience', 'design', 'technology', 'innovation', 'digital transformation'
    ];

    const foundKeywords = commonTechKeywords.filter(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );

    return foundKeywords.slice(0, 5);
  }

  async generateBlogPost(topic: TrendingTopic): Promise<BlogPost> {
    const systemPrompt = `You are an expert SEO content writer and editor. Generate HTML content for WordPress. Return a JSON object with the following structure:
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "description": "150-160 character meta description",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "tags": ["tag1", "tag2", "tag3"],
  "content": "<h1>Title</h1><p>TL;DR: Brief summary in 2 lines</p><h2>Introduction</h2><p>Content...</p><h2>Main Section</h2><p>Content with <a href='external-url'>external links</a> and <a href='${this.wpBaseUrl}'>internal link to homepage</a>...</p><h3>Subsection</h3><ul><li>Bullet point 1</li><li>Bullet point 2</li></ul><h2>Conclusion</h2><p>Clear conclusion with call-to-action</p>"
}

Write a 1500–1800 word article with H1, H2, H3, bullet lists where helpful, and a clear conclusion with a one-line call-to-action. Include 2 external links to reputable sources and one internal link to our homepage. Provide a short 150–160 character meta description and a list of 8–12 SEO keywords. Tone: professional and helpful. If you are unsure about a fact, write "source unavailable" instead of inventing one.`;

    const userPrompt = `Topic: ${topic.title}
Source URL (if any): ${topic.url || 'N/A'}
Keywords to emphasize: ${topic.keywords.join(', ')}

Generate the blog post in HTML format for WordPress. Return only valid JSON with the structure specified in the system prompt.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from OpenAI');
      }

      // Parse the JSON response
      const parsedPost = this.parseJsonResponse(content);
      
      return {
        title: parsedPost.title,
        slug: parsedPost.slug,
        content: parsedPost.content,
        metaDescription: parsedPost.description,
        keywords: parsedPost.keywords,
        heroImage: '', // Will be generated separately
        heroImageAlt: '',
        publishedAt: new Date().toISOString(),
        tags: parsedPost.tags,
        canonicalUrl: `${this.wpBaseUrl}/blog/${parsedPost.slug}`,
      };
    } catch (error) {
      console.error('Error generating blog post:', error);
      throw error;
    }
  }

  private parseJsonResponse(content: string) {
    try {
      // Try to parse as JSON directly
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        return {
          title: jsonData.title || 'Untitled',
          slug: jsonData.slug || this.generateSlug(jsonData.title || 'untitled'),
          description: jsonData.description || '',
          keywords: Array.isArray(jsonData.keywords) ? jsonData.keywords : ['technology'],
          tags: Array.isArray(jsonData.tags) ? jsonData.tags : ['technology'],
          content: jsonData.content || '',
        };
      }
      
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      // Fallback to basic parsing
      return {
        title: 'Generated Blog Post',
        slug: this.generateSlug('generated-blog-post'),
        description: 'AI-generated blog post about technology trends.',
        keywords: ['technology', 'AI', 'innovation'],
        tags: ['technology'],
        content: '<h1>Generated Blog Post</h1><p>Content generation failed. Please try again.</p>',
      };
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async generateHeroImage(title: string): Promise<{ imageUrl: string; altText: string }> {
    const imagePrompt = `Create a wide hero banner image for a blog titled "${title}". Style: modern flat/vector OR photo-realistic if topic is non-technical; keep composition simple with a clear focal point and a space suitable for a text overlay. Size ratio about 2:1 (e.g., 2048x1024). Keep images brand-friendly and not copyright-infringing.`;

    try {
      // Try Stable Diffusion first
      if (this.stabilityApiKey) {
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.stabilityApiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: imagePrompt,
                weight: 1,
              },
            ],
            cfg_scale: 7,
            height: 1024,
            width: 2048,
            samples: 1,
            steps: 30,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = `data:image/png;base64,${data.artifacts[0].base64}`;
          return {
            imageUrl,
            altText: `Hero image for blog post: ${title}`,
          };
        }
      }

      // Fallback to Pexels for free stock images
      if (this.pexelsApiKey) {
        const searchResponse = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(title)}&per_page=1`,
          {
            headers: {
              'Authorization': this.pexelsApiKey,
            },
          }
        );

        if (searchResponse.ok) {
          const data = await searchResponse.json();
          if (data.photos && data.photos.length > 0) {
            return {
              imageUrl: data.photos[0].src.large,
              altText: data.photos[0].alt || `Hero image for blog post: ${title}`,
            };
          }
        }
      }

      // Final fallback - return a placeholder
      return {
        imageUrl: 'https://via.placeholder.com/2048x1024/4F46E5/FFFFFF?text=Blog+Hero+Image',
        altText: `Placeholder hero image for blog post: ${title}`,
      };
    } catch (error) {
      console.error('Error generating hero image:', error);
      return {
        imageUrl: 'https://via.placeholder.com/2048x1024/4F46E5/FFFFFF?text=Blog+Hero+Image',
        altText: `Placeholder hero image for blog post: ${title}`,
      };
    }
  }

  async publishToWordPress(post: BlogPost): Promise<boolean> {
    try {
      const auth = Buffer.from(`${this.wpUser}:${this.wpAppPassword}`).toString('base64');

      const response = await fetch(`${this.wpBaseUrl}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          status: 'publish',
          slug: post.slug,
          excerpt: post.metaDescription,
          categories: [], // You can add category IDs here
          tags: post.tags,
          meta: {
            _yoast_wpseo_metadesc: post.metaDescription,
            _yoast_wpseo_focuskw: post.keywords.join(', '),
            _yoast_wpseo_meta-robots-noindex: '0',
            _yoast_wpseo_meta-robots-nofollow: '0',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
      }

      const publishedPost = await response.json();
      console.log(`Successfully published post: ${publishedPost.link}`);

      // Upload hero image if we have one
      if (post.heroImage && post.heroImage !== '') {
        await this.uploadHeroImage(publishedPost.id, post.heroImage, post.heroImageAlt);
      }

      return true;
    } catch (error) {
      console.error('Error publishing to WordPress:', error);
      return false;
    }
  }

  private async uploadHeroImage(postId: number, imageUrl: string, altText: string): Promise<void> {
    try {
      const auth = Buffer.from(`${this.wpUser}:${this.wpAppPassword}`).toString('base64');

      // Download the image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      // Upload to WordPress media library
      const uploadResponse = await fetch(`${this.wpBaseUrl}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Disposition': 'attachment; filename=hero-image.jpg',
        },
        body: imageBuffer,
      });

      if (uploadResponse.ok) {
        const media = await uploadResponse.json();

        // Set as featured image
        await fetch(`${this.wpBaseUrl}/wp-json/wp/v2/posts/${postId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
          },
          body: JSON.stringify({
            featured_media: media.id,
          }),
        });
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
    }
  }

  async generateAndPublishPosts(count: number = 2): Promise<BlogPost[]> {
    const publishedPosts: BlogPost[] = [];

    try {
      // Get trending topics
      const topics = await this.getTrendingTopics();
      
      // Generate and publish posts
      for (let i = 0; i < Math.min(count, topics.length); i++) {
        const topic = topics[i];
        
        console.log(`Generating blog post for topic: ${topic.title}`);
        
        // Generate blog content
        const post = await this.generateBlogPost(topic);
        
        // Generate hero image
        const { imageUrl, altText } = await this.generateHeroImage(post.title);
        post.heroImage = imageUrl;
        post.heroImageAlt = altText;
        
        // Publish to WordPress
        const published = await this.publishToWordPress(post);
        
        if (published) {
          publishedPosts.push(post);
          console.log(`Successfully published: ${post.title}`);
        } else {
          console.error(`Failed to publish: ${post.title}`);
        }
        
        // Add delay between posts to avoid rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    } catch (error) {
      console.error('Error in generateAndPublishPosts:', error);
    }

    return publishedPosts;
  }
}

export default AIBlogGenerator;
