# AI Blog Generator Setup Guide

## 🚀 Overview

This AI blog generator automatically creates and publishes 2 SEO-ready blog posts per day using:
- **Text Generation**: OpenAI GPT-4o mini
- **Image Generation**: Stable Diffusion or DALL-E
- **Topic Discovery**: NewsAPI for trending topics
- **Publishing**: MongoDB database (Prisma ORM)

## 📋 Prerequisites

1. **OpenAI Account** - Get API key from [openai.com](https://openai.com)
2. **Stability AI Account** - Get API key from [stability.ai](https://stability.ai)
3. **NewsAPI Account** - Get API key from [newsapi.org](https://newsapi.org)
4. **Pexels Account** (optional) - Get API key from [pexels.com](https://pexels.com)
5. **MongoDB Database** - Already configured with Prisma

## 🔧 Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```env
# AI + Topic APIs
OPENAI_API_KEY=sk-XXXXXXXXXXXX
STABILITY_API_KEY=stb-XXXXXXXXXXXX
NEWSAPI_KEY=nn-XXXXXXXXXXXX
PEXELS_API_KEY=px-XXXXXXXXXXXX

# Website configuration
NEXT_PUBLIC_SITE_URL=https://techonigx.com

# Scheduling
POSTS_PER_DAY=2
PUBLISH_TIMES=08:00,20:00   # times in IST, or UTC if you prefer

# Optional security
CRON_SECRET=your-secret-key-here
```

## 🔑 Getting API Keys

### 1. OpenAI API Key
1. Go to [openai.com](https://openai.com)
2. Sign up/Login
3. Navigate to API Keys section
4. Click "Create new key"
5. Copy the key (starts with `sk-`)

### 2. Stability AI API Key
1. Go to [stability.ai](https://stability.ai)
2. Sign up/Login
3. Navigate to API Keys section
4. Generate a new key
5. Copy the key (starts with `stb-`)

### 3. NewsAPI Key
1. Go to [newsapi.org](https://newsapi.org)
2. Sign up for free account
3. Get your API key
4. Copy the key

### 4. Pexels API Key (Optional)
1. Go to [pexels.com](https://pexels.com)
2. Sign up/Login
3. Navigate to API section
4. Generate API key
5. Copy the key

### 5. MongoDB Database
Your MongoDB database is already configured with Prisma. The AI blog generator will:
- Create posts in your existing `Post` model
- Create tags and categories as needed
- Use an AI author account for generated content

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install openai newsapi --legacy-peer-deps
   ```

2. **Set Environment Variables**
   - Copy the `.env` template above
   - Fill in your actual API keys
   - Never commit `.env` to Git

3. **Test the Setup**
   ```bash
   # Start your development server
   npm run dev
   
   # Visit the admin interface
   http://localhost:3000/admin/blog-generator
   ```

## 🧪 Testing

### Manual Test
1. Visit `/admin/blog-generator`
2. Set number of posts (1-5)
3. Click "Generate & Publish Posts"
4. Wait for completion (2-5 minutes)
5. Check your website/blog for new posts

### API Test
```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"count": 2}'
```

## ⏰ Scheduling Setup

### Option 1: Vercel Cron Jobs
Add to your `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/blog-generation",
      "schedule": "0 8,20 * * *"
    }
  ]
}
```

### Option 2: External Cron Service
Use services like:
- [Cron-job.org](https://cron-job.org)
- [EasyCron](https://easycron.com)
- [SetCronJob](https://setcronjob.com)

Set the cron URL to: `https://yourdomain.com/api/cron/blog-generation`

### Option 3: GitHub Actions
Create `.github/workflows/blog-generation.yml`:
```yaml
name: Blog Generation
on:
  schedule:
    - cron: '0 8,20 * * *'
  workflow_dispatch:

jobs:
  generate-blogs:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Blog Generation
        run: |
          curl -X POST https://yourdomain.com/api/cron/blog-generation \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## 📊 Monitoring & Logs

### Console Logs
The system logs all activities to the console:
- Topic discovery
- Content generation
- Image generation
- Publishing status
- Errors and failures

### API Endpoints
- `GET /api/blog/generate` - Check API status
- `POST /api/blog/generate` - Manual generation
- `POST /api/cron/blog-generation` - Scheduled generation

## 🔒 Security Considerations

1. **API Keys**: Never commit to Git
2. **Environment Variables**: Use hosting platform secrets
3. **Cron Security**: Use CRON_SECRET for authentication
4. **Rate Limiting**: Built-in delays between API calls
5. **Error Handling**: Graceful fallbacks for all services

## 💰 Cost Management

### OpenAI Costs
- GPT-4o mini: ~$0.15 per 1M tokens
- Estimated: $0.50-1.00 per post

### Stability AI Costs
- SDXL: ~$0.20 per image
- Estimated: $0.20 per post

### NewsAPI Costs
- Free tier: 1,000 requests/day
- Sufficient for daily blog generation

### Total Estimated Cost
- **Per post**: $0.70-1.20
- **Daily (2 posts)**: $1.40-2.40
- **Monthly**: $42-72

## 🚨 Troubleshooting

### Common Issues

1. **"Missing environment variables"**
   - Check all required variables are set
   - Restart your development server

2. **"OpenAI API error"**
   - Verify API key is correct
   - Check account has sufficient credits
   - Verify API key has proper permissions

3. **"MongoDB publishing failed"**
   - Check database connection
   - Verify Prisma schema is up to date
   - Ensure MongoDB is accessible

4. **"Image generation failed"**
   - Check Stability AI API key
   - Verify account has credits
   - System will fallback to Pexels/placeholder

### Debug Mode
Add `DEBUG=true` to your `.env` for detailed logging.

## 📈 Customization

### Modify Prompts
Edit the prompts in `src/lib/ai-blog-generator.ts`:
- System prompt for content generation
- Image generation prompt
- Keyword extraction logic

### Change Topics
Modify `getTrendingTopics()` method to:
- Use different news sources
- Filter by specific categories
- Add custom topic generation

### Adjust Scheduling
Change `POSTS_PER_DAY` and `PUBLISH_TIMES` in `.env`:
```env
POSTS_PER_DAY=1
PUBLISH_TIMES=10:00
```

## 🎯 Success Criteria

✅ **Two new posts appear automatically per day**
✅ **Each post has title, hero image, meta description**
✅ **Posts are not duplicates and have working links**
✅ **Manual test generates posts within 10 minutes**
✅ **Quality content with proper SEO structure**

## 📞 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all API keys are correct and have sufficient credits
3. Test the manual generation endpoint first
4. Check your WordPress site's REST API is working

---

**Ready to start?** Set up your environment variables and run your first test! 🚀
