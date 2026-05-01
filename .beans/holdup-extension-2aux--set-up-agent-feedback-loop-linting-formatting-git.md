---
# holdup-extension-2aux
title: Set up agent feedback loop (linting, formatting, git hooks)
status: in-progress
type: task
priority: normal
created_at: 2026-05-01T02:02:26Z
updated_at: 2026-05-01T02:06:18Z
parent: holdup-extension-fpjy
blocking:
    - holdup-extension-tbru
---

Set up deterministic feedback loops for AI-assisted coding in this repo:

- [ ] Initialize git repo with a proper `.gitignore`
- [ ] Add a linter (ESLint for JS files) with sensible defaults
- [ ] Add a formatter (Prettier) with consistent config
- [ ] Add pre-commit hooks (via Husky or simple git hooks) to run lint + format on commit
- [ ] Add a `CLAUDE.md` or `CONTEXT.md` with project conventions for AI agents
- [ ] Ensure all configs are minimal — this is a vanilla JS project, no overkill

Parent epic: holdup-extension-fpjy
