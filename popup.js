// Holdup — Popup Script

(() => {
  'use strict';

  const statusEl = document.getElementById('status');
  const optionsBtn = document.getElementById('openOptions');

  async function loadStatus() {
    const entries = await HoldupStorage.getEntries();
    const count = entries.length;
    statusEl.textContent = count === 0 ? 'No domains configured.' : `${count} domain(s) active.`;
  }

  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  optionsBtn.addEventListener('click', openOptions);
  loadStatus();
})();
