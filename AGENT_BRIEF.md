agentB-history-api — Sprint 3

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
- Fix the bold+italic combined markdown rendering bug (B-004) so ***text*** renders as bold+italic
- Make the copy button always visible instead of hover-only (F-004)
- Add a server-side endpoint to retrieve conversation history (needed for future history sidebar)

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js


Objective
- Add a server-side API endpoint to retrieve stored conversation history by ID

Tasks
- Open server.js and read it fully before making changes
- Add GET /api/conversations/:id endpoint: if the conversationId exists in the conversations Map, return { messages: history } as JSON where history is the array of {role, content} objects. If not found, return 404 { error: 'not found' }.
- Add GET /api/conversations endpoint: return a list of all active conversation IDs as { ids: [...] } — useful for the frontend to enumerate sessions.
- Add DELETE /api/conversations/:id endpoint: removes the conversation from the Map and returns { ok: true }. If not found, returns 404.
- Commit with: feat: add conversation history API endpoints (GET/DELETE /api/conversations)

Acceptance Criteria
- GET /api/conversations/:id returns the full message history for a known conversationId
- GET /api/conversations returns all active conversation IDs
- DELETE /api/conversations/:id removes the conversation
- Unknown IDs return 404
- All changes committed to server.js only
