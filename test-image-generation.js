#!/usr/bin/env node

// Test script to demonstrate the new image generation functionality
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImageWithStability(prompt, aspectRatio = "16:9") {
  try {
    console.log(`🎨 Generating image: ${prompt.substring(0, 50)}...`);
    
    const stabilityApiKey = process.env.STABILITY_API_KEY;
    if (!stabilityApiKey) {
      throw new Error('STABILITY_API_KEY not found in environment variables');
    }

    console.log('✅ Stability API key found');

    // Determine dimensions based on aspect ratio (using allowed SDXL dimensions)
    let width, height;
    switch (aspectRatio) {
      case "16:9":
        width = 1344;
        height = 768;
        break;
      case "4:3":
        width = 1024;
        height = 768;
        break;
      case "1:1":
        width = 1024;
        height = 1024;
        break;
      default:
        width = 1344;
        height = 768;
    }

    console.log(`📐 Using dimensions: ${width}x${height}`);

    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stabilityApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: height,
        width: width,
        samples: 1,
        steps: 30,
        style_preset: "photographic"
      })
    });

    console.log(`📡 API Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Stability API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ API Response received');
    
    if (result.artifacts && result.artifacts.length > 0) {
      const imageData = result.artifacts[0];
      const base64Image = imageData.base64;
      
      // Convert base64 to URL
      const imageUrl = `data:image/png;base64,${base64Image}`;
      
      console.log(`✅ Image generated successfully (${base64Image.length} characters)`);
      return imageUrl;
    } else {
      console.error('No artifacts in response:', result);
      throw new Error('No image generated from Stability API');
    }

  } catch (error) {
    console.error(`❌ Image generation failed: ${error.message}`);
    // Return a fallback image URL
    return 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg';
  }
}

async function testImageGeneration() {
  console.log('🧪 Testing image generation with Stability API...');
  
  // Test cover image generation
  console.log('\n📸 Testing cover image generation...');
  const coverImagePrompt = `Create a modern, professional hero banner image for a blog titled "Top 10 Free AI Tools You Should Be Using in 2025". Style: modern flat/vector design with a clear focal point and space suitable for text overlay. Keep it brand-friendly and not copyright-infringing. Use a 16:9 aspect ratio.`;
  
  const coverImage = await generateImageWithStability(coverImagePrompt, "16:9");
  console.log(`🖼️ Cover Image URL: ${coverImage.substring(0, 100)}...`);
  
  // Test card image generation
  console.log('\n📸 Testing card image generation...');
  const cardImagePrompt = `Create a square social media card image for a blog post about "Top 10 Free AI Tools You Should Be Using in 2025". Style: modern, clean design with icons and visual elements related to AI and technology. Use a 1:1 aspect ratio.`;
  
  const cardImage = await generateImageWithStability(cardImagePrompt, "1:1");
  console.log(`🖼️ Card Image URL: ${cardImage.substring(0, 100)}...`);
  
  console.log('\n✅ Image generation test completed!');
  
  await prisma.$disconnect();
}

testImageGeneration();
