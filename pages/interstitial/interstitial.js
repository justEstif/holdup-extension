// Holdup — Interstitial Page Script

(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const entryHost = params.get('entry') || '';
  const fallbackMsg = params.get('msg') || 'Are you sure about this?';

  async function init() {
    const entry = await loadEntry();
    renderMessage(entry);
    wireButtons(entry);
  }

  async function loadEntry() {
    const found = await HoldupStorage.getEntryByHost(entryHost);
    return found || { host: entryHost, message: fallbackMsg };
  }

  function renderMessage(entry) {
    document.getElementById('nudgeMessage').textContent = entry.message;
  }

  function wireButtons(entry) {
    const url = `https://${entry.host}`;
    wireGoBack(entry);
    wireContinue(entry, url);
    wireRemind(entry, url);
    wireRedirect(entry);
  }

  function wireGoBack(entry) {
    const btn = document.getElementById('goBackBtn');
    btn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'go-back', entryHost: entry.host });
      window.history.back();
    });
  }

  function wireContinue(entry, url) {
    const btn = document.getElementById('continueBtn');
    btn.addEventListener('click', async () => {
      const cooldown = entry.cooldownMinutes || 30;
      await chrome.runtime.sendMessage({
        action: 'continue',
        entryHost: entry.host,
        cooldownMinutes: cooldown,
      });
      window.location.href = url;
    });
  }

  function wireRemind(entry, url) {
    const btn = document.getElementById('remindBtn');
    btn.addEventListener('click', async () => {
      const delay = entry.remindDelayMinutes || 5;
      await chrome.runtime.sendMessage({
        action: 'remind',
        entryHost: entry.host,
        delayMinutes: delay,
      });
      window.location.href = url;
    });
  }

  function wireRedirect(entry) {
    if (!entry.redirectUrl) return;
    const container = document.getElementById('redirectContainer');
    container.classList.remove('hidden');
    const btn = document.getElementById('redirectBtn');
    btn.addEventListener('click', () => {
      window.location.href = entry.redirectUrl;
    });
  }

  init();
})();
