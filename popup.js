// Holdup — Popup Script

(() => {
  'use strict';

  const statusEl = document.getElementById('status');
  const optionsBtn = document.getElementById('openOptions');

  /**
   * Load and display domain count.
   */
  async function loadStatus() {
    const { domains } = await chrome.storage.sync.get('domains');
    const count = (domains || []).length;
    statusEl.textContent = count === 0 ? 'No domains configured.' : `${count} domain(s) active.`;
  }

  /** Open the options page. */
  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  optionsBtn.addEventListener('click', openOptions);
  loadStatus();
})();
