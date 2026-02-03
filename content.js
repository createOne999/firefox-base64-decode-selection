let currentDisplayDiv = null;
let currentHideListener = null;

// Base64 Decode (UTF-8)
function base64Decode(str) {
  try {
    // Remove potential whitespace or newlines which might be included in selection
    str = str.replace(/\s/g, '');

    // Check if it looks like valid Base64 (optional but can filter junk)
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) {
      console.warn("String might not be strict Base64, but attempting decode anyway:", str);
    }

    const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  } catch (e) {
    console.error("Base64 decode failed:", e);
    if (e instanceof DOMException && e.name === 'InvalidCharacterError') {
        return "Error: Invalid characters found in the string. Cannot decode Base64.";
    }
    return "Error: Failed to decode Base64. (Invalid characters or structure)";
  }
}

// Show copy success message with copied text
function showCopyMessage(copiedText) {
  const messageDiv = document.createElement('div');
  
  // Truncate long text for display
  const displayText = copiedText.length > 50 
    ? copiedText.substring(0, 50) + '...'
    : copiedText;
  
  messageDiv.innerHTML = `<strong>Copied:</strong> ${displayText}`;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    padding: 10px 30px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 5px;
    font-family: monospace;
    font-size: 14px;
    opacity: 1;
    transition: opacity 0.3s ease-out;
    max-width: 80%;
    word-wrap: break-word;
  `;
  
  document.body.appendChild(messageDiv);
  
  // Close display immediately
  hideDecodedText();
  
  // Fade out message after 1.5 seconds
  setTimeout(() => {
    messageDiv.style.opacity = '0';
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }, 1500);
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

  // Detect dark mode
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Color scheme based on dark/light mode
  const colors = isDarkMode ? {
    bg: '#333',
    text: '#fff',
    border: '#555',
    buttonBg: '#4a4a4a',
    buttonHover: '#5a5a5a',
    buttonText: '#fff'
  } : {
    bg: '#f5f5f5',
    text: '#333',
    border: '#ccc',
    buttonBg: '#e0e0e0',
    buttonHover: '#d0d0d0',
    buttonText: '#333'
  };
  
  // Update display div colors
  displayDiv.style.backgroundColor = colors.bg;
  displayDiv.style.color = colors.text;
  displayDiv.style.borderColor = colors.border;
  
  // Container for text and button (horizontal layout)
  const contentContainer = document.createElement('div');
  contentContainer.style.cssText = `
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
  `;
  
  const textDiv = document.createElement('div');
  textDiv.textContent = text;
  textDiv.style.cssText = `
    word-wrap: break-word;
    max-height: 300px;
    overflow-y: auto;
    flex: 1;
  `;
  contentContainer.appendChild(textDiv);
  
  // Copy button with icon
  const copyButton = document.createElement('button');
  copyButton.innerHTML = '&#x2398;'; // Unicode copy icon (⎘)
  copyButton.title = 'Copy to clipboard';
  copyButton.style.cssText = `
    padding: 4px 8px;
    background-color: ${colors.buttonBg};
    color: ${colors.buttonText};
    border: 1px solid ${colors.border};
    border-radius: 3px;
    cursor: pointer;
    font-family: monospace;
    font-size: 14px;
    line-height: 1;
    flex-shrink: 0;
  `;
  copyButton.addEventListener('mouseenter', () => {
    copyButton.style.backgroundColor = colors.buttonHover;
  });
  copyButton.addEventListener('mouseleave', () => {
    copyButton.style.backgroundColor = colors.buttonBg;
  });
  copyButton.addEventListener('click', (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      showCopyMessage(text);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  });
  contentContainer.appendChild(copyButton);
  
  displayDiv.appendChild(contentContainer);

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