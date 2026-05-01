---
# holdup-extension-cgw4
title: Implement storage layer for entries CRUD
status: in-progress
type: task
priority: normal
created_at: 2026-05-01T01:55:41Z
updated_at: 2026-05-01T03:17:19Z
parent: holdup-extension-fpjy
blocked_by:
    - holdup-extension-tbru
---

Build the data layer for managing entries in `chrome.storage.sync`:

- [ ] Create `/background/storage.js` with CRUD functions: `getEntries()`, `addEntry(entry)`, `updateEntry(id, updates)`, `deleteEntry(id)`
- [ ] Entry schema: `{ id, domain, message, mode, cooldown, cooldownMinutes, redirectUrl, enabled }`
- [ ] Generate unique IDs for entries
- [ ] Add defaults: `mode='fullscreen'`, `cooldown='tab'`, `enabled=true`
- [ ] Export functions for use by service worker, options page, and content scripts

Parent epic: holdup-extension-fpjy
