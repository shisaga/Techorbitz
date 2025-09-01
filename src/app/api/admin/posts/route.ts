import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/posts - Fetch all posts for admin (including drafts)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const authorId = searchParams.get('authorId');

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, avatar: true, email: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    // Get categories and tags for each post
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const categories = await prisma.category.findMany({
          where: { id: { in: post.categoryIds } }
        });

        const tags = await prisma.tag.findMany({
          where: { id: { in: post.tagIds } }
        });

        return {
          ...post,
          categories,
          tags
        };
      })
    );

    return NextResponse.json({
      posts: postsWithDetails,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      content, 
      excerpt, 
      authorId, 
      category,
      categoryIds = [], 
      tagNames = [], 
      coverImage, 
      showcaseImage,
      status = 'DRAFT',
      seoTitle,
      seoDescription 
    } = body;

    // Generate slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate reading time
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    // Handle category
    let finalCategoryIds = categoryIds;
    if (category && typeof category === 'string') {
      // If category is a slug (contains hyphens), find by slug, otherwise create by name
      if (category.includes('-')) {
        const categoryObj = await prisma.category.findUnique({
          where: { slug: category }
        });
        if (categoryObj) {
          finalCategoryIds = [categoryObj.id];
        } else {
          // If not found by slug, create new category
          const newCategoryObj = await prisma.category.create({
            data: {
              name: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              slug: category
            }
          });
          finalCategoryIds = [newCategoryObj.id];
        }
      } else {
        // Category is a name, create slug and upsert
        const categorySlug = category
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const categoryObj = await prisma.category.upsert({
          where: { slug: categorySlug },
          update: {},
          create: {
            name: category,
            slug: categorySlug
          }
        });
        
        finalCategoryIds = [categoryObj.id];
      }
    }

    // Create or find tags
    const tagObjects = await Promise.all(
      tagNames.map(async (tagName: string) => {
        const tagSlug = tagName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
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

    // Get or create admin user if no authorId provided
    let finalAuthorId = authorId;
    if (!authorId || authorId === '1' || authorId === '507f1f77bcf86cd799439011') {
      const adminUser = await prisma.user.upsert({
        where: { email: 'admin@techonigx.com' },
        update: {},
        create: {
          name: 'TechOnigx Admin',
          email: 'admin@techonigx.com',
          role: 'ADMIN',
          isVerified: true,
          bio: 'Administrator of TechOnigx platform'
        }
      });
      finalAuthorId = adminUser.id;
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || seoDescription || title,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt || title,
        readingTime,
        coverImage,
        showcaseImage,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: finalAuthorId,
        categoryIds: finalCategoryIds,
        tagIds: tagObjects.map(tag => tag.id)
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, email: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
