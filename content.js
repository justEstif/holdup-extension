// Holdup — Content Script (Overlay Mode)
// Injected dynamically by the background service worker on matched domains.

(() => {
  'use strict';

  /** @type {HTMLDivElement | null} */
  let overlayEl = null;

  /**
   * Show the nudge overlay with the given message.
   * @param {string} message
   */
  function showOverlay(message) {
    if (overlayEl) return;

    overlayEl = document.createElement('div');
    overlayEl.id = 'holdup-overlay';
    overlayEl.innerHTML = `
      <div class="holdup-backdrop">
        <div class="holdup-card">
          <h1 class="holdup-title">Hold up!</h1>
          <p class="holdup-message">${escapeHtml(message)}</p>
          <button class="holdup-dismiss">I know what I'm doing</button>
        </div>
      </div>
    `;

    overlayEl.querySelector('.holdup-dismiss').addEventListener('click', dismissOverlay);
    document.body.appendChild(overlayEl);
  }

  /** Remove the overlay. */
  function dismissOverlay() {
    if (!overlayEl) return;
    overlayEl.remove();
    overlayEl = null;
  }

  /**
   * Escape HTML to prevent XSS in user-defined messages.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Listen for messages from the background service worker
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'show-overlay' && message.message) {
      showOverlay(message.message);
    }
  });
})();
