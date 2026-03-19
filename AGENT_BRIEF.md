agentA-frontend-polish — Sprint 6

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
- Complete markdown rendering: ordered lists (F-008) and horizontal rules (F-009)
- Fix copy button overlap on narrow bubbles (B-005)
- Make layout responsive for mobile screens (F-010)
- Add server stats endpoint and conversation count endpoint

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js


Objective
- Complete the markdown renderer and make the UI responsive on mobile

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-005: Increase padding-right on `.msg.claude .bubble` from whatever it currently is to at least 56px, so the always-visible copy button never overlaps text.
- Add F-008 (ordered lists): In the renderTextInto() function, add support for numbered lists. Detect contiguous lines matching `/^\d+\. /` (e.g., "1. First", "2. Second"). Group them into an `<ol>` element with `<li>` children. Apply inline formatting (bold/italic/code) to each list item. A blank line or non-list line ends the list.
- Add F-009 (horizontal rules): In renderTextInto(), detect lines that are exactly `---` or `***` (after trim) and replace them with an `<hr>` element. Add CSS for `hr { border: none; border-top: 1px solid var(--border); margin: 8px 0; }`.
- Add F-010 (mobile responsive): Add CSS media query `@media (max-width: 600px)` that: hides the sidebar (`#sidebar { display: none; }`), makes the chat area use full width, and adjusts the header to wrap on small screens. Also add a hamburger button `☰` that toggles the sidebar on mobile (toggling a `.sidebar-open` class on `#sidebar` that sets `display: flex` and position: fixed + full-height overlay). The hamburger button should appear in the header only on mobile (hide with CSS on desktop).
- Commit with: feat: ordered lists, horizontal rules, mobile responsive layout, copy button fix (F-008, F-009, F-010, B-005)

Acceptance Criteria
- Copy button no longer overlaps text (padding-right >= 56px)
- Numbered lists render as <ol><li> elements
- --- and *** on their own line render as <hr>
- On screens <= 600px the sidebar is hidden and a hamburger button appears
- Hamburger button toggles sidebar on mobile
- Desktop layout is unchanged
