// Background script - Context menu management
// Handles context menu creation and message passing to content scripts

const ContextMenuManager = {
  MENU_ID: 'decode-base64',
  MENU_TITLE: 'Base64 Decode',

  /**
   * Creates the context menu item
   * @returns {Promise<void>}
   */
  async create() {
    try {
      // Remove existing menu items to prevent duplication
      await browser.contextMenus.removeAll();

      // Create the new context menu item
      await browser.contextMenus.create({
        id: this.MENU_ID,
        title: this.MENU_TITLE,
        contexts: ['selection']
      });

      console.log('Base64 Decode context menu created.');
    } catch (error) {
      console.error('Failed to create context menu:', error);
    }
  },

  /**
   * Handles context menu click events
   * @param {Object} info - Click info
   * @param {Object} tab - Tab information
   */
  async handleClick(info, tab) {
    if (info.menuItemId !== this.MENU_ID) {
      return;
    }

    try {
      await browser.tabs.sendMessage(tab.id, { action: 'decodeBase64' });
    } catch (error) {
      // Content script might not be loaded yet
      console.error('Failed to send message to content script:', error);

      // Try to inject content scripts dynamically if needed
      await this.injectContentScripts(tab.id);
    }
  },

  /**
   * Content scripts are automatically injected via manifest.json.
   * Dynamic script injection is not supported in Firefox Manifest V3.
   * @param {number} tabId - Tab ID (unused, kept for API compatibility)
   */
  async injectContentScripts(tabId) {
    // Content scripts are loaded automatically by manifest.json
    // No dynamic injection needed for Firefox extensions
    console.log('Content scripts should be loaded via manifest.json');
  },

  /**
   * Initializes the context menu manager
   */
  init() {
    // Create menu on installation/update
    browser.runtime.onInstalled.addListener(() => this.create());

    // Create menu on browser startup
    browser.runtime.onStartup.addListener(() => this.create());

    // Handle menu clicks
    browser.contextMenus.onClicked.addListener((info, tab) =>
      this.handleClick(info, tab)
    );
  }
};

// Initialize the context menu manager
ContextMenuManager.init();
