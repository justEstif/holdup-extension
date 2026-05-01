# PRODUCT.md — Holdup

## One-liner

Personal nudge engine — you set reminders for sites you want to think twice about visiting.

## Target user

You. Yourself. Not a parent, not an employer, not a school. This is a tool you choose and configure for your own behavior.

## Core loop

1. User adds domain + message + mode (overlay or redirect)
2. User navigates to that domain
3. Holdup interrupts with the custom message
4. User reads, then chooses: proceed or turn back

## Personality

- **Calm authority** — like a friend who cares, not a guard who punishes
- **Honest** — no trick UX, no shame, no fake delays
- **Quiet** — minimal chrome, generous space, the message is the content
- **Warm** — amber tones, not red alerts. You're being asked, not warned

## Design priorities

1. **The nudge is the product** — overlay and interstitial get design investment
2. **Popup and options are infrastructure** — clean, fast, functional
3. **Never hostile** — no aggressive copy, no guilt-tripping colors
4. **Instant** — no loading spinners on nudges, no custom font downloads

## Tone of voice

Direct. Second person. No exclamation marks.

- "Hold up." (not "Hold up!")
- "You wanted to think about this." (not "This site is blocked!")
- "Go back" / "Continue anyway" (not "BLOCKED" / "I accept the consequences")

## Constraints

- Tailwind CDN only — no custom CSS files unless unavoidable
- System font stack — no web font downloads (overlay must render instantly)
- Vanilla JS — no framework, no build step
- Manifest V3 — Chrome/Brave only
