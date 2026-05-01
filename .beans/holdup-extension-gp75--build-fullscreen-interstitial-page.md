---
# holdup-extension-gp75
title: Build fullscreen interstitial page
status: completed
type: task
priority: normal
created_at: 2026-05-01T01:56:02Z
updated_at: 2026-05-01T02:53:53Z
parent: holdup-extension-fpjy
blocked_by:
    - holdup-extension-tbru
---

Create the interstitial page shown when fullscreen mode triggers:

- [ ] Create `/pages/interstitial/interstitial.html` + `interstitial.js` + `interstitial.css`
- [ ] Parse URL params (`url`, `entry` id) to get original destination and entry data
- [ ] Load entry from `chrome.storage.sync` to display the custom message
- [ ] Show user's custom reminder message prominently
- [ ] **Continue** button → message service worker to set cooldown, then navigate to original URL
- [ ] **Go back** button → message service worker, then `history.back()`
- [ ] **Remind me again** link → message service worker with timer, navigate to original URL
- [ ] **Redirect** button (only if `redirectUrl` is set) → navigate to redirect URL
- [ ] Style with Tailwind CDN — clean, centered, minimal UI

Parent epic: holdup-extension-fpjy

## Summary of Changes

- Redesigned interstitial.html per design spec (slate-900 dark bg, amber bar, slate-800 card, amber Go back CTA, muted Continue button)
- Implemented interstitial.js: parses entry param from URL, loads entry data from chrome.storage.sync, wires all four buttons (Go back, Continue anyway, Remind me again, Redirect)
- Updated background.js with cooldown system: chrome.storage.session for cooldown timestamps, chrome.alarms for cooldown expiry, DNR rules dynamically exclude cooled-down domains to prevent redirect loops
- Added alarms permission to manifest.json
- All files pass npm run check (format + lint)
