---
# holdup-extension-gp75
title: Build fullscreen interstitial page
status: todo
type: task
created_at: 2026-05-01T01:56:02Z
updated_at: 2026-05-01T01:56:02Z
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
