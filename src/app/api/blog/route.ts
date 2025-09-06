import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCacheHeaders } from './cache';
// Temporary local functions until AI is configured
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/blog - Fetch blog posts with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const techOnly = searchParams.get('techOnly') === 'true';

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    };

    if (category) {
      // For MongoDB, we'll search in categoryIds array
      const categoryDoc = await prisma.category.findUnique({
        where: { slug: category }
      });
      if (categoryDoc) {
        where.categoryIds = { has: categoryDoc.id };
      }
    }

    if (tag) {
      // For MongoDB, we'll search in tagIds array
      const tagDoc = await prisma.tag.findUnique({
        where: { slug: tag }
      });
      if (tagDoc) {
        where.tagIds = { has: tagDoc.id };
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Tech-only filter for main front page
    if (techOnly) {
      // Get tech-related category IDs
      const techCategories = await prisma.category.findMany({
        where: {
          slug: {
            in: [
              'innovation-insights',
              'digital-transformation', 
              'software-engineering',
              'web-development',
              'artificial-intelligence',
              'emerging-technologies',
              'business-strategy',
              'startup-ecosystem',
              'research-analysis',
              'case-studies',
              'tools-resources',
              'tutorials-guides'
            ]
          }
        },
        select: { id: true }
      });

      const techCategoryIds = techCategories.map(cat => cat.id);
      
      if (techCategoryIds.length > 0) {
        where.categoryIds = { hasSome: techCategoryIds };
      }
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, avatar: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    const hasMore = skip + limit < totalCount;

    const response = NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore
      }
    });

    // Add cache headers
    const cacheHeaders = getCacheHeaders('blogList');
    Object.entries(cacheHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, authorId, categoryIds, tagNames, coverImage, status = 'DRAFT' } = body;

    // Generate slug
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    // Use provided SEO description or excerpt
    const seoDescription = excerpt || title;

    // Use provided tags
    const tags = tagNames || [];
    let category = null;

    // Create or find tags
    const tagObjects = await Promise.all(
      tags.map(async (tagName: string) => {
        const tagSlug = generateSlug(tagName);
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: {
            name: tagName,
            slug: tagSlug
          }
        });
      })
    );

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || seoDescription,
        seoDescription,
        readingTime,
        coverImage,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId,
        categoryIds: categoryIds || [],
        tagIds: tagObjects.map(tag => tag.id)
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
