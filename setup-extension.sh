#!/bin/bash
# Setup script for Multiplier Time Bud Chrome Extension

echo "🌍 Multiplier Time Bud - Extension Setup"
echo "======================================="

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Please run this script from the extension directory."
    exit 1
fi

echo "✅ Found manifest.json"

# Check if icons directory exists
if [ ! -d "icons" ]; then
    echo "📁 Creating icons directory..."
    mkdir -p icons
fi

# Create simple PNG files if they don't exist
create_simple_png() {
    local size=$1
    local filename="icons/icon${size}.png"
    
    if [ ! -f "$filename" ]; then
        echo "🎨 Creating placeholder icon: $filename"
        
        # Create a simple colored square PNG (this is a minimal PNG file)
        # This creates a very basic 1x1 blue pixel that Chrome will scale
        printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x00\x00\x00\x7f\x6d\xb0\x00\x00\x00\x00IEND\xaeB`\x82' > "$filename"
        
        # Alternative: Create a simple SVG and note it for user
        if [ ! -f "$filename" ]; then
            echo "⚠️  Could not create PNG file. Please create $filename manually."
            echo "   You can use any ${size}x${size} PNG image as a placeholder."
        fi
    else
        echo "✅ Icon already exists: $filename"
    fi
}

# Create all required icon sizes
for size in 16 32 48 128; do
    create_simple_png $size
done

echo ""
echo "📋 Extension Setup Complete!"
echo "=============================="
echo ""
echo "📁 Files created:"
echo "   ✅ manifest.json - Extension configuration"
echo "   ✅ background.js - Background service worker"
echo "   ✅ content.js - Google Calendar integration"
echo "   ✅ popup.html/js - Extension popup interface"
echo "   ✅ options.html/js - Settings page"
echo "   ✅ styles.css - Extension styles"
echo "   ✅ icons/ - Extension icons (placeholder)"
echo ""
echo "🚀 To install the extension:"
echo "   1. Open Chrome and go to chrome://extensions/"
echo "   2. Enable 'Developer mode' (toggle in top right)"
echo "   3. Click 'Load unpacked'"
echo "   4. Select this directory ($(pwd))"
echo ""
echo "🎨 Icon Note:"
echo "   The extension uses placeholder icons. For better appearance,"
echo "   replace the PNG files in the icons/ directory with proper"
echo "   ${size}x${size} images featuring a clock or timezone theme."
echo ""
echo "📖 Usage:"
echo "   1. Install the extension in Chrome"
echo "   2. Visit Google Calendar (calendar.google.com)"
echo "   3. Create or edit an event"
echo "   4. Look for the '🌍 Global Time Zones' widget"
echo "   5. Configure timezones via the extension popup"
echo ""
echo "🔧 Configuration:"
echo "   - Click the extension icon in Chrome toolbar"
echo "   - Click 'Settings' to configure timezones"
echo "   - Choose up to 8 timezones from the list"
echo "   - Toggle 24-hour format, day indicators, etc."
echo ""
echo "✨ Features:"
echo "   - Real-time timezone conversion"
echo "   - Google Calendar integration"
echo "   - Customizable timezone list"
echo "   - Visual day indicators (+1/-1)"
echo "   - Mini timezone display"
echo "   - Clean, modern interface"
echo ""
echo "🎯 Happy scheduling across timezones!"