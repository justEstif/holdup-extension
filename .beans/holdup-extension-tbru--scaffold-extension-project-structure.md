---
# holdup-extension-tbru
title: Scaffold extension project structure
status: in-progress
type: task
priority: normal
created_at: 2026-05-01T01:55:33Z
updated_at: 2026-05-01T02:16:52Z
parent: holdup-extension-fpjy
---

Set up the basic Manifest V3 extension structure:

- [x] Create `manifest.json` with permissions: `storage`, `declarativeNetRequest`, `webNavigation`, `tabs`, `scripting`
- [x] Create folder structure: `/pages/interstitial/`, `/icons/`, `/docs/` (flat structure: root-level JS files per AGENTS.md)
- [x] Add Tailwind CDN to HTML pages (popup.html, options.html, interstitial.html)
- [x] Add extension icon placeholder (PNG icons via ImageMagick)
- [ ] Verify extension loads in Brave (chrome://extensions → developer mode → load unpacked)

Parent epic: holdup-extension-fpjy
