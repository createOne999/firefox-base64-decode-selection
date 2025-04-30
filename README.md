# Firefox Base64 Decode Selection

(You can add a short description or a logo image here)

A Firefox browser extension that allows you to easily decode selected Base64 encoded text using the context menu (right-click).

## Key Features

*   Select Base64 encoded text on a web page by dragging your mouse.
*   Right-click on the selected text.
*   Click the "Base64 Decode" item that appears in the context menu.
*   The decoded text is displayed in an overlay near the original text (above or below), positioned to avoid being cut off by the viewport.
*   Clicking outside the overlay area dismisses the decoded text popup.
*   Works asynchronously to maintain browser responsiveness.

## Installation

You can install this extension in two ways:

**1. From the Official Firefox Add-ons Store (Recommended)**

*   To be added

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
