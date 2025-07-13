#!/bin/bash

echo "🎨 Deploying PassM Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the frontend directory
if [ ! -f "package.json" ] || [ ! -f "src/App.js" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

# Build the project
echo "🔨 Building React app..."
npm run build

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment complete!"
echo "🔧 Don't forget to set environment variables in Vercel dashboard:"
echo "   - REACT_APP_API_URL=https://your-backend-url.vercel.app"
echo "   - REACT_APP_NODE_ENV=production" 