# Holdup

Personal nudge engine. Set reminders for sites. Get interrupted by your own words when you visit them.

## Install

**Chrome Web Store** (recommended):

[![Install from Chrome Web Store](https://img.shields.io/badge/Install-Chrome%20Web%20Store-amber?style=flat-square)](https://chromewebstore.google.com/detail/holdup/cgpkmnkjkkccjfimgkkggkkackpbbljp)

**Manual (developer)**:

```
git clone https://github.com/justEstif/holdup-extension.git
```

1. Open `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select project folder

## Use

1. Toolbar icon → Settings
2. Add domain + message + mode (overlay | fullscreen)
3. Visit that site → nudge appears
4. Go back / continue / remind later / redirect

## Cooldown

| Setting               | Behavior          |
| --------------------- | ----------------- |
| Always ask            | Nudge every visit |
| Until browser restart | Session-scoped    |
| For N minutes         | Custom duration   |

## Modes

- **Overlay** — frosted backdrop + card on top of page (Shadow DOM isolated)
- **Fullscreen** — redirect to dedicated interstitial page

## Theme

System / Light / Dark toggle on settings page. Follows OS preference by default.

## Structure

```
manifest.json          # MV3 manifest
background.js          # Service worker — URL detection, cooldown, DNR
content.js             # Overlay — Shadow DOM, injected per navigation
popup.html/js          # Toolbar popup
options.html/js        # Settings — domain CRUD + theme + FAQ
storage.js             # CRUD layer (chrome.storage.sync)
theme.js               # Dark/light mode manager
pages/interstitial/    # Fullscreen interstitial page
css/tailwind.css       # Built Tailwind (local, no CDN)
```

## Dev

```bash
npm install
npm run check          # build:css + format:check + lint (gate)
npm run build:css      # rebuild Tailwind
npm run format         # prettier --write .
npm run lint           # eslint .
```

Stack: vanilla JS, Tailwind v4 (local build), no framework, no bundler, MV3 only.

## Design

Amber warmth, not red alerts. "Go back" prominent, "Continue" muted. No shame, no delays, no guilt. See [`docs/design-spec.md`](docs/design-spec.md).
