agentA-error-ux — Sprint 16

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
- B-034 Medium: Fix input enabled on 404 error state — when a conversation 404s, disable textarea+send OR silently recover (clear error banner) on first successful new send
- B-035 Low: Apply markdown stripping to sidebar titles at render time — so pre-Sprint-15 conversations with raw **asterisks** in their titles show clean text

Constraints
- One agent only — all changes in public/index.html
- Agent A owns everything


Objective
Two targeted fixes: error-state input behavior and retroactive sidebar title cleanup.

Tasks

1. B-034 Stale conversation error state input:
   - When `loadConversation()` gets a 404, the app currently shows an error banner and leaves the input enabled
   - Option A (simpler): In the 404 error handler inside `loadConversation()`, disable the textarea and send button (`msgInput.disabled = true; sendBtn.disabled = true`) and add a note to the error message like "Start a new chat to continue"
   - Option B (smarter): Leave input enabled but in the message send handler, if the current conversationId returned a 404, clear the error banner before sending (treat as a fresh conversation). Update `conversationId` to null so a new one gets created.
   - Implement Option B — it's the better UX. When the user types after a 404, they clearly want to continue chatting. Clear the error banner, set `currentConversationId = null`, and let the send proceed normally as a new conversation.

2. B-035 Retroactive sidebar title markdown stripping:
   - Find where sidebar history entries are rendered (the function that reads from localStorage and creates the sidebar `<li>` elements)
   - Before setting the title text in the DOM, apply the same markdown-stripping regex used in B-032:
     ```js
     function stripMarkdown(text) {
       return text.replace(/\*\*([^*]+)\*\*/g, '$1')
                  .replace(/\*([^*]+)\*/g, '$1')
                  .replace(/`([^`]+)`/g, '$1')
                  .replace(/^#+\s*/gm, '');
     }
     ```
   - This ensures ALL conversations (old and new) show clean titles without asterisks

Acceptance Criteria
- Load a stale 404 conversation. Type a message and send. The error banner disappears, the message sends as a new conversation, and the sidebar updates with a new title.
- Old conversations stored with `**bold**` in their title show `bold` (no asterisks) in the sidebar after reload.

## Merge Order
1. agentA-error-ux

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
