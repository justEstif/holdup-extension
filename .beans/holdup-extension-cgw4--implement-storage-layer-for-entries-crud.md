---
# holdup-extension-cgw4
title: Implement storage layer for entries CRUD
status: completed
type: task
priority: normal
created_at: 2026-05-01T01:55:41Z
updated_at: 2026-05-01T03:21:02Z
parent: holdup-extension-fpjy
blocked_by:
    - holdup-extension-tbru
---

Build the data layer for managing entries in `chrome.storage.sync`:

- [x] Create `storage.js` with CRUD functions: `getEntries()`, `addEntry(entry)`, `updateEntry(id, updates)`, `deleteEntry(id)`
- [x] Entry schema: `{ id, host, message, mode, cooldownType, cooldownMinutes, redirectUrl, enabled }` (uses `host`/`cooldownType` per existing convention)
- [x] Generate unique IDs for entries (crypto.randomUUID with fallback)
- [x] Add defaults: `mode='overlay'`, `cooldownType='session'`, `cooldownMinutes=30`, `enabled=true`
- [x] Export functions via globalThis.HoldupStorage namespace (works in service worker, options, popup, interstitial)

Parent epic: holdup-extension-fpjy

## Summary of Changes

- Created `storage.js` with `HoldupStorage` global namespace providing CRUD: getEntries, addEntry, getEntryById, getEntryByHost, updateEntry, deleteEntry
- Entries get unique IDs via crypto.randomUUID (with fallback)
- Defaults: mode=overlay, cooldownType=session, cooldownMinutes=30, enabled=true
- Auto-migrates existing entries without IDs on first load
- Updated all consumers: background.js (importScripts), options.js (ID-based CRUD), popup.js, interstitial.js
- Added serviceworker globals and HoldupStorage to eslint config
