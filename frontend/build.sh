#!/bin/bash

# Frontend build script with Node.js compatibility check
set -e

echo "🔧 Frontend Build Script"
echo "========================"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Extract major version number
NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')

echo "🔍 Node.js major version: $NODE_MAJOR"

# Check compatibility
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ Error: Node.js version $NODE_VERSION is not supported"
    echo "   Required: Node.js 18.x or 20.x"
    echo "   Please use a compatible Node.js version"
    exit 1
elif [ "$NODE_MAJOR" -gt 20 ]; then
    echo "⚠️  Warning: Node.js version $NODE_VERSION is newer than tested versions"
    echo "   Recommended: Node.js 18.x or 20.x"
    echo "   Continuing with build..."
elif [ "$NODE_MAJOR" -eq 24 ]; then
    echo "❌ Error: Node.js 24.x is not supported by current Vite version"
    echo "   Please use Node.js 18.x or 20.x"
    echo "   Run: nvm use 20 (if using nvm)"
    exit 1
else
    echo "✅ Node.js version $NODE_VERSION is compatible"
fi

# Check npm version
NPM_VERSION=$(npm --version)
echo "📦 npm version: $NPM_VERSION"

# Install dependencies
echo "📥 Installing dependencies..."
if npm ci --prefer-offline --no-audit; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    echo "🔧 Trying with npm install..."
    npm install
fi

# Build project
echo "🏗️  Building project..."
if npm run build; then
    echo "✅ Build completed successfully"
    echo "📁 Output directory: dist/"
    
    # Show build info
    if [ -d "dist" ]; then
        echo "📊 Build statistics:"
        du -sh dist/
        echo "📄 Files created:"
        find dist/ -type f | head -10
    fi
else
    echo "❌ Build failed"
    echo "🔧 Troubleshooting tips:"
    echo "   1. Check if all dependencies are installed"
    echo "   2. Verify Node.js version (should be 18.x or 20.x)"
    echo "   3. Clear node_modules and try again: rm -rf node_modules && npm install"
    echo "   4. Check for syntax errors in source code"
    exit 1
fi

echo "🎉 Frontend build process completed successfully!"
