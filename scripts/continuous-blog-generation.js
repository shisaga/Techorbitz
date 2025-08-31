#!/usr/bin/env node

/**
 * Continuous Blog Generation Script
 * Runs every few hours to generate fresh blog content
 * 
 * Usage: node scripts/continuous-blog-generation.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const GENERATION_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours
const POSTS_PER_GENERATION = 2;

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

async function generateBlogPosts() {
  const timestamp = new Date().toISOString();
  console.log(`\n🕐 [${timestamp}] Starting blog generation...`);
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/blog/generate`, {
      method: 'POST',
      body: JSON.stringify({ count: POSTS_PER_GENERATION }),
    });

    if (response.status === 200) {
      console.log(`✅ [${timestamp}] Successfully generated ${response.data.posts.length} blog posts:`);
      response.data.posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title}`);
        console.log(`      Slug: ${post.slug}`);
        console.log(`      Published: ${post.publishedAt}`);
      });
    } else {
      console.error(`❌ [${timestamp}] Blog generation failed:`, response.status, response.data);
    }
  } catch (error) {
    console.error(`❌ [${timestamp}] Error generating blog posts:`, error.message);
  }
}

async function startContinuousGeneration() {
  console.log('🚀 Starting Continuous Blog Generation System');
  console.log(`📊 Configuration:`);
  console.log(`   - Base URL: ${BASE_URL}`);
  console.log(`   - Generation Interval: ${GENERATION_INTERVAL / (60 * 60 * 1000)} hours`);
  console.log(`   - Posts per generation: ${POSTS_PER_GENERATION}`);
  console.log(`   - Next generation in: ${new Date(Date.now() + GENERATION_INTERVAL).toLocaleString()}`);
  
  // Generate initial posts
  await generateBlogPosts();
  
  // Set up continuous generation
  setInterval(async () => {
    await generateBlogPosts();
  }, GENERATION_INTERVAL);
  
  console.log('\n🔄 Continuous generation started. Press Ctrl+C to stop.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping continuous blog generation...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping continuous blog generation...');
  process.exit(0);
});

// Start the system
startContinuousGeneration().catch(error => {
  console.error('❌ Failed to start continuous generation:', error);
  process.exit(1);
});
