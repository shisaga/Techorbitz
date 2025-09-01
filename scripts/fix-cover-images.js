#!/usr/bin/env node

/**
 * Fix Cover Images Script
 * Updates existing blog posts to have cover images
 * 
 * Usage: node scripts/fix-cover-images.js
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

async function fixCoverImages() {
  console.log('🔧 Starting Cover Image Fix Process...\n');
  
  try {
    // Get all blog posts
    console.log('📝 Fetching all blog posts...');
    const postsResponse = await makeRequest(`${BASE_URL}/api/blog`);
    
    if (postsResponse.status !== 200) {
      console.error('❌ Failed to fetch blog posts');
      return;
    }
    
    const posts = postsResponse.data.posts || [];
    console.log(`📊 Found ${posts.length} blog posts`);
    
    // Filter posts that need cover images
    const postsNeedingCoverImages = posts.filter(post => 
      !post.coverImage && post.showcaseImage
    );
    
    console.log(`🔧 Found ${postsNeedingCoverImages.length} posts needing cover images`);
    
    if (postsNeedingCoverImages.length === 0) {
      console.log('✅ All posts already have cover images!');
      return;
    }
    
    // Fix each post
    for (const post of postsNeedingCoverImages) {
      console.log(`\n🔄 Fixing cover image for: ${post.title}`);
      console.log(`   Current showcaseImage: ${post.showcaseImage}`);
      
      // Update the post to have cover image
      const updateResponse = await makeRequest(`${BASE_URL}/api/admin/posts/${post.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          coverImage: post.showcaseImage
        }),
      });
      
      if (updateResponse.status === 200) {
        console.log(`   ✅ Successfully updated cover image`);
      } else {
        console.log(`   ❌ Failed to update: ${updateResponse.status}`);
      }
    }
    
    console.log('\n🎉 Cover image fix process completed!');
    
  } catch (error) {
    console.error('❌ Error fixing cover images:', error.message);
  }
}

// Run the fix
fixCoverImages().catch(error => {
  console.error('❌ Failed to run cover image fix:', error);
  process.exit(1);
});
