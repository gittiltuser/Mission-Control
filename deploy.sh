#!/bin/bash
# Deploy to Vercel using curl (bypasses npm issues)

echo "🦀 Deploying Mission Control to Vercel..."

# Check for node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing..."
    # Try to install node
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

echo "✓ Node version: $(node --version)"

# Use npx from local node_modules
./node_modules/.bin/vercel --version 2>/dev/null || npm install -g vercel

# Deploy
echo "🚀 Starting deployment..."
vercel --prod

echo "✅ Deployment complete!"
