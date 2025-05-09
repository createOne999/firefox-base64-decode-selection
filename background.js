// Create a context menu item when installing extensions
function createContextMenu() {
  // Remove existing menu (to prevent duplication)
  browser.contextMenus.removeAll().then(() => {
    // Create a new context menu
    browser.contextMenus.create({
      id: "decode-base64",
      title: "Base64 Decode",
      contexts: ["selection"] // Only show when text is selected
    });
    console.log("Base64 Decode context menu created.");
  });
}

// Create context menu when installing/updating extensions
browser.runtime.onInstalled.addListener(createContextMenu);
// Create a context menu when the browser starts
browser.runtime.onStartup.addListener(createContextMenu);

// Event processing when clicking the context menu item
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "decode-base64") {
    // Message transfer to the content script of the clicked tab
    browser.tabs.sendMessage(tab.id, { action: "decodeBase64" });
  }
});