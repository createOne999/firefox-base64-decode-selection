// 확장 프로그램 설치 시 컨텍스트 메뉴 항목 생성
browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "decode-base64",
      title: "Base64 Decode",
      contexts: ["selection"] // 텍스트가 선택되었을 때만 표시
    });
  });
  
  // 컨텍스트 메뉴 항목 클릭 시 이벤트 처리
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "decode-base64") {
      // 클릭된 탭의 컨텐츠 스크립트로 메시지 전송
      browser.tabs.sendMessage(tab.id, { action: "decodeBase64" });
    }
  });