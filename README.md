# Holdup

A personal nudge engine for Chrome/Brave. You set reminders for sites you want to think twice about visiting. When you navigate there, Holdup interrupts with your own message.

You write the nudge. You decide what it says. Holdup just makes sure you read it.

## How it works

1. Add a domain + your message + choose a mode (overlay or fullscreen)
2. Navigate to that domain
3. Holdup shows your reminder
4. Choose: go back, continue, get reminded later, or redirect somewhere else

## Modes

| Mode           | What happens                                                 |
| -------------- | ------------------------------------------------------------ |
| **Overlay**    | Semi-transparent backdrop over the page with a centered card |
| **Fullscreen** | Full redirect to a dedicated interstitial page               |

## Installation

1. Clone this repo
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** → select the project folder

## Setup

1. Click the Holdup icon in your toolbar → open Settings
2. Add a domain (e.g. `twitter.com`), write your message, pick a mode
3. Navigate to that site — Holdup intervenes

## Cooldown

After you dismiss a nudge, Holdup backs off. Configure per entry:

- **Always ask** — shows the nudge every time
- **Until browser restart** — session-based cooldown
- **For specified minutes** — custom duration

## Project structure

```
manifest.json                  # MV3 manifest
background.js                  # Service worker — URL detection, cooldown, DNR rules
content.js                     # Overlay content script (Shadow DOM, injected dynamically)
popup.html / popup.js          # Toolbar popup — status + settings link
options.html / options.js      # Settings page — domain CRUD
pages/interstitial/            # Fullscreen interstitial page
icons/                         # Extension icons
```

## Tech

- Vanilla HTML/CSS/JS — no framework, no build step, no bundler
- Tailwind via CDN
- System font stack (no web fonts — overlay renders instantly)
- Manifest V3 — Chrome/Brave only
- `chrome.storage.sync` for settings, `chrome.storage.session` for cooldowns

## Development

```bash
npm install            # install dev dependencies
npm run check          # format:check + lint (gate command)
npm run format         # prettier --write .
npm run lint           # eslint .
npm run lint -- --fix  # auto-fix lint issues
```

## Design

- **Calm authority** — amber warmth, not red alerts
- **CTA inversion** — "Go back" is prominent (amber), "Continue anyway" is muted (slate)
- **Never hostile** — no shame, no fake delays, no guilt-tripping copy
- The nudge is the product. Everything else is infrastructure.

See [`docs/design-spec.md`](docs/design-spec.md) for full visual language.
