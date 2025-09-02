const https = require('https');

async function testTrendingTopics() {
  console.log('🧪 Testing Trending Topics API...\n');
  
  try {
    // Test the trending topics endpoint
    const response = await fetch('http://localhost:3000/api/blog/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        count: 1,
        testMode: true 
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Trending topics API working!');
      console.log('📊 Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Trending topics API failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testTrendingTopics();
