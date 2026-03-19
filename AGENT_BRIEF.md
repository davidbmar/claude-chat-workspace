agentA-frontend-fixes — Sprint 3

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
- Fix the triple-asterisk markdown rendering bug and make the copy button always visible

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-004: In the appendFormattedLine() function, update the regex split pattern to also handle ***text*** (bold+italic combined). The current pattern is `(\*\*[^*]+\*\*|\*[^*\n]+\*)`. Change it to handle three cases in order: (1) `***text***` → wrap in both <strong> and <em>, (2) `**text**` → wrap in <strong>, (3) `*text*` → wrap in <em>. The new regex should be `(\*{3}[^*]+\*{3}|\*\*[^*]+\*\*|\*[^*\n]+\*)`. Add a new branch at the top of the if/else chain: if p starts with *** and ends with *** and length > 6, create a <strong> containing an <em> with the inner text (strip 3 chars from each end).
- Fix F-004: Make the copy button always visible by removing `opacity: 0` from the `.copy-btn` CSS rule and removing `.bubble-wrap:hover .copy-btn { opacity: 1; }`. Instead, always show the copy button. Keep the hover styles for color change but remove the opacity hide/show.
- Commit with: fix: triple-asterisk markdown rendering and always-visible copy button (B-004, F-004)

Acceptance Criteria
- ***bold italic*** text renders as bold+italic (strong>em) not raw asterisks
- **bold** text still renders correctly as <strong>
- *italic* text still renders correctly as <em>
- Copy button is visible on all Claude bubbles without needing to hover
- All changes committed to public/index.html only
