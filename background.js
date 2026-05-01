// Holdup — Background Service Worker
// Registers all listeners synchronously at top level (MV3 requirement).

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('domains', (result) => {
    if (!result.domains) {
      chrome.storage.sync.set({ domains: [] });
    }
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.domains) {
    rebuildDynamicRules(changes.domains.newValue);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleInterstitialMessage(message).then(() => sendResponse({ ok: true }));
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!alarm.name.startsWith('cooldown_')) return;
  const host = alarm.name.replace('cooldown_', '');
  clearCooldown(host);
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;
  handleNavigation(details);
});

async function handleNavigation(details) {
  const url = new URL(details.url);
  if (!url.protocol.startsWith('http')) return;

  const { domains } = await chrome.storage.sync.get('domains');
  const match = findMatch(domains || [], url.hostname);
  if (!match) return;

  handleMatch(details.tabId, match);
}

function findMatch(domains, hostname) {
  return domains.find((d) => hostname === d.host || hostname.endsWith(`.${d.host}`));
}

function handleMatch(tabId, match) {
  if (match.mode === 'overlay') {
    injectOverlay(tabId, match.message);
  }
}

function injectOverlay(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js'],
  });

  chrome.tabs.sendMessage(tabId, { action: 'show-overlay', message });
}

async function handleInterstitialMessage(message) {
  if (message.action === 'continue') {
    await setCooldown(message.entryHost, message.cooldownMinutes || 30);
  } else if (message.action === 'remind') {
    await setCooldown(message.entryHost, message.delayMinutes || 5);
  }
}

async function setCooldown(host, minutes) {
  const key = `cooldown_${host}`;
  const endTime = Date.now() + minutes * 60000;
  await chrome.storage.session.set({ [key]: endTime });

  const { domains } = await chrome.storage.sync.get('domains');
  await rebuildDynamicRules(domains || []);
  chrome.alarms.create(`cooldown_${host}`, { delayInMinutes: minutes });
}

async function clearCooldown(host) {
  const key = `cooldown_${host}`;
  await chrome.storage.session.remove(key);

  const { domains } = await chrome.storage.sync.get('domains');
  await rebuildDynamicRules(domains || []);
}

async function rebuildDynamicRules(domains) {
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = oldRules.map((r) => r.id);
  const active = await filterActiveRedirects(domains);
  const addRules = active.map((d, i) => buildRedirectRule(d, i));
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
}

async function filterActiveRedirects(domains) {
  const results = [];
  for (const d of domains) {
    if (d.mode !== 'redirect') continue;
    if (await isOnCooldown(d.host)) continue;
    results.push(d);
  }
  return results;
}

function buildRedirectRule(domain, index) {
  const entryParam = encodeURIComponent(domain.host);
  const msgParam = encodeURIComponent(domain.message);
  return {
    id: index + 1,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: {
        extensionPath: `/pages/interstitial/interstitial.html?entry=${entryParam}&msg=${msgParam}`,
      },
    },
    condition: {
      urlFilter: `||${domain.host}/`,
      resourceTypes: ['main_frame'],
    },
  };
}

async function isOnCooldown(host) {
  const key = `cooldown_${host}`;
  const stored = await chrome.storage.session.get(key);
  const endTime = stored[key];
  return endTime && Date.now() < endTime;
}
