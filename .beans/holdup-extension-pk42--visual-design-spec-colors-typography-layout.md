---
# holdup-extension-pk42
title: Visual design spec (colors, typography, layout)
status: completed
type: task
priority: normal
created_at: 2026-05-01T02:02:15Z
updated_at: 2026-05-01T02:31:14Z
parent: holdup-extension-fpjy
blocking:
    - holdup-extension-gp75
    - holdup-extension-phqp
    - holdup-extension-9atm
---

Define the visual language for all Holdup UI surfaces before building:

- [x] **Color palette**: Pick a primary, accent, background, text, and danger color. Tailwind classes only — no custom CSS colors.
- [x] **Typography**: Choose font sizes/weights for headings, body text, buttons, labels
- [x] **Vibe**: Define the tone (minimal? playful? stern?) — this is a personal nudge engine, not a corporate blocker
- [x] **Interstitial page mockup**: Layout for the fullscreen reminder — message placement, button arrangement (Continue, Go back, Remind me again, Redirect), spacing
- [x] **Overlay popup mockup**: Layout for the injected overlay — backdrop, card size, button arrangement (Dismiss, Leave, Remind me again, Redirect)
- [x] **Options page mockup**: Layout for the entry list, add form, expand/edit state, advanced section collapsed/expanded
- [x] Document all decisions as Tailwind utility classes so implementation is just copy-paste

Parent epic: holdup-extension-fpjy

## Summary of Changes

Created visual design spec covering all Holdup UI surfaces.

**Files created:**
- `docs/design-spec.md` — full spec with color palette, typography scale, spacing conventions, ASCII mockups for all 4 surfaces, animation rules, a11y notes, copy-paste Tailwind class reference
- `PRODUCT.md` — product identity (impeccable teach artifact)
- `DESIGN.md` — design quick reference (impeccable teach artifact)

**Key decisions:**
- Color: slate (neutral) + amber (warmth/accent). No blue primary, no red on nudges.
- Typography: system font stack, weight contrast. No web fonts (overlay must render instantly).
- CTA logic: "Go back" = amber (warm, encouraged path). "Continue" = muted slate (available but not promoted). Reverses typical UI pattern — safe choice is visually primary.
- Motion: overlay fade-in only (250ms). Interstitial instant. No gratuitous animation.
- Spacing: generous padding on nudge surfaces (48px interstitial, 32px overlay) — the pause should breathe.
