---
# holdup-extension-phqp
title: Build overlay content script (popup on page)
status: completed
type: task
priority: normal
created_at: 2026-05-01T01:56:10Z
updated_at: 2026-05-01T02:59:11Z
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

## Summary of Changes

- Rewrote content.js using Shadow DOM (closed mode) for complete style isolation from host pages
- Light card on frosted backdrop per design spec: white card, amber bar, amber Go back CTA, muted Dismiss button
- All four buttons wired: Go back (history.back), Dismiss (cooldown + close), Remind me again (short cooldown + close), Redirect (conditional)
- Entrance animations via Web Animations API: 200ms backdrop fade-in, 250ms card scale-in with prefers-reduced-motion support
- Escape key closes overlay, focus-visible outlines on all interactive elements
- Updated background.js: injectOverlay now passes full entry object, uses .then() sequencing for reliable message delivery
- All files pass npm run check
