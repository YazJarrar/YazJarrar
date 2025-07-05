#!/usr/bin/env python3
"""
Create simple placeholder PNG icons for the Multiplier Time Bud Chrome Extension
Uses PIL (Pillow) to create basic colored icons
"""

import os
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    """Create a simple circular icon with a clock design"""
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw outer circle (blue background)
    margin = 2
    draw.ellipse([margin, margin, size-margin, size-margin], 
                 fill=(26, 115, 232, 255), outline=(255, 255, 255, 255), width=2)
    
    # Draw clock hands
    center = size // 2
    radius = center - 4
    
    # Hour hand (shorter)
    hand_length = radius * 0.6
    draw.line([center, center, center, center - hand_length], 
              fill=(255, 255, 255, 255), width=max(1, size // 16))
    
    # Minute hand (longer)
    hand_length = radius * 0.8
    draw.line([center, center, center + hand_length * 0.7, center - hand_length * 0.7], 
              fill=(255, 255, 255, 255), width=max(1, size // 16))
    
    # Center dot
    dot_size = max(1, size // 16)
    draw.ellipse([center - dot_size, center - dot_size, 
                  center + dot_size, center + dot_size], 
                 fill=(255, 255, 255, 255))
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"✓ Created {filename}")

def main():
    """Create all required icon sizes"""
    print("🌍 Multiplier Time Bud - Creating Placeholder Icons")
    print("=" * 50)
    
    # Check if PIL is available
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        print("✗ PIL (Pillow) not found. Installing...")
        import subprocess
        subprocess.run(['pip', 'install', 'Pillow'])
        from PIL import Image, ImageDraw
    
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)
    
    # Create all required sizes
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        filename = f'icons/icon{size}.png'
        create_icon(size, filename)
    
    print("\n✅ All placeholder icons created successfully!")
    print("You can now install the extension in Chrome Developer Mode")
    print("\nTo install:")
    print("1. Open Chrome and go to chrome://extensions/")
    print("2. Enable 'Developer mode' (toggle in top right)")
    print("3. Click 'Load unpacked'")
    print("4. Select this directory")

if __name__ == '__main__':
    main()