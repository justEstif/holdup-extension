---
# holdup-extension-mrod
title: Build background service worker (navigation detection + cooldown)
status: todo
type: task
created_at: 2026-05-01T01:55:52Z
updated_at: 2026-05-01T01:55:52Z
parent: holdup-extension-fpjy
blocked_by:
    - holdup-extension-cgw4
---

Implement the core interception and cooldown logic in the service worker:

- [ ] Create `/background/service-worker.js`
- [ ] Maintain in-memory cooldown state map: `{ domain: { tabId: timestamp } }`
- [ ] On `chrome.storage.onChanged`, rebuild `declarativeNetRequest` rules for fullscreen-mode enabled entries
- [ ] For fullscreen entries: redirect matching URLs to `chrome-extension://.../pages/interstitial/interstitial.html?url=<original_url>&entry=<id>`
- [ ] For overlay entries: register content script dynamically for matching domains
- [ ] On interstitial/overlay callback messages (continue/go back/remind/redirect), update cooldown state per the entry's cooldown setting
- [ ] Handle tab close → clean up tab-based cooldowns
- [ ] Handle "remind me again" timer using `chrome.alarms`

Parent epic: holdup-extension-fpjy
