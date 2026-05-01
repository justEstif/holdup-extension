---
# holdup-extension-tbru
title: Scaffold extension project structure
status: completed
type: task
priority: normal
created_at: 2026-05-01T01:55:33Z
updated_at: 2026-05-01T02:23:25Z
parent: holdup-extension-fpjy
---

Set up the basic Manifest V3 extension structure:

- [x] Create `manifest.json` with permissions: `storage`, `declarativeNetRequest`, `webNavigation`, `tabs`, `scripting`
- [x] Create folder structure: `/pages/interstitial/`, `/icons/`, `/docs/` (flat structure: root-level JS files per AGENTS.md)
- [x] Add Tailwind CDN to HTML pages (popup.html, options.html, interstitial.html)
- [x] Add extension icon placeholder (PNG icons via ImageMagick)
- [x] Verify extension loads in Brave (chrome://extensions → developer mode → load unpacked)

Parent epic: holdup-extension-fpjy

## Summary of Changes

Scaffolded complete MV3 extension structure with research docs:
- manifest.json with storage, tabs, webNavigation, scripting, declarativeNetRequest permissions
- background.js service worker with URL detection and dynamic rule rebuilding
- content.js overlay content script (injected dynamically)
- popup.html/js extension popup
- options.html/js settings page for domain configuration
- pages/interstitial/ fullscreen interstitial redirect page
- rules.json empty static ruleset placeholder
- docs/extension-api.md MV3 API research (caveman mode)
- Placeholder PNG icons (16/48/128)
- All files pass npm run check, committed as 53257dd
