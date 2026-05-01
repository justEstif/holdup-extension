// Holdup — Background Service Worker
// Registers all listeners synchronously at top level (MV3 requirement).

// Default settings on first install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('domains', (result) => {
    if (!result.domains) {
      chrome.storage.sync.set({ domains: [] });
    }
  });
});

// Rebuild declarativeNetRequest rules when settings change
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.domains) {
    rebuildDynamicRules(changes.domains.newValue);
  }
});

// Detect navigation to configured domains
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  const url = new URL(details.url);
  chrome.storage.sync.get('domains', (result) => {
    const domains = result.domains || [];
    const match = domains.find(
      (d) => url.hostname === d.host || url.hostname.endsWith(`.${d.host}`),
    );
    if (!match) return;

    handleMatch(details.tabId, match);
  });
});

/**
 * Handle a domain match — inject overlay or redirect.
 * @param {number} tabId
 * @param {{ host: string, message: string, mode: string }} match
 */
function handleMatch(tabId, match) {
  if (match.mode === 'overlay') {
    injectOverlay(tabId, match.message);
  }
  // Redirect mode handled by declarativeNetRequest rules
}

/**
 * Inject the overlay content script with the nudge message.
 * @param {number} tabId
 * @param {string} message
 */
function injectOverlay(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js'],
  });

  chrome.tabs.sendMessage(tabId, { action: 'show-overlay', message });
}

/**
 * Rebuild declarativeNetRequest dynamic rules from domain config.
 * @param {Array<{ host: string, message: string, mode: string }>} domains
 */
async function rebuildDynamicRules(domains) {
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = oldRules.map((r) => r.id);

  const addRules = domains
    .filter((d) => d.mode === 'redirect')
    .map((d, i) => ({
      id: i + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          extensionPath: `/pages/interstitial/interstitial.html?target=${encodeURIComponent(d.host)}&msg=${encodeURIComponent(d.message)}`,
        },
      },
      condition: {
        urlFilter: `||${d.host}/`,
        resourceTypes: ['main_frame'],
      },
    }));

  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
}
