// Multiplier Time Bud - Popup Script
// Handles the extension popup interface

class TimezoneBudPopup {
  constructor() {
    this.settings = {};
    this.timezones = [];
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
    this.startTimeUpdater();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success) {
        this.settings = response.settings;
        this.timezones = response.settings.timezones || [];
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  setupEventListeners() {
    // Toggle switch
    const toggleSwitch = document.getElementById('toggleSwitch');
    toggleSwitch.addEventListener('click', () => {
      this.toggleExtension();
    });

    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    settingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });

    // Help button
    const helpBtn = document.getElementById('helpBtn');
    helpBtn.addEventListener('click', () => {
      this.showHelp();
    });
  }

  async toggleExtension() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'toggleExtension' });
      if (response.success) {
        this.settings.enabled = !this.settings.enabled;
        this.updateUI();
      }
    } catch (error) {
      console.error('Failed to toggle extension:', error);
    }
  }

  updateUI() {
    // Update status
    const status = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    const toggleSwitch = document.getElementById('toggleSwitch');

    if (this.settings.enabled) {
      status.className = 'status enabled';
      statusText.textContent = '✓ Active on Google Calendar';
      toggleSwitch.classList.add('active');
    } else {
      status.className = 'status disabled';
      statusText.textContent = '✗ Disabled';
      toggleSwitch.classList.remove('active');
    }

    // Update time grid
    this.updateTimeGrid();
  }

  updateTimeGrid() {
    const timeGrid = document.getElementById('timeGrid');
    timeGrid.innerHTML = '';

    if (!this.timezones.length) {
      timeGrid.innerHTML = '<div class="time-item">No timezones configured</div>';
      return;
    }

    this.timezones.forEach(tz => {
      const now = new Date();
      const tzTime = new Date(now.toLocaleString("en-US", { timeZone: tz.timezone }));
      const timeString = tzTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: !this.settings.use24HourFormat
      });

      const timeItem = document.createElement('div');
      timeItem.className = 'time-item';
      timeItem.innerHTML = `
        <span class="time-name">${tz.name}</span>
        <span class="time-value">${timeString}</span>
      `;
      timeGrid.appendChild(timeItem);
    });
  }

  startTimeUpdater() {
    // Update times every 30 seconds
    setInterval(() => {
      this.updateTimeGrid();
    }, 30000);
  }

  showHelp() {
    const helpText = `
Multiplier Time Bud Help:

1. Visit Google Calendar (calendar.google.com)
2. Create or edit an event
3. Look for the 🌍 Global Time Zones widget
4. See equivalent times in your configured zones
5. Click the 🌍 mini icons for quick time checks

Features:
• Automatic timezone conversion
• Day indicators (+1, -1)
• 12/24 hour format support
• Customizable timezone list

Configure your timezones in Settings!
    `;

    alert(helpText);
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TimezoneBudPopup();
});