---
# holdup-extension-x0vm
title: Integration testing and end-to-end wiring
status: todo
type: task
created_at: 2026-05-01T01:56:29Z
updated_at: 2026-05-01T01:56:29Z
parent: holdup-extension-fpjy
blocked_by:
    - holdup-extension-mrod
    - holdup-extension-gp75
    - holdup-extension-phqp
    - holdup-extension-9atm
---

Wire all pieces together and test the full flow:

- [ ] Test fullscreen mode: add entry, navigate to domain, verify interstitial shows
- [ ] Test overlay mode: add entry, navigate to domain, verify popup injects
- [ ] Test all 4 actions: Continue, Go back, Remind me again, Redirect
- [ ] Test cooldown behaviors: always, tab (new tab re-triggers), session, time-based
- [ ] Test options page: add/edit/delete/toggle entries
- [ ] Test advanced section collapse/expand
- [ ] Test service worker restart (cooldowns reset correctly)
- [ ] Test edge cases: duplicate domains, invalid redirect URLs, empty message
- [ ] Load as unpacked extension in Brave and verify everything works

Parent epic: holdup-extension-fpjy
