---
# holdup-extension-phqp
title: Build overlay content script (popup on page)
status: in-progress
type: task
priority: normal
created_at: 2026-05-01T01:56:10Z
updated_at: 2026-05-01T02:54:01Z
parent: holdup-extension-fpjy
blocked_by:
    - holdup-extension-tbru
---

Create the overlay popup injected onto pages for overlay-mode entries:

- [ ] Create `/content/overlay.js` + `/content/overlay.css`
- [ ] On injection, message service worker to get entry data for current domain
- [ ] Inject a floating overlay/popup on the page with the custom reminder message
- [ ] **Dismiss** button → message service worker to set cooldown, remove overlay
- [ ] **Leave** button → navigate back (`history.back()`)
- [ ] **Remind me again** link → message service worker with timer, dismiss overlay
- [ ] **Redirect** button (only if `redirectUrl` is set) → navigate to redirect URL
- [ ] Style: fixed-position modal, semi-transparent backdrop, dismissible-looking
- [ ] Ensure overlay doesn't break page layout (z-index, position: fixed)

Parent epic: holdup-extension-fpjy
