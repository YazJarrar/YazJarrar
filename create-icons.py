#!/usr/bin/env python3
"""
Icon generator for Multiplier Time Bud Chrome Extension
Converts SVG icons to PNG format required by Chrome extensions
"""

import os
import subprocess
import sys

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        subprocess.run(['inkscape', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def convert_svg_to_png(svg_file, png_file, size):
    """Convert SVG to PNG using Inkscape"""
    try:
        subprocess.run([
            'inkscape',
            '--export-filename', png_file,
            '--export-width', str(size),
            '--export-height', str(size),
            svg_file
        ], check=True, capture_output=True)
        print(f"✓ Created {png_file}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to create {png_file}: {e}")
        return False

def create_icons():
    """Create PNG icons from SVG files"""
    icons_dir = 'icons'
    sizes = [16, 32, 48, 128]
    
    if not os.path.exists(icons_dir):
        print(f"✗ {icons_dir} directory not found")
        return False
    
    success_count = 0
    for size in sizes:
        svg_file = os.path.join(icons_dir, f'icon{size}.svg')
        png_file = os.path.join(icons_dir, f'icon{size}.png')
        
        if os.path.exists(svg_file):
            if convert_svg_to_png(svg_file, png_file, size):
                success_count += 1
        else:
            print(f"✗ {svg_file} not found")
    
    print(f"\n{success_count}/{len(sizes)} icons created successfully")
    return success_count == len(sizes)

def main():
    """Main function"""
    print("🌍 Multiplier Time Bud - Icon Generator")
    print("=" * 40)
    
    if not check_dependencies():
        print("✗ Inkscape not found. Please install Inkscape:")
        print("  - macOS: brew install inkscape")
        print("  - Ubuntu/Debian: sudo apt install inkscape")
        print("  - Windows: Download from https://inkscape.org/")
        sys.exit(1)
    
    print("✓ Inkscape found")
    
    if create_icons():
        print("\n✅ All icons created successfully!")
        print("You can now install the extension in Chrome Developer Mode")
    else:
        print("\n❌ Some icons failed to create")
        sys.exit(1)

if __name__ == '__main__':
    main()