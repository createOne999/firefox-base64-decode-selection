// DOM manipulation utilities module
// Provides helper functions for DOM operations

const DOMUtils = {
  /**
   * Detects if dark mode is preferred
   * @returns {boolean} - True if dark mode is active
   */
  isDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  /**
   * Gets the appropriate color scheme based on current mode
   * @returns {Object} - Color scheme object
   */
  getColorScheme() {
    return this.isDarkMode() ? CONFIG.colors.dark : CONFIG.colors.light;
  },

  /**
   * Gets the viewport dimensions and scroll position
   * @returns {Object} - Viewport info { scrollX, scrollY, width, height }
   */
  getViewportInfo() {
    return {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },

  /**
   * Calculates the optimal position for an overlay element
   * @param {DOMRect} rect - The bounding client rect of the selection
   * @param {number} elementWidth - Width of the overlay element
   * @param {number} elementHeight - Height of the overlay element
   * @returns {Object} - Position { top, left, isFixed }
   */
  calculateOverlayPosition(rect, elementWidth, elementHeight) {
    const { scrollX, scrollY, width: viewportWidth, height: viewportHeight } = this.getViewportInfo();
    const { padding, minMargin, fallbackFixedTop } = CONFIG.position;

    let top;
    let left;
    let isFixed = false;

    // Calculate ideal positions
    const idealTopBelow = rect.bottom + scrollY + padding;
    const fitsBelow = (idealTopBelow + elementHeight) <= (scrollY + viewportHeight);

    const idealTopAbove = rect.top + scrollY - elementHeight - padding;
    const fitsAbove = idealTopAbove >= scrollY;

    // Determine vertical position
    if (fitsBelow) {
      top = idealTopBelow;
    } else if (fitsAbove) {
      top = idealTopAbove;
    } else {
      // Fallback: fixed position at viewport bottom
      isFixed = true;
      top = viewportHeight - elementHeight - minMargin;
      if (top < minMargin) {
        top = minMargin;
      }
    }

    // Calculate horizontal position
    const idealLeft = rect.left + scrollX;
    left = Math.max(scrollX + minMargin, idealLeft);
    left = Math.min(left, scrollX + viewportWidth - elementWidth - minMargin);

    // Adjust if element is too wide
    if (elementWidth > viewportWidth - (minMargin * 2)) {
      left = scrollX + minMargin;
    }

    return { top, left, isFixed };
  },

  /**
   * Truncates text for display purposes
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} - Truncated text with ellipsis if needed
   */
  truncateText(text, maxLength = CONFIG.text.maxDisplayLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
};

// Export for global use
if (typeof window !== 'undefined') {
  window.DOMUtils = DOMUtils;
}
