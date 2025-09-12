#!/usr/bin/env node

/**
 * Force Cache Refresh Script
 * Updates the blog post to force cache refresh
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function forceCacheRefresh() {
  try {
    console.log('🔄 Forcing cache refresh for iPhone blog post...');

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

    // Force update by updating the updatedAt timestamp
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        updatedAt: new Date()
      }
    });

    console.log(`✅ Successfully forced cache refresh:`);
    console.log(`   Title: ${updatedPost.title}`);
    console.log(`   Slug: ${updatedPost.slug}`);
    console.log(`   URL: https://techxak.com/blog/${updatedPost.slug}`);
    console.log(`   Updated: ${updatedPost.updatedAt}`);
    console.log(`   Content length: ${updatedPost.content.length} characters`);
    console.log(`   Content format: ${updatedPost.content.includes('<div') ? 'HTML' : 'Markdown'}`);

    // Also try to trigger a revalidation by making a request to the page
    console.log('\n🌐 Attempting to trigger page revalidation...');
    
    const https = require('https');
    const url = `https://techxak.com/blog/${slug}`;
    
    https.get(url, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
      console.log('✅ Page revalidation triggered');
    }).on('error', (err) => {
      console.log(`❌ Error triggering revalidation: ${err.message}`);
    });

  } catch (error) {
    console.error('❌ Error forcing cache refresh:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
forceCacheRefresh();
