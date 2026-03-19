agentB-frontend-polish — Sprint 2

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
- Fix the invalid Opus model ID, add markdown bold/italic rendering, and add a loading indicator

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-003: In the model selector <select>, change the Opus option value from 'claude-opus-4-6' to 'claude-opus-4-5'. Keep the display text "Opus — powerful".
- Fix F-001: In the renderTextInto() JavaScript function, after handling fenced code blocks and inline code, add support for **bold** (wrap in <strong>) and *italic* (wrap in <em>) text. Implement this in the appendInlineSegments() function: after splitting on inline code backticks, further split text segments on bold/italic markers using regex and insert the appropriate DOM elements. Be careful to handle the case where * or ** appear in code spans (they should not be processed inside code elements).
- Fix F-003: Add a loading indicator. After the user sends a message and before the first streaming token arrives, show a pulsing "..." animation inside the Claude bubble. Implement this by: (1) adding a CSS class `.loading-dots` with an animated content or child spans, and (2) in sendMessage(), adding the loading indicator to the claudeBubble immediately after creating it, then removing it as soon as the first token is received (before calling renderTextInto for the first time).
- Commit with: fix: correct Opus model ID, add bold/italic rendering, add loading indicator (B-003, F-001, F-003)

Acceptance Criteria
- Opus option value is 'claude-opus-4-5' (not 'claude-opus-4-6')
- Claude responses with **bold** and *italic* text render correctly as <strong> and <em> elements
- A loading animation appears in the Claude bubble between send and first token
- Loading animation disappears when the first token arrives
- All changes committed to public/index.html only
