let currentDisplayDiv = null;
let currentHideListener = null;

// Base64 Decode (UTF-8)
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

// Display Result
function showDecodedText(text, rect) {
  // close already displayed
  if (currentDisplayDiv) {
    hideDecodedText();
  }

  const displayDiv = document.createElement('div');
  displayDiv.classList.add('base64-decode-result');
  displayDiv.style.cssText = `
    position: absolute;
    z-index: 9999; /* Displayed on another element */
    padding: 10px;
    background-color: #333;
    color: #fff;
    border: 1px solid #555;
    border-radius: 5px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
    word-wrap: break-word; /* long text line change */
    max-width: 80%;
    pointer-events: auto; /* Click Event detection over DIV */
    font-family: monospace;
    font-size: 14px;
    cursor: text; /* Text cursor on the DIV */
    user-select: text; /* Text selection available */
  `;

  displayDiv.textContent = text;

  // Add the temp DIV for calculate the size
  document.body.appendChild(displayDiv);

  const divWidth = displayDiv.offsetWidth;
  const divHeight = displayDiv.offsetHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let finalTop;
  let finalLeft;

  // place divs under the selection area
  const idealTopBelow = rect.bottom + scrollY + 5; // 5px padding
  const fitsBelow = (idealTopBelow + divHeight) <= (scrollY + viewportHeight);

  // place divs upper the selection area
  const idealTopAbove = rect.top + scrollY - divHeight - 5; // 5px padding
  const fitsAbove = idealTopAbove >= scrollY; // scroll area check

  if (fitsBelow) {
    finalTop = idealTopBelow;
  } else if (fitsAbove) {
    finalTop = idealTopAbove;
  } else {
    finalTop = rect.top + scrollY;
    if (finalTop + divHeight > scrollY + viewportHeight) {
         displayDiv.style.position = 'fixed';
         finalTop = viewportHeight - divHeight - 10; 
         if (finalTop < 10) finalTop = 10; 
         scrollY = 0;
    }
  }

  const idealLeft = rect.left + scrollX;
  finalLeft = Math.max(scrollX + 10, idealLeft); 
  finalLeft = Math.min(finalLeft, scrollX + viewportWidth - divWidth - 10);

   if (divWidth > viewportWidth - 20) {
       finalLeft = scrollX + 10;
   }

  displayDiv.style.top = finalTop + 'px';
  if (displayDiv.style.position === 'fixed') {
       displayDiv.style.left = Math.max(10, rect.left); 
       displayDiv.style.left = Math.min(parseInt(displayDiv.style.left), viewportWidth - divWidth - 10) + 'px';
        if (divWidth > viewportWidth - 20) {
             displayDiv.style.left = '10px';
        }
  } else {
      displayDiv.style.left = finalLeft + 'px';
  }

  displayDiv.addEventListener('click', (e) => {
    e.stopPropagation();
  });


  currentDisplayDiv = displayDiv;

  currentHideListener = (event) => {
      if (currentDisplayDiv && !currentDisplayDiv.contains(event.target)) {
          hideDecodedText();
      }
  };
  document.addEventListener('click', currentHideListener, true);
}

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

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "decodeBase64") {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (!selectedText) {
      console.log("No text selected for decoding.");
      hideDecodedText();
      return;
    }

    const decodedText = base64Decode(selectedText);

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect(); // 뷰포트 기준 위치

      showDecodedText(decodedText, rect);

    } else {
       console.log("Selection range not available.");
       hideDecodedText();
    }
  }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && currentDisplayDiv) {
        hideDecodedText();
    }
});