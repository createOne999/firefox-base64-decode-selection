let currentDisplayDiv = null;
let currentHideListener = null;

// Base64 디코딩 함수 (UTF-8 지원)
function base64Decode(str) {
  try {
    // Remove potential whitespace or newlines which might be included in selection
    str = str.trim();

    // Check if it looks like valid Base64 (optional but can filter junk)
    if (!/^[a-zA-Z0-9+/=\s]+$/.test(str)) {
        return "Error: Not a valid Base64 string format.";
    }

    const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  } catch (e) {
    console.error("Base64 decode failed:", e);
    return "Error: Failed to decode Base64. (Possible invalid characters or padding)";
  }
}

// 결과 표시 Div 생성 및 위치 설정
function showDecodedText(text, rect) {
  // 이미 표시된 Div가 있으면 제거
  if (currentDisplayDiv) {
    hideDecodedText();
  }

  const displayDiv = document.createElement('div');
  displayDiv.classList.add('base64-decode-result'); // CSS 클래스 추가 (스타일링용)
  displayDiv.style.cssText = `
    position: absolute;
    z-index: 9999; /* 다른 요소 위에 표시 */
    padding: 10px;
    background-color: #333;
    color: #fff;
    border: 1px solid #555;
    border-radius: 5px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
    word-wrap: break-word; /* 긴 텍스트 줄바꿈 */
    max-width: 80%; /* 화면 너비의 최대 80% */
    pointer-events: auto; /* Div 위에서 클릭 이벤트 감지 */
    font-family: monospace; /* 디코딩 결과는 보통 모노스페이스 폰트가 좋음 */
    font-size: 14px;
    cursor: text; /* Div 위에서는 텍스트 커서 */
    user-select: text; /* 텍스트 선택 가능 */
  `;

  displayDiv.textContent = text;

  // Div를 잠시 추가하여 크기를 계산
  document.body.appendChild(displayDiv);

  const divWidth = displayDiv.offsetWidth;
  const divHeight = displayDiv.offsetHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let finalTop;
  let finalLeft;

  // Div를 선택 영역 아래에 배치 시도
  const idealTopBelow = rect.bottom + scrollY + 5; // 5px 여백
  const fitsBelow = (idealTopBelow + divHeight) <= (scrollY + viewportHeight);

  // Div를 선택 영역 위에 배치 시도
  const idealTopAbove = rect.top + scrollY - divHeight - 5; // 5px 여백
  const fitsAbove = idealTopAbove >= scrollY; // 스크롤된 영역 위로 넘어가지 않게

  // 위치 결정
  if (fitsBelow) {
    finalTop = idealTopBelow;
  } else if (fitsAbove) {
    finalTop = idealTopAbove;
  } else {
    // 위/아래 모두 공간이 부족하면, 선택 영역 근처에 (예: 상단에) 배치
    // 이 경우 선택 영역을 가릴 수도 있습니다.
    finalTop = rect.top + scrollY;
    if (finalTop + divHeight > scrollY + viewportHeight) {
        // 너무 길어서 아래로 잘리면, 뷰포트 하단에 고정 (fallback)
         displayDiv.style.position = 'fixed';
         finalTop = viewportHeight - divHeight - 10; // 뷰포트 하단에서 10px 위
         if (finalTop < 10) finalTop = 10; // 뷰포트 상단에서 10px 아래 최소값
         scrollY = 0; // fixed position은 scrollY가 의미 없음
    }
  }

  // 좌우 위치 결정
  // 선택 영역 좌측에 맞추되, 화면 밖으로 나가지 않게 조정
  const idealLeft = rect.left + scrollX;
  finalLeft = Math.max(scrollX + 10, idealLeft); // 최소 좌측 10px 여백
  finalLeft = Math.min(finalLeft, scrollX + viewportWidth - divWidth - 10); // 최소 우측 10px 여백

  // Div 너비가 뷰포트보다 큰 경우 (max-width: 80% 설정 때문에 흔하진 않지만)
   if (divWidth > viewportWidth - 20) {
       finalLeft = scrollX + 10;
   }


  // 위치 적용
  displayDiv.style.top = finalTop + 'px';
  // fixed position일 경우 left 계산은 scrollX가 빠져야 합니다.
  if (displayDiv.style.position === 'fixed') {
       displayDiv.style.left = Math.max(10, rect.left); // 뷰포트 좌측 기준
       displayDiv.style.left = Math.min(parseInt(displayDiv.style.left), viewportWidth - divWidth - 10) + 'px';
        if (divWidth > viewportWidth - 20) {
             displayDiv.style.left = '10px';
        }
  } else {
      displayDiv.style.left = finalLeft + 'px';
  }


  // 클릭 이벤트 버블링 중지 (Div 내부 클릭 시 숨겨지지 않도록)
  displayDiv.addEventListener('click', (e) => {
    e.stopPropagation();
  });


  currentDisplayDiv = displayDiv;

  // Div 외부 클릭 감지 및 숨김 처리 리스너
  currentHideListener = (event) => {
      // 클릭 타겟이 displayDiv 자신 또는 그 자식 요소가 아니면 숨김
      if (currentDisplayDiv && !currentDisplayDiv.contains(event.target)) {
          hideDecodedText();
      }
  };
  // Capture phase를 사용하면 이벤트가 자식 요소에 도달하기 전에 먼저 감지 가능
  document.addEventListener('click', currentHideListener, true);
}

// 결과 표시 Div 숨김 및 제거
function hideDecodedText() {
  if (currentDisplayDiv) {
    currentDisplayDiv.remove();
    currentDisplayDiv = null;
  }
  if (currentHideListener) {
    document.removeEventListener('click', currentHideListener, true);
    currentHideListener = null;
  }
}

// 백그라운드 스크립트로부터 메시지 수신 대기
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "decodeBase64") {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (!selectedText) {
      console.log("No text selected for decoding.");
      // 선택된 텍스트가 없으면 이미 표시된 Div가 있다면 숨김
      hideDecodedText();
      return;
    }

    const decodedText = base64Decode(selectedText);

    // 선택 영역의 위치 정보 가져오기
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect(); // 뷰포트 기준 위치

      // 디코딩 결과를 페이지에 표시
      showDecodedText(decodedText, rect);

    } else {
       // 선택 영역이 없는 경우 (예: 텍스트 선택 후 페이지 이동 등)
       console.log("Selection range not available.");
       hideDecodedText();
    }
  }
});

// ESC 키 눌렀을 때도 결과 Div 숨김 (추가 편의 기능)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && currentDisplayDiv) {
        hideDecodedText();
    }
});