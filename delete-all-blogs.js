const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAllBlogPosts() {
  try {
    console.log('🗑️ Starting deletion of all blog posts...');
    
    // Count existing posts
    const postCount = await prisma.post.count();
    console.log(`📊 Found ${postCount} posts to delete`);
    
    if (postCount === 0) {
      console.log('ℹ️ No posts found to delete');
      return;
    }
    
    // Delete all posts
    const result = await prisma.post.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.count} posts from database`);
    console.log('🎉 All blog posts have been removed');
    
  } catch (error) {
    console.error('❌ Error deleting posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllBlogPosts();
