#!/usr/bin/env node

/**
 * Add Cover Image to iPhone Blog Post
 * Adds a cover image to the blog post for better visual appeal
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCoverImage() {
  try {
    console.log('🚀 Adding cover image to iPhone blog post...');

    const slug = "iphone-16-vs-iphone-17-is-there-really-a-difference-iphone-16-owners-dont-rush";
    
    // Find the existing blog post
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (!existingPost) {
      console.error('❌ Blog post not found with slug:', slug);
      return;
    }

    console.log('📝 Found existing blog post:', existingPost.title);

    // Add cover image
    const coverImage = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=630&fit=crop&crop=center";

    // Update the blog post with cover image
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        coverImage: coverImage,
        updatedAt: new Date()
      }
    });

    console.log(`✅ Successfully added cover image to iPhone blog post:`);
    console.log(`   Title: ${updatedPost.title}`);
    console.log(`   Slug: ${updatedPost.slug}`);
    console.log(`   URL: https://techxak.com/blog/${updatedPost.slug}`);
    console.log(`   Cover Image: ${coverImage}`);
    console.log(`   Updated: ${updatedPost.updatedAt}`);

  } catch (error) {
    console.error('❌ Error adding cover image:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addCoverImage();
