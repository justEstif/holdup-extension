---
# holdup-extension-mrod
title: Build background service worker (navigation detection + cooldown)
status: completed
type: task
priority: normal
created_at: 2026-05-01T01:55:52Z
updated_at: 2026-05-01T03:24:21Z
parent: holdup-extension-fpjy
blocked_by:
    - holdup-extension-cgw4
---

Implement the core interception and cooldown logic in the service worker:

- [x] Create service worker (`background.js` at root, flat structure convention)
- [x] Cooldown state via `chrome.storage.session` (persists across SW wakeups) + `chrome.alarms` for expiry
- [x] On `chrome.storage.onChanged`, rebuild `declarativeNetRequest` rules for redirect-mode enabled entries
- [x] For redirect entries: DNR rules redirect to interstitial page with entry params
- [x] For overlay entries: inject content script dynamically per navigation via `chrome.scripting.executeScript`
- [x] Handle continue/go-back/remind messages: apply cooldown per entry's cooldownType setting
- [x] Handle tab close via `chrome.tabs.onRemoved` (hook for future per-tab cooldowns)
- [x] Handle "remind me again" via `chrome.alarms` → clears cooldown on expiry → rebuilds DNR rules

Parent epic: holdup-extension-fpjy

## Summary of Changes

- background.js now uses HoldupStorage via importScripts('./storage.js')
- Navigation detection: webNavigation.onBeforeNavigate → findActiveMatch (checks enabled + host match) → routeMatch (checks cooldown before injection)
- Cooldown system: chrome.storage.session for timestamps, chrome.alarms for expiry, DNR rules rebuilt to exclude cooled-down domains
- Message handling: continue/go-back apply cooldown, remind sets short timer
- DNR rules: only redirect-mode + enabled + not-on-cooldown entries get rules
- Tab close listener registered as hook for future per-tab cooldowns
- onInstalled rebuilds DNR rules on extension install/update
