// Holdup — Interstitial Page Script

(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const target = params.get('target') || '';
  const message = params.get('msg') || 'Are you sure about this?';

  const nudgeEl = document.getElementById('nudgeMessage');
  const proceedBtn = document.getElementById('proceedBtn');
  const goBackBtn = document.getElementById('goBackBtn');

  nudgeEl.textContent = message;

  /** Navigate to the original target URL. */
  function proceed() {
    if (target) {
      window.location.href = `https://${target}`;
    }
  }

  /** Go back in history. */
  function goBack() {
    window.history.back();
  }

  proceedBtn.addEventListener('click', proceed);
  goBackBtn.addEventListener('click', goBack);
})();
