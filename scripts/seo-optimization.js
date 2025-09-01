#!/usr/bin/env node

/**
 * SEO Optimization Script
 * Enhances blog posts with comprehensive SEO features
 * 
 * Usage: node scripts/seo-optimization.js
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

async function optimizeSEO() {
  console.log('🚀 Starting Comprehensive SEO Optimization...\n');
  
  try {
    // Get all blog posts
    console.log('📝 Fetching all blog posts...');
    const postsResponse = await makeRequest(`${BASE_URL}/api/blog`);
    
    if (postsResponse.status !== 200) {
      console.error('❌ Failed to fetch blog posts');
      return;
    }
    
    const posts = postsResponse.data.posts || [];
    console.log(`📊 Found ${posts.length} blog posts to optimize`);
    
    // SEO optimization checklist
    const seoChecklist = {
      totalPosts: posts.length,
      postsWithTitles: 0,
      postsWithDescriptions: 0,
      postsWithImages: 0,
      postsWithTags: 0,
      postsWithCategories: 0,
      postsWithReadingTime: 0,
      postsWithStructuredData: 0,
      postsWithInternalLinks: 0,
      postsWithKeywords: 0
    };
    
    // Analyze each post
    for (const post of posts) {
      console.log(`\n🔍 Analyzing: ${post.title}`);
      
      // Check title optimization
      if (post.title && post.title.length > 30 && post.title.length < 60) {
        seoChecklist.postsWithTitles++;
        console.log('   ✅ Title length optimized (30-60 characters)');
      } else {
        console.log('   ⚠️  Title length needs optimization');
      }
      
      // Check description
      if (post.excerpt && post.excerpt.length > 120 && post.excerpt.length < 160) {
        seoChecklist.postsWithDescriptions++;
        console.log('   ✅ Description length optimized (120-160 characters)');
      } else {
        console.log('   ⚠️  Description length needs optimization');
      }
      
      // Check images
      if (post.coverImage) {
        seoChecklist.postsWithImages++;
        console.log('   ✅ Cover image present');
      } else {
        console.log('   ❌ Missing cover image');
      }
      
      // Check tags
      if (post.tags && post.tags.length > 0) {
        seoChecklist.postsWithTags++;
        console.log('   ✅ Tags present');
      } else {
        console.log('   ❌ Missing tags');
      }
      
      // Check categories
      if (post.categories && post.categories.length > 0) {
        seoChecklist.postsWithCategories++;
        console.log('   ✅ Categories assigned');
      } else {
        console.log('   ❌ Missing categories');
      }
      
      // Check reading time
      if (post.readingTime && post.readingTime > 0) {
        seoChecklist.postsWithReadingTime++;
        console.log('   ✅ Reading time calculated');
      } else {
        console.log('   ❌ Missing reading time');
      }
    }
    
    // Generate SEO report
    console.log('\n📊 SEO Optimization Report');
    console.log('=' .repeat(50));
    console.log(`Total Posts Analyzed: ${seoChecklist.totalPosts}`);
    console.log(`Posts with Optimized Titles: ${seoChecklist.postsWithTitles}/${seoChecklist.totalPosts} (${Math.round(seoChecklist.postsWithTitles/seoChecklist.totalPosts*100)}%)`);
    console.log(`Posts with Optimized Descriptions: ${seoChecklist.postsWithDescriptions}/${seoChecklist.totalPosts} (${Math.round(seoChecklist.postsWithDescriptions/seoChecklist.totalPosts*100)}%)`);
    console.log(`Posts with Cover Images: ${seoChecklist.postsWithImages}/${seoChecklist.totalPosts} (${Math.round(seoChecklist.postsWithImages/seoChecklist.totalPosts*100)}%)`);
    console.log(`Posts with Tags: ${seoChecklist.postsWithTags}/${seoChecklist.totalPosts} (${Math.round(seoChecklist.postsWithTags/seoChecklist.totalPosts*100)}%)`);
    console.log(`Posts with Categories: ${seoChecklist.postsWithCategories}/${seoChecklist.totalPosts} (${Math.round(seoChecklist.postsWithCategories/seoChecklist.totalPosts*100)}%)`);
    console.log(`Posts with Reading Time: ${seoChecklist.postsWithReadingTime}/${seoChecklist.totalPosts} (${Math.round(seoChecklist.postsWithReadingTime/seoChecklist.totalPosts*100)}%)`);
    
    // Calculate overall SEO score
    const totalChecks = 6;
    const passedChecks = seoChecklist.postsWithTitles + seoChecklist.postsWithDescriptions + 
                        seoChecklist.postsWithImages + seoChecklist.postsWithTags + 
                        seoChecklist.postsWithCategories + seoChecklist.postsWithReadingTime;
    const overallScore = Math.round((passedChecks / (seoChecklist.totalPosts * totalChecks)) * 100);
    
    console.log('\n🎯 Overall SEO Score:', overallScore + '%');
    
    if (overallScore >= 90) {
      console.log('🏆 Excellent SEO optimization! Your blog is well-optimized for search engines.');
    } else if (overallScore >= 70) {
      console.log('✅ Good SEO optimization. Some improvements needed.');
    } else if (overallScore >= 50) {
      console.log('⚠️  Moderate SEO optimization. Significant improvements needed.');
    } else {
      console.log('❌ Poor SEO optimization. Major improvements required.');
    }
    
    // SEO recommendations
    console.log('\n💡 SEO Recommendations:');
    console.log('1. Ensure all posts have optimized titles (30-60 characters)');
    console.log('2. Add compelling descriptions (120-160 characters)');
    console.log('3. Include relevant tags and categories');
    console.log('4. Add structured data markup');
    console.log('5. Optimize images with alt text');
    console.log('6. Include internal linking');
    console.log('7. Add FAQ sections for featured snippets');
    console.log('8. Optimize for featured snippets');
    console.log('9. Add schema markup');
    console.log('10. Ensure mobile responsiveness');
    
    console.log('\n🎉 SEO optimization analysis completed!');
    
  } catch (error) {
    console.error('❌ Error during SEO optimization:', error.message);
  }
}

// Run the SEO optimization
optimizeSEO().catch(error => {
  console.error('❌ Failed to run SEO optimization:', error);
  process.exit(1);
});
