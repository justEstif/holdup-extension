# Holdup — Privacy Policy

**Last updated: May 1, 2026**

Holdup does not collect, store, transmit, or sell any personal data.

## Data handling

All extension data is stored locally in your browser using Chrome's built-in storage API (`chrome.storage.sync` and `chrome.storage.session`). This includes:

- Your configured domain entries and nudge messages
- Your theme preference (System / Light / Dark)
- Cooldown timestamps (session only, cleared on browser restart)

No data is sent to any server. No analytics. No tracking. No third-party services.

## Permissions

| Permission                   | Why                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `storage`                    | Save your domain entries and settings locally                                               |
| `tabs`                       | Send overlay content script to the active tab                                               |
| `webNavigation`              | Detect when you navigate to a configured domain                                             |
| `scripting`                  | Inject the overlay content script on matched pages                                          |
| `declarativeNetRequest`      | Redirect fullscreen-mode entries to the interstitial page                                   |
| `alarms`                     | Schedule cooldown expiry timers                                                             |
| `<all_urls>` host permission | Match any user-configured domain without prior knowledge of which domains the user will add |

## Third parties

None. Holdup has no external dependencies, no CDN scripts, no analytics, no ads.

## Changes

If this policy changes, it will be updated on this page.

## Contact

Open an issue at [github.com/justEstif/holdup-extension](https://github.com/justEstif/holdup-extension/issues).
