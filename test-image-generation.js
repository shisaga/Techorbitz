#!/usr/bin/env node

// Test script to demonstrate the new image generation functionality
require('dotenv').config({ path: '.env.local' });

const AIBlogGenerator = require('./src/lib/ai-blog-generator.ts').default;

async function testImageGeneration() {
  console.log('🎨 Testing AI Blog Image Generation...\n');
  
  try {
    const generator = new AIBlogGenerator();
    
    // Test 1: Generate hero image for a React topic
    console.log('📸 Test 1: Generating hero image for "React Hooks"');
    const reactImage = await generator.generateHeroImage('React Hooks Implementation');
    console.log(`✅ React Image: ${reactImage}\n`);
    
    // Test 2: Generate hero image for a Python topic
    console.log('📸 Test 2: Generating hero image for "Python AI"');
    const pythonImage = await generator.generateHeroImage('Python AI Machine Learning');
    console.log(`✅ Python Image: ${pythonImage}\n`);
    
    // Test 3: Generate hero image for a database topic
    console.log('📸 Test 3: Generating hero image for "Database"');
    const dbImage = await generator.generateHeroImage('Database Management Systems');
    console.log(`✅ Database Image: ${dbImage}\n`);
    
    // Test 4: Generate hero image for a cloud topic
    console.log('📸 Test 4: Generating hero image for "Cloud"');
    const cloudImage = await generator.generateHeroImage('Cloud Infrastructure AWS');
    console.log(`✅ Cloud Image: ${cloudImage}\n`);
    
    console.log('🎉 All image generation tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- React: ${reactImage}`);
    console.log(`- Python: ${pythonImage}`);
    console.log(`- Database: ${dbImage}`);
    console.log(`- Cloud: ${cloudImage}`);
    
  } catch (error) {
    console.error('❌ Error testing image generation:', error);
  }
}

testImageGeneration();
