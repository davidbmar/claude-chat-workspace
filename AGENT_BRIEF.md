agentB-js-error-ux — Sprint 9

Previous Sprint Summary
─────────────────────────────────────────
# claude-chat-workspace Project Status — March 19, 2026 (Sprint 8: Sprint 8)

## Sprint 8 Summary

- Fix markdown table rendering (B-007): GFM pipe-table syntax renders as raw text
- Fix model selection persistence (B-008): model selector resets to Sonnet on page reload
- Fix copy button overlap on short responses (B-005): needs minimum padding-right ~56px

---

## What Changed

### agentA-frontend-fixes

- Fix model selector persistence across page reloads and fix copy button overlap on short responses

**Commits:**
- (no commits)

**Files:** no changes

### agentB-table-renderer

- Add GFM markdown table rendering to the DOM-based markdown renderer in public/index.html

**Commits:**
- (no commits)

**Files:** no changes


---

## Merge Results

| # | Branch | Deliverable | Phase | Conflicts | Files Changed |
|---|--------|-------------|-------|-----------|---------------|
| 1 | agentA-frontend-fixes | Fix model selector persistence across page reloads and fix copy button overlap on short responses | 1 | Clean | 0 |
| 2 | agentB-table-renderer | Add GFM markdown table rendering to the DOM-based markdown renderer in public/index.html | 1 | Clean | 0 |

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| Agents | 2 |
| Test files | 0 |
| Security audit | 0 vulnerabilities |
| Git diff |  20 files changed, 1868 insertions(+), 472 deletions(-) |

---

## Backlog Snapshot

**Open:** 0
0 bug(s), 0
0 feature request(s)

### Completed This Sprint
- B-004
- B-006

---

## Next Steps

- Review sprint output and plan next sprint
─────────────────────────────────────────

Sprint-Level Context

Goal
- B-009 Critical: Fix mobile sidebar — add close button + click-outside overlay so user is never trapped with sidebar open
- B-010 High: Replace raw JSON API errors with human-readable messages
- B-011 High: Add CSS for rendered markdown tables (borders, padding, header styling)
- B-012 High: Fix stale history 404 UX — keep entry in sidebar, show explicit Remove button
- B-015 Medium: Fix history delete button layout — replace float:right with flexbox

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html CSS section + sidebar HTML + sidebar toggle JS
- Agent B owns: public/index.html sendMessage() error handler + loadConversation() 404 branch + model init


Objective
Fix JavaScript UX bugs in public/index.html

Tasks
1. B-010 Friendly errors: In sendMessage() SSE error handling, replace raw JSON display with human-readable messages. Map known error types:
   - authentication_error → "API key is invalid or not configured. Please contact your administrator."
   - rate_limit_error → "Rate limit reached. Please wait a moment and try again."
   - overloaded_error → "Claude is currently busy. Please try again in a few seconds."
   - Network/fetch failure → "Could not reach the server. Check your connection and try again."
   - Default → "Something went wrong. Please try again." with a small collapsed "Details" toggle showing the raw error for debugging.

2. B-012 Stale 404 UX: In loadConversation(), when response is 404, do NOT immediately remove from localStorage. Instead: show error bubble "This conversation is no longer available (server was restarted)." with a "Remove from history" button. When that button is clicked, remove from localStorage and re-render the list. Until then, keep the entry in the sidebar.

3. B-013 Stale model guard: After setting modelSelector.value = savedModel, validate: if (modelSelector.value !== savedModel) { localStorage.removeItem('selectedModel'); } to clear stale IDs that don't match any option.

Acceptance Criteria
- A 401 API response shows "API key is invalid or not configured" not raw JSON
- Clicking a 404 history entry shows error bubble with "Remove from history" button; entry stays in sidebar
- Stale localStorage model IDs are cleared, not silently mismatched

## Merge Order
1. agentA-css-and-layout
2. agentB-js-error-ux

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
