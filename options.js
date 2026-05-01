// Holdup — Options Page Script

(() => {
  'use strict';

  const form = document.getElementById('domainForm');
  const hostInput = document.getElementById('hostInput');
  const messageInput = document.getElementById('messageInput');
  const modeInput = document.getElementById('modeInput');
  const domainList = document.getElementById('domainList');

  /**
   * Render the list of configured domains.
   * @param {Array<{ host: string, message: string, mode: string }>} domains
   */
  function renderDomains(domains) {
    domainList.innerHTML = '';

    if (!domains || domains.length === 0) {
      domainList.innerHTML = '<p class="text-sm text-gray-500">No domains configured yet.</p>';
      return;
    }

    domains.forEach((domain, index) => {
      const el = document.createElement('div');
      el.className = 'flex items-center justify-between p-3 bg-white rounded shadow-sm';
      el.innerHTML = `
        <div>
          <span class="font-medium text-gray-800">${escapeHtml(domain.host)}</span>
          <span class="text-xs text-gray-500 ml-2">(${domain.mode})</span>
          <p class="text-sm text-gray-600 mt-1">${escapeHtml(domain.message)}</p>
        </div>
        <button data-index="${index}" class="remove-btn text-red-500 hover:text-red-700 text-sm">Remove</button>
      `;
      domainList.appendChild(el);
    });

    domainList.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => removeDomain(Number(btn.dataset.index)));
    });
  }

  /**
   * Load domains from storage and render.
   */
  async function loadDomains() {
    const { domains } = await chrome.storage.sync.get('domains');
    renderDomains(domains || []);
  }

  /**
   * Add a new domain to storage.
   * @param {Event} e
   */
  async function addDomain(e) {
    e.preventDefault();

    const host = hostInput.value.trim();
    const message = messageInput.value.trim();
    const mode = modeInput.value;

    if (!host || !message) return;

    const { domains } = await chrome.storage.sync.get('domains');
    const updated = [...(domains || []), { host, message, mode }];
    await chrome.storage.sync.set({ domains: updated });

    hostInput.value = '';
    messageInput.value = '';
    loadDomains();
  }

  /**
   * Remove a domain by index.
   * @param {number} index
   */
  async function removeDomain(index) {
    const { domains } = await chrome.storage.sync.get('domains');
    const updated = (domains || []).filter((_, i) => i !== index);
    await chrome.storage.sync.set({ domains: updated });
    loadDomains();
  }

  /**
   * Escape HTML to prevent XSS.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  form.addEventListener('submit', addDomain);
  loadDomains();
})();
