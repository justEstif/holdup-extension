---
# holdup-extension-pk42
title: Visual design spec (colors, typography, layout)
status: todo
type: task
created_at: 2026-05-01T02:02:15Z
updated_at: 2026-05-01T02:02:15Z
parent: holdup-extension-fpjy
blocking:
    - holdup-extension-gp75
    - holdup-extension-phqp
    - holdup-extension-9atm
---

Define the visual language for all Holdup UI surfaces before building:

- [ ] **Color palette**: Pick a primary, accent, background, text, and danger color. Tailwind classes only — no custom CSS colors.
- [ ] **Typography**: Choose font sizes/weights for headings, body text, buttons, labels
- [ ] **Vibe**: Define the tone (minimal? playful? stern?) — this is a personal nudge engine, not a corporate blocker
- [ ] **Interstitial page mockup**: Layout for the fullscreen reminder — message placement, button arrangement (Continue, Go back, Remind me again, Redirect), spacing
- [ ] **Overlay popup mockup**: Layout for the injected overlay — backdrop, card size, button arrangement (Dismiss, Leave, Remind me again, Redirect)
- [ ] **Options page mockup**: Layout for the entry list, add form, expand/edit state, advanced section collapsed/expanded
- [ ] Document all decisions as Tailwind utility classes so implementation is just copy-paste

Parent epic: holdup-extension-fpjy
