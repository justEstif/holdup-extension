// Holdup — Content Script (Overlay Mode)
// Injected dynamically by the background service worker on matched domains.

(() => {
  'use strict';

  let shadowHost = null;

  function showOverlay(entry) {
    if (shadowHost) return;
    shadowHost = document.createElement('div');
    shadowHost.id = 'holdup-overlay-host';
    const shadow = shadowHost.attachShadow({ mode: 'closed' });
    shadow.innerHTML = buildOverlayHtml(entry);
    document.body.appendChild(shadowHost);
    wireButtons(shadow, entry);
    animateEntrance(shadow);
    document.addEventListener('keydown', handleKeyDown);
  }

  function buildOverlayHtml(entry) {
    const msg = escapeHtml(entry.message);
    const redirectBtn = entry.redirectUrl
      ? '<button class="link" id="holdup-redirect">Go somewhere else</button>'
      : '';
    return `<style>${getStyles()}</style>
<div class="backdrop">
  <div class="card">
    <div class="bar"></div>
    <div class="inner">
      <h2 class="title">Hold up.</h2>
      <p class="message">${msg}</p>
      <div class="buttons">
        <button class="btn-safe" id="holdup-leave">Go back</button>
        <button class="btn-dismiss" id="holdup-dismiss">Dismiss</button>
      </div>
      <div class="links">
        <button class="link" id="holdup-remind">Remind me again in 5 minutes</button>
        ${redirectBtn}
      </div>
    </div>
  </div>
</div>`;
  }

  function wireButtons(shadow, entry) {
    wireLeave(shadow, entry);
    wireDismiss(shadow, entry);
    wireRemind(shadow, entry);
    wireRedirect(shadow, entry);
  }

  function wireLeave(shadow, entry) {
    shadow.getElementById('holdup-leave').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'go-back', entryHost: entry.host });
      removeOverlay();
      window.history.back();
    });
  }

  function wireDismiss(shadow, entry) {
    shadow.getElementById('holdup-dismiss').addEventListener('click', () => {
      const cooldown = entry.cooldownMinutes || 30;
      chrome.runtime.sendMessage({
        action: 'continue',
        entryHost: entry.host,
        cooldownMinutes: cooldown,
      });
      removeOverlay();
    });
  }

  function wireRemind(shadow, entry) {
    shadow.getElementById('holdup-remind').addEventListener('click', () => {
      const delay = entry.remindDelayMinutes || 5;
      chrome.runtime.sendMessage({
        action: 'remind',
        entryHost: entry.host,
        delayMinutes: delay,
      });
      removeOverlay();
    });
  }

  function wireRedirect(shadow, entry) {
    const btn = shadow.getElementById('holdup-redirect');
    if (!btn) return;
    btn.addEventListener('click', () => {
      removeOverlay();
      window.location.href = entry.redirectUrl;
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      removeOverlay();
    }
  }

  function removeOverlay() {
    if (!shadowHost) return;
    document.removeEventListener('keydown', handleKeyDown);
    shadowHost.remove();
    shadowHost = null;
  }

  function animateEntrance(shadow) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const backdrop = shadow.querySelector('.backdrop');
    const card = shadow.querySelector('.card');
    backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'forwards' });
    card.animate(
      [
        { transform: 'scale(0.95)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 },
      ],
      { duration: 250, easing: 'ease-out', fill: 'forwards' },
    );
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getStyles() {
    return `:host{all:initial;position:fixed;inset:0;z-index:999999}
.backdrop{position:fixed;inset:0;background:rgba(15,23,42,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);max-width:28rem;width:100%;opacity:0;transform:scale(.95)}
.bar{height:2px;background:#f59e0b}
.inner{padding:32px;text-align:center}
.title{font-size:24px;font-weight:700;color:#1e293b;margin:0}
.message{font-size:18px;color:#475569;line-height:1.625;margin:12px 0 0}
.buttons{display:flex;gap:12px;margin-top:32px}
.btn-safe{flex:1;padding:10px 20px;background:#f59e0b;color:#fff;font-weight:600;font-size:14px;border-radius:12px;border:none;cursor:pointer;transition:background-color .15s;font-family:inherit}
.btn-safe:hover{background:#d97706}
.btn-safe:focus-visible{outline:2px solid #fbbf24;outline-offset:2px}
.btn-dismiss{flex:1;padding:10px 20px;background:#f1f5f9;color:#475569;font-weight:500;font-size:14px;border-radius:12px;border:none;cursor:pointer;transition:background-color .15s;font-family:inherit}
.btn-dismiss:hover{background:#e2e8f0}
.btn-dismiss:focus-visible{outline:2px solid #fbbf24;outline-offset:2px}
.links{margin-top:16px}
.link{font-size:14px;color:#64748b;background:none;border:none;cursor:pointer;transition:color .15s;font-family:inherit}
.link:hover{color:#fbbf24}
.link:focus-visible{outline:2px solid #fbbf24;outline-offset:2px}
@media(prefers-reduced-motion:reduce){.backdrop{opacity:1}.card{opacity:1;transform:none}}`;
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'show-overlay' && message.entry) {
      showOverlay(message.entry);
    }
  });
})();
