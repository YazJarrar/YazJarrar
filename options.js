// Multiplier Time Bud - Options Script
// Handles the settings/options page functionality

class TimezoneBudOptions {
  constructor() {
    this.settings = {};
    this.allTimezones = this.getAllTimezones();
    this.selectedTimezones = [];
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.renderTimezoneList();
    this.updateUI();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success) {
        this.settings = response.settings;
        this.selectedTimezones = response.settings.timezones || [];
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.showStatus('Failed to load settings', 'error');
    }
  }

  setupEventListeners() {
    // Save button
    document.getElementById('saveBtn').addEventListener('click', () => {
      this.saveSettings();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetSettings();
    });

    // Add custom timezone button
    document.getElementById('addCustomBtn').addEventListener('click', () => {
      this.addCustomTimezone();
    });

    // Enter key in custom timezone inputs
    document.getElementById('customName').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addCustomTimezone();
    });

    document.getElementById('customTimezone').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addCustomTimezone();
    });
  }

  getAllTimezones() {
    return [
      { name: 'New York', timezone: 'America/New_York' },
      { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
      { name: 'Chicago', timezone: 'America/Chicago' },
      { name: 'Denver', timezone: 'America/Denver' },
      { name: 'Toronto', timezone: 'America/Toronto' },
      { name: 'Mexico City', timezone: 'America/Mexico_City' },
      { name: 'São Paulo', timezone: 'America/Sao_Paulo' },
      { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
      { name: 'London', timezone: 'Europe/London' },
      { name: 'Paris', timezone: 'Europe/Paris' },
      { name: 'Berlin', timezone: 'Europe/Berlin' },
      { name: 'Rome', timezone: 'Europe/Rome' },
      { name: 'Madrid', timezone: 'Europe/Madrid' },
      { name: 'Amsterdam', timezone: 'Europe/Amsterdam' },
      { name: 'Stockholm', timezone: 'Europe/Stockholm' },
      { name: 'Zurich', timezone: 'Europe/Zurich' },
      { name: 'Prague', timezone: 'Europe/Prague' },
      { name: 'Warsaw', timezone: 'Europe/Warsaw' },
      { name: 'Moscow', timezone: 'Europe/Moscow' },
      { name: 'Istanbul', timezone: 'Europe/Istanbul' },
      { name: 'Cairo', timezone: 'Africa/Cairo' },
      { name: 'Johannesburg', timezone: 'Africa/Johannesburg' },
      { name: 'Lagos', timezone: 'Africa/Lagos' },
      { name: 'Dubai', timezone: 'Asia/Dubai' },
      { name: 'Mumbai', timezone: 'Asia/Kolkata' },
      { name: 'Bangkok', timezone: 'Asia/Bangkok' },
      { name: 'Singapore', timezone: 'Asia/Singapore' },
      { name: 'Manila', timezone: 'Asia/Manila' },
      { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
      { name: 'Shanghai', timezone: 'Asia/Shanghai' },
      { name: 'Tokyo', timezone: 'Asia/Tokyo' },
      { name: 'Seoul', timezone: 'Asia/Seoul' },
      { name: 'Sydney', timezone: 'Australia/Sydney' },
      { name: 'Melbourne', timezone: 'Australia/Melbourne' },
      { name: 'Auckland', timezone: 'Pacific/Auckland' },
      { name: 'Honolulu', timezone: 'Pacific/Honolulu' }
    ];
  }

  renderTimezoneList() {
    const timezoneList = document.getElementById('timezoneList');
    timezoneList.innerHTML = '';

    // Include custom timezones that aren't in the preset list
    const customTimezones = this.selectedTimezones.filter(selected => 
      !this.allTimezones.some(preset => preset.timezone === selected.timezone)
    );

    const allTimezones = [...this.allTimezones, ...customTimezones];

    allTimezones.forEach(tz => {
      const isSelected = this.selectedTimezones.some(selected => selected.timezone === tz.timezone);
      const currentTime = this.getCurrentTime(tz.timezone);
      
      const item = document.createElement('div');
      item.className = 'timezone-item';
      item.innerHTML = `
        <input type="checkbox" id="tz-${tz.timezone}" ${isSelected ? 'checked' : ''}>
        <label for="tz-${tz.timezone}" class="timezone-name">${tz.name}</label>
        <span class="timezone-time">${currentTime}</span>
      `;

      const checkbox = item.querySelector('input');
      checkbox.addEventListener('change', (e) => {
        this.toggleTimezone(tz, e.target.checked);
      });

      timezoneList.appendChild(item);
    });

    this.updateSelectedCount();
  }

  getCurrentTime(timezone) {
    try {
      const now = new Date();
      const tzTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
      return tzTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: !this.settings.use24HourFormat
      });
    } catch (error) {
      return 'Invalid timezone';
    }
  }

  toggleTimezone(timezone, isSelected) {
    if (isSelected) {
      if (this.selectedTimezones.length >= 8) {
        this.showStatus('Maximum 8 timezones allowed', 'error');
        // Uncheck the checkbox
        document.getElementById(`tz-${timezone.timezone}`).checked = false;
        return;
      }
      
      if (!this.selectedTimezones.some(tz => tz.timezone === timezone.timezone)) {
        this.selectedTimezones.push(timezone);
      }
    } else {
      this.selectedTimezones = this.selectedTimezones.filter(tz => tz.timezone !== timezone.timezone);
    }
    
    this.updateSelectedCount();
  }

  updateSelectedCount() {
    const count = this.selectedTimezones.length;
    document.getElementById('selectedCount').textContent = `${count} time zone${count !== 1 ? 's' : ''} selected`;
  }

  addCustomTimezone() {
    const nameInput = document.getElementById('customName');
    const timezoneInput = document.getElementById('customTimezone');
    
    const name = nameInput.value.trim();
    const timezone = timezoneInput.value.trim();

    if (!name || !timezone) {
      this.showStatus('Please enter both name and timezone identifier', 'error');
      return;
    }

    // Validate timezone
    try {
      new Date().toLocaleString("en-US", { timeZone: timezone });
    } catch (error) {
      this.showStatus('Invalid timezone identifier', 'error');
      return;
    }

    // Check if already exists
    if (this.selectedTimezones.some(tz => tz.timezone === timezone)) {
      this.showStatus('Timezone already added', 'error');
      return;
    }

    // Add to selected timezones
    const customTimezone = { name, timezone };
    this.selectedTimezones.push(customTimezone);

    // Clear inputs
    nameInput.value = '';
    timezoneInput.value = '';

    // Re-render list
    this.renderTimezoneList();
    this.showStatus('Custom timezone added', 'success');
  }

  updateUI() {
    // Update checkboxes
    document.getElementById('enableExtension').checked = this.settings.enabled !== false;
    document.getElementById('use24HourFormat').checked = this.settings.use24HourFormat !== false;
    document.getElementById('showDayIndicators').checked = this.settings.showDayIndicators !== false;
    document.getElementById('showInMiniView').checked = this.settings.showInMiniView !== false;
  }

  async saveSettings() {
    try {
      const settings = {
        enabled: document.getElementById('enableExtension').checked,
        use24HourFormat: document.getElementById('use24HourFormat').checked,
        showDayIndicators: document.getElementById('showDayIndicators').checked,
        showInMiniView: document.getElementById('showInMiniView').checked,
        timezones: this.selectedTimezones
      };

      const response = await chrome.runtime.sendMessage({ 
        action: 'saveSettings', 
        settings 
      });

      if (response.success) {
        this.showStatus('Settings saved successfully!', 'success');
        this.settings = settings;
      } else {
        this.showStatus('Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showStatus('Failed to save settings', 'error');
    }
  }

  async resetSettings() {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) {
      return;
    }

    try {
      const defaultSettings = {
        enabled: true,
        use24HourFormat: true,
        showDayIndicators: true,
        showInMiniView: true,
        timezones: [
          { name: 'New York', timezone: 'America/New_York' },
          { name: 'London', timezone: 'Europe/London' },
          { name: 'Tokyo', timezone: 'Asia/Tokyo' },
          { name: 'Sydney', timezone: 'Australia/Sydney' }
        ]
      };

      const response = await chrome.runtime.sendMessage({ 
        action: 'saveSettings', 
        settings: defaultSettings 
      });

      if (response.success) {
        this.settings = defaultSettings;
        this.selectedTimezones = defaultSettings.timezones;
        this.updateUI();
        this.renderTimezoneList();
        this.showStatus('Settings reset to defaults!', 'success');
      } else {
        this.showStatus('Failed to reset settings', 'error');
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
      this.showStatus('Failed to reset settings', 'error');
    }
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}

// Initialize options page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TimezoneBudOptions();
});