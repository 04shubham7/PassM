#!/bin/bash

echo "🚀 Deploying PassM Backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the backend directory
if [ ! -f "server.js" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔧 Don't forget to set environment variables in Vercel dashboard:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - EMAIL_USER"
echo "   - EMAIL_PASS"
echo "   - ENCRYPTION_KEY" 