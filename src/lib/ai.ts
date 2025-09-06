import { openai } from '@ai-sdk/openai';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

// AI-powered title generation
export async function generateBlogTitle(content: string, topic?: string) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Generate an engaging, SEO-optimized blog title for this content. 
               Topic: ${topic || 'Technology'}
               Content preview: ${content.substring(0, 500)}
               
               Requirements:
               - Maximum 60 characters for SEO
               - Include relevant keywords
               - Make it engaging and clickable
               - Professional tone for tech audience`,
    });
    
    return text.trim();
  } catch (error) {
    console.error('Error generating title:', error);
    return null;
  }
}

// AI-powered SEO meta description
export async function generateSEODescription(title: string, content: string) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Generate an SEO-optimized meta description for this blog post:
               Title: ${title}
               Content: ${content.substring(0, 1000)}
               
               Requirements:
               - Maximum 160 characters
               - Include main keywords
               - Compelling and descriptive
               - Call-to-action oriented`,
    });
    
    return text.trim();
  } catch (error) {
    console.error('Error generating SEO description:', error);
    return null;
  }
}

// AI-powered content improvement
export async function improveContent(content: string) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Improve this blog content for better readability, engagement, and SEO:
               
               ${content}
               
               Improvements needed:
               - Fix grammar and style
               - Improve readability
               - Add engaging transitions
               - Optimize for SEO keywords
               - Maintain professional tone
               - Keep the same length approximately`,
    });
    
    return text.trim();
  } catch (error) {
    console.error('Error improving content:', error);
    return null;
  }
}

// AI-powered tag generation
export async function generateTags(title: string, content: string) {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        tags: z.array(z.string()).max(8),
        category: z.string(),
      }),
      prompt: `Analyze this blog post and generate relevant tags and category:
               Title: ${title}
               Content: ${content.substring(0, 1000)}
               
               Generate:
               - 5-8 relevant tags (single words or short phrases)
               - 1 main category
               
               Focus on: Innovation Insights, Breaking News, Artificial Intelligence, Emerging Technologies, Business Strategy, Startup Ecosystem, Research & Analysis, Global Impact, Sustainability, Tools & Resources`,
    });
    
    return object;
  } catch (error) {
    console.error('Error generating tags:', error);
    return { tags: [], category: 'Innovation Insights' };
  }
}

// AI-powered related posts
export async function findRelatedPosts(postId: string, title: string, tags: string[]) {
  // This would use vector embeddings in a real implementation
  // For now, we'll use a simple tag-based matching
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        relatedTopics: z.array(z.string()).max(5),
        searchKeywords: z.array(z.string()).max(10),
      }),
      prompt: `Based on this blog post, suggest related topics and search keywords:
               Title: ${title}
               Tags: ${tags.join(', ')}
               
               Generate:
               - 5 related topics someone might want to read about
               - 10 search keywords for finding similar content`,
    });
    
    return object;
  } catch (error) {
    console.error('Error finding related posts:', error);
    return { relatedTopics: [], searchKeywords: [] };
  }
}

// AI-powered content summary
export async function generateSummary(content: string, maxLength: number = 200) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Create a compelling summary of this blog post:
               
               ${content}
               
               Requirements:
               - Maximum ${maxLength} characters
               - Highlight key points
               - Engaging and informative
               - Professional tone`,
    });
    
    return text.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    return null;
  }
}

// Calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readingTime);
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Website Builder AI Functions

interface WebsiteRequirements {
  businessType: string;
  websiteType: string;
  industry: string;
  targetAudience: string;
  features: string[];
  colorScheme: string;
  designStyle: string;
  businessName: string;
  description: string;
  additionalContent?: string;
}

interface GeneratedWebsite {
  html: string;
  css: string;
  js: string;
  structure: {
    sections: Array<{
      id: string;
      type: string;
      title: string;
      content: string;
    }>;
    navigation: string[];
    colorPalette: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
  };
}

interface NextJSWebsite {
  pages: {
    index: string;
    about?: string;
    contact?: string;
    services?: string;
  };
  components: {
    Header: string;
    Footer: string;
    Hero: string;
    About: string;
    Services: string;
    Contact: string;
    Navigation: string;
  };
  styles: {
    globals: string;
    components: string;
  };
  config: {
    packageJson: string;
    nextConfig: string;
    tailwindConfig?: string;
  };
  structure: {
    sections: Array<{
      id: string;
      type: string;
      title: string;
      content: string;
    }>;
    navigation: string[];
    colorPalette: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
  };
}

// Generate complete Next.js website
export async function generateNextJSWebsite(requirements: WebsiteRequirements): Promise<NextJSWebsite | null> {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        pages: z.object({
          index: z.string(),
          about: z.string().optional(),
          contact: z.string().optional(),
          services: z.string().optional()
        }),
        components: z.object({
          Header: z.string(),
          Footer: z.string(),
          Hero: z.string(),
          About: z.string(),
          Services: z.string(),
          Contact: z.string(),
          Navigation: z.string()
        }),
        styles: z.object({
          globals: z.string(),
          components: z.string()
        }),
        config: z.object({
          packageJson: z.string(),
          nextConfig: z.string(),
          tailwindConfig: z.string().optional()
        }),
        structure: z.object({
          sections: z.array(z.object({
            id: z.string(),
            type: z.string(),
            title: z.string(),
            content: z.string()
          })),
          navigation: z.array(z.string()),
          colorPalette: z.object({
            primary: z.string(),
            secondary: z.string(),
            accent: z.string(),
            background: z.string(),
            text: z.string()
          })
        })
      }),
      prompt: `Generate a complete Next.js application based on these requirements:

Business Name: ${requirements.businessName}
Business Type: ${requirements.businessType}
Website Type: ${requirements.websiteType}
Industry: ${requirements.industry}
Target Audience: ${requirements.targetAudience}
Features: ${requirements.features.join(', ')}
Color Scheme: ${requirements.colorScheme}
Design Style: ${requirements.designStyle}
Description: ${requirements.description}
Additional Content: ${requirements.additionalContent || 'None'}

Requirements:
1. Generate Next.js 14+ compatible code with App Router
2. Create reusable React components with TypeScript
3. Use Tailwind CSS for styling
4. Include proper TypeScript interfaces
5. Add responsive design with mobile-first approach
6. Include all requested features as interactive components
7. Make it SEO-friendly with proper meta tags
8. Ensure accessibility (ARIA labels, semantic HTML)
9. Use the specified color scheme and design style
10. Include engaging content relevant to the business
11. Add unique element IDs for easy targeting
12. Include proper error handling and loading states

Generate:
- pages/index.tsx (main homepage)
- pages/about.tsx (if needed)
- pages/contact.tsx (if needed)
- pages/services.tsx (if needed)
- components/Header.tsx
- components/Footer.tsx
- components/Hero.tsx
- components/About.tsx
- components/Services.tsx
- components/Contact.tsx
- components/Navigation.tsx
- styles/globals.css
- styles/components.css
- package.json (with all necessary dependencies)
- next.config.js
- tailwind.config.js

The website should be production-ready and visually appealing. Include hero section, about section, services/features, contact section, and footer. Make sure all elements have unique IDs for comment targeting.`
    });
    
    return object;
  } catch (error) {
    console.error('Error generating Next.js website:', error);
    return null;
  }
}

// Generate complete website (legacy - static HTML/CSS/JS)
export async function generateWebsite(requirements: WebsiteRequirements): Promise<GeneratedWebsite | null> {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        html: z.string(),
        css: z.string(),
        js: z.string(),
        structure: z.object({
          sections: z.array(z.object({
            id: z.string(),
            type: z.string(),
            title: z.string(),
            content: z.string()
          })),
          navigation: z.array(z.string()),
          colorPalette: z.object({
            primary: z.string(),
            secondary: z.string(),
            accent: z.string(),
            background: z.string(),
            text: z.string()
          })
        })
      }),
      prompt: `Generate a complete, modern, responsive website based on these requirements:

Business Name: ${requirements.businessName}
Business Type: ${requirements.businessType}
Website Type: ${requirements.websiteType}
Industry: ${requirements.industry}
Target Audience: ${requirements.targetAudience}
Features: ${requirements.features.join(', ')}
Color Scheme: ${requirements.colorScheme}
Design Style: ${requirements.designStyle}
Description: ${requirements.description}
Additional Content: ${requirements.additionalContent || 'None'}

Requirements:
1. Generate clean, semantic HTML5 with proper structure
2. Create modern, responsive CSS with mobile-first approach
3. Include interactive JavaScript for dynamic features
4. Use modern design principles and best practices
5. Include all requested features
6. Make it SEO-friendly with proper meta tags
7. Ensure accessibility (ARIA labels, semantic HTML)
8. Use the specified color scheme and design style
9. Include engaging content relevant to the business
10. Add unique element IDs for easy targeting

The website should be production-ready and visually appealing. Include hero section, about section, services/features, contact section, and footer. Make sure all elements have unique IDs for comment targeting.`
    });
    
    return object;
  } catch (error) {
    console.error('Error generating website:', error);
    return null;
  }
}

// Modify website based on comment
export async function modifyWebsiteElement(
  currentHtml: string,
  currentCss: string,
  elementId: string,
  elementType: string,
  requestedChange: string,
  comment: string
): Promise<{ html: string; css: string; js?: string } | null> {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        html: z.string(),
        css: z.string(),
        js: z.string().optional(),
        changelog: z.string()
      }),
      prompt: `Modify the website based on this user feedback:

Current HTML:
${currentHtml}

Current CSS:
${currentCss}

Element to modify: ${elementId} (${elementType})
User comment: ${comment}
Requested change: ${requestedChange}

Requirements:
1. Make the requested changes while maintaining the overall design
2. Keep all other elements unchanged
3. Ensure the changes are visually consistent
4. Maintain responsive design
5. Update only the necessary HTML and CSS
6. Provide a brief changelog of what was modified

Return the complete updated HTML and CSS with the modifications applied.`
    });
    
    return object;
  } catch (error) {
    console.error('Error modifying website element:', error);
    return null;
  }
}

// Generate website content suggestions
export async function generateContentSuggestions(
  businessType: string,
  industry: string,
  targetAudience: string
): Promise<string[] | null> {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        suggestions: z.array(z.string()).max(10)
      }),
      prompt: `Generate content suggestions for a ${businessType} in the ${industry} industry targeting ${targetAudience}.

Provide 8-10 specific content suggestions that would be valuable for this business website, such as:
- Service descriptions
- About us content
- Call-to-action text
- Feature highlights
- Testimonial examples
- FAQ topics
- Blog post ideas

Make them specific and relevant to the business type and industry.`
    });
    
    return object.suggestions;
  } catch (error) {
    console.error('Error generating content suggestions:', error);
    return null;
  }
}

// Analyze website performance and suggest improvements
export async function analyzeWebsitePerformance(
  html: string,
  css: string
): Promise<{ score: number; suggestions: string[] } | null> {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        score: z.number().min(0).max(100),
        suggestions: z.array(z.string()).max(8)
      }),
      prompt: `Analyze this website code for performance, SEO, and user experience:

HTML:
${html.substring(0, 2000)}...

CSS:
${css.substring(0, 2000)}...

Provide:
1. A performance score (0-100)
2. Up to 8 specific improvement suggestions

Focus on:
- Loading speed optimization
- SEO best practices
- Mobile responsiveness
- Accessibility
- User experience
- Code quality
- Security considerations`
    });
    
    return object;
  } catch (error) {
    console.error('Error analyzing website performance:', error);
    return null;
  }
}

// Generate SEO meta tags for website
export async function generateWebsiteSEO(
  businessName: string,
  description: string,
  industry: string,
  keywords: string[]
): Promise<{ title: string; description: string; keywords: string } | null> {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.string()
      }),
      prompt: `Generate SEO meta tags for this website:

Business Name: ${businessName}
Description: ${description}
Industry: ${industry}
Target Keywords: ${keywords.join(', ')}

Generate:
1. SEO-optimized title tag (50-60 characters)
2. Meta description (150-160 characters)
3. Comma-separated keywords string

Focus on search intent and local SEO if applicable.`
    });
    
    return object;
  } catch (error) {
    console.error('Error generating website SEO:', error);
    return null;
  }
}
