// Holdup — Background Service Worker
// Registers all listeners synchronously at top level (MV3 requirement).

importScripts('./storage.js');

chrome.runtime.onInstalled.addListener(() => {
  initOnInstalled();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.domains) {
    rebuildDynamicRules(changes.domains.newValue);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleMessage(message).then(() => sendResponse({ ok: true }));
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!alarm.name.startsWith('cooldown_')) return;
  const host = alarm.name.replace('cooldown_', '');
  clearCooldown(host);
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId !== 0) return;
  handleNavigation(details);
});

chrome.tabs.onRemoved.addListener(() => {
  cleanUpTabCooldowns();
});

async function initOnInstalled() {
  const domains = await HoldupStorage.getEntries();
  await rebuildDynamicRules(domains);
}

async function handleNavigation(details) {
  const url = new URL(details.url);
  if (!url.protocol.startsWith('http')) return;
  const domains = await HoldupStorage.getEntries();
  const match = findActiveMatch(domains, url.hostname);
  if (!match) return;
  await routeMatch(details.tabId, match);
}

function findActiveMatch(domains, hostname) {
  return domains.find(
    (d) => d.enabled !== false && (hostname === d.host || hostname.endsWith(`.${d.host}`)),
  );
}

async function routeMatch(tabId, match) {
  if (await isOnCooldown(match.host)) return;
  if (match.mode === 'overlay') {
    const theme = await getResolvedTheme();
    injectOverlay(tabId, match, theme);
  }
}

function injectOverlay(tabId, entry, theme) {
  chrome.scripting
    .executeScript({
      target: { tabId },
      files: ['content.js'],
    })
    .then(() => {
      chrome.tabs.sendMessage(tabId, { action: 'show-overlay', entry, theme });
    });
}

async function handleMessage(message) {
  const { action, entryHost } = message;
  if (action === 'continue' || action === 'go-back') {
    await applyCooldown(entryHost, message.cooldownMinutes || 30);
  } else if (action === 'remind') {
    await setCooldown(entryHost, message.delayMinutes || 5);
  }
}

async function applyCooldown(host, defaultMinutes) {
  const entry = await HoldupStorage.getEntryByHost(host);
  if (entry?.cooldownType === 'always') return;
  if (entry?.cooldownType === 'session') {
    await setSessionCooldown(host);
    return;
  }
  const minutes =
    entry?.cooldownType === 'time' ? entry.cooldownMinutes || defaultMinutes : defaultMinutes;
  await setCooldown(host, minutes);
}

async function setCooldown(host, minutes) {
  const key = `cooldown_${host}`;
  const endTime = Date.now() + minutes * 60000;
  await chrome.storage.session.set({ [key]: endTime });
  const domains = await HoldupStorage.getEntries();
  await rebuildDynamicRules(domains);
  chrome.alarms.create(`cooldown_${host}`, { delayInMinutes: minutes });
}

async function setSessionCooldown(host) {
  const key = `cooldown_${host}`;
  await chrome.storage.session.set({ [key]: Infinity });
  const domains = await HoldupStorage.getEntries();
  await rebuildDynamicRules(domains);
}

async function clearCooldown(host) {
  const key = `cooldown_${host}`;
  await chrome.storage.session.remove(key);
  const domains = await HoldupStorage.getEntries();
  await rebuildDynamicRules(domains);
}

function cleanUpTabCooldowns() {
  // Future hook for per-tab cooldown cleanup.
  // Current cooldown model is domain-based (session storage + alarms),
  // so no per-tab state to clean up yet.
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
    if (d.enabled === false) continue;
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

async function getResolvedTheme() {
  const result = await chrome.storage.sync.get('theme');
  const pref = result.theme || 'system';
  if (pref === 'dark' || pref === 'light') return pref;
  return 'system';
}

async function isOnCooldown(host) {
  const key = `cooldown_${host}`;
  const stored = await chrome.storage.session.get(key);
  const endTime = stored[key];
  return endTime && Date.now() < endTime;
}
