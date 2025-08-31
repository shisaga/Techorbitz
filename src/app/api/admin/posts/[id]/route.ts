import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/admin/posts/[id] - Fetch single post for admin
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const { id } = params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, email: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get categories and tags
    const categories = await prisma.category.findMany({
      where: { id: { in: post.categoryIds } }
    });

    const tags = await prisma.tag.findMany({
      where: { id: { in: post.tagIds } }
    });

    return NextResponse.json({
      ...post,
      categories,
      tags
    });

  } catch (error) {
    console.error('Error fetching admin post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts/[id] - Update post
export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const { 
      title, 
      content, 
      excerpt, 
      category, 
      categoryIds = [], 
      tagNames = [], 
      coverImage, 
      showcaseImage,
      status,
      seoTitle,
      seoDescription 
    } = body;

    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
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

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || seoDescription || title,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt || title,
        readingTime,
        coverImage,
        showcaseImage,
        status,
        publishedAt: status === 'PUBLISHED' && !existingPost.publishedAt ? new Date() : existingPost.publishedAt,
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

    return NextResponse.json(updatedPost);

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts/[id] - Delete post
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const { id } = params;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
