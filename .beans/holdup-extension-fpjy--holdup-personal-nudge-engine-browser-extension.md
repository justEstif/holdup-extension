---
# holdup-extension-fpjy
title: Holdup - Personal Nudge Engine Browser Extension
status: todo
type: epic
created_at: 2026-05-01T01:55:21Z
updated_at: 2026-05-01T01:55:21Z
---

A browser extension that intercepts navigation to user-defined websites and shows custom reminder messages. Think of it as a personal nudge engine — when you navigate to claude.ai, it asks 'you sure you don't want to use opencode instead?'

## Core Design Decisions

- **Browser**: Chrome/Brave, Manifest V3
- **Site matching**: Domain only
- **Interception**: Fullscreen via `declarativeNetRequest` redirect; Overlay via content script
- **UI modes**: Fullscreen interstitial or overlay popup, configurable per entry
- **Actions**: Continue, Go back, Remind me again, Redirect (optional per entry)
- **Cooldown**: Per-entry — always / tab (default) / session / time
- **Cooldown state**: In-memory in service worker
- **Storage**: `chrome.storage.sync`
- **Options page**: Full tab, vertical list with expand/edit
- **Form**: Simple (domain + message + mode) + collapsed advanced section
- **Tech stack**: Vanilla HTML/CSS/JS + Tailwind CDN
- **Toolbar icon**: Click → opens options page

## Data Model

```
Entry {
  id:               string
  domain:           string
  message:          string
  mode:             'fullscreen' | 'overlay'
  cooldown:         'always' | 'tab' | 'session' | 'time'
  cooldownMinutes:  number?       // only if cooldown = 'time'
  redirectUrl:      string?       // optional alternative URL
  enabled:          boolean
}
```

## Parking Lot (future versions)

- Path/regex-based URL matching
- Category-based site matching
- Time-based rules (intercept during work hours only)
- Toolbar popup with quick toggles
- Global on/off toggle
