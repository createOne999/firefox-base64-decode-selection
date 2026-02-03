# AGENTS.md - Firefox Base64 Decoder Extension

## Project Overview
A Firefox browser extension that decodes selected Base64 text via context menu. Uses WebExtension APIs with Manifest V3 and modular JavaScript architecture.

## Build/Test Commands

This is a **no-build** vanilla JavaScript project. No compilation step required.

### Development Workflow
```bash
# No build step needed - edit files directly

# Load extension in Firefox for testing:
# 1. Open Firefox, navigate to about:debugging
# 2. Click "This Firefox" → "Load Temporary Add-on"
# 3. Select manifest.json

# Lint JavaScript (if ESLint is configured locally)
npx eslint src/background.js src/content/*.js

# No formal test suite - manual testing required via Firefox
```

### Testing Approach
- **Manual testing only**: Load as temporary add-on in Firefox
- Test on various websites with different Base64 strings
- Verify context menu appears on text selection
- Test popup positioning (above/below selection, viewport edge cases)
- Test error handling with invalid Base64 input

## Code Style Guidelines

### JavaScript Conventions
- **ES6+ features**: Use `const`, `let`, arrow functions, template literals
- **Indentation**: 2 spaces (visible in existing code)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required at end of statements
- **Variable naming**: 
  - camelCase for variables/functions (e.g., `currentDisplayDiv`, `base64Decode`)
  - PascalCase for constructors/classes (none currently)
  - UPPER_SNAKE_CASE for constants (none currently)

### File Structure
```
firefox-base64-decode-selection/
├── manifest.json          # Extension manifest (v3) - must stay at root
├── src/
│   ├── background.js      # Background script - context menu management
│   ├── config.js          # Configuration constants and styles
│   └── content/           # Content scripts directory
│       ├── content.js     # Main orchestrator - coordinates all modules
│       ├── decoder.js     # Base64 decoding logic with UTF-8 support
│       ├── dom-utils.js   # DOM utilities and viewport calculations
│       ├── ui-components.js # UI creation and overlay management
│       └── event-manager.js # Event listener management and cleanup
├── AGENTS.md              # Agent instructions (this file)
├── README.md              # Documentation (English)
├── README-ko.md           # Documentation (Korean)
├── LICENSE                # License file
└── .vscode/               # VS Code settings
    └── settings.json
```

### Code Patterns

**Error Handling**: Use try-catch with specific error types
```javascript
try {
  // risky operation
} catch (e) {
  console.error("Descriptive message:", e);
  if (e instanceof DOMException && e.name === 'InvalidCharacterError') {
    return "User-friendly error message";
  }
  return "Generic fallback error message";
}
```

**Browser API Usage**: Use `browser.*` namespace (WebExtension API)
```javascript
// Message passing between background and content
browser.runtime.onMessage.addListener((request, sender, sendResponse) => { });
browser.tabs.sendMessage(tab.id, { action: "decodeBase64" });
browser.contextMenus.create({ id, title, contexts });
```

**DOM Manipulation**: Create elements programmatically, avoid innerHTML
```javascript
const div = document.createElement('div');
div.classList.add('base64-decode-result');
div.style.cssText = `...`;
div.textContent = text;  // NOT innerHTML
```

**Event Listeners**: Always store references for cleanup
```javascript
let currentHideListener = null;
// ... later
currentHideListener = (event) => { };
document.addEventListener('click', currentHideListener, true);
// ... cleanup
document.removeEventListener('click', currentHideListener, true);
```

### CSS-in-JS
When styling dynamically created elements, use `style.cssText` with backtick strings:
```javascript
div.style.cssText = `
  position: absolute;
  z-index: 9999;
  padding: 10px;
  /* ... */
`;
```

### Comments
- Use `//` for single-line comments
- Keep comments concise and in English
- Add inline comments for complex calculations (viewport positioning, etc.)

### Import/Module System
- No ES6 modules - use global scope for shared state
- WebExtension APIs available globally via `browser` object
- State managed via module-level variables (e.g., `let currentDisplayDiv`)
- Modules export to global window object for cross-module access

## Extension Architecture

**manifest.json**: Defines permissions (`activeTab`, `contextMenus`), background script, and content script

**manifest.json**: Defines permissions (`activeTab`, `contextMenus`), background script, and content script

**background.js**: 
- Creates context menu on install/startup
- Listens for menu clicks
- Sends messages to content script
- Handles dynamic script injection if needed

**content.js**:
- Main orchestrator that coordinates all modules
- Receives messages from background
- Handles text selection and triggers decoding
- Coordinates UI display and cleanup

**decoder.js**: Base64 decoding with UTF-8 support and validation

**dom-utils.js**: Viewport calculations, dark mode detection, positioning helpers

**ui-components.js**: Creates and manages overlay UI, copy functionality, messages

**event-manager.js**: Robust event listener tracking and cleanup management

**config.js**: Centralized configuration for styles, colors, messages

## Key Implementation Notes

1. **UTF-8 Decoding**: Use `TextDecoder` with `Uint8Array` from `atob()` result
2. **Viewport Handling**: Calculate position to avoid clipping; prefer below selection, fall back to above or fixed position
3. **Cleanup**: Always remove event listeners and DOM elements when hiding overlay
4. **Escape Key**: Listen for 'Escape' keydown to dismiss overlay
5. **Whitespace Removal**: Strip whitespace from selection before decoding

## Editor Configuration

**VS Code Settings**: GitHub Copilot disabled globally (except plaintext) to avoid interfering with manual extension development

**No Build Tools**: This is a zero-build project - edit files directly and reload extension in Firefox for testing

## No External Dependencies
- Pure vanilla JavaScript
- No npm, webpack, or build tools
- No external libraries

## No External Dependencies
- Pure vanilla JavaScript
- No npm, webpack, or build tools
- No external libraries
