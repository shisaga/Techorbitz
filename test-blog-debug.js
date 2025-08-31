const { AIBlogGenerator } = require('./src/lib/ai-blog-generator.ts');

async function testBlogGeneration() {
  console.log('🧪 Testing AI Blog Generator directly...\n');
  
  try {
    const generator = new AIBlogGenerator();
    
    console.log('1. Testing trending topics...');
    const topics = await generator.getTrendingTopics();
    console.log(`Found ${topics.length} trending topics:`);
    topics.slice(0, 5).forEach((topic, i) => {
      console.log(`   ${i + 1}. ${topic.title} (${topic.source})`);
    });
    
    if (topics.length === 0) {
      console.log('❌ No trending topics found');
      return;
    }
    
    console.log('\n2. Testing blog post generation...');
    const blogPost = await generator.generateBlogPost(topics[0]);
    console.log('✅ Blog post generated successfully!');
    console.log(`Title: ${blogPost.title}`);
    console.log(`Content length: ${blogPost.content.length} characters`);
    console.log(`Hero image: ${blogPost.heroImage}`);
    
    console.log('\n3. Testing publishing...');
    const publishedPost = await generator.publishToMongoDB(blogPost);
    console.log('✅ Blog post published successfully!');
    console.log(`Published ID: ${publishedPost.id}`);
    console.log(`Published URL: ${publishedPost.url}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testBlogGeneration();
