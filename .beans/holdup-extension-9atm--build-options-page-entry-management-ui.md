---
# holdup-extension-9atm
title: Build options page (entry management UI)
status: completed
type: task
priority: normal
created_at: 2026-05-01T01:56:18Z
updated_at: 2026-05-01T03:11:13Z
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

## Summary of Changes

- Redesigned options.html per design spec (slate-50 bg, white cards, amber accents, responsive form layout)
- Implemented options.js: add domain form, entry list with view/collapsed and edit/expanded states, inline remove confirmation (click Remove → Remove? → confirm)
- Advanced section with cooldown type dropdown (Always ask / Until browser restart / For specified minutes), conditional cooldown minutes input, redirect URL input
- Click entry card to expand inline edit form with all fields (domain, message, mode, cooldown, redirect URL), Save/Cancel buttons
- Updated background.js: applyContinueCooldown checks entry's cooldownType field, skips cooldown for 'always' entries, uses entry-specific minutes for 'time' entries
- All files pass npm run check
