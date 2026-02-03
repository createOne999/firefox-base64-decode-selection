// Base64 decoding utility module
// Handles Base64 decoding with UTF-8 support and error handling

const Base64Decoder = {
  /**
   * Validates if a string looks like valid Base64
   * @param {string} str - String to validate
   * @returns {boolean} - True if valid Base64 pattern
   */
  isValidBase64(str) {
    return /^[A-Za-z0-9+/]*={0,2}$/.test(str);
  },

  /**
   * Cleans Base64 string by removing whitespace
   * @param {string} str - Raw Base64 string
   * @returns {string} - Cleaned Base64 string
   */
  cleanInput(str) {
    return str.replace(/\s/g, '');
  },

  /**
   * Decodes a Base64 string to UTF-8 text
   * @param {string} str - Base64 encoded string
   * @returns {string} - Decoded text or error message
   */
  decode(str) {
    const cleanedStr = this.cleanInput(str);

    // Check if it looks like valid Base64
    if (!this.isValidBase64(cleanedStr)) {
      console.warn('String might not be strict Base64, but attempting decode anyway:', cleanedStr);
    }

    try {
      const bytes = Uint8Array.from(atob(cleanedStr), c => c.charCodeAt(0));
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);
    } catch (e) {
      console.error('Base64 decode failed:', e);

      if (e instanceof DOMException && e.name === 'InvalidCharacterError') {
        return CONFIG.errors.invalidCharacters;
      }

      return CONFIG.errors.genericDecodeError;
    }
  }
};

// Export for global use
if (typeof window !== 'undefined') {
  window.Base64Decoder = Base64Decoder;
}
