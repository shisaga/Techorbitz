#!/usr/bin/env node

/**
 * Add FAQ Structured Data Script
 * Adds FAQ structured data to the iPhone blog post for better SEO
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addFAQStructuredData() {
  try {
    console.log('🚀 Adding FAQ structured data to iPhone blog post...');

    const slug = "iphone-16-vs-iphone-17-is-there-really-a-difference-iphone-16-owners-dont-rush";
    
    // Find the existing blog post
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (!existingPost) {
      console.error('❌ Blog post not found with slug:', slug);
      return;
    }

    console.log('📝 Found existing blog post:', existingPost.title);

    // FAQ data for structured data
    const faqData = [
      {
        question: "Is iPhone 17 worth upgrading from iPhone 16?",
        answer: "The iPhone 17 offers incremental improvements in performance, camera, and battery life. For most users, the upgrade isn't essential unless you're a power user or photography enthusiast. The iPhone 16 remains excellent and will receive software updates for years."
      },
      {
        question: "What's the main difference between iPhone 16 Pro Max and iPhone 17 Pro Max?",
        answer: "The iPhone 17 Pro Max features a more powerful A18 Pro chip, enhanced camera system with better zoom capabilities, improved battery life, and brighter display. However, the core functionality remains similar to the iPhone 16 Pro Max."
      },
      {
        question: "When will iPhone 17 be released?",
        answer: "Based on Apple's traditional timeline, the iPhone 17 is expected to be announced and released in September 2025, following the same pattern as previous iPhone releases."
      },
      {
        question: "How much will iPhone 17 cost?",
        answer: "The iPhone 17 is expected to start at $899, with the iPhone 17 Pro Max starting around $1,299. Prices may vary by region and storage capacity."
      },
      {
        question: "Should I wait for iPhone 18 instead of buying iPhone 17?",
        answer: "If you're currently using an iPhone 16 or newer, waiting for iPhone 18 might be worthwhile as it's likely to bring more significant changes. The iPhone 17 represents an 'S' year with refinements rather than major innovations."
      },
      {
        question: "What's the battery life difference between iPhone 16 and iPhone 17?",
        answer: "The iPhone 17 offers up to 2 hours longer battery life compared to the iPhone 16, with improved efficiency and better thermal management contributing to sustained performance."
      },
      {
        question: "Are iPhone 17 cameras significantly better than iPhone 16?",
        answer: "The iPhone 17 features enhanced camera capabilities including improved low-light performance, better zoom, and new computational photography features. While noticeable, the improvements are evolutionary rather than revolutionary."
      },
      {
        question: "Can I trade in my iPhone 16 for iPhone 17?",
        answer: "Yes, Apple typically offers trade-in programs for previous generation iPhones. iPhone 16 models can fetch $400-600 in trade-in value depending on condition and storage capacity."
      }
    ];

    // Create structured data JSON-LD
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    // Add structured data to the content
    const structuredDataScript = `\n\n<!-- FAQ Structured Data for SEO -->\n<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n</script>`;

    // Update the blog post with structured data
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        content: existingPost.content + structuredDataScript,
        updatedAt: new Date()
      }
    });

    console.log(`✅ Successfully added FAQ structured data to iPhone blog post:`);
    console.log(`   Title: ${updatedPost.title}`);
    console.log(`   Slug: ${updatedPost.slug}`);
    console.log(`   URL: https://techxak.com/blog/${updatedPost.slug}`);
    console.log(`   Updated: ${updatedPost.updatedAt}`);
    console.log(`   FAQ items: ${faqData.length} questions and answers`);
    console.log(`   Structured data: Added JSON-LD schema for FAQPage`);
    console.log(`   SEO benefit: Enhanced search result snippets and FAQ rich results`);

  } catch (error) {
    console.error('❌ Error adding FAQ structured data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addFAQStructuredData();
