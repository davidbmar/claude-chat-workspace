agentB-ux-interactions — Sprint 11

Previous Sprint Summary
─────────────────────────────────────────
# claude-chat-workspace Project Status — March 20, 2026 (Sprint 9: Sprint 9)

## Sprint 9 Summary

- B-009 Critical: Fix mobile sidebar — add close button + click-outside overlay so user is never trapped with sidebar open
- B-010 High: Replace raw JSON API errors with human-readable messages
- B-011 High: Add CSS for rendered markdown tables (borders, padding, header styling)
- B-012 High: Fix stale history 404 UX — keep entry in sidebar, show explicit Remove button
- B-015 Medium: Fix history delete button layout — replace float:right with flexbox

---

## What Changed

### agentA-css-and-layout

Completed assigned tasks.

**Commits:**
- (no commits)

**Files:** no changes

### agentB-js-error-ux

Completed assigned tasks.

**Commits:**
- (no commits)

**Files:** no changes


---

## Merge Results

| # | Branch | Deliverable | Phase | Conflicts | Files Changed |
|---|--------|-------------|-------|-----------|---------------|
| 1 | agentA-css-and-layout | Completed tasks | 1 | Clean | 0 |
| 2 | agentB-js-error-ux | Completed tasks | 1 | Clean | 0 |

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| Agents | 2 |
| Test files | 0 |
| Security audit | 0 vulnerabilities |
| Git diff |  9 files changed, 442 insertions(+), 116 deletions(-) |

---

## Backlog Snapshot

**Open:** 8 bug(s), 4 feature request(s)

### Completed This Sprint
- B-004
- B-006

---

## Next Steps

- Review sprint output and plan next sprint
─────────────────────────────────────────

Sprint-Level Context

Goal
- F-013 Low: Add "New Chat" confirmation when conversation is in progress — prevent accidental loss
- B-017 Low: Fix mobile model selector label — show short labels (Haiku/Sonnet/Opus) at narrow widths
- B-018 Low: Remove Copy button from error bubbles — only show on real Claude responses
- F-017 New: Add keyboard shortcut Cmd+Enter (or Ctrl+Enter) as alternative send (some users expect this)
- F-018 New: Add "scroll to bottom" button that appears when user scrolls up mid-stream

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html HTML structure + CSS (model selector labels, scroll button CSS)
- Agent B owns: public/index.html JS (new chat confirmation, copy button guard, keyboard shortcut, scroll button logic)


Objective
JavaScript UX improvements in public/index.html

Tasks
1. F-013 New Chat confirmation: In the `newChatBtn` click handler, before clearing the thread, check if there are any `.msg` elements in `#thread`. If yes, show a `confirm()` dialog: "Start a new chat? Your current conversation is saved in history." Only proceed if confirmed (or thread is already empty).

2. B-018 Copy button guard: In `addMsg('claude', ...)`, after creating the copy button, check whether the bubble has `isError` context. Add a flag — the simplest approach: when showing an error message (in the catch block or 404 handler), add a CSS class like `error-bubble` to the bubble element. In `addMsg`, check for this class and skip appending the copy button if present. OR: pass a second argument `{isError: true}` to `addMsg` for error cases.

3. F-017 Cmd+Enter to send: In the `textarea` keydown handler, add a check for `(e.metaKey || e.ctrlKey) && e.key === 'Enter'` — trigger send (same as plain Enter). This should work alongside the existing Enter-to-send and Shift+Enter-for-newline logic.

Acceptance Criteria
- Clicking New Chat when messages exist shows confirm dialog; canceling leaves conversation intact
- Error bubbles (stale 404 message, API error message) have no Copy button
- Cmd+Enter and Ctrl+Enter both send the message

## Merge Order
1. agentA-ui-polish
2. agentB-ux-interactions

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
