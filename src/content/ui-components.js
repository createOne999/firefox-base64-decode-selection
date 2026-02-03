// UI components module
// Handles creation and display of overlay UI elements

const UIComponents = {
  displayDiv: null,

  /**
   * Creates the main result display overlay
   * @param {string} text - Text to display
   * @param {DOMRect} rect - Selection bounding rect
   * @param {Function} onCopySuccess - Callback when copy succeeds
   * @returns {HTMLElement} - The created display element
   */
  createResultDisplay(text, rect, onCopySuccess) {
    const colors = DOMUtils.getColorScheme();
    const display = document.createElement('div');

    // Base styling
    display.classList.add('base64-decode-result');
    display.style.cssText = `
      position: absolute;
      z-index: ${CONFIG.display.zIndex};
      padding: ${CONFIG.display.padding};
      background-color: ${colors.bg};
      color: ${colors.text};
      border: 1px solid ${colors.border};
      border-radius: ${CONFIG.display.borderRadius};
      box-shadow: ${CONFIG.display.boxShadow};
      word-wrap: break-word;
      max-width: ${CONFIG.display.maxWidth};
      pointer-events: auto;
      font-family: ${CONFIG.display.fontFamily};
      font-size: ${CONFIG.display.fontSize};
      cursor: text;
      user-select: text;
    `;

    // Create content container
    const contentContainer = this.createContentContainer(text, colors, onCopySuccess);
    display.appendChild(contentContainer);

    // Position the display
    this.positionDisplay(display, rect);

    // Add click handler to prevent propagation
    display.addEventListener('click', (e) => e.stopPropagation());

    document.body.appendChild(display);
    this.displayDiv = display;

    return display;
  },

  /**
   * Creates the content container with text and copy button
   * @param {string} text - Text to display
   * @param {Object} colors - Color scheme
   * @param {Function} onCopySuccess - Callback when copy succeeds
   * @returns {HTMLElement} - Content container element
   */
  createContentContainer(text, colors, onCopySuccess) {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: ${CONFIG.display.gap};
    `;

    // Text element
    const textDiv = this.createTextElement(text);
    container.appendChild(textDiv);

    // Copy button
    const copyButton = this.createCopyButton(text, colors, onCopySuccess);
    container.appendChild(copyButton);

    return container;
  },

  /**
   * Creates the text display element
   * @param {string} text - Text to display
   * @returns {HTMLElement} - Text element
   */
  createTextElement(text) {
    const textDiv = document.createElement('div');
    textDiv.textContent = text;
    textDiv.style.cssText = `
      word-wrap: break-word;
      max-height: ${CONFIG.display.maxHeight};
      overflow-y: auto;
      flex: 1;
    `;
    return textDiv;
  },

  /**
   * Creates the copy button
   * @param {string} text - Text to copy
   * @param {Object} colors - Color scheme
   * @param {Function} onCopySuccess - Callback when copy succeeds
   * @returns {HTMLElement} - Copy button element
   */
  createCopyButton(text, colors, onCopySuccess) {
    const button = document.createElement('button');
    button.textContent = CONFIG.icons.copy;
    button.title = CONFIG.labels.copyButtonTitle;
    button.style.cssText = `
      padding: ${CONFIG.copyButton.padding};
      background-color: ${colors.buttonBg};
      color: ${colors.buttonText};
      border: 1px solid ${colors.border};
      border-radius: ${CONFIG.copyButton.borderRadius};
      cursor: pointer;
      font-family: ${CONFIG.display.fontFamily};
      font-size: ${CONFIG.copyButton.fontSize};
      line-height: ${CONFIG.copyButton.lineHeight};
      flex-shrink: 0;
    `;

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = colors.buttonHover;
    });
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = colors.buttonBg;
    });

    // Click handler
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleCopy(text, onCopySuccess);
    });

    return button;
  },

  /**
   * Handles copy to clipboard operation
   * @param {string} text - Text to copy
   * @param {Function} onSuccess - Callback to execute on successful copy
   */
  handleCopy(text, onSuccess) {
    navigator.clipboard.writeText(text).then(() => {
      this.showCopyMessage(text);
      if (onSuccess) {
        onSuccess();
      }
    }).catch(err => {
      console.error(CONFIG.errors.copyFailed, err);
    });
  },

  /**
   * Shows a copy success message
   * @param {string} copiedText - The text that was copied
   */
  showCopyMessage(copiedText) {
    const displayText = DOMUtils.truncateText(copiedText);
    const messageDiv = document.createElement('div');

    const strong = document.createElement('strong');
    strong.textContent = CONFIG.labels.copiedPrefix;
    messageDiv.appendChild(strong);
    messageDiv.appendChild(document.createTextNode(' ' + displayText));
    messageDiv.style.cssText = `
      position: fixed;
      top: ${CONFIG.message.top};
      left: 50%;
      transform: translateX(-50%);
      z-index: ${CONFIG.message.zIndex};
      padding: ${CONFIG.message.padding};
      background-color: ${CONFIG.message.backgroundColor};
      color: ${CONFIG.message.color};
      border-radius: ${CONFIG.message.borderRadius};
      font-family: ${CONFIG.display.fontFamily};
      font-size: ${CONFIG.message.fontSize};
      opacity: 1;
      transition: opacity 0.3s ease-out;
      max-width: 80%;
      word-wrap: break-word;
    `;

    document.body.appendChild(messageDiv);

    // Fade out and remove
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      setTimeout(() => {
        messageDiv.remove();
      }, CONFIG.message.fadeDuration);
    }, CONFIG.message.fadeDelay);
  },

  /**
   * Positions the display element based on viewport calculations
   * @param {HTMLElement} display - Display element to position
   * @param {DOMRect} rect - Selection bounding rect
   */
  positionDisplay(display, rect) {
    const width = display.offsetWidth;
    const height = display.offsetHeight;
    const { top, left, isFixed } = DOMUtils.calculateOverlayPosition(rect, width, height);

    display.style.top = `${top}px`;

    if (isFixed) {
      display.style.position = 'fixed';
      display.style.left = Math.max(10, rect.left) + 'px';
      display.style.left = Math.min(
        parseInt(display.style.left),
        window.innerWidth - width - 10
      ) + 'px';
    } else {
      display.style.left = `${left}px`;
    }
  },

  /**
   * Gets the current display element
   * @returns {HTMLElement|null} - Current display element or null
   */
  getCurrentDisplay() {
    return this.displayDiv;
  },

  /**
   * Removes and cleans up the display
   */
  removeDisplay() {
    if (this.displayDiv) {
      this.displayDiv.remove();
      this.displayDiv = null;
    }
  }
};

// Export for global use
if (typeof window !== 'undefined') {
  window.UIComponents = UIComponents;
}
