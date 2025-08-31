const { AIBlogGenerator } = require('./src/lib/ai-blog-generator.ts');

async function testTrendingTopics() {
  console.log('🧪 Testing Trending Topics...\n');
  
  try {
    const generator = new AIBlogGenerator();
    
    console.log('1. Testing getTrendingTopics...');
    const topics = await generator.getTrendingTopics();
    console.log(`Found ${topics.length} trending topics:`);
    
    if (topics.length === 0) {
      console.log('❌ No trending topics found');
      console.log('This explains why no blog posts are being generated');
      return;
    }
    
    topics.slice(0, 5).forEach((topic, i) => {
      console.log(`   ${i + 1}. ${topic.title} (${topic.source})`);
    });
    
    console.log('\n2. Testing first topic for duplicate check...');
    const firstTopic = topics[0];
    const isDuplicate = await generator.checkTopicExists(firstTopic.title);
    console.log(`Topic "${firstTopic.title}" is duplicate: ${isDuplicate}`);
    
    if (!isDuplicate) {
      console.log('\n3. Testing blog post generation...');
      const blogPost = await generator.generateBlogPost(firstTopic);
      console.log('✅ Blog post generated successfully!');
      console.log(`Title: ${blogPost.title}`);
      console.log(`Content length: ${blogPost.content.length} characters`);
      console.log(`Hero image: ${blogPost.heroImage}`);
    } else {
      console.log('❌ Topic is duplicate, skipping generation');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testTrendingTopics();
