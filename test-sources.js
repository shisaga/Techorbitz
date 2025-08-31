✓ Compiled successfully in 25.4s
Skipping linting
Checking validity of types ...
Failed to compile.
src/app/blog/[slug]/layout.tsx
Type error: Type 'Props' does not satisfy the constraint 'LayoutProps'.
Types of property 'params' are incompatible.
 Type '{ slug: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
Next.js build worker exited with code: 1 and signal: null
Error: Command "next build " exited with 1
#!/usr/bin/env node

// Test script to verify both GitHub and NewsAPI sources are working
const { exec } = require('child_process');
require('dotenv').config({ path: '.env.local' });

async function testGitHubAPI() {
  console.log('🐙 Testing GitHub API...');
  
  const programmingLanguages = ['javascript', 'typescript', 'python', 'react'];
  const randomLang = programmingLanguages[Math.floor(Math.random() * programmingLanguages.length)];
  
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=language:${randomLang}+created:>2025-08-29&sort=stars&order=desc&per_page=5`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ GitHub API: Found ${data.items?.length || 0} ${randomLang} repositories`);
      
      if (data.items && data.items.length > 0) {
        console.log(`📝 Sample GitHub repository: ${data.items[0].name}`);
        console.log(`   Description: ${data.items[0].description}`);
        console.log(`   Language: ${data.items[0].language}`);
        console.log(`   Stars: ${data.items[0].stargazers_count}`);
      }
      return true;
    } else {
      console.log(`❌ GitHub API failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ GitHub API error: ${error.message}`);
    return false;
  }
}

async function testNewsAPI() {
  console.log('\n📰 Testing NewsAPI...');
  
  const newsApiKey = process.env.NEWSAPI_KEY;
  if (!newsApiKey) {
    console.log('❌ NewsAPI key not found in environment');
    return false;
  }
  
  const techQuery = 'React OR JavaScript OR TypeScript';
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const dateStr = twoDaysAgo.toISOString().split('T')[0];
  
  try {
    const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(techQuery)}&language=en&pageSize=5&from=${dateStr}&apiKey=${newsApiKey}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ NewsAPI: Found ${data.articles?.length || 0} tech articles`);
      
      if (data.articles && data.articles.length > 0) {
        console.log(`📝 Sample NewsAPI article: ${data.articles[0].title}`);
        console.log(`   Source: ${data.articles[0].source?.name}`);
        console.log(`   Published: ${data.articles[0].publishedAt}`);
      } else {
        console.log('⚠️ No articles found from NewsAPI (this might be normal)');
      }
      return true;
    } else {
      const errorData = await response.json();
      console.log(`❌ NewsAPI failed: ${response.status}`);
      console.log(`   Error: ${errorData.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ NewsAPI error: ${error.message}`);
    return false;
  }
}

async function testBlogGeneration() {
  console.log('\n🤖 Testing blog generation with both sources...');
  
  try {
    const response = await fetch('http://localhost:3000/api/blog/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: 1 })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Blog generation: ${data.message}`);
      console.log(`📝 Generated ${data.posts?.length || 0} posts`);
      
      if (data.posts && data.posts.length > 0) {
        data.posts.forEach(post => {
          console.log(`   - ${post.title}`);
          console.log(`     Slug: ${post.slug}`);
        });
      }
      return true;
    } else {
      console.log(`❌ Blog generation failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Blog generation error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Testing AI Blog Generator Sources\n');
  
  const githubOk = await testGitHubAPI();
  const newsApiOk = await testNewsAPI();
  const blogGenOk = await testBlogGeneration();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`GitHub API: ${githubOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`NewsAPI: ${newsApiOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`Blog Generation: ${blogGenOk ? '✅ Working' : '❌ Failed'}`);
  
  if (githubOk && newsApiOk) {
    console.log('\n🎉 Both sources are working correctly!');
    console.log('✨ Your AI blog generator can fetch from:');
    console.log('   - GitHub trending repositories (programming content)');
    console.log('   - NewsAPI latest tech news (industry updates)');
  } else {
    console.log('\n⚠️ Some sources may need attention:');
    if (!githubOk) console.log('   - Check GitHub API access (rate limits?)');
    if (!newsApiOk) console.log('   - Check NewsAPI key and credits');
  }
}

main().catch(console.error);
