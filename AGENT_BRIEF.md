agentA-history-sidebar — Sprint 4

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
- Add a localStorage-based chat history sidebar so users can return to previous conversations (F-005)
- Fix the copy button overlap on narrow Claude bubbles (B-005)
- Enhance the server conversations list endpoint to include a preview of the first message

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js


Objective
- Add a collapsible history sidebar to the chat UI and fix the copy button overlap

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-005: Add padding-right: 52px to .msg.claude .bubble CSS rule so the always-visible copy button (positioned absolute top-right) does not overlap the message text.
- Add F-005 (history sidebar):
  - Add a sidebar panel to the left of the chat area. The sidebar should be a fixed-width column (220px) showing a list of past conversations. The overall layout should change from a single column to two columns: sidebar + chat area.
  - Add CSS for the sidebar: `#sidebar { width: 220px; flex-shrink: 0; border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }`. Add a "History" heading and a `#history-list` div that holds conversation entries.
  - Each history entry shows the first message as a truncated title (max 40 chars). Entries are stored in localStorage under key `chat-history` as a JSON array of `{ id, title, timestamp }` objects.
  - When a message is sent, save the conversation to history: if it is the first message in the current conversationId, push `{ id: conversationId, title: text.slice(0, 40), timestamp: Date.now() }` to the history array in localStorage (max 20 entries, newest first).
  - When a history entry is clicked: set conversationId to the clicked id, fetch GET /api/conversations/:id to retrieve the message history, then replay the messages into the thread DOM (user and claude messages in order).
  - When New Chat is clicked: generate a new conversationId, clear the thread, reset empty state, and refresh the history list display.
  - On page load: render the history list from localStorage.
  - Wrap the existing `#app` content (header + thread + input-area) in a flex row container alongside the sidebar.
- Commit with: feat: add chat history sidebar and fix copy button overlap (F-005, B-005)

Acceptance Criteria
- A sidebar is visible on the left with a list of past conversations
- Conversations are saved to localStorage when the first message is sent
- Clicking a history entry reloads the conversation by fetching from /api/conversations/:id
- Copy button no longer overlaps text in narrow Claude bubbles (padding-right added)
- New Chat clears thread and refreshes history list
