---
# holdup-extension-2aux
title: Set up agent feedback loop (linting, formatting, git hooks)
status: completed
type: task
priority: normal
created_at: 2026-05-01T02:02:26Z
updated_at: 2026-05-01T02:08:41Z
parent: holdup-extension-fpjy
blocking:
    - holdup-extension-tbru
---

Set up deterministic feedback loops for AI-assisted coding in this repo:

- [x] Initialize git repo with a proper `.gitignore`
- [x] Add a linter (ESLint for JS files) with sensible defaults
- [x] Add a formatter (Prettier) with consistent config
- [x] Add pre-commit hooks (via Husky or simple git hooks) to run lint + format on commit
- [x] Add a `AGENTS.md` with project conventions for AI agents
- [x] Ensure all configs are minimal — this is a vanilla JS project, no overkill

Parent epic: holdup-extension-fpjy

## Summary of Changes

Initialized feedback loop at Level 1 - Guardrails:

- Git repo with `.gitignore` (node_modules, dist, .env, .DS_Store)
- ESLint 9 flat config with complexity limits (max-depth 3, max-lines-per-function 40, max-params 4, complexity 10, no-console except warn/error)
- Prettier with single quotes, semicolons, trailing commas, 100 char width
- Husky pre-commit hook running `format:check` + `lint --max-warnings=0`
- `AGENTS.md` with project conventions, verification commands, git safety rules
- `npm run check` as the single local gate command
- Validated: lint catches violations (tested with console.log), format check passes, pre-commit hook runs on commit
