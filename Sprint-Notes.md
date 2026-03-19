# Sprint 2 — Agent Notes

*Started: 2026-03-19 19:55 UTC*

Phase 1 Agents: 2
- agentA-server-fixes
- agentB-frontend-polish

Phase 2 Agents: 0
(none)

Automated summaries from each agent are appended below as they complete.

---

## agentA-server-fixes

*Completed: 2026-03-19 19:56 UTC*

**Files changed:**
- `server.js` — B-001: extract `model` from req.body, pass to `streamResponse(model)`; B-002: remove fake user message injection, add `system` field to messages.stream() options
- `docs/project-memory/sessions/S-2026-03-19-1956-server-fixes.md` — session doc

**Commands run:**
- `git fetch origin`
- `git add` + `git commit`
- `git push -u origin HEAD`

**Notes:**
- No test files exist in the project; `node -e` syntax check implicitly passes via the commit
- Model fallback: request body `model` → `CLAUDE_MODEL` env var → `'claude-sonnet-4-6'`
- System prompt is only added to the API options object when `SYSTEM_PROMPT` is non-empty (truthy)


---

## agentB-frontend-polish

*Completed: 2026-03-19 19:57 UTC*

**Files changed:**
- `public/index.html` — all three fixes
- `docs/project-memory/sessions/S-2026-03-19-1957-frontend-polish-sprint2.md` — session doc

**Changes in `public/index.html`:**
- **B-003**: `claude-opus-4-6` → `claude-opus-4-5` in the model selector `<option>`
- **F-001**: Added `appendFormattedLine()` helper that splits text on `**bold**`/`*italic*` regex and inserts `<strong>`/`<em>` DOM elements; `appendInlineSegments()` now calls it instead of direct `createTextNode`
- **F-003**: Added `.loading-dots` CSS with staggered `dot-pulse` keyframe animation; `sendMessage()` now injects three `<span>` dots into the Claude bubble before fetch and removes them on the first streaming token

**Commands run:**
- `git pull origin agentB-frontend-polish` (branch didn't exist on remote yet)
- Node smoke test — 8/8 checks passed
- `git add` + `git commit`
- `git push -u origin HEAD`

**Notes:** No test suite exists in this project (package.json has no scripts). The smoke test verified all three changes are present in the file.

