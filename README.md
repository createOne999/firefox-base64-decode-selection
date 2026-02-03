# Firefox Base64 Decode Selection

**English** | [한국어](README-ko.md)

A Firefox browser extension that allows you to easily decode selected Base64 encoded text using the context menu (right-click).

## Key Features

*   **Context Menu Integration**: Right-click on selected Base64 text to decode instantly.
*   **Smart Positioning**: The decoded text overlay appears above or below your selection, automatically adjusted to stay within the viewport.
*   **UTF-8 Support**: Properly decodes international characters including Korean, Japanese, Chinese, and emojis.
*   **One-Click Copy**: Built-in copy button to copy decoded text directly to your clipboard.
*   **Visual Feedback**: Toast notification appears when text is copied successfully.
*   **Auto Dark Mode**: Automatically detects and matches your browser's dark/light theme.
*   **Keyboard Support**: Press `Escape` key to close the overlay instantly.
*   **Click Outside to Close**: Click anywhere outside the overlay to dismiss it.

## Installation

You can install this extension in two ways:

**1. From the Official Firefox Add-ons Store (Recommended)**

*   [https://addons.mozilla.org/ko/firefox/addon/base64-decoder-on-selection/](https://addons.mozilla.org/ko/firefox/addon/base64-decoder-on-selection/)

**2. Manual Installation (For Development & Testing)**

This method is useful during development or for testing before the extension is listed on the store.

1.  **Download or Clone the Repository:** Download or clone this Git repository to your local machine.
    ```bash
    git clone https://github.com/your-username/firefox-base64-decode-selection.git
    # Or download the ZIP file and extract it
    ```
2.  **Open Firefox:** Launch the Firefox browser.
3.  **Navigate to Debugging Page:** Enter `about:debugging` in the address bar and press Enter.
4.  **Select "This Firefox":** Click on "This Firefox" in the left-hand menu.
5.  **Load Temporary Add-on:** Click the "Load Temporary Add-on..." button.
6.  **Select `manifest.json`:** In the file browser that opens, navigate to the folder where you downloaded or cloned the extension (from step 1), select the `manifest.json` file, and click "Open".
7.  The extension will be loaded and appear in the list.

*   **Note:** Temporary add-ons are removed when you close Firefox. You will need to repeat this process each time you restart the browser if you want to continue using it this way.

## How to Use

1.  Select the Base64 encoded text on any web page by dragging your mouse over it.
2.  Right-click on the selected text to open the context menu.
3.  Click on "Base64 Decode" in the menu.
4.  A small overlay window containing the decoded text will appear near your selection.
5.  Click anywhere else on the page to close the overlay window.
