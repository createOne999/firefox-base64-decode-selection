// Create a context menu item when installing extensions
browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "decode-base64",
      title: "Base64 Decode",
      contexts: ["selection"] // 텍스트가 선택되었을 때만 표시
    });
  });
  
  // Event processing when clicking the context menu item
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "decode-base64") {
      // Message transfer to the content script of the clicked tab
      browser.tabs.sendMessage(tab.id, { action: "decodeBase64" });
    }
  });