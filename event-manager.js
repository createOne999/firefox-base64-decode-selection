// Event manager module
// Provides robust event listener management and cleanup

const EventManager = {
  listeners: new Map(),
  escapeHandler: null,
  clickHandler: null,

  /**
   * Creates and registers a click-outside handler
   * @returns {Function} - The created handler function
   */
  createOutsideClickHandler() {
    const handler = (event) => {
      const display = UIComponents.getCurrentDisplay();
      if (display && !display.contains(event.target)) {
        this.cleanup();
      }
    };

    this.clickHandler = handler;
    return handler;
  },

  /**
   * Creates and registers an escape key handler
   * @returns {Function} - The created handler function
   */
  createEscapeHandler() {
    const handler = (event) => {
      if (event.key === 'Escape' && UIComponents.getCurrentDisplay()) {
        this.cleanup();
      }
    };

    this.escapeHandler = handler;
    return handler;
  },

  /**
   * Registers an event listener with tracking for cleanup
   * @param {EventTarget} target - Event target (document, window, element)
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event listener options
   * @returns {Function} - Handler function for reference
   */
  addListener(target, event, handler, options = {}) {
    const key = `${event}-${Date.now()}-${Math.random()}`;

    this.listeners.set(key, {
      target,
      event,
      handler,
      options
    });

    target.addEventListener(event, handler, options);
    return handler;
  },

  /**
   * Removes a specific tracked listener
   * @param {string} key - Listener key
   */
  removeListener(key) {
    const listener = this.listeners.get(key);
    if (listener) {
      listener.target.removeEventListener(
        listener.event,
        listener.handler,
        listener.options
      );
      this.listeners.delete(key);
    }
  },

  /**
   * Sets up all event listeners for the overlay
   */
  setup() {
    // Click outside handler
    const outsideClickHandler = this.createOutsideClickHandler();
    this.addListener(document, 'click', outsideClickHandler, true);

    // Escape key handler (only add once)
    if (!this.escapeHandler) {
      const escapeHandler = this.createEscapeHandler();
      this.addListener(document, 'keydown', escapeHandler);
    }
  },

  /**
   * Cleans up all event listeners and removes the display
   */
  cleanup() {
    // Remove all tracked listeners
    for (const [key, listener] of this.listeners) {
      listener.target.removeEventListener(
        listener.event,
        listener.handler,
        listener.options
      );
    }
    this.listeners.clear();
    this.clickHandler = null;

    // Remove the display
    UIComponents.removeDisplay();
  },

  /**
   * Removes just the click handler (for copy success message)
   */
  removeClickHandler() {
    if (this.clickHandler) {
      for (const [key, listener] of this.listeners) {
        if (listener.handler === this.clickHandler) {
          this.removeListener(key);
          break;
        }
      }
      this.clickHandler = null;
    }
  }
};

// Export for global use
if (typeof window !== 'undefined') {
  window.EventManager = EventManager;
}
