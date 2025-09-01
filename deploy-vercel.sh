#!/bin/bash

echo "🚀 Deploying AI Blog Generator with Cron Job to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Select your project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add the required environment variables:"
echo "   - OPENAI_API_KEY"
echo "   - STABILITY_API_KEY"
echo "   - NEWSAPI_KEY"
echo "   - PEXELS_API_KEY"
echo "   - DATABASE_URL"
echo "   - NEXT_PUBLIC_SITE_URL"
echo "   - POSTS_PER_DAY"
echo "   - PUBLISH_TIMES"
echo "   - CRON_SECRET (optional)"
echo ""
echo "5. Check the Functions tab to see your cron job"
echo "6. Test manually at: https://your-domain.vercel.app/admin/blog-generator"
echo ""
echo "🎉 Your AI blog generation cron job is now live!"
