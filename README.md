# 🌍 Multiplier Time Bud

A Chrome extension that integrates with Google Calendar to display multiple time zones when scheduling meetings, helping global teams coordinate effortlessly.

## Features

- **Real-time timezone conversion** - Automatically converts meeting times to multiple timezones
- **Google Calendar integration** - Seamlessly works within Google Calendar interface
- **Customizable timezone list** - Choose from 35+ predefined timezones or add custom ones
- **Visual day indicators** - Shows +1/-1 for next/previous day meetings
- **Mini timezone display** - Quick timezone icons throughout the calendar
- **24/12 hour format support** - Choose your preferred time format
- **User-friendly interface** - Clean, modern design that matches Google's aesthetic
- **Reliable performance** - Lightweight and efficient background processing

## Installation

### From Chrome Web Store (Recommended)
*Coming soon - extension will be published to Chrome Web Store*

### Manual Installation (Developer Mode)

1. **Download the extension**
   ```bash
   git clone https://github.com/yourusername/multiplier-time-bud.git
   cd multiplier-time-bud
   ```

2. **Add extension icons**
   - Create PNG icons in the `icons/` directory:
     - `icon16.png` (16x16 pixels)
     - `icon32.png` (32x32 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)
   - You can use any icon generator or design tool to create these

3. **Install in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `multiplier-time-bud` folder
   - The extension should now appear in your toolbar

## Usage

### Getting Started

1. **Enable the extension**
   - Click the 🌍 icon in your Chrome toolbar
   - Ensure the extension is enabled (green status)

2. **Configure your timezones**
   - Click the ⚙️ Settings button in the popup
   - Select up to 8 timezones from the comprehensive list
   - Add custom timezones using standard identifiers (e.g., 'Europe/Berlin')
   - Save your settings

3. **Use with Google Calendar**
   - Visit [Google Calendar](https://calendar.google.com)
   - Create or edit an event
   - Look for the "🌍 Global Time Zones" widget
   - View equivalent times in all your configured zones

### Features in Detail

#### Timezone Widget
When creating or editing events, the timezone widget shows:
- All selected timezones with converted times
- Day indicators (+1/-1) for different days
- Toggle button to show/hide the widget
- Real-time updates as you change the meeting time

#### Mini Timezone Icons
- Small 🌍 icons appear on calendar time slots
- Click any icon to see current times in all zones
- Helpful for quick timezone checks without opening events

#### Settings Panel
- **General Settings**: Enable/disable extension, time format, day indicators
- **Timezone Selection**: Choose from 35+ predefined zones or add custom ones
- **Real-time Preview**: See current times in all selected zones
- **Import/Export**: Reset to defaults or save custom configurations

## Configuration

### Predefined Timezones
The extension includes popular timezones across all continents:

**Americas**: New York, Los Angeles, Chicago, Denver, Toronto, Mexico City, São Paulo, Buenos Aires

**Europe**: London, Paris, Berlin, Rome, Madrid, Amsterdam, Stockholm, Zurich, Prague, Warsaw, Moscow, Istanbul

**Africa**: Cairo, Johannesburg, Lagos

**Asia**: Dubai, Mumbai, Bangkok, Singapore, Manila, Hong Kong, Shanghai, Tokyo, Seoul

**Oceania**: Sydney, Melbourne, Auckland, Honolulu

### Custom Timezones
Add any timezone using standard IANA timezone identifiers:
- `America/New_York`
- `Europe/London`
- `Asia/Tokyo`
- `Australia/Sydney`

Find complete list at: [IANA Time Zone Database](https://www.iana.org/time-zones)

## Technical Details

### Architecture
- **Manifest Version 3** - Latest Chrome extension standard
- **Content Script** - Injects timezone functionality into Google Calendar
- **Background Service Worker** - Manages settings and API calls
- **Popup Interface** - Quick access and controls
- **Options Page** - Comprehensive settings management

### Permissions
- `storage` - Save user preferences
- `activeTab` - Access current tab for calendar integration
- `scripting` - Inject timezone widgets into Google Calendar
- `host_permissions` - Access to calendar.google.com

### Browser Support
- Chrome 88+
- Chromium-based browsers (Edge, Opera, Brave)

## Development

### Project Structure
```
multiplier-time-bud/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for calendar integration
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── options.html          # Settings page
├── options.js            # Settings functionality
├── styles.css            # Extension styles
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Development Setup
1. Clone the repository
2. Make your changes
3. Test in Chrome using Developer Mode
4. Submit pull requests for improvements

### Building for Production
1. Ensure all icon files are present
2. Test thoroughly in multiple timezones
3. Package as .zip file for Chrome Web Store submission

## Troubleshooting

### Common Issues

**Extension not appearing in Google Calendar**
- Ensure the extension is enabled in Chrome
- Refresh the Google Calendar page
- Check that you're on calendar.google.com

**Timezone conversions incorrect**
- Verify timezone identifiers in settings
- Check your system's timezone settings
- Ensure browser has correct date/time

**Settings not saving**
- Check Chrome storage permissions
- Try disabling and re-enabling the extension
- Clear browser cache and reload

### Support
For issues, feature requests, or questions:
- Create an issue on GitHub
- Check existing issues for solutions
- Provide browser version and error details

## Privacy

This extension:
- ✅ Stores settings locally in Chrome
- ✅ Only accesses Google Calendar pages
- ✅ Does not collect personal data
- ✅ Does not send data to external servers
- ✅ Works entirely offline after installation

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### Version 1.0.0
- Initial release
- Google Calendar integration
- Multiple timezone support
- Popup and options interfaces
- Real-time timezone conversion
- Day indicators
- Mini timezone display
- 24/12 hour format support
- Dark mode compatibility

---

**Made with ❤️ for global teams everywhere**

*Coordinate across timezones effortlessly with Multiplier Time Bud!*
