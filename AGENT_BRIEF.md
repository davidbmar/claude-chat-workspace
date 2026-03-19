agentA-frontend-fixes — Sprint 8

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
- Fix markdown table rendering (B-007): GFM pipe-table syntax renders as raw text
- Fix model selection persistence (B-008): model selector resets to Sonnet on page reload
- Fix copy button overlap on short responses (B-005): needs minimum padding-right ~56px

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html (model persistence + copy button overlap fix)
- Agent B owns: public/index.html table renderer — NOTE: agents must coordinate; agentA commits first, agentB must git pull before editing


Objective
- Fix model selector persistence across page reloads and fix copy button overlap on short responses

Tasks
- Edit public/index.html: in the model selector change event handler, add localStorage.setItem('selectedModel', this.value)
- Edit public/index.html: on page load after DOMContentLoaded, read localStorage.getItem('selectedModel') and if truthy set document.getElementById('model-selector').value to the saved value
- Edit public/index.html: in the .msg.claude CSS rule add padding-right: 56px so the Copy button does not overlap text on short bubbles
- Commit with: fix: persist model selection in localStorage, fix copy button overlap (B-005, B-008)

Acceptance Criteria
- Selecting Haiku and reloading the page keeps Haiku selected
- Copy button does not visually overlap message text on short Claude responses
