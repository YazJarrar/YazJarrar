// Multiplier Time Bud - Content Script
// Integrates with Google Calendar to display multiple time zones

class TimezoneBud {
  constructor() {
    this.timezones = [];
    this.observer = null;
    this.isEnabled = true;
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupObserver();
    this.addTimezoneDisplay();
    this.injectStyles();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['timezones', 'enabled']);
      this.timezones = result.timezones || [
        { name: 'New York', timezone: 'America/New_York' },
        { name: 'London', timezone: 'Europe/London' },
        { name: 'Tokyo', timezone: 'Asia/Tokyo' },
        { name: 'Sydney', timezone: 'Australia/Sydney' }
      ];
      this.isEnabled = result.enabled !== false;
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  setupObserver() {
    this.observer = new MutationObserver(() => {
      this.addTimezoneDisplay();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  addTimezoneDisplay() {
    if (!this.isEnabled) return;

    // Look for event creation/editing dialogs
    const eventDialogs = document.querySelectorAll('[data-eventid], [role="dialog"]');
    eventDialogs.forEach(dialog => {
      if (dialog.querySelector('.timezone-bud-container')) return;
      
      const timeInputs = dialog.querySelectorAll('input[type="time"], input[aria-label*="time"]');
      if (timeInputs.length > 0) {
        this.addTimezoneWidget(dialog, timeInputs[0]);
      }
    });

    // Look for calendar grid times
    const timeSlots = document.querySelectorAll('[data-time], .calendar-time');
    timeSlots.forEach(slot => {
      if (!slot.querySelector('.timezone-bud-mini')) {
        this.addMiniTimezoneDisplay(slot);
      }
    });
  }

  addTimezoneWidget(container, timeInput) {
    const widget = document.createElement('div');
    widget.className = 'timezone-bud-container';
    widget.innerHTML = `
      <div class="timezone-bud-header">
        <span>🌍 Global Time Zones</span>
        <button class="timezone-bud-toggle" title="Toggle timezone display">⌚</button>
      </div>
      <div class="timezone-bud-content">
        <div class="timezone-bud-grid"></div>
      </div>
    `;

    // Insert after the time input
    timeInput.parentNode.insertBefore(widget, timeInput.nextSibling);

    // Add event listeners
    const toggleBtn = widget.querySelector('.timezone-bud-toggle');
    const content = widget.querySelector('.timezone-bud-content');
    
    toggleBtn.addEventListener('click', () => {
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });

    // Listen for time changes
    timeInput.addEventListener('input', () => {
      this.updateTimezoneDisplay(widget, timeInput.value);
    });

    timeInput.addEventListener('change', () => {
      this.updateTimezoneDisplay(widget, timeInput.value);
    });

    // Initial display
    this.updateTimezoneDisplay(widget, timeInput.value);
  }

  addMiniTimezoneDisplay(timeSlot) {
    const mini = document.createElement('div');
    mini.className = 'timezone-bud-mini';
    mini.innerHTML = '🌍';
    mini.title = 'Click to see global times';
    
    mini.addEventListener('click', () => {
      this.showTimezonePopup(timeSlot);
    });

    timeSlot.appendChild(mini);
  }

  updateTimezoneDisplay(widget, timeValue) {
    if (!timeValue) return;

    const grid = widget.querySelector('.timezone-bud-grid');
    const baseDate = new Date();
    
    // Parse the time input
    const [hours, minutes] = timeValue.split(':');
    baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    grid.innerHTML = '';
    
    this.timezones.forEach(tz => {
      const tzTime = new Date(baseDate.toLocaleString("en-US", { timeZone: tz.timezone }));
      const timeString = tzTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
      
      const dayDiff = tzTime.getDate() - baseDate.getDate();
      let dayIndicator = '';
      if (dayDiff > 0) dayIndicator = ' +1';
      else if (dayDiff < 0) dayIndicator = ' -1';

      const tzDiv = document.createElement('div');
      tzDiv.className = 'timezone-bud-item';
      tzDiv.innerHTML = `
        <span class="timezone-name">${tz.name}</span>
        <span class="timezone-time">${timeString}${dayIndicator}</span>
      `;
      
      grid.appendChild(tzDiv);
    });
  }

  showTimezonePopup(timeSlot) {
    const popup = document.createElement('div');
    popup.className = 'timezone-bud-popup';
    popup.innerHTML = `
      <div class="timezone-bud-popup-content">
        <div class="timezone-bud-popup-header">
          <span>Global Time Zones</span>
          <button class="timezone-bud-close">×</button>
        </div>
        <div class="timezone-bud-popup-body">
          ${this.timezones.map(tz => {
            const now = new Date();
            const tzTime = new Date(now.toLocaleString("en-US", { timeZone: tz.timezone }));
            const timeString = tzTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            });
            return `
              <div class="timezone-bud-popup-item">
                <span class="timezone-name">${tz.name}</span>
                <span class="timezone-time">${timeString}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // Position popup
    const rect = timeSlot.getBoundingClientRect();
    popup.style.left = rect.left + 'px';
    popup.style.top = (rect.bottom + 5) + 'px';

    // Close handlers
    const closeBtn = popup.querySelector('.timezone-bud-close');
    closeBtn.addEventListener('click', () => {
      popup.remove();
    });

    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.remove();
      }
    });
  }

  injectStyles() {
    if (document.querySelector('#timezone-bud-styles')) return;

    const style = document.createElement('style');
    style.id = 'timezone-bud-styles';
    style.textContent = `
      .timezone-bud-container {
        margin: 10px 0;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #f8f9fa;
        font-family: 'Google Sans', Arial, sans-serif;
      }

      .timezone-bud-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #fff;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 8px 8px 0 0;
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .timezone-bud-toggle {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .timezone-bud-toggle:hover {
        background: #f0f0f0;
      }

      .timezone-bud-content {
        padding: 12px;
      }

      .timezone-bud-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 8px;
      }

      .timezone-bud-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 13px;
      }

      .timezone-name {
        font-weight: 500;
        color: #333;
      }

      .timezone-time {
        font-family: 'Roboto Mono', monospace;
        font-weight: 600;
        color: #1a73e8;
      }

      .timezone-bud-mini {
        position: absolute;
        top: 2px;
        right: 2px;
        cursor: pointer;
        font-size: 12px;
        padding: 2px 4px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.9);
        transition: background 0.2s;
      }

      .timezone-bud-mini:hover {
        background: rgba(26, 115, 232, 0.1);
      }

      .timezone-bud-popup {
        position: fixed;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
      }

      .timezone-bud-popup-content {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        min-width: 300px;
        max-width: 400px;
      }

      .timezone-bud-popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #e0e0e0;
        font-weight: 500;
        color: #333;
      }

      .timezone-bud-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        color: #666;
        transition: background 0.2s;
      }

      .timezone-bud-close:hover {
        background: #f0f0f0;
      }

      .timezone-bud-popup-body {
        padding: 12px 16px;
      }

      .timezone-bud-popup-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .timezone-bud-popup-item:last-child {
        border-bottom: none;
      }
    `;

    document.head.appendChild(style);
  }
}

// Initialize the extension
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TimezoneBud();
  });
} else {
  new TimezoneBud();
}