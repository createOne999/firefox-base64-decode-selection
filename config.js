// Constants configuration
// Colors, styles, and messages centralized

const CONFIG = {
  // Color schemes for dark/light mode
  colors: {
    dark: {
      bg: '#333',
      text: '#fff',
      border: '#555',
      buttonBg: '#4a4a4a',
      buttonHover: '#5a5a5a',
      buttonText: '#fff'
    },
    light: {
      bg: '#f5f5f5',
      text: '#333',
      border: '#ccc',
      buttonBg: '#e0e0e0',
      buttonHover: '#d0d0d0',
      buttonText: '#333'
    }
  },

  // Display styles
  display: {
    zIndex: 9999,
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)',
    maxWidth: '80%',
    fontFamily: 'monospace',
    fontSize: '14px',
    maxHeight: '300px',
    gap: '10px'
  },

  // Copy button styles
  copyButton: {
    padding: '4px 8px',
    borderRadius: '3px',
    fontSize: '14px',
    lineHeight: '1'
  },

  // Message styles
  message: {
    top: '20px',
    zIndex: 10000,
    padding: '10px 30px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    borderRadius: '5px',
    fontSize: '14px',
    fadeDelay: 1500,
    fadeDuration: 300
  },

  // Positioning
  position: {
    padding: 5, // px
    minMargin: 10, // px
    fallbackFixedTop: 10 // px
  },

  // Text truncation
  text: {
    maxDisplayLength: 50
  },

  // Error messages
  errors: {
    invalidCharacters: 'Error: Invalid characters found in the string. Cannot decode Base64.',
    genericDecodeError: 'Error: Failed to decode Base64. (Invalid characters or structure)',
    copyFailed: 'Failed to copy:'
  },

  // Icons
  icons: {
    copy: '\u2398' // Unicode copy icon (⎘)
  },

  // UI labels
  labels: {
    copyButtonTitle: 'Copy to clipboard',
    copiedPrefix: 'Copied:'
  }
};

// Export for use in modules (in browser extension context, this will be global)
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
