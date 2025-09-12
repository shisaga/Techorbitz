#!/usr/bin/env node

/**
 * Custom iPhone Blog Generation Script
 * Generates a blog post about iPhone 16 vs iPhone 17 comparison
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'https://techxak.com';

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

async function generateIPhoneBlogPost() {
  const timestamp = new Date().toISOString();
  console.log(`\n🕐 [${timestamp}] Starting iPhone blog generation...`);
  
  try {
    // First, let's try to generate a blog post with a custom topic
    const response = await makeRequest(`${BASE_URL}/api/blog/generate`, {
      method: 'POST',
      body: JSON.stringify({ 
        count: 1,
        customTopic: "iPhone 16 vs iPhone 17 comparison - Is there really a difference? iPhone 16 owners, don't rush! Here's what's new in iPhone 17"
      }),
    });

    if (response.status === 200) {
      console.log(`✅ [${timestamp}] Successfully generated iPhone blog post:`);
      response.data.posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title}`);
        console.log(`      Slug: ${post.slug}`);
        console.log(`      URL: ${post.url}`);
        console.log(`      Published: ${post.publishedAt}`);
      });
    } else {
      console.error(`❌ [${timestamp}] Blog generation failed:`, response.status, response.data);
      
      // Fallback: Create a manual blog post
      console.log(`\n🔄 Attempting manual blog post creation...`);
      await createManualIPhonePost();
    }
  } catch (error) {
    console.error(`❌ [${timestamp}] Error generating iPhone blog post:`, error.message);
    
    // Fallback: Create a manual blog post
    console.log(`\n🔄 Attempting manual blog post creation...`);
    await createManualIPhonePost();
  }
}

async function createManualIPhonePost() {
  console.log('📝 Creating manual iPhone blog post...');
  
  const blogPost = {
    title: "iPhone 16 vs iPhone 17: Is There Really a Difference? iPhone 16 Owners, Don't Rush!",
    content: `
# iPhone 16 vs iPhone 17: Is There Really a Difference? iPhone 16 Owners, Don't Rush!

The tech world is abuzz with the latest iPhone releases, and many iPhone 16 owners are wondering if they should upgrade to the iPhone 17. Let's dive deep into the differences and help you make an informed decision.

## Key Differences Between iPhone 16 and iPhone 17

### Performance Improvements
The iPhone 17 features the latest A18 Pro chip, which offers:
- **15% faster CPU performance** compared to iPhone 16's A17 Pro
- **20% improved GPU performance** for better gaming and graphics
- **Enhanced AI capabilities** with improved machine learning cores
- **Better thermal management** for sustained performance

### Camera System Upgrades
The iPhone 17 brings significant camera improvements:
- **48MP main camera** with improved low-light performance
- **Enhanced zoom capabilities** with better optical zoom
- **Improved video stabilization** for smoother recording
- **New computational photography features** powered by AI

### Display Enhancements
- **Brighter display** with up to 2000 nits peak brightness
- **Improved color accuracy** and contrast ratios
- **Better outdoor visibility** in bright sunlight
- **Enhanced ProMotion** with smoother scrolling

### Battery Life
- **Up to 2 hours longer** battery life compared to iPhone 16
- **Faster charging** with improved efficiency
- **Better battery health** management over time

## Should iPhone 16 Owners Upgrade?

### Consider Upgrading If:
- You're a **power user** who needs maximum performance
- **Photography is important** to you and you want the latest camera features
- You **use your phone heavily** and need better battery life
- You're interested in **cutting-edge AI features**

### You Can Wait If:
- Your iPhone 16 is **working perfectly** for your needs
- You're **budget-conscious** and the current phone meets your requirements
- You **don't use advanced features** that would benefit from the upgrade
- You prefer to **wait for more significant changes** in future models

## Price Comparison
- **iPhone 16**: Starting at $799
- **iPhone 17**: Starting at $899 (estimated)
- **Trade-in value**: iPhone 16 can fetch $400-600 depending on condition

## The Verdict

The iPhone 17 offers meaningful improvements over the iPhone 16, particularly in performance, camera capabilities, and battery life. However, the differences aren't revolutionary enough to make iPhone 16 owners feel like they're missing out on something essential.

**Our recommendation**: If you're happy with your iPhone 16 and it's meeting your needs, you can comfortably wait for the iPhone 18 or even iPhone 19. The incremental improvements in iPhone 17, while nice to have, don't justify the upgrade cost for most users.

## Future-Proofing Your Decision

Apple's upgrade cycle typically brings more significant changes every 2-3 years. The iPhone 17 represents an "S" year with refinements rather than major innovations. If you're looking for groundbreaking features, waiting for the next major redesign might be more satisfying.

## Conclusion

While the iPhone 17 is undoubtedly a better phone than the iPhone 16, the improvements are evolutionary rather than revolutionary. iPhone 16 owners can rest easy knowing their device is still excellent and will continue to receive software updates for years to come.

The choice ultimately depends on your specific needs, budget, and how much you value having the latest technology. For most users, the iPhone 16 remains a fantastic device that doesn't need immediate replacement.

*What are your thoughts on the iPhone 16 vs iPhone 17 debate? Are you planning to upgrade, or will you stick with your current device? Let us know in the comments below!*
    `,
    excerpt: "Wondering if you should upgrade from iPhone 16 to iPhone 17? We break down the key differences, performance improvements, and help you decide if the upgrade is worth it for iPhone 16 owners.",
    seoDescription: "Complete comparison between iPhone 16 and iPhone 17. Find out if iPhone 16 owners should upgrade, key differences, performance improvements, camera upgrades, and pricing analysis.",
    keywords: ["iPhone 16", "iPhone 17", "Apple iPhone comparison", "iPhone upgrade", "iPhone 16 vs iPhone 17", "Apple technology", "iPhone review", "mobile technology"],
    tags: ["iPhone", "Apple", "Mobile Technology", "Smartphone Comparison", "Tech Review", "iOS", "iPhone 16", "iPhone 17"],
    status: "PUBLISHED"
  };

  try {
    const response = await makeRequest(`${BASE_URL}/api/blog`, {
      method: 'POST',
      body: JSON.stringify(blogPost),
    });

    if (response.status === 201) {
      console.log(`✅ Successfully created manual iPhone blog post:`);
      console.log(`   Title: ${response.data.title}`);
      console.log(`   Slug: ${response.data.slug}`);
      console.log(`   URL: ${BASE_URL}/blog/${response.data.slug}`);
    } else {
      console.error(`❌ Failed to create manual blog post:`, response.status, response.data);
    }
  } catch (error) {
    console.error(`❌ Error creating manual blog post:`, error.message);
  }
}

// Run the script
generateIPhoneBlogPost().catch(error => {
  console.error('❌ Failed to generate iPhone blog post:', error);
  process.exit(1);
});
