agentB-server-robustness — Sprint 5

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
- Fix graceful handling of stale history entries when the server restarts and conversations are lost (B-006)
- Add markdown heading rendering for # ## ### syntax (F-006)
- Add markdown unordered list rendering for - item syntax (F-007)
- Add server-side request logging and graceful shutdown (server robustness)

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js


Objective
- Add request logging and graceful shutdown to the server

Tasks
- Open server.js and read it fully before making changes
- Add request logging middleware: before app.use(express.json()), add a simple middleware that logs `[${new Date().toISOString()}] ${req.method} ${req.url}` to console for every request. Use app.use() with a function that calls next().
- Add graceful shutdown: after app.listen(), add process.on('SIGTERM', ...) and process.on('SIGINT', ...) handlers that call server.close() and then process.exit(0). Store the return value of app.listen() in a variable named `server` so it can be closed.
- Add a conversation cleanup: add a route DELETE /api/conversations which clears ALL conversations from the Map (useful for testing). Returns { ok: true, cleared: count }.
- Commit with: feat: request logging, graceful shutdown, bulk conversation clear endpoint

Acceptance Criteria
- Every HTTP request is logged to stdout with method, URL, and ISO timestamp
- SIGTERM and SIGINT trigger graceful server close
- DELETE /api/conversations (no id) clears all conversations and returns count
- DELETE /api/conversations/:id (existing) still works per individual conversation
