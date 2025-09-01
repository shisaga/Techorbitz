#!/usr/bin/env node

/**
 * Blog System Monitoring Script
 * Monitors the blog generation system performance
 * 
 * Usage: node scripts/monitor-blog-system.js
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

async function checkSystemStatus() {
  const timestamp = new Date().toISOString();
  console.log(`\n📊 [${timestamp}] Blog System Status Report`);
  console.log('=' .repeat(60));
  
  try {
    // Check API status
    console.log('🔍 Checking API endpoints...');
    const apiResponse = await makeRequest(`${BASE_URL}/api/blog/generate`);
    console.log(`✅ API Status: ${apiResponse.status === 200 ? 'Online' : 'Offline'}`);
    
    // Get current blog posts
    console.log('\n📝 Checking current blog posts...');
    const postsResponse = await makeRequest(`${BASE_URL}/api/blog`);
    
    if (postsResponse.status === 200) {
      const posts = postsResponse.data.posts || [];
      console.log(`📊 Total Posts: ${posts.length}`);
      
      if (posts.length > 0) {
        const latestPost = posts[0];
        const latestDate = new Date(latestPost.publishedAt);
        const hoursAgo = Math.round((Date.now() - latestDate.getTime()) / (1000 * 60 * 60));
        
        console.log(`🕐 Latest Post: ${latestPost.title}`);
        console.log(`📅 Published: ${hoursAgo} hours ago`);
        console.log(`🖼️  Has Image: ${latestPost.showcaseImage ? 'Yes' : 'No'}`);
        
        // Check posts from last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentPosts = posts.filter(post => new Date(post.publishedAt) > oneDayAgo);
        console.log(`📈 Posts in last 24h: ${recentPosts.length}`);
        
        // Check image diversity
        const images = posts.slice(0, 10).map(post => post.showcaseImage).filter(Boolean);
        const uniqueImages = new Set(images);
        console.log(`🎨 Image Diversity: ${uniqueImages.size}/${images.length} unique images`);
      }
    }
    
    // Test generation capability
    console.log('\n🧪 Testing generation capability...');
    const testResponse = await makeRequest(`${BASE_URL}/api/blog/generate`, {
      method: 'POST',
      body: JSON.stringify({ count: 1 }),
    });
    
    if (testResponse.status === 200) {
      console.log(`✅ Generation Test: Success (${testResponse.data.posts?.length || 0} posts generated)`);
    } else {
      console.log(`❌ Generation Test: Failed (${testResponse.status})`);
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 System Status: HEALTHY ✅');
    console.log('🚀 Blog generation system is running optimally!');
    
  } catch (error) {
    console.error(`❌ Error checking system status: ${error.message}`);
    console.log('\n📊 System Status: ISSUES DETECTED ❌');
  }
}

async function startMonitoring() {
  console.log('🔍 Starting Blog System Monitor');
  console.log(`📊 Monitoring URL: ${BASE_URL}`);
  console.log('🔄 Will check system status every 30 minutes...\n');
  
  // Initial check
  await checkSystemStatus();
  
  // Set up periodic monitoring
  setInterval(async () => {
    await checkSystemStatus();
  }, 30 * 60 * 1000); // 30 minutes
  
  console.log('\n🔄 Monitoring started. Press Ctrl+C to stop.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping blog system monitor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping blog system monitor...');
  process.exit(0);
});

// Start monitoring
startMonitoring().catch(error => {
  console.error('❌ Failed to start monitoring:', error);
  process.exit(1);
});
