# AGENTS.md — Holdup

Project conventions for AI agents working on this codebase.

## Project overview

Holdup is a Chrome/Brave Manifest V3 browser extension that acts as a personal nudge engine. When a user navigates to a configured domain, it shows a custom reminder via a fullscreen interstitial or overlay popup.

- **Stack**: Vanilla HTML/CSS/JS + Tailwind CDN. No build step, no framework, no bundler.
- **Browser**: Chrome/Brave, Manifest V3
- **Storage**: `chrome.storage.sync`
- **Intentionally minimal** — do not add frameworks, bundlers, or build tools.

## Verification commands

Run these before committing. CI runs the same commands.

```bash
npm run check          # format:check + lint (max-warnings=0)
npm run format:check   # prettier --check .
npm run lint           # eslint .
npm run lint -- --max-warnings=0  # strict: fails on any warning
```

## Conventions

- Use `const`/`let`, never `var`.
- Use `chrome.` APIs directly — no wrappers unless the wrapper hides real complexity.
- Keep functions small: max 40 lines, max 4 params, max depth 3.
- No `console.log` — use `console.warn` or `console.error` for debugging.
- Single quotes, semicolons, trailing commas (enforced by Prettier).
- All UI uses Tailwind utility classes via CDN — no custom CSS files unless unavoidable.

## Git safety

- Never push directly to `main` or `master`.
- Never use `git push --force`, `git reset --hard`, or `git clean -fdx` without explicit approval.
- Do not commit secrets, `.env` files, or private keys.
- Before committing, run `npm run check` to ensure lint and format pass.

## File structure

```
manifest.json          # Extension manifest (MV3)
*.html                 # Extension pages (popup, options, interstitial)
*.js                   # Content scripts, background service worker, popup logic
*.css                  # Only if Tailwind CDN is insufficient
icons/                 # Extension icons
```
