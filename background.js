// Multiplier Time Bud - Background Script
// Manages extension state and provides API for content scripts

class TimezoneBudBackground {
  constructor() {
    this.initializeExtension();
  }

  async initializeExtension() {
    // Set default settings on install
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.setDefaultSettings();
      }
    });

    // Handle messages from content script and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Initialize default settings if they don't exist
    const settings = await chrome.storage.sync.get(['timezones', 'enabled']);
    if (!settings.timezones) {
      await this.setDefaultSettings();
    }
  }

  async setDefaultSettings() {
    const defaultSettings = {
      enabled: true,
      timezones: [
        { name: 'New York', timezone: 'America/New_York' },
        { name: 'London', timezone: 'Europe/London' },
        { name: 'Tokyo', timezone: 'Asia/Tokyo' },
        { name: 'Sydney', timezone: 'Australia/Sydney' }
      ],
      showDayIndicators: true,
      use24HourFormat: true,
      showInMiniView: true
    };

    await chrome.storage.sync.set(defaultSettings);
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getTimezones':
          const timezones = await this.getTimezones();
          sendResponse({ success: true, timezones });
          break;

        case 'saveTimezones':
          await this.saveTimezones(request.timezones);
          sendResponse({ success: true });
          break;

        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, settings });
          break;

        case 'saveSettings':
          await this.saveSettings(request.settings);
          sendResponse({ success: true });
          break;

        case 'toggleExtension':
          await this.toggleExtension();
          sendResponse({ success: true });
          break;

        case 'convertTime':
          const convertedTimes = await this.convertTime(request.time, request.fromTimezone);
          sendResponse({ success: true, times: convertedTimes });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async getTimezones() {
    const result = await chrome.storage.sync.get(['timezones']);
    return result.timezones || [];
  }

  async saveTimezones(timezones) {
    await chrome.storage.sync.set({ timezones });
    
    // Notify content scripts to update
    const tabs = await chrome.tabs.query({ url: 'https://calendar.google.com/*' });
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated' });
      } catch (error) {
        console.log('Could not send message to tab:', tab.id);
      }
    }
  }

  async getSettings() {
    const result = await chrome.storage.sync.get([
      'enabled', 
      'timezones', 
      'showDayIndicators', 
      'use24HourFormat', 
      'showInMiniView'
    ]);
    return result;
  }

  async saveSettings(settings) {
    await chrome.storage.sync.set(settings);
    
    // Notify content scripts to update
    const tabs = await chrome.tabs.query({ url: 'https://calendar.google.com/*' });
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated' });
      } catch (error) {
        console.log('Could not send message to tab:', tab.id);
      }
    }
  }

  async toggleExtension() {
    const result = await chrome.storage.sync.get(['enabled']);
    const newState = !result.enabled;
    await chrome.storage.sync.set({ enabled: newState });
    
    // Update extension icon
    const iconPath = newState ? 'icons/icon' : 'icons/icon_disabled';
    await chrome.action.setIcon({
      path: {
        '16': `${iconPath}16.png`,
        '32': `${iconPath}32.png`,
        '48': `${iconPath}48.png`,
        '128': `${iconPath}128.png`
      }
    });

    // Notify content scripts
    const tabs = await chrome.tabs.query({ url: 'https://calendar.google.com/*' });
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleExtension', enabled: newState });
      } catch (error) {
        console.log('Could not send message to tab:', tab.id);
      }
    }
  }

  async convertTime(time, fromTimezone) {
    const settings = await this.getSettings();
    const timezones = settings.timezones || [];
    
    // Create a date object for the given time
    const [hours, minutes] = time.split(':');
    const baseDate = new Date();
    baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Convert to each timezone
    const convertedTimes = timezones.map(tz => {
      const tzTime = new Date(baseDate.toLocaleString("en-US", { timeZone: tz.timezone }));
      const timeString = tzTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: !settings.use24HourFormat
      });
      
      const dayDiff = tzTime.getDate() - baseDate.getDate();
      let dayIndicator = '';
      if (settings.showDayIndicators) {
        if (dayDiff > 0) dayIndicator = ' +1';
        else if (dayDiff < 0) dayIndicator = ' -1';
      }

      return {
        name: tz.name,
        timezone: tz.timezone,
        time: timeString,
        dayIndicator
      };
    });

    return convertedTimes;
  }
}

// Initialize the background script
new TimezoneBudBackground();