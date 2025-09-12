#!/usr/bin/env node

/**
 * Direct iPhone Blog Creation Script
 * Creates iPhone blog post directly in database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function createIPhoneBlogPost() {
  try {
    console.log('🚀 Creating iPhone blog post...');

    const title = "iPhone 16 vs iPhone 17: Is There Really a Difference? iPhone 16 Owners, Don't Rush!";
    const slug = generateSlug(title);
    
    const content = `# iPhone 16 vs iPhone 17: Is There Really a Difference? iPhone 16 Owners, Don't Rush!

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

*What are your thoughts on the iPhone 16 vs iPhone 17 debate? Are you planning to upgrade, or will you stick with your current device? Let us know in the comments below!*`;

    const excerpt = "Wondering if you should upgrade from iPhone 16 to iPhone 17? We break down the key differences, performance improvements, and help you decide if the upgrade is worth it for iPhone 16 owners.";
    
    const readingTime = calculateReadingTime(content);
    
    // Create or find tags
    const tagNames = ["iPhone", "Apple", "Mobile Technology", "Smartphone Comparison", "Tech Review", "iOS", "iPhone 16", "iPhone 17"];
    
    const tagObjects = await Promise.all(
      tagNames.map(async (tagName) => {
        const tagSlug = generateSlug(tagName);
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: {
            name: tagName,
            slug: tagSlug
          }
        });
      })
    );

    // Find or create an author (assuming there's a default author)
    let author = await prisma.user.findFirst();
    if (!author) {
      author = await prisma.user.create({
        data: {
          name: "TechXak Team",
          email: "team@techxak.com",
          avatar: "/chatgpt-logo.png"
        }
      });
    }

    // Create the blog post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        seoDescription: excerpt,
        readingTime,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: author.id,
        categoryIds: [],
        tagIds: tagObjects.map(tag => tag.id)
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    console.log(`✅ Successfully created iPhone blog post:`);
    console.log(`   Title: ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   URL: https://techxak.com/blog/${post.slug}`);
    console.log(`   Published: ${post.publishedAt}`);
    console.log(`   Author: ${post.author.name}`);
    console.log(`   Tags: ${tagNames.join(', ')}`);
    console.log(`   Reading Time: ${readingTime} minutes`);

  } catch (error) {
    console.error('❌ Error creating iPhone blog post:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createIPhoneBlogPost();
