# Holdup — Extension API Reference (MV3)

Caveman mode. Facts only.

## Architecture Overview

Holdup flow: user navigates to configured domain → background service worker detects URL → injects content script or redirects to interstitial → user sees nudge.

Components:

- **Background** (service worker): URL detection, rule mgmt, message hub
- **Content script**: overlay injected into matched pages
- **Interstitial page**: fullscreen redirect target
- **Popup**: quick status/toggle
- **Options**: domain + message config
- **Storage**: `chrome.storage.sync` for user settings

---

## chrome.storage.sync

### Why

User settings persist across synced browsers. ~100 KB quota, 8 KB/item. Survives cache clear.

### Key Methods

```js
// Write
await chrome.storage.sync.set({ domains: [{ host: 'claude.ai', message: 'Ship it.' }] });

// Read
const { domains } = await chrome.storage.sync.get('domains');

// Delete key
await chrome.storage.sync.remove('domains');

// Listen for changes (service worker, content script, popup, options — all contexts)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.domains) {
    const newValue = changes.domains.newValue;
  }
});
```

### MV3 Constraints

- Global vars lost when service worker terminates (~30s idle). Always persist to storage.
- All contexts (SW, content scripts, popup, options) can read/write.
- JSON-serializable values only.
- `onChanged` fires in ALL extension contexts — perfect for syncing UI state.

### Storage Areas

| Area      | Quota  | Survives          | Use For       |
| --------- | ------ | ----------------- | ------------- |
| `sync`    | 100 KB | Yes, cross-device | User settings |
| `local`   | 10 MB  | Yes               | Large data    |
| `session` | 10 MB  | No (memory only)  | Temp state    |

---

## chrome.webNavigation

### Why

Detect when user navigates to a configured domain. Fires before page renders — early enough to intercept.

### Permission

```json
"permissions": ["webNavigation"]
```

### Key Events (lifecycle order)

```
onBeforeNavigate → onCommitted → onDOMContentLoaded → onCompleted
```

### Holdup: use `onBeforeNavigate` or `onCommitted`

```js
// Detect navigation to target domains
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // main frame only
  const url = new URL(details.url);
  // Check if url.hostname matches a configured domain
  checkAndIntercept(details.tabId, url);
});
```

### MV3 Constraints

- Service worker must register listeners synchronously at top level (not inside async callbacks).
- Service worker can wake up just for the event, then go idle again.
- `tabId` valid only for current session.

### Key Props

- `details.tabId` — target tab
- `details.url` — navigating URL
- `details.frameId` — 0 = main frame
- `details.parentFrameId` — -1 for main frame
- `details.transitionType` — "typed", "link", "reload", etc.

---

## chrome.scripting

### Why

Inject overlay content script dynamically at runtime (only on matched domains).

### Permission

```json
"permissions": ["scripting"]
```

Also needs host permissions or `activeTab`:

```json
"host_permissions": ["<all_urls>"]
```

### Key Methods

```js
// Inject JS file into tab
await chrome.scripting.executeScript({
  target: { tabId },
  files: ['content.js'],
});

// Inject function with args
await chrome.scripting.executeScript({
  target: { tabId },
  func: (msg) => {
    document.title = msg;
  },
  args: ['Nudge!'],
});

// Inject CSS
await chrome.scripting.insertCSS({
  target: { tabId },
  css: 'body { opacity: 0.5; }',
});

// Inject CSS file
await chrome.scripting.insertCSS({
  target: { tabId },
  files: ['overlay.css'],
});

// Remove injected CSS
await chrome.scripting.removeCSS({
  target: { tabId },
  css: 'body { opacity: 0.5; }',
});
```

### MV3 Constraints

- No `chrome.tabs.executeScript()` (removed in MV3). Use `chrome.scripting.executeScript()`.
- Must declare `"scripting"` permission + host perms.
- `executeScript` returns array of `InjectionResult` per frame: `{ frameId, result }`.
- Runs at `document_idle` by default. Can set `injectImmediately: true`.
- Can target specific frames via `frameIds: [...]` or all frames via `allFrames: true`.

---

## chrome.declarativeNetRequest

### Why

Alternative approach: redirect matched URLs to interstitial page via declarative rules. No service worker needed for URL matching — browser handles it natively.

### Permission

```json
"permissions": ["declarativeNetRequest"]
```

For redirecting to extension pages:

```json
"host_permissions": ["<all_urls>"]
```

### Rule Structure

```json
{
  "id": 1,
  "priority": 1,
  "action": {
    "type": "redirect",
    "redirect": { "extensionPath": "/pages/interstitial/interstitial.html?target=claude.ai" }
  },
  "condition": {
    "urlFilter": "||claude.ai/",
    "resourceTypes": ["main_frame"]
  }
}
```

### Dynamic Rules (runtime)

```js
// Add dynamic rules (user-configured domains)
await chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [1, 2, 3],
  addRules: [
    {
      id: 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { extensionPath: '/pages/interstitial/interstitial.html?target=claude.ai' },
      },
      condition: {
        urlFilter: '||claude.ai/',
        resourceTypes: ['main_frame'],
      },
    },
  ],
});

// Get existing dynamic rules
const rules = await chrome.declarativeNetRequest.getDynamicRules();
```

### Limits

| Type    | Max Rules                                            |
| ------- | ---------------------------------------------------- |
| Static  | 30,000 guaranteed (across up to 50 enabled rulesets) |
| Dynamic | 5,000 (30,000 "safe" rules since Chrome 121)         |
| Session | 5,000                                                |
| Regex   | 1,000 total                                          |

### MV3 Constraints

- Cannot read request content — purely declarative. More private.
- Redirect targets must be `web_accessible_resources` or extension pages.
- Rules persist across sessions (dynamic) or browser close (session).
- URL filter syntax: `||domain.com/` matches domain + all subdomains + all paths.

---

## chrome.tabs

### Why

Query current tab, update URL, communicate with content scripts.

### Permission

```json
"permissions": ["tabs"]
```

`"tabs"` permission gives access to `url`, `title`, `favIconUrl` on Tab objects. Without it, only `tabId` and `windowId` available.

### Key Methods

```js
// Query active tab
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

// Update tab URL (navigate)
await chrome.tabs.update(tabId, { url: 'chrome-extension://ID/pages/interstitial.html' });

// Send message to content script in tab
await chrome.tabs.sendMessage(tabId, { action: 'show-overlay', message: 'Ship it.' });

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    checkAndIntercept(tabId, new URL(tab.url));
  }
});
```

---

## Messaging Patterns

### Content Script → Service Worker

```js
// content.js
const response = await chrome.runtime.sendMessage({ action: 'get-settings' });

// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'get-settings') {
    chrome.storage.sync.get('domains').then(sendResponse);
    return true; // keep channel open for async response
  }
});
```

### Service Worker → Content Script

```js
// background.js
await chrome.tabs.sendMessage(tabId, { action: 'show-nudge', message: 'Focus!' });

// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'show-nudge') {
    showOverlay(message.message);
  }
});
```

### Long-lived Connections

```js
// content.js — connect
const port = chrome.runtime.connect({ name: 'nudge-channel' });
port.postMessage({ action: 'subscribe' });
port.onMessage.addListener((msg) => {
  /* handle */
});

// background.js — accept
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.action === 'subscribe') {
      /* ... */
    }
  });
});
```

### MV3 Constraints

- `sendResponse` synchronous by default. Return `true` for async.
- Chrome 146+: can return Promise from listener for async response.
- Long-lived ports keep service worker alive (since Chrome 114).
- Service worker may restart between messages — design stateless.

---

## Service Worker Lifecycle

### Key Timers

| Condition          | Timeout                        |
| ------------------ | ------------------------------ |
| Inactivity         | 30s (resets on event/API call) |
| Single request     | 5 min                          |
| `fetch()` response | 30s                            |

### Events (install order)

```
install → chrome.runtime.onInstalled → activate
```

### Best Practices for Holdup

1. Register ALL event listeners synchronously at top level.
2. Never rely on global vars — use `chrome.storage`.
3. Keep handlers small, return quickly.
4. Use `chrome.storage.session` for temp state.
5. Alarms min period: 30s (Chrome 120+).

### Init Pattern

```js
// background.js — top level, synchronous listener registration
chrome.runtime.onInstalled.addListener(() => {
  // First-time setup
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;
  handleNavigation(details);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    rebuildRules();
  }
});
```

---

## Recommended Approach for Holdup

**Primary: `chrome.webNavigation` + `chrome.scripting`**

Why:

- Dynamic — works with user-configured domains at runtime
- Fine-grained — inject overlay or redirect per-domain
- Flexible — can check additional conditions before nudging

**Fallback: `chrome.declarativeNetRequest` for interstitial redirect**

Why:

- Zero service worker involvement for URL matching
- Native performance
- Good for "hard block + redirect to interstitial" pattern

**Recommended hybrid:**

- Use `declarativeNetRequest` dynamic rules for the actual redirect/intercept
- Use `webNavigation` as a secondary signal if needed
- Use `chrome.scripting` for overlay mode (non-redirect)
- Rebuild dynamic rules whenever user changes domain config via `storage.onChanged`

---

## Manifest V3 Skeleton

```json
{
  "manifest_version": 3,
  "name": "Holdup",
  "version": "0.1.0",
  "description": "A personal nudge engine for your browser",
  "permissions": ["storage", "tabs", "webNavigation", "scripting", "declarativeNetRequest"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "options_page": "options.html",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "content_scripts": [],
  "declarative_net_request": {
    "rule_resources": [
      {
        "id": "default_rules",
        "enabled": true,
        "path": "rules.json"
      }
    ]
  },
  "web_accessible_resources": [
    {
      "resources": ["pages/interstitial/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
```
