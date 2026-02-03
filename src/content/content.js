// Main content script orchestrator
// Coordinates all modules to handle Base64 decoding and UI display

/**
 * Main extension controller
 */
const Base64Extension = {
  /**
   * Initializes the extension
   */
  init() {
    this.setupRuntimeListener();
    console.log('Base64 Decoder Extension initialized');
  },

  /**
   * Sets up the runtime message listener
   */
  setupRuntimeListener() {
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'decodeBase64') {
        this.handleDecodeRequest();
      }
    });
  },

  /**
   * Handles the decode Base64 request
   */
  handleDecodeRequest() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText) {
      console.log('No text selected for decoding.');
      EventManager.cleanup();
      return;
    }

    const decodedText = Base64Decoder.decode(selectedText);

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      this.showResult(decodedText, rect);
    } else {
      console.log('Selection range not available.');
      EventManager.cleanup();
    }
  },

  /**
   * Shows the decoding result in the overlay
   * @param {string} text - Decoded text or error message
   * @param {DOMRect} rect - Selection bounding rect
   */
  showResult(text, rect) {
    // Clean up any existing display first
    EventManager.cleanup();

    // Create the new display with cleanup callback for copy action
    UIComponents.createResultDisplay(text, rect, () => EventManager.cleanup());

    // Setup event listeners for the display
    EventManager.setup();
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Base64Extension.init());
} else {
  Base64Extension.init();
}
