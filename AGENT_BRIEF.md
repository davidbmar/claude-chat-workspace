agentA-markdown-and-history-fixes — Sprint 5

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
- Improve the markdown renderer with heading and list support, and handle stale history entries gracefully

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-006: In the history item click handler, when fetching GET /api/conversations/:id, handle the case where the server returns a 404 (conversation not found after server restart). If a 404 is returned: show a small inline error message in the thread like "This conversation is no longer available (server was restarted)." Remove the stale entry from localStorage and re-render the history list.
- Add F-006: In renderTextInto(), after splitting on fenced code blocks, detect lines starting with # markdown headings BEFORE calling appendInlineSegments. In the text-part processing, split on newlines first, then check if each line starts with `# `, `## `, or `### ` and create the appropriate heading element (h1, h2, h3) with the heading text content. Apply inline formatting (bold/italic/code) to heading content too.
- Add F-007: In renderTextInto() (or appendInlineSegments), detect contiguous lines starting with `- ` and group them into a `<ul>` element with `<li>` children. Each list item text should have inline formatting (bold/italic/code) applied via appendFormattedLine(). A blank line or a non-list line ends the current list.
- Commit with: feat: markdown headings and lists, graceful stale history handling (B-006, F-006, F-007)

Acceptance Criteria
- Clicking a stale history entry shows an inline error and removes the entry from localStorage
- Claude responses with # Heading render as h1/h2/h3 elements (not raw # text)
- Claude responses with - list item render as <ul><li> elements
- Bold, italic, and inline code still work inside headings and list items
- No regressions in existing code block or bold/italic rendering
