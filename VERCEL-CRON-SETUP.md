# Vercel Cron Job Setup for AI Blog Generation 🚀

## 📋 Overview

This guide will help you set up automatic AI blog generation using Vercel's built-in cron job functionality. The system will generate 2 blog posts daily at 8:00 AM and 8:00 PM UTC.

## ⚙️ Configuration

### 1. **Vercel Configuration (vercel.json)**
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "PRISMA_GENERATE_DATAPROXY": "true"
  },
  "crons": [
    {
      "path": "/api/cron/blog-generation",
      "schedule": "0 8,20 * * *"
    }
  ]
}
```

### 2. **Cron Schedule Explanation**
- `0 8,20 * * *` = Run at 8:00 AM and 8:00 PM UTC daily
- Format: `minute hour day month day-of-week`
- You can modify this schedule as needed

### 3. **Environment Variables Required**

Add these to your Vercel project settings:

```env
# AI APIs
OPENAI_API_KEY=sk-your-openai-key
STABILITY_API_KEY=stb-your-stability-key
NEWSAPI_KEY=nn-your-newsapi-key
PEXELS_API_KEY=px-your-pexels-key

# Website Configuration
NEXT_PUBLIC_SITE_URL=https://techonigx.com

# Blog Generation Settings
POSTS_PER_DAY=2
PUBLISH_TIMES=08:00,20:00

# Security (Optional)
CRON_SECRET=your-secret-key-here

# Database
DATABASE_URL=your-mongodb-connection-string
```

## 🚀 Deployment Steps

### Step 1: Push Changes to Repository
```bash
git add .
git commit -m "Add Vercel cron job configuration for AI blog generation"
git push origin main
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

### Step 3: Configure Environment Variables
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the required environment variables listed above

### Step 4: Verify Cron Job
1. Go to your Vercel dashboard
2. Select your project
3. Go to Functions tab
4. You should see the cron job listed

## 🔧 Customization Options

### 1. **Change Schedule**
Modify the cron schedule in `vercel.json`:

```json
"crons": [
  {
    "path": "/api/cron/blog-generation",
    "schedule": "0 9,21 * * *"  // 9 AM and 9 PM UTC
  }
]
```

### 2. **Multiple Times Per Day**
```json
"crons": [
  {
    "path": "/api/cron/blog-generation",
    "schedule": "0 6,12,18 * * *"  // 6 AM, 12 PM, 6 PM UTC
  }
]
```

### 3. **Different Days**
```json
"crons": [
  {
    "path": "/api/cron/blog-generation",
    "schedule": "0 8,20 * * 1-5"  // Weekdays only
  }
]
```

## 📊 Monitoring & Testing

### 1. **Manual Testing**
Test the cron endpoint manually:
```bash
curl -X POST https://your-domain.vercel.app/api/cron/blog-generation \
  -H "Authorization: Bearer your-cron-secret"
```

### 2. **Check Logs**
- Go to Vercel dashboard → Functions
- Click on the cron function
- View execution logs and results

### 3. **Admin Interface**
Visit: `https://your-domain.vercel.app/admin/blog-generator`
- Test blog generation manually
- View generation history
- Monitor system status

## 🔒 Security Features

### 1. **Optional Authentication**
The cron job supports optional authentication:
```env
CRON_SECRET=your-secret-key
```

### 2. **Rate Limiting**
Built-in rate limiting prevents abuse:
- 5-second delays between API calls
- Error handling and fallbacks
- Duplicate detection

## 💰 Cost Management

### Estimated Costs:
- **Per Post**: $0.70-1.20
- **Daily**: $1.40-2.40 (2 posts)
- **Monthly**: $42-72

### Cost Optimization:
1. Use `POSTS_PER_DAY=1` for lower costs
2. Monitor usage in Vercel dashboard
3. Set up billing alerts

## 🛠️ Troubleshooting

### Common Issues:

1. **Cron Job Not Running**
   - Check Vercel dashboard → Functions
   - Verify environment variables
   - Check function logs

2. **API Errors**
   - Verify API keys are correct
   - Check API rate limits
   - Review error logs

3. **Database Issues**
   - Verify DATABASE_URL
   - Check MongoDB connection
   - Ensure Prisma is properly configured

### Debug Commands:
```bash
# Test the endpoint locally
curl -X POST http://localhost:3000/api/cron/blog-generation

# Check environment variables
vercel env ls

# View function logs
vercel logs
```

## 📈 Performance Optimization

### 1. **Function Timeout**
Set to 30 seconds for blog generation:
```json
"functions": {
  "app/api/**/*.ts": {
    "maxDuration": 30
  }
}
```

### 2. **Memory Usage**
- Optimized for Vercel's serverless functions
- Efficient API calls with delays
- Proper error handling

## 🎯 Success Metrics

### What to Monitor:
1. **Success Rate**: Posts generated successfully
2. **Content Quality**: Word count, SEO structure
3. **Image Generation**: Hero images created
4. **Database Integration**: Posts saved to MongoDB
5. **Cost Efficiency**: API usage and costs

### Expected Results:
- ✅ 2 posts generated daily
- ✅ 1,500-1,800 words per post
- ✅ SEO-optimized content
- ✅ AI-generated hero images
- ✅ Proper database storage

## 🚀 Next Steps

1. **Deploy the changes**
2. **Configure environment variables**
3. **Test the cron job manually**
4. **Monitor the first few executions**
5. **Adjust schedule if needed**

---

## 📞 Support

If you encounter any issues:
1. Check the Vercel function logs
2. Review the admin interface at `/admin/blog-generator`
3. Test manually using the API endpoint
4. Verify all environment variables are set correctly

**Your AI blog generation system is now ready for automatic operation!** 🎉
