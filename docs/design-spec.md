# Design Spec — Holdup

Visual language for all UI surfaces. Tailwind classes only. System fonts only.

## Philosophy

Calm authority. User installed this. User wrote the messages. Nudge = user talking to self. Design serves the pause — not decoration, not alarm.

## Color Palette

| Token             | Tailwind       | Use                                           |
| ----------------- | -------------- | --------------------------------------------- |
| bg-dark           | `slate-900`    | Interstitial background                       |
| bg-surface        | `white`        | Cards, forms, popup                           |
| bg-page           | `slate-50`     | Options page background                       |
| bg-backdrop       | `slate-900/60` | Overlay backdrop (semi-transparent)           |
| accent            | `amber-500`    | Nudge highlight, "go back" CTA, active states |
| accent-hover      | `amber-600`    | Hover state for amber elements                |
| accent-muted      | `amber-100`    | Badge background, subtle highlights           |
| accent-border     | `amber-400`    | Focus rings, active borders                   |
| text-primary      | `slate-800`    | Headings, body text on light bg               |
| text-secondary    | `slate-500`    | Labels, secondary info, timestamps            |
| text-on-dark      | `slate-100`    | Body text on dark bg                          |
| text-heading-dark | `white`        | Headings on dark bg                           |
| btn-proceed       | `slate-700`    | "Continue" / "I know what I'm doing" button   |
| btn-proceed-hover | `slate-800`    | Proceed hover                                 |
| btn-safe          | `amber-500`    | "Go back" / primary positive CTA              |
| btn-safe-hover    | `amber-600`    | Safe hover                                    |
| btn-danger        | `red-500`      | Delete, destructive actions                   |
| btn-danger-hover  | `red-600`      | Danger hover                                  |
| border            | `slate-200`    | Input borders, dividers                       |
| border-focus      | `amber-400`    | Input focus ring                              |

### No-go colors

- No `blue-*` as primary (too corporate, too "default browser UI")
- No `red-*` on nudges (too alarming — red only for destructive settings actions)
- No `green-*` (implies pass/fail judgment)

## Typography

System font stack via Tailwind default (`font-sans`). No web fonts. Overlay renders instantly — no FOIT/FOUT.

| Role               | Classes                                                      | Size | Notes                         |
| ------------------ | ------------------------------------------------------------ | ---- | ----------------------------- |
| h1-interstitial    | `text-4xl font-bold tracking-tight text-white`               | 36px | Interstitial heading          |
| h1-page            | `text-2xl font-bold text-slate-800`                          | 24px | Options page heading          |
| h1-popup           | `text-lg font-bold text-slate-800`                           | 20px | Popup heading                 |
| h2                 | `text-lg font-semibold text-slate-800`                       | 20px | Section headings              |
| body-nudge         | `text-xl text-slate-100 leading-relaxed`                     | 20px | Nudge message on interstitial |
| body-nudge-overlay | `text-lg text-slate-700 leading-relaxed`                     | 18px | Nudge message on overlay card |
| body               | `text-sm text-slate-600`                                     | 14px | Standard body text            |
| label              | `text-xs font-medium text-slate-500 uppercase tracking-wide` | 12px | Form labels, badges           |
| btn-primary        | `text-sm font-semibold text-white`                           | 14px | CTA buttons                   |
| btn-secondary      | `text-sm font-medium text-slate-600`                         | 14px | Secondary actions             |

## Spacing

Base unit: 4px (Tailwind default). Generosity matters — nudges breathe.

| Context           | Padding                                 | Gap                             |
| ----------------- | --------------------------------------- | ------------------------------- |
| Interstitial card | `p-12` (48px)                           | `gap-6` between sections        |
| Overlay card      | `p-8` (32px)                            | `gap-5` between sections        |
| Popup container   | `p-4` (16px)                            | `gap-3` between elements        |
| Options page      | `p-6` (24px)                            | `gap-4` between sections        |
| Form inputs       | `px-3 py-2`                             | `gap-2` inline, `gap-3` stacked |
| List items        | `p-4`                                   | `gap-3` between items           |
| Buttons           | `px-6 py-3` large, `px-4 py-2` standard | —                               |

## Components

### Interstitial (Fullscreen Redirect)

Full viewport. Dark. Centered content. Single focus.

```
┌──────────────────────────────────────────┐
│              slate-900 bg                │
│                                          │
│          ┌──────────────────┐            │
│          │  amber-500 bar   │  4px top   │
│          ├──────────────────┤            │
│          │                  │            │
│          │    "Hold up."    │  h1-dark   │
│          │                  │            │
│          │   {message}      │  body-nudge│
│          │                  │            │
│          │  ┌──────┐ ┌────┐ │            │
│          │  │ Go   │ │Cont│ │  buttons   │
│          │  │ back │ │inue│ │            │
│          │  └──────┘ └────┘ │            │
│          │                  │            │
│          │  Remind in 5min  │  link      │
│          │                  │            │
│          └──────────────────┘            │
│              max-w-lg                    │
└──────────────────────────────────────────┘
```

- Container: `min-h-screen bg-slate-900 flex items-center justify-center p-6`
- Card: `max-w-lg w-full bg-slate-800 rounded-2xl overflow-hidden shadow-2xl`
- Amber bar: `h-1 bg-amber-500` (top edge of card)
- Heading: `text-4xl font-bold tracking-tight text-white mt-10`
- Message: `text-xl text-slate-300 leading-relaxed mt-4`
- Button row: `flex gap-4 mt-10`
- Go back btn: `flex-1 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors`
- Continue btn: `flex-1 px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-600 transition-colors`
- Remind link: `text-sm text-slate-500 hover:text-amber-400 mt-4 transition-colors`
- Card inner: `p-12 text-center`

### Overlay (On-Page Injection)

Light card. Frosted backdrop. Must visually separate from host page.

```
┌──────────────────────────────────────────┐
│         slate-900/60 backdrop            │
│   (page content blurred behind)          │
│                                          │
│          ┌──────────────────┐            │
│          │  amber-500 bar   │  3px top   │
│          ├──────────────────┤            │
│          │                  │            │
│          │    "Hold up."    │  h2        │
│          │                  │            │
│          │   {message}      │  nudge-ovr │
│          │                  │            │
│          │  ┌──────┐ ┌────┐ │            │
│          │  │ Go   │ │Dismiss│           │
│          │  │ back │ │     │ │            │
│          │  └──────┘ └────┘ │            │
│          │                  │            │
│          │  Remind in 5min  │  link      │
│          └──────────────────┘            │
│              max-w-md                    │
└──────────────────────────────────────────┘
```

- Backdrop: `fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4`
- Card: `bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full`
- Amber bar: `h-0.5 bg-amber-500`
- Heading: `text-2xl font-bold text-slate-800`
- Message: `text-lg text-slate-600 leading-relaxed mt-3`
- Button row: `flex gap-3 mt-8`
- Go back btn: `flex-1 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors text-sm`
- Dismiss btn: `flex-1 px-5 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors text-sm`
- Card inner: `p-8 text-center`

### Extension Popup

Tiny. Functional. One purpose: show status, link to settings.

```
┌────────────────────┐
│  Holdup       ⚙️   │  w-72
│  3 domains active  │
└────────────────────┘
```

- Container: `w-72 p-4 bg-slate-50`
- Header row: `flex items-center justify-between mb-3`
- Heading: `text-lg font-bold text-slate-800`
- Settings icon: `text-slate-400 hover:text-amber-500 transition-colors`
- Status: `text-sm text-slate-500`
- Divider: `border-t border-slate-200 mt-3 pt-3` (if extra content needed)

### Options / Settings Page

Form + list. Clean tool layout. Two sections: add form, entry list.

```
┌─────────────────────────────────────────────────────┐
│  Holdup — Settings                      max-w-2xl   │
│                                                     │
│  ┌─ Add Domain ──────────────────────────────────┐  │
│  │  [domain input]  [message input]  [mode ▾]    │  │
│  │  ┌─ Advanced (collapsed) ──────────────────┐   │  │
│  │  │  ▸ Cooldown, redirect URL              │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  │                            [Add Domain]        │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ claude.ai ────────────────────────────────────┐ │
│  │  overlay  │  "Do you really need AI for this?"  │ │
│  │                                    [✕ Remove]  │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
│  ┌─ twitter.com ──────────────────────────────────┐ │
│  │  redirect │  "You said you'd check this later."│ │
│  │                                    [✕ Remove]  │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

- Page: `max-w-2xl mx-auto p-6 bg-slate-50 min-h-screen`
- Heading: `text-2xl font-bold text-slate-800 mb-8`
- Form card: `bg-white rounded-xl border border-slate-200 p-5 mb-6`
- Form row: `flex gap-3 mb-4` (inputs inline on wide, stack on narrow)
- Input: `flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`
- Select: same as input + `bg-white`
- Add button: `px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors`
- Advanced toggle: `text-sm text-slate-500 hover:text-amber-600 cursor-pointer mt-2`
- Entry card: `bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors`
- Entry domain: `font-semibold text-slate-800`
- Mode badge: `text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700`
- Entry message: `text-sm text-slate-500 mt-1`
- Remove btn: `text-sm text-slate-400 hover:text-red-500 transition-colors`
- Empty state: `text-sm text-slate-400 text-center py-8`

## Animations & Transitions

Minimal. Purposeful. No gratuitous motion.

| Element             | Transition                         | Duration | Purpose                                      |
| ------------------- | ---------------------------------- | -------- | -------------------------------------------- |
| Button hover        | `transition-colors`                | 150ms    | Standard feedback                            |
| Overlay appear      | `animate-in fade-in` (opacity 0→1) | 200ms    | Smooth entrance, not jarring                 |
| Overlay card appear | scale 0.95→1 + opacity 0→1         | 250ms    | Subtle grow-in                               |
| Interstitial appear | instant                            | 0ms      | Redirect = full page swap, no animation      |
| Entry card hover    | `transition-colors` on border      | 150ms    | Interactive feedback                         |
| Remove confirm      | inline state swap                  | instant  | No animation — action should feel deliberate |

### Overlay entrance (CSS)

Overlay needs inline styles (content script, no Tailwind `@keyframes` access):

```css
/* Backdrop */
opacity: 0 → 1 over 200ms

/* Card */
transform: scale(0.95) → scale(1)
opacity: 0 → 1
over 250ms, ease-out
```

Use `element.animate()` Web Animations API — no CSS file needed.

### Interstitial entrance

None. Full page redirect — no transition needed. Content appears instantly.

## z-index Layers

| Layer            | z-index                    | Use                    |
| ---------------- | -------------------------- | ---------------------- |
| Page content     | auto                       | Default                |
| Overlay backdrop | 999999                     | Above all page content |
| Overlay card     | 999999 (child of backdrop) | Same stacking context  |

## Accessibility

- Focus ring: `focus:ring-2 focus:ring-amber-400 focus:outline-none` on all interactive elements
- Color contrast: all text meets WCAG AA (slate-800 on white = 9.3:1, white on slate-800 = 8.6:1)
- Buttons: visible text labels, no icon-only buttons
- Keyboard: overlay and interstitial trap focus, Escape closes overlay
- Motion: `prefers-reduced-motion` disables overlay animations

## Summary of Classes (Copy-Paste Reference)

### Nudge surfaces

```
/* Interstitial card */
max-w-lg w-full bg-slate-800 rounded-2xl overflow-hidden shadow-2xl

/* Interstitial inner */
p-12 text-center

/* Amber bar */
h-1 bg-amber-500

/* Overlay backdrop */
fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4

/* Overlay card */
bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full

/* Overlay inner */
p-8 text-center
```

### Buttons

```
/* Safe/primary CTA (Go back, Add domain) */
px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors

/* Proceed/dismiss (Continue, I know what I'm doing) */
px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-600 transition-colors

/* Dismiss on overlay */
px-5 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors text-sm

/* Danger (Remove) */
text-sm text-slate-400 hover:text-red-500 transition-colors
```

### Forms

```
/* Input */
px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent

/* Select */
bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
```

### Badges

```
text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700
```
