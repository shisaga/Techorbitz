#!/usr/bin/env node

/**
 * Test script for AI Blog Generator
 * Run with: node scripts/test-blog-generator.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: new URL(url).hostname,
      port: new URL(url).port || (isHttps ? 443 : 80),
      path: new URL(url).pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testBlogGenerator() {
  console.log('🧪 Testing AI Blog Generator...\n');

  try {
    // Test 1: Check API status
    console.log('1. Testing API status...');
    const statusResponse = await makeRequest(`${BASE_URL}/api/blog/generate`);
    
    if (statusResponse.status === 200) {
      console.log('✅ API status check passed');
    } else {
      console.log('❌ API status check failed:', statusResponse.status);
      return;
    }

    // Test 2: Generate 1 test post
    console.log('\n2. Generating test blog post...');
    const generateResponse = await makeRequest(`${BASE_URL}/api/blog/generate`, {
      method: 'POST',
      body: JSON.stringify({ count: 1 }),
    });

    if (generateResponse.status === 200) {
      console.log('✅ Blog generation successful!');
      console.log('📝 Generated posts:');
      
      if (generateResponse.data.posts && generateResponse.data.posts.length > 0) {
        generateResponse.data.posts.forEach((post, index) => {
          console.log(`   ${index + 1}. ${post.title}`);
          console.log(`      Slug: ${post.slug}`);
          console.log(`      URL: ${post.url}`);
          console.log(`      Published: ${post.publishedAt}`);
          console.log('');
        });
      }
    } else {
      console.log('❌ Blog generation failed:', generateResponse.status);
      console.log('Error:', generateResponse.data);
      return;
    }

    // Test 3: Check cron endpoint
    console.log('3. Testing cron endpoint...');
    const cronResponse = await makeRequest(`${BASE_URL}/api/cron/blog-generation`);
    
    if (cronResponse.status === 200) {
      console.log('✅ Cron endpoint accessible');
    } else {
      console.log('❌ Cron endpoint failed:', cronResponse.status);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Check your WordPress site for the published post');
    console.log('2. Verify the post has a hero image and proper SEO meta');
    console.log('3. Set up scheduling using one of the methods in the setup guide');
    console.log('4. Monitor the logs for any issues');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your development server is running');
    console.log('2. Check all environment variables are set correctly');
    console.log('3. Verify your API keys have sufficient credits');
    console.log('4. Check the console logs for detailed error messages');
  }
}

// Run the test
testBlogGenerator();
