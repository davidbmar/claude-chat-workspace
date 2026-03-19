agentA-server-fixes — Sprint 2

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
- Fix two high-priority server-side bugs: model selector is ignored by server (B-001) and system prompt uses wrong API pattern (B-002)
- Fix invalid Opus model ID in the frontend (B-003)
- Add markdown bold/italic rendering in Claude bubbles (F-001)
- Add a loading indicator before the first streaming token (F-003)

Constraints
- No two agents may modify the same files
- Agent A owns: server.js
- Agent B owns: public/index.html


Objective
- Fix server.js so it respects the per-request model sent by the frontend, and use the correct Anthropic API system parameter for system prompts

Tasks
- Open server.js and read it fully before making changes
- Fix B-001: In the /api/chat route handler, extract `model` from req.body alongside `message` and `conversationId`. Pass the extracted model (falling back to process.env.CLAUDE_MODEL || 'claude-sonnet-4-6') into streamResponse() as a parameter. Update streamResponse() to accept a `model` argument and use it instead of always reading process.env.CLAUDE_MODEL.
- Fix B-002: In the /api/chat route handler, remove the current system prompt injection that prepends a fake user message. Instead, pass process.env.SYSTEM_PROMPT directly to the Anthropic client.messages.stream() call as the `system` field (only when it is non-empty). The system field should be a top-level string in the messages.stream() options object, not a message in the history array.
- Commit with: fix: respect per-request model and use Anthropic system parameter (B-001, B-002)

Acceptance Criteria
- server.js /api/chat extracts `model` from req.body and passes it to the API call
- streamResponse() takes model as a parameter instead of reading env var directly
- System prompt is passed as `system:` field in messages.stream(), not as a fake user message
- Fallback to process.env.CLAUDE_MODEL || 'claude-sonnet-4-6' when no model in request body
