agentA-history-delete — Sprint 7

Previous Sprint Summary
─────────────────────────────────────────
# claude-chat-workspace Project Status — March 19, 2026 (Sprint 1: Sprint 1)

## Sprint 1 Summary

- Copy the v1 claude-chat-workspace implementation from ~/src/everyone-ai into this standalone repo
- Add Docker Compose for local development and .env.example for configuration
- Add UX polish: new chat button, copy message to clipboard, model selector in header
- Make server.js read SYSTEM_PROMPT and CLAUDE_MODEL from environment variables

---

## What Changed

### agentA-standalone-setup

- Bring the v1 server code into this repo and wire up local dev tooling with environment variable config

**Commits:**
- agentA-standalone-setup: implement sprint 1 tasks
- feat: standalone setup — copy v1 code, Docker Compose, env config

**Files:**  11 files changed, 340 insertions(+)

### agentB-ux-polish

- Add new chat button, per-message copy button, and model selector to the chat UI

**Commits:**
- agentB-ux-polish: implement sprint 1 tasks
- feat: UX polish — new chat button, model selector, copy message button

**Files:**  3 files changed, 520 insertions(+)


---

## Merge Results

| # | Branch | Deliverable | Phase | Conflicts | Files Changed |
|---|--------|-------------|-------|-----------|---------------|
| 1 | agentA-standalone-setup | Bring the v1 server code into this repo and wire up local dev tooling with environment variable config | 1 | Clean | 11 |
| 2 | agentB-ux-polish | Add new chat button, per-message copy button, and model selector to the chat UI | 1 | Ephemeral only | 3 |

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| Agents | 2 |
| Test files | 0 |

---

## Next Steps

- Review sprint output and plan next sprint
─────────────────────────────────────────

Sprint-Level Context

Goal
- Add delete button to history sidebar entries (F-011)
- Add character count display below Claude responses (F-012 frontend)
- Add character count to the SSE stream done event (F-012 backend)

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js


Objective
- Add delete buttons to history entries and display character count below Claude responses

Tasks
- Open public/index.html and read it fully before making changes
- Add F-011: In the history item rendering function, add a small delete button `×` to the right of each history entry title. Style it: `float: right; background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; padding: 0 2px; line-height: 1;`. On click (stop propagation so it doesn't trigger the conversation reload): (1) remove the entry from the localStorage `chat-history` array by filtering out the matching id, (2) call DELETE /api/conversations/:id to remove server-side history, (3) re-render the history list. If the deleted conversation is currently active (conversationId matches), clear the thread and show empty state.
- Add F-012 (frontend part): After a Claude response completes streaming (after `claudeBubble.classList.remove('cursor')`), check if the bubble has a `data-charcount` attribute. If so, append a small muted label below the bubble showing "N chars". Add CSS for this label: `.char-count { font-size: 10px; color: var(--text-muted); margin-top: 2px; text-align: right; }`. The character count value should be read from the `data-charcount` attribute set on the bubble, which will be set by reading a `chars` field from the final SSE `done` event.
- Commit with: feat: history entry delete button and character count display (F-011, F-012 frontend)

Acceptance Criteria
- Each history entry shows a × button on the right
- Clicking × removes the entry from localStorage and calls DELETE /api/conversations/:id
- If the deleted conversation is active, the thread clears
- Character count label appears below completed Claude responses
- Character count comes from the SSE done event's `chars` field
