#!/usr/bin/env node

/**
 * Check Blog Content Script
 * Check what content is actually stored in the database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBlogContent() {
  try {
    console.log('🔍 Checking iPhone blog post content...');

    const slug = "iphone-16-vs-iphone-17-is-there-really-a-difference-iphone-16-owners-dont-rush";
    
    // Find the existing blog post
    const post = await prisma.post.findUnique({
      where: { slug }
    });

    if (!post) {
      console.error('❌ Blog post not found with slug:', slug);
      return;
    }

    console.log('📝 Blog post found:');
    console.log(`   Title: ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Status: ${post.status}`);
    console.log(`   Updated: ${post.updatedAt}`);
    console.log(`   Cover Image: ${post.coverImage || 'None'}`);
    console.log(`   Content length: ${post.content.length} characters`);
    console.log(`   Content preview (first 200 chars): ${post.content.substring(0, 200)}...`);
    
    // Check if content contains HTML or markdown
    if (post.content.includes('<h1>') || post.content.includes('<div')) {
      console.log('✅ Content appears to be HTML format');
    } else if (post.content.includes('##') || post.content.includes('**')) {
      console.log('❌ Content is still in markdown format');
    } else {
      console.log('❓ Content format unclear');
    }

  } catch (error) {
    console.error('❌ Error checking blog content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkBlogContent();
