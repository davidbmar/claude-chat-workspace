agentA-ui-polish — Sprint 11

Previous Sprint Summary
─────────────────────────────────────────
# claude-chat-workspace Project Status — March 20, 2026 (Sprint 9: Sprint 9)

## Sprint 9 Summary

- B-009 Critical: Fix mobile sidebar — add close button + click-outside overlay so user is never trapped with sidebar open
- B-010 High: Replace raw JSON API errors with human-readable messages
- B-011 High: Add CSS for rendered markdown tables (borders, padding, header styling)
- B-012 High: Fix stale history 404 UX — keep entry in sidebar, show explicit Remove button
- B-015 Medium: Fix history delete button layout — replace float:right with flexbox

---

## What Changed

### agentA-css-and-layout

Completed assigned tasks.

**Commits:**
- (no commits)

**Files:** no changes

### agentB-js-error-ux

Completed assigned tasks.

**Commits:**
- (no commits)

**Files:** no changes


---

## Merge Results

| # | Branch | Deliverable | Phase | Conflicts | Files Changed |
|---|--------|-------------|-------|-----------|---------------|
| 1 | agentA-css-and-layout | Completed tasks | 1 | Clean | 0 |
| 2 | agentB-js-error-ux | Completed tasks | 1 | Clean | 0 |

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| Agents | 2 |
| Test files | 0 |
| Security audit | 0 vulnerabilities |
| Git diff |  9 files changed, 442 insertions(+), 116 deletions(-) |

---

## Backlog Snapshot

**Open:** 8 bug(s), 4 feature request(s)

### Completed This Sprint
- B-004
- B-006

---

## Next Steps

- Review sprint output and plan next sprint
─────────────────────────────────────────

Sprint-Level Context

Goal
- F-013 Low: Add "New Chat" confirmation when conversation is in progress — prevent accidental loss
- B-017 Low: Fix mobile model selector label — show short labels (Haiku/Sonnet/Opus) at narrow widths
- B-018 Low: Remove Copy button from error bubbles — only show on real Claude responses
- F-017 New: Add keyboard shortcut Cmd+Enter (or Ctrl+Enter) as alternative send (some users expect this)
- F-018 New: Add "scroll to bottom" button that appears when user scrolls up mid-stream

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html HTML structure + CSS (model selector labels, scroll button CSS)
- Agent B owns: public/index.html JS (new chat confirmation, copy button guard, keyboard shortcut, scroll button logic)


Objective
CSS and HTML polish in public/index.html

Tasks
1. B-017 Mobile model selector short labels: In the `<select id="model-selector">` options, add a `data-short` label approach OR simply shorten the option text values to use abbreviated labels on small screens. Simplest approach: change option text to use a format like "Haiku — fast" → keep as-is on desktop, but add a media query that sets `font-size: 0` on the select and uses `::after` pseudo... actually the simplest fix is: just increase `max-width` of the model selector in the mobile media query from `100px` to `130px` so "Sonnet — bala..." is readable, OR rename option values to shorter text: `Haiku`, `Sonnet`, `Opus` (3 words max each).

2. F-018 Scroll-to-bottom button: Add a `#scroll-btn` button (`↓`) that is `position: fixed`, bottom-right of the thread area, hidden by default. Show it when the thread is scrolled more than 100px from the bottom (`thread.scrollTop < thread.scrollHeight - thread.clientHeight - 100`). Clicking it scrolls to bottom. CSS: `position: fixed; bottom: 80px; right: 20px; z-index: 50; border-radius: 50%; width: 36px; height: 36px; background: var(--accent); border: none; color: white; cursor: pointer; display: none; font-size: 18px`.

Acceptance Criteria
- Model selector on mobile shows enough text to distinguish between models
- Scroll-to-bottom button appears when scrolled up and scrolls to bottom on click
