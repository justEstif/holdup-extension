---
# holdup-extension-9atm
title: Build options page (entry management UI)
status: in-progress
type: task
priority: normal
created_at: 2026-05-01T01:56:18Z
updated_at: 2026-05-01T02:59:19Z
parent: holdup-extension-fpjy
blocked_by:
    - holdup-extension-cgw4
---

Create the full options page for managing entries:

- [ ] Create `/pages/options/options.html` + `options.js` + `options.css`
- [ ] **Entry list**: Vertical list showing domain, truncated message, mode badge, enable/disable toggle
- [ ] **Click to expand**: Expand an entry to see full details and edit
- [ ] **Delete button**: Remove an entry with confirmation
- [ ] **Add form** (simple): Domain input, Message textarea, Mode dropdown (fullscreen/overlay)
- [ ] **Advanced section** (collapsed by default): Cooldown dropdown (always/tab/session/time), Cooldown minutes input (visible only if time selected), Redirect URL input
- [ ] Load/save entries via `chrome.storage.sync` using storage layer functions
- [ ] Style with Tailwind CDN
- [ ] Set as `options_page` in manifest.json
- [ ] Toolbar icon click opens this page

Parent epic: holdup-extension-fpjy
